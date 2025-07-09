from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, RedirectResponse
from auth.oauth import oauth
from auth.jwt import create_access_token
from auth.cookie import set_access_token_cookie, clear_access_token
from db.database import SessionLocal
from db.models import User
from calendar_webhook import initiate_calendar_watch_db
import os
import uuid
from datetime import datetime, timezone
from typing import Optional, List

router = APIRouter()

SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events.readonly",
    "https://www.googleapis.com/auth/calendar.addons.current.event.read",
]
async def handle_oauth_user(
    email: str,
    name: str,
    provider: str,
    redirect_response: RedirectResponse,
    access_token: Optional[str] = None,
    refresh_token: Optional[str] = None,
    token_uri: Optional[str] = None,
    scopes: Optional[List[str]] = None,
    token_expires_at: Optional[datetime] = None,
):
    db = SessionLocal()
    existing = db.query(User).filter_by(email=email).first()
    if not existing:
        new_user = User(
            id=uuid.uuid4(),
            email=email,
            name=name,
            oauth_provider=provider,
            created_at=datetime.now(timezone.utc),
            access_token=access_token,
            refresh_token=refresh_token,
            token_uri=token_uri,
            scopes=",".join(scopes) if scopes else None,
            token_expires_at=token_expires_at,
        )
        db.add(new_user)
        db.commit()
        user = new_user

    else:
        existing.access_token = access_token
        existing.refresh_token = refresh_token
        existing.token_uri = token_uri
        existing.scopes = ",".join(scopes) if scopes else None
        existing.token_expires_at = token_expires_at
        user = existing

    client_token = os.getenv("GOOGLE_WEBHOOK_CLIENT_TOKEN", "a_strong_secret_token")
    WEBHOOK_PUBLIC_URL = os.getenv("WEBHOOK_PUBLIC_URL")
    channel = await initiate_calendar_watch_db(db=db, user=user, calendar_id="primary", webhook_url=WEBHOOK_PUBLIC_URL, client_token=client_token)

    jwt_token = create_access_token(
        {"sub": str(existing.id), "email": existing.email, "provider": provider}
    )

    set_access_token_cookie(redirect_response, jwt_token)
    return redirect_response

@router.get("/auth/login/google")
async def login_google(request: Request):
    redirect_uri = str(request.url_for("auth_google_callback"))
    scope_str = " ".join(SCOPES)
    return await oauth.google.authorize_redirect(
        request,
        redirect_uri,
        scope=scope_str,
        access_type="offline",
        prompt="consent",
    )


@router.get("/auth/callback/google")
async def auth_google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    access_token = token["access_token"]
    refresh_token = token.get("refresh_token")
    expires_at = (
        datetime.fromtimestamp(token["expires_at"], timezone.utc)
        if token.get("expires_at")
        else None
    )
    token_uri = oauth.google.client_kwargs.get(
        "token_endpoint", "https://oauth2.googleapis.com/token"
    )
    resp = await oauth.google.get(
        "https://openidconnect.googleapis.com/v1/userinfo", token=token
    )
    user_info = resp.json()

    redirect_response = RedirectResponse("http://127.0.0.1:5173/")
    return await handle_oauth_user(
        email=user_info["email"],
        name=user_info.get("name"),
        provider="google",
        redirect_response=redirect_response,
        access_token=access_token,
        refresh_token=refresh_token,
        token_uri=token_uri,
        scopes=SCOPES,
        token_expires_at=expires_at,
    )

@router.get("/logout")
async def logout():
    response = JSONResponse(content={"message": "Logout successful"})
    clear_access_token(response)
    return response
