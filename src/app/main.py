from fastapi import FastAPI
from app.api.routes import meeting as meet_routes
from app.auth import routes as auth_routes
from starlette.middleware.sessions import SessionMiddleware
import os

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))

app.include_router(auth_routes.router)
app.include_router(meet_routes.router)