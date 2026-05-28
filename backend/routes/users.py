from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import User
from schemas.schemas import User as UserSchema, UserUpdate
from core.security import decode_token

router = APIRouter()

def get_current_user(token: str = None, db: Session = Depends(get_db)):
    """Get current authenticated user"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.get("/{user_id}", response_model=UserSchema)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/{user_id}", response_model=UserSchema)
async def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    """Update user information"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user_update.email:
        user.email = user_update.email
    if user_update.full_name:
        user.full_name = user_update.full_name
    if user_update.profile_picture is not None:
        user.profile_picture = user_update.profile_picture

    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

@router.get("/")
async def list_voters(db: Session = Depends(get_db)):
    """List all active voters"""
    voters = db.query(User).filter(User.is_voter == True).all()
    return voters
