import uuid
import asyncio
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from uuid import UUID as PydanticUUID

from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import select

from google.auth.transport.requests import Request as GoogleAuthRequest
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from app.db.database import SessionLocal
from app.db.models import User, Meeting, CalendarChannel, CalendarSyncToken
from app.auth.dependencies import get_current_user
from app.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, WEBHOOK_PUBLIC_URL
router = APIRouter()
db = SessionLocal()

SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]
TOKEN_FILE = "token.json"
CREDENTIALS_FILE = "credentials.json"

DEFAULT_CALENDAR_ID_TO_WATCH = "primary"

if not WEBHOOK_PUBLIC_URL:
    raise ValueError("WEBHOOK_PUBLIC_URL environment variable not set!")

def get_google_calendar_service(user: User):
    if not user.access_token or not user.refresh_token or not user.token_uri:
        raise ValueError("User is missing required OAuth credentials")

    creds = Credentials(
        token=user.access_token,
        refresh_token=user.refresh_token,
        token_uri=user.token_uri,
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        scopes=user.scopes.split(",") if user.scopes else SCOPES,
    )
    if not creds.valid or creds.expired:
        if creds.refresh_token:
            creds.refresh(GoogleAuthRequest())
        else:
            raise HTTPException(status_code=401, detail="OAuth credentials are expired and non-refreshable.")
    return build("calendar", "v3", credentials=creds)


def extract_meet_link(event: Dict[str, Any]) -> Optional[str]:
    if "conferenceData" in event and "entryPoints" in event["conferenceData"]:
        for entry_point in event["conferenceData"]["entryPoints"]:
            if entry_point.get("entryPointType") == "video" and "uri" in entry_point:
                return entry_point["uri"]
    return None

