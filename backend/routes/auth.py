from fastapi import APIRouter, Body, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import timedelta
from db.database import get_db
from models.models import User
from schemas.schemas import UserCreate, Login, Token, TokenVerifyRequest
from core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_token
)
from core.config import settings

router = APIRouter()

@router.post("/register", response_model=dict)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user/voter"""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if student ID already exists
    db_user = db.query(User).filter(User.student_id == user.student_id).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student ID already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        student_id=user.student_id,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"message": "User registered successfully", "user_id": db_user.id}

@router.post("/login", response_model=Token)
async def login(credentials: Login, db: Session = Depends(get_db)):
    """Login user and return access token"""
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not active"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "university_id": user.university_id,
            "student_id": user.student_id,
            "profile_picture": user.profile_picture,
            "is_active": user.is_active,
            "is_voter": user.is_voter,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    }

@router.post("/verify-token")
async def verify_token(
    payload: TokenVerifyRequest | None = Body(default=None),
    token: str | None = Query(default=None),
):
    """Verify if token is valid"""
    token_value = payload.token if payload else token
    if not token_value:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Token is required",
        )

    decoded_payload = decode_token(token_value)
    if not decoded_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    return {"valid": True, "email": decoded_payload.get("sub")}
