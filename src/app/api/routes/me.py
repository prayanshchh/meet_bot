from fastapi import APIRouter, Depends
from app.db.models import User
from app.auth.dependencies import get_current_user

router = APIRouter()

@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "provider": user.oauth_provider,
    }
