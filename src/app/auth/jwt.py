from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHIM = "HS256"
EXPIRY_MINUTES = 60 * 24 * 7

def create_access_token(data: dict):
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + timedelta(minutes=EXPIRY_MINUTES)})
    print("I am ", SECRET_KEY)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHIM)

def decode_access_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHIM])