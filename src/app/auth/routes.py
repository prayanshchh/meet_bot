from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, RedirectResponse
from auth.oauth import oauth
from auth.jwt import create_access_token
from auth.cookie import set_access_token_cookie, clear_access_token
from db.database import SessionLocal
from db.models import User
import uuid

router = APIRouter()

async def handle_oauth_user(email: str, name: str, provider: str, redirect_response):
    db = SessionLocal()
    existing = db.query(User).filter_by(email=email).first()
    if not existing:
        existing = User(id=uuid.uuid4(), email=email, name=name, oauth_provider=provider)
        db.add(existing)
        db.commit()

    jwt_token = create_access_token({
        "sub": str(existing.id),
        "email": existing.email,
        "provider": provider
    })

    set_access_token_cookie(redirect_response, jwt_token)
    return redirect_response

@router.get("/auth/login/google")
async def login_google(request: Request):
    redirect_uri = request.url_for('auth_google_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/login/github")
async def login_github(request: Request):
    redirect_uri = request.url_for('auth_github_callback')
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("/auth/callback/google")
async def auth_google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    resp = await oauth.google.get("https://openidconnect.googleapis.com/v1/userinfo", token=token)
    user_info = resp.json()

    redirect_response = RedirectResponse("http://127.0.0.1:5173/")
    return await handle_oauth_user(email= user_info['email'], name=user_info.get('name'), provider='google', redirect_response=redirect_response)

@router.get("/auth/callback/github")
async def auth_github_callback(request: Request):
    token = await oauth.github.authorize_access_token(request)
    user_info = await oauth.github.get('user', token=token)
    profile = user_info.json()
    email_resp = await oauth.github.get('user/emails', token=token)
    primary_email = next((e['email'] for e in email_resp.json() if e['primary']), profile['email'])

    redirect_response = RedirectResponse("http://127.0.0.1:5173/")
    return await handle_oauth_user(email=primary_email, name=profile.get('name'), provider='github', redirect_response=redirect_response)

@router.get("/logout")
async def logout():
    response = JSONResponse(content = {"message": "Logout successful"})
    clear_access_token(response)
    return response 
