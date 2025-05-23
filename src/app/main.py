from fastapi import FastAPI
from api.routes import me as me_route
from api.routes import meeting as meet_routes
from auth import routes as auth_routes
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(me_route.router)
app.include_router(auth_routes.router)
app.include_router(meet_routes.router)