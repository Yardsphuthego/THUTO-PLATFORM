from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    student_id: Optional[str] = None
    full_name: str

class UserCreate(UserBase):
    student_id: str
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    profile_picture: Optional[str] = None

class User(UserBase):
    id: int
    role: Optional[str] = None
    university_id: Optional[int] = None
    profile_picture: Optional[str] = None
    is_active: bool
    is_voter: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Authentication schemas
class Login(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional['User'] = None

class TokenVerifyRequest(BaseModel):
    token: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Election schemas
class ElectionBase(BaseModel):
    title: str
    description: str
    start_date: datetime
    end_date: datetime
    university_id: Optional[int] = None

class ElectionCreate(ElectionBase):
    pass

class ElectionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    university_id: Optional[int] = None

class Election(ElectionBase):
    id: int
    status: str
    is_active: bool
    created_by: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Candidate schemas
class CandidateBase(BaseModel):
    candidate_name: str
    party_name: Optional[str] = None
    candidate_photo: Optional[str] = None
    party_logo: Optional[str] = None
    position: str
    manifesto: str
    biography: Optional[str] = None

class CandidateCreate(CandidateBase):
    user_id: Optional[int] = None
    election_id: int

class Candidate(CandidateBase):
    id: int
    election_id: int
    user_id: Optional[int] = None
    votes_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Vote schemas
class VoteCreate(BaseModel):
    election_id: int
    candidate_id: int

class Vote(BaseModel):
    id: int
    election_id: int
    voter_id: int
    candidate_id: int
    cast_at: datetime
    
    class Config:
        from_attributes = True
# University schemas
class UniversityBase(BaseModel):
    name: str
    code: str
    abbreviation: str
    description: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[str] = None

class UniversityCreate(UniversityBase):
    pass

class University(UniversityBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# VoterRoll schemas
class VoterRollBase(BaseModel):
    student_email: str
    student_id: Optional[str] = None
    full_name: Optional[str] = None
    course: Optional[str] = None
    gender: Optional[str] = None

class VoterRollCreate(VoterRollBase):
    university_id: int

class VoterRoll(VoterRollBase):
    id: int
    university_id: int
    file_name: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Admin schemas
class AdminCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    university_id: Optional[int] = None

class AdminUpdate(BaseModel):
    full_name: Optional[str] = None
    university_id: Optional[int] = None
    is_active: Optional[bool] = None

class Admin(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    school_id: Optional[int] = None
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# News schemas
class NewsBase(BaseModel):
    title: str
    content: str
    category: str

class NewsCreate(NewsBase):
    university_id: Optional[int] = None

class NewsUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None

class News(NewsBase):
    id: int
    university_id: Optional[int] = None
    created_by: int
    is_published: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
