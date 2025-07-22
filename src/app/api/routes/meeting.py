from fastapi import APIRouter, Depends, Body, Query, HTTPException
from pydantic import BaseModel
from app.auth.dependencies import get_current_user
from app.db.models import User
from app.db.database import SessionLocal
from app.db.models import Meeting
from app.db.models import User
from datetime import datetime
import uuid
from sqlalchemy.orm import joinedload
from app.bot.main import main as bot
from app.utilities.s3.generatePresignedURL import generate_view_url

router = APIRouter()

class MeetingCreateRequest(BaseModel):
    meeting_url: str

@router.post("/meet")
async def create_meeting(
    data: MeetingCreateRequest = Body(...), user: User = Depends(get_current_user)
):
    db = SessionLocal()
    meet_id = uuid.uuid4()
    meeting = Meeting(
        id=meet_id,
        user_id=user.id,
        meeting_url=data.meeting_url,
        start_time=datetime.utcnow(),
    )

    db.add(meeting)
    db.commit()

    await bot(data.meeting_url, meet_id)
    return {"message": "Bot is finished with the meeting!"}


@router.get("/dashboard")
def dashboard(
    user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
):
    print(user.email)
    db = SessionLocal()

    meetings = (
        db.query(Meeting)
        .filter(Meeting.user_id == user.id)
        .order_by(Meeting.created_at.desc())
        .options(joinedload(Meeting.recording))
        .offset(skip)
        .limit(limit)
        .all()
    )

    results = []
    for meeting in meetings:
        if meeting.recording:
            results.append(
            {
                "meeting_id": str(meeting.id),
                "meeting_url": meeting.meeting_url,
            }
        )
    return results


@router.get("/meet/{meet_id}")
def get_meeting(meet_id: str, user: User = Depends(get_current_user)):
    db = SessionLocal()

    meeting = (
        db.query(Meeting)
        .options(joinedload(Meeting.recording), joinedload(Meeting.summary))
        .filter_by(id=meet_id, user_id=user.id)
        .first()
    )

    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    recording_url = None
    if meeting.recording and meeting.recording.file_name:
        recording_url = generate_view_url(meeting.recording.file_name)

    return {
        "id": str(meeting.id),
        "meeting_url": meeting.meeting_url,
        "start_time": meeting.start_time,
        "recording": {
            "file_name": meeting.recording.file_name if meeting.recording else None,
            "uploaded_at": meeting.recording.uploaded_at if meeting.recording else None,
        } if meeting.recording else None,
        "recording_url": recording_url,
        "summary": {
            "summary_text": meeting.summary.summary_text,
            "transcript": meeting.summary.transcript,
            "generated_at": meeting.summary.generated_at,
        } if meeting.summary else None,
    }