async def process_calendar_changes(
    db: Session,
    calendar_id: str,
    user: User,
    current_sync_token: Optional[str] = None,
):
    service = (
        get_google_calendar_service(user=user)
    )
    try:
        events_list_request = service.events().list(
            calendarId=calendar_id,
            singleEvents=True,
            showDeleted=True,
            showHiddenInvitations=True,
            syncToken=current_sync_token,
        )
        events_result = events_list_request.execute()

        events = events_result.get("items", [])
        new_sync_token = events_result.get("nextSyncToken")

        if new_sync_token:
            sync_token_record = db.execute(
                select(CalendarSyncToken).filter_by(
                    user_id=user.id, calendar_id=calendar_id
                )
            ).scalar_one_or_none()

            if sync_token_record:
                sync_token_record.sync_token = new_sync_token
                sync_token_record.updated_at = datetime.now(timezone.utc)
            else:
                db.add(
                    CalendarSyncToken(
                        user_id=user.id,
                        calendar_id=calendar_id,
                        sync_token=new_sync_token,
                    )
                )
            db.commit()
        if not events:
            return
        for event in events:
            meet_link = extract_meet_link(event)
            event_id = event.get("id")
            summary = event.get("summary", "No Title")
            status = event.get("status")

            existing_meeting = db.execute(
                select(Meeting).filter_by(
                    user_id=user.id,
                    google_event_id=event_id,
                    source_calendar_id=calendar_id,
                )
            ).scalar_one_or_none()

            if status == "cancelled":
                if existing_meeting:
                    db.delete(existing_meeting)
                    db.commit()
                else:
                    continue
            if meet_link:
                start_time_str = event["start"].get(
                    "dateTime", event["start"].get("date")
                )
                end_time_str = event["end"].get("dateTime", event["end"].get("date"))
                try:
                    start_time = (
                        datetime.fromisoformat(start_time_str)
                        if isinstance(start_time_str, str)
                        else None
                    )
                    end_time = (
                        datetime.fromisoformat(end_time_str)
                        if isinstance(end_time_str, str)
                        else None
                    )
                    if start_time and start_time.tzinfo is None:
                        start_time = start_time.replace(tzinfo=timezone.utc)
                    if end_time and end_time.tzinfo is None:
                        end_time = end_time.replace(tzinfo=timezone.utc)
                except ValueError as e:
                    print(
                        f"  Warning: Could not parse datetime for event {event_id}: {e}"
                    )
                    start_time = None
                    end_time = None

                if existing_meeting:
                    print(f"  --> Updating existing Meet Event: {summary}")
                    existing_meeting.title = summary
                    existing_meeting.meeting_url = meet_link
                    existing_meeting.start_time = start_time
                    existing_meeting.end_time = end_time
                    existing_meeting.status = status
                    existing_meeting.updated_at = datetime.now(timezone.utc)
                else:
                    print(f"  --> Creating new Meet Event: {summary}")
                    new_meeting = Meeting(
                        user_id=user.id,
                        google_event_id=event_id,
                        source_calendar_id=calendar_id,
                        title=summary,
                        meeting_url=meet_link,
                        start_time=start_time,
                        end_time=end_time,
                        status=status,
                    )
                    db.add(new_meeting)
            db.commit()

    except HttpError as error:
        if error.resp.status == 410:
            sync_token_record = db.execute(
                select(CalendarSyncToken).filter_by(
                    user_id=user.id, calendar_id=calendar_id
                )
            ).scalar_one_or_none()
            if sync_token_record:
                db.delete(sync_token_record)
                db.commit()
            raise HTTPException(
                status_code=200, detail="Sync token invalid, re-sync needed"
            )
        else:
            raise HTTPException(
                status_code=500, detail=f"Google Calendar API error: {error}"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@router.post("/google-calendar-webhook")
async def google_calendar_webhook(request: Request):
    channel_id_str = request.headers.get("X-Goog-Channel-Id")
    resource_id = request.headers.get("X-Goog-Resource-Id")
    resource_state = request.headers.get("X-Goog-Resource-State")
    channel_token = request.headers.get("X-Goog-Channel-Token")

    if not channel_id_str:
        raise HTTPException(status_code=400, detail="Missing X-Goog-Channel-Id header")
    try:
        channel_id = PydanticUUID(channel_id_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid X-Goog-Channel-Id format")

    calendar_channel = db.execute(
        select(CalendarChannel).filter_by(id=channel_id, resource_id=resource_id)
    ).scalar_one_or_none()

    user_id = calendar_channel.user_id

    user = db.execute(
    select(User).filter_by(id=user_id)
        ).scalar_one_or_none()

    if not calendar_channel:
        raise HTTPException(status_code=404, detail="Channel not found or inactive")

    if calendar_channel.client_token and calendar_channel.client_token != channel_token:
        raise HTTPException(status_code=403, detail="Invalid channel token")

    calendar_id = calendar_channel.calendar_id
    user_id = calendar_channel.user_id

    if resource_state == "sync":
        return JSONResponse(content={"status": "ok"}, status_code=200)

    elif resource_state == "exists" or resource_state == "not_exists":
        sync_token_record = db.execute(
            select(CalendarSyncToken).filter_by(
                user_id=user_id, calendar_id=calendar_id
            )
        ).scalar_one_or_none()

        current_sync_token = sync_token_record.sync_token if sync_token_record else None

        # Process changes in a background task to immediately return 200 OK
        # and not block the webhook listener.
        asyncio.create_task(
            process_calendar_changes(db, calendar_id, user, current_sync_token)
        )
        return JSONResponse(content={"status": "ok"}, status_code=200)

async def initiate_calendar_watch_db(
    db: Session,
    user: User,
    calendar_id: str,
    webhook_url: str,
    client_token: Optional[str] = None,
) -> Optional[CalendarChannel]:
    service = get_google_calendar_service(user)

    existing_channel = db.execute(
        select(CalendarChannel)
        .filter_by(user_id=user.id, calendar_id=calendar_id)
        .where(CalendarChannel.expiration_time > datetime.now(timezone.utc))
    ).scalar_one_or_none()

    if existing_channel:
        return existing_channel

    channel_id = uuid.uuid4()

    try:
        events_result = (
            service.events()
            .list(
                calendarId=calendar_id,
                maxResults=1,
                singleEvents=True,
                showDeleted=True,
                showHiddenInvitations=True,
                syncToken="invalid"
            )
            .execute()
        )
        initial_sync_token = events_result.get("nextSyncToken")

        if initial_sync_token:
            sync_token_record = db.execute(
                select(CalendarSyncToken).filter_by(
                    user_id=user.id, calendar_id=calendar_id
                )
            ).scalar_one_or_none()

            if sync_token_record:
                sync_token_record.sync_token = initial_sync_token
                sync_token_record.updated_at = datetime.now(timezone.utc)
            else:
                db.add(
                    CalendarSyncToken(
                        user_id=user.id,
                        calendar_id=calendar_id,
                        sync_token=initial_sync_token,
                    )
                )
            db.commit()
    except HttpError as error:
        if error.resp.status == 410:
            print(f"No previous sync token for {calendar_id}. Proceeding to set up watch.")
        else:
            print(f"Error fetching sync token: {error}")
            return None
    try:
        expiration_seconds = 604800  # 7 days
        expiration_timestamp_ms = (
            datetime.now(timezone.utc) + timedelta(seconds=expiration_seconds)
        ).timestamp() * 1000

        watch_request_body = {
            "id": str(channel_id),
            "type": "web_hook",
            "address": webhook_url,
            "token": client_token,
            "expiration": int(expiration_timestamp_ms),
        }
        watch_response = (
            service.events()
            .watch(calendarId=calendar_id, body=watch_request_body)
            .execute()
        )
        new_channel = CalendarChannel(
            id=channel_id,
            resource_id=watch_response.get("resourceId"),
            calendar_id=calendar_id,
            user_id=user.id,
            client_token=client_token,
            expiration_time=datetime.fromtimestamp(
                int(watch_response.get("expiration")) / 1000, tz=timezone.utc
            ),
        )
        db.add(new_channel)
        db.commit()
        print(f"Calendar watch created for user {user.email}")
        return new_channel
    except HttpError as error:
        print(f"Failed to create calendar watch: {error}")
        return None
