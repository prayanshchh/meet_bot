from fastapi import FastAPI
from app.api.routes import me as me_route
from app.api.routes import meeting as meet_routes
from app.auth import routes as auth_routes
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="MeetBot API",
    description="Endpoints for user auth, meetings and calendar sync",
    version="1.0.0"
    )

app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://meetbot.prayanshchhablani.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(me_route.router)
app.include_router(auth_routes.router)
app.include_router(meet_routes.router)