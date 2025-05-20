from fastapi import Request, HTTPException, status, Depends
from jose import JWTError
from auth.jwt import decode_access_token
from db.database import SessionLocal
from db.models import User

def get_current_user(request: Request) -> User:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED, detail= "Missin auth token")
    
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user