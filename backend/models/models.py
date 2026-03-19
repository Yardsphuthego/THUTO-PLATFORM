from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from db.database import Base

class UserRole(str, enum.Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    STUDENT = "student"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    student_id = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default=UserRole.STUDENT.value)  # super_admin, admin, student
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    is_voter = Column(Boolean, default=True)
    profile_picture = Column(String, nullable=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    votes = relationship("Vote", back_populates="voter")
    activity_logs = relationship("ActivityLog", back_populates="user")

class Election(Base):
    __tablename__ = "elections"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=True)
    status = Column(String, default="pending")  # pending, active, completed
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    created_by = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    candidates = relationship("Candidate", back_populates="election", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="election", cascade="all, delete-orphan")
    university = relationship("University", back_populates="elections")

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    election_id = Column(Integer, ForeignKey("elections.id"), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    candidate_name = Column(String, nullable=True)
    party_name = Column(String, nullable=True)
    candidate_photo = Column(Text, nullable=True)
    party_logo = Column(Text, nullable=True)
    position = Column(String)  # e.g., "President", "Vice President"
    biography = Column(Text)
    votes_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    election = relationship("Election", back_populates="candidates")
    candidate_user = relationship("User")

class Vote(Base):
    __tablename__ = "votes"
    
    id = Column(Integer, primary_key=True, index=True)
    election_id = Column(Integer, ForeignKey("elections.id"), index=True)
    voter_id = Column(Integer, ForeignKey("users.id"), index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), index=True)
    cast_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    election = relationship("Election", back_populates="votes")
    voter = relationship("User", back_populates="votes")
    candidate = relationship("Candidate")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    action = Column(String)  # e.g., "user_created", "election_started", "vote_cast"
    description = Column(Text)
    resource_type = Column(String)  # e.g., "user", "election", "vote"
    resource_id = Column(Integer, nullable=True)
    ip_address = Column(String, nullable=True)
    status = Column(String, default="success")  # success, failed
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="activity_logs")

class University(Base):
    __tablename__ = "universities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    code = Column(String, unique=True, index=True)
    abbreviation = Column(String)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    website = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    voter_rolls = relationship("VoterRoll", back_populates="university", cascade="all, delete-orphan")
    elections = relationship("Election", back_populates="university")

class VoterRoll(Base):
    __tablename__ = "voter_rolls"
    
    id = Column(Integer, primary_key=True, index=True)
    university_id = Column(Integer, ForeignKey("universities.id"), index=True)
    student_email = Column(String, index=True)
    student_id = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    course = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    file_name = Column(String)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    university = relationship("University", back_populates="voter_rolls")
    created_by_user = relationship("User")

class News(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    category = Column(String)  # e.g., "Election Updates", "General News", "Announcements"
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    is_published = Column(Boolean, default=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    university = relationship("University")
    author = relationship("User")
