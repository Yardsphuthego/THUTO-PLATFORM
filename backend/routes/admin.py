from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import desc
from core.dependencies import require_admin_user, require_super_admin_user
from db.database import get_db
from models.models import User, UserRole, Election, Vote, ActivityLog, University, VoterRoll
from core.security import get_password_hash
from datetime import datetime, timedelta
import io
import csv

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Dashboard Statistics
@router.get("/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get comprehensive dashboard statistics"""
    try:
        total_users = db.query(User).count()
        total_students = db.query(User).filter(User.role == UserRole.STUDENT.value).count()
        total_admins = db.query(User).filter(User.role.in_([UserRole.ADMIN.value, UserRole.SUPER_ADMIN.value])).count()
        active_users = db.query(User).filter(User.is_active == True).count()
        
        total_elections = db.query(Election).count()
        active_elections = db.query(Election).filter(Election.is_active == True).count()
        completed_elections = db.query(Election).filter(Election.status == "completed").count()
        
        total_votes = db.query(Vote).count()
        recent_votes = db.query(Vote).order_by(desc(Vote.cast_at)).limit(5).count()
        
        # Activity in last 24 hours
        yesterday = datetime.utcnow() - timedelta(hours=24)
        activity_24h = db.query(ActivityLog).filter(ActivityLog.created_at >= yesterday).count()
        
        return {
            "users": {
                "total": total_users,
                "students": total_students,
                "admins": total_admins,
                "active": active_users
            },
            "elections": {
                "total": total_elections,
                "active": active_elections,
                "completed": completed_elections
            },
            "votes": {
                "total": total_votes,
                "recent": recent_votes
            },
            "activity": {
                "last_24_hours": activity_24h
            },
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

# User Management
@router.get("/users")
async def get_all_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Get all users with pagination"""
    users = db.query(User).offset(skip).limit(limit).all()
    total = db.query(User).count()
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "full_name": u.full_name,
                "student_id": u.student_id,
                "role": u.role,
                "is_active": u.is_active,
                "is_voter": u.is_voter,
                "last_login": u.last_login,
                "created_at": u.created_at
            }
            for u in users
        ]
    }

@router.get("/users/{user_id}")
async def get_user_details(user_id: int, db: Session = Depends(get_db)):
    """Get detailed user information"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_votes = db.query(Vote).filter(Vote.voter_id == user_id).count()
    user_activities = db.query(ActivityLog).filter(ActivityLog.user_id == user_id).count()
    
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "student_id": user.student_id,
        "role": user.role,
        "is_active": user.is_active,
        "is_voter": user.is_voter,
        "profile_picture": user.profile_picture,
        "last_login": user.last_login,
        "votes_cast": user_votes,
        "activities": user_activities,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    }

@router.post("/users/{user_id}/toggle-status")
async def toggle_user_status(user_id: int, db: Session = Depends(get_db)):
    """Toggle user active status"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = not user.is_active
    db.add(user)
    db.commit()
    
    # Log activity
    activity = ActivityLog(
        user_id=user_id,
        action="status_toggled",
        description=f"User status changed to {'active' if user.is_active else 'inactive'}",
        resource_type="user",
        resource_id=user_id,
        status="success"
    )
    db.add(activity)
    db.commit()
    
    return {"success": True, "message": f"User is now {'active' if user.is_active else 'inactive'}"}

@router.post("/users/{user_id}/promote-to-admin")
async def promote_user_to_admin(user_id: int, db: Session = Depends(get_db)):
    """Promote user to admin role"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == UserRole.SUPER_ADMIN.value:
        raise HTTPException(status_code=400, detail="Cannot change super admin role")
    
    user.role = UserRole.ADMIN.value
    db.add(user)
    db.commit()
    
    return {"success": True, "message": "User promoted to admin"}

@router.post("/users/{user_id}/demote-to-student")
async def demote_user_to_student(user_id: int, db: Session = Depends(get_db)):
    """Demote user to student role"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == UserRole.SUPER_ADMIN.value:
        raise HTTPException(status_code=400, detail="Cannot change super admin role")
    
    user.role = UserRole.STUDENT.value
    db.add(user)
    db.commit()
    
    return {"success": True, "message": "User demoted to student"}

# Activity Logs
@router.get("/activity-logs")
async def get_activity_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get activity logs with pagination"""
    logs = db.query(ActivityLog).order_by(desc(ActivityLog.created_at)).offset(skip).limit(limit).all()
    total = db.query(ActivityLog).count()
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "logs": [
            {
                "id": log.id,
                "user_id": log.user_id,
                "action": log.action,
                "description": log.description,
                "resource_type": log.resource_type,
                "resource_id": log.resource_id,
                "status": log.status,
                "created_at": log.created_at
            }
            for log in logs
        ]
    }

# System Health
@router.get("/system/health")
async def get_system_health(db: Session = Depends(get_db)):
    """Get system health status"""
    try:
        db.query(User).first()  # Test database connection
        
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.utcnow()
        }

# ═══════════════════════════════════════════════════════════
# SUPER ADMIN: UNIVERSITY MANAGEMENT
# ═══════════════════════════════════════════════════════════

@router.post("/universities/create")
async def create_university(
    name: str,
    code: str,
    abbreviation: str,
    description: str = "",
    location: str = "",
    website: str = "",
    contact_email: str = "",
    current_user: User = Depends(require_super_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new university"""
    # Check if university already exists
    existing = db.query(University).filter(
        (University.name == name) | (University.code == code)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="University already exists")
    
    university = University(
        name=name,
        code=code,
        abbreviation=abbreviation,
        description=description,
        location=location,
        website=website,
        contact_email=contact_email,
        created_by=current_user.id,
        is_active=True
    )
    
    db.add(university)
    db.commit()
    db.refresh(university)
    
    # Log activity
    activity = ActivityLog(
        user_id=current_user.id,
        action="school_created",
        description=f"School '{name}' created",
        resource_type="school",
        resource_id=university.id,
        status="success"
    )
    db.add(activity)
    db.commit()
    
    return {
        "id": university.id,
        "name": university.name,
        "code": university.code,
        "abbreviation": university.abbreviation,
        "message": "School created successfully"
    }

@router.get("/universities")
async def get_all_universities(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db),
):
    """Get all universities"""
    query = db.query(University)
    if current_user.role == UserRole.ADMIN.value:
        if current_user.university_id is None:
            return {"total": 0, "skip": skip, "limit": limit, "universities": []}
        query = query.filter(University.id == current_user.university_id)

    universities = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "universities": [
            {
                "id": u.id,
                "name": u.name,
                "code": u.code,
                "abbreviation": u.abbreviation,
                "description": u.description,
                "location": u.location,
                "website": u.website,
                "contact_email": u.contact_email,
                "is_active": u.is_active,
                "created_at": u.created_at
            }
            for u in universities
        ]
    }

@router.get("/universities/{university_id}")
async def get_university_details(
    university_id: int,
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db),
):
    """Get university details with stats"""
    university = db.query(University).filter(University.id == university_id).first()
    if not university:
        raise HTTPException(status_code=404, detail="University not found")

    if (
        current_user.role == UserRole.ADMIN.value
        and current_user.university_id != university_id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your assigned university",
        )
    
    voter_count = db.query(VoterRoll).filter(VoterRoll.university_id == university_id).count()
    election_count = db.query(Election).filter(Election.university_id == university_id).count()
    
    return {
        "id": university.id,
        "name": university.name,
        "code": university.code,
        "abbreviation": university.abbreviation,
        "description": university.description,
        "location": university.location,
        "website": university.website,
        "contact_email": university.contact_email,
        "is_active": university.is_active,
        "voter_count": voter_count,
        "election_count": election_count,
        "created_at": university.created_at
    }

@router.put("/universities/{university_id}")
async def update_university(
    university_id: int,
    name: str = None,
    abbreviation: str = None,
    description: str = None,
    location: str = None,
    website: str = None,
    contact_email: str = None,
    current_user: User = Depends(require_super_admin_user),
    db: Session = Depends(get_db)
):
    """Update university details"""
    university = db.query(University).filter(University.id == university_id).first()
    if not university:
        raise HTTPException(status_code=404, detail="University not found")
    
    if name:
        university.name = name
    if abbreviation:
        university.abbreviation = abbreviation
    if description:
        university.description = description
    if location:
        university.location = location
    if website:
        university.website = website
    if contact_email:
        university.contact_email = contact_email
    
    university.updated_at = datetime.utcnow()
    db.add(university)
    db.commit()
    
    return {"success": True, "message": "University updated successfully"}

@router.delete("/universities/{university_id}")
async def delete_university(
    university_id: int,
    current_user: User = Depends(require_super_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a university when no dependent records exist."""
    university = db.query(University).filter(University.id == university_id).first()
    if not university:
        raise HTTPException(status_code=404, detail="University not found")

    linked_users = db.query(User).filter(User.university_id == university_id).count()
    linked_elections = db.query(Election).filter(Election.university_id == university_id).count()
    linked_voter_rolls = db.query(VoterRoll).filter(VoterRoll.university_id == university_id).count()

    if linked_users > 0 or linked_elections > 0 or linked_voter_rolls > 0:
        raise HTTPException(
            status_code=400,
            detail=(
                "Cannot delete university with linked records. "
                "Remove related users, elections, and voter rolls first."
            ),
        )

    db.delete(university)
    db.commit()

    activity = ActivityLog(
        user_id=current_user.id,
        action="school_deleted",
        description=f"School '{university.name}' deleted",
        resource_type="school",
        resource_id=university_id,
        status="success"
    )
    db.add(activity)
    db.commit()

    return {"success": True, "message": "University deleted successfully"}

# ═══════════════════════════════════════════════════════════
# SUPER ADMIN: ELECTION MANAGEMENT
# ═══════════════════════════════════════════════════════════

@router.post("/elections/create")
async def create_election(
    title: str,
    university_id: int,
    description: str,
    start_date: str,  # Format: "2026-02-10T10:00:00"
    end_date: str,
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new election for a university"""
    university = db.query(University).filter(University.id == university_id).first()
    if not university:
        raise HTTPException(status_code=404, detail="University not found")

    if (
        current_user.role == UserRole.ADMIN.value
        and current_user.university_id != university_id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create elections for your assigned university",
        )
    
    try:
        start_dt = datetime.fromisoformat(start_date)
        end_dt = datetime.fromisoformat(end_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use ISO format")
    
    if end_dt <= start_dt:
        raise HTTPException(status_code=400, detail="End date must be after start date")
    
    election = Election(
        title=title,
        description=description,
        university_id=university_id,
        start_date=start_dt,
        end_date=end_dt,
        created_by=current_user.id,
        status="pending",
        is_active=False
    )
    
    db.add(election)
    db.commit()
    db.refresh(election)
    
    # Log activity
    activity = ActivityLog(
        user_id=current_user.id,
        action="election_created",
        description=f"Election '{title}' created for university {university.name}",
        resource_type="election",
        resource_id=election.id,
        status="success"
    )
    db.add(activity)
    db.commit()
    
    return {
        "id": election.id,
        "title": election.title,
        "university_id": election.university_id,
        "start_date": election.start_date,
        "end_date": election.end_date,
        "status": election.status,
        "message": "Election created successfully"
    }

@router.get("/elections/university/{university_id}")
async def get_university_elections(
    university_id: int,
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db),
):
    """Get all elections for a university"""
    if (
        current_user.role == UserRole.ADMIN.value
        and current_user.university_id != university_id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access elections for your assigned university",
        )

    elections = db.query(Election).filter(Election.university_id == university_id).all()
    
    return {
        "university_id": university_id,
        "elections": [
            {
                "id": e.id,
                "title": e.title,
                "description": e.description,
                "start_date": e.start_date,
                "end_date": e.end_date,
                "status": e.status,
                "is_active": e.is_active,
                "created_at": e.created_at
            }
            for e in elections
        ]
    }

@router.post("/elections/{election_id}/activate")
async def activate_election(election_id: int, db: Session = Depends(get_db)):
    """Activate an election (make it live)"""
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    
    # Deactivate any other active elections for the same university
    db.query(Election).filter(
        (Election.university_id == election.university_id) & (Election.is_active == True)
    ).update({"is_active": False})
    
    election.is_active = True
    election.status = "active"
    db.add(election)
    db.commit()
    
    return {"success": True, "message": "Election activated"}

@router.post("/elections/{election_id}/end")
async def end_election(election_id: int, db: Session = Depends(get_db)):
    """End an election"""
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    
    election.is_active = False
    election.status = "completed"
    db.add(election)
    db.commit()
    
    return {"success": True, "message": "Election ended"}

# ═══════════════════════════════════════════════════════════
# SUPER ADMIN: VOTER ROLL MANAGEMENT
# ═══════════════════════════════════════════════════════════

@router.post("/voter-roll/upload")
async def upload_voter_roll(
    university_id: int,
    file: UploadFile = File(...),
    current_user_id: int = 1,
    db: Session = Depends(get_db)
):
    """Upload voter roll from Excel/CSV file"""
    university = db.query(University).filter(University.id == university_id).first()
    if not university:
        raise HTTPException(status_code=404, detail="University not found")
    
    try:
        contents = await file.read()
        stream = io.StringIO(contents.decode("utf-8"))
        csv_reader = csv.DictReader(stream)
        
        if not csv_reader.fieldnames or not all(
            field in csv_reader.fieldnames 
            for field in ["email", "student_id", "full_name", "course", "gender"]
        ):
            raise HTTPException(
                status_code=400,
                detail="CSV must contain: email, student_id, full_name, course, gender"
            )
        
        uploaded_count = 0
        for row in csv_reader:
            if not row.get("email"):
                continue
            
            voter_roll = VoterRoll(
                university_id=university_id,
                student_email=row.get("email", "").strip(),
                student_id=row.get("student_id", "").strip(),
                full_name=row.get("full_name", "").strip(),
                course=row.get("course", "").strip(),
                gender=row.get("gender", "").strip(),
                file_name=file.filename or "upload",
                created_by=current_user_id
            )
            db.add(voter_roll)
            uploaded_count += 1
        
        db.commit()
        
        # Log activity
        activity = ActivityLog(
            user_id=current_user_id,
            action="voter_roll_uploaded",
            description=f"Voter roll uploaded for {university.name}: {uploaded_count} records",
            resource_type="voter_roll",
            resource_id=university_id,
            status="success"
        )
        db.add(activity)
        db.commit()
        
        return {
            "success": True,
            "university_id": university_id,
            "uploaded_count": uploaded_count,
            "message": f"Uploaded {uploaded_count} voter records"
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Upload failed: {str(e)}") from e

@router.get("/voter-roll/university/{university_id}")
async def get_voter_roll(university_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get voter roll for a university"""
    university = db.query(University).filter(University.id == university_id).first()
    if not university:
        raise HTTPException(status_code=404, detail="University not found")
    
    voters = db.query(VoterRoll).filter(
        VoterRoll.university_id == university_id
    ).offset(skip).limit(limit).all()
    total = db.query(VoterRoll).filter(VoterRoll.university_id == university_id).count()
    
    return {
        "university_id": university_id,
        "total": total,
        "skip": skip,
        "limit": limit,
        "voters": [
            {
                "id": v.id,
                "email": v.student_email,
                "student_id": v.student_id,
                "full_name": v.full_name,
                "course": v.course,
                "gender": v.gender
            }
            for v in voters
        ]
    }

@router.delete("/voter-roll/{voter_id}")
async def delete_voter_record(voter_id: int, db: Session = Depends(get_db)):
    """Delete a voter record"""
    voter = db.query(VoterRoll).filter(VoterRoll.id == voter_id).first()
    if not voter:
        raise HTTPException(status_code=404, detail="Voter record not found")
    
    db.delete(voter)
    db.commit()
    
    return {"success": True, "message": "Voter record deleted"}

@router.delete("/voter-roll/university/{university_id}/all")
async def delete_all_voter_rolls(university_id: int, db: Session = Depends(get_db)):
    """Delete all voter records for a university"""
    university = db.query(University).filter(University.id == university_id).first()
    if not university:
        raise HTTPException(status_code=404, detail="University not found")
    
    count = db.query(VoterRoll).filter(VoterRoll.university_id == university_id).count()
    db.query(VoterRoll).filter(VoterRoll.university_id == university_id).delete()
    db.commit()
    
    return {
        "success": True,
        "deleted_count": count,
        "message": f"Deleted {count} voter records"
    }

# ═══════════════════════════════════════════════════════════
# SUPER ADMIN: ADMIN CREATION
# ═══════════════════════════════════════════════════════════

@router.post("/admins/create")
async def create_admin(
    email: str,
    full_name: str,
    password: str,
    university_id: int = None,
    current_user: User = Depends(require_super_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new admin user"""
    if university_id is None:
        raise HTTPException(status_code=400, detail="University is required for admin creation")

    university = db.query(University).filter(University.id == university_id).first()
    if not university:
        raise HTTPException(status_code=404, detail="University not found")

    # Check if user already exists
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    # Create new admin
    new_admin = User(
        email=email,
        full_name=full_name,
        hashed_password=get_password_hash(password),
        role=UserRole.ADMIN.value,
        university_id=university_id,
        is_active=True
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    # Log activity
    activity = ActivityLog(
        user_id=current_user.id,
        action="admin_created",
        description=f"Admin user '{email}' created for {university.name}",
        resource_type="user",
        resource_id=new_admin.id,
        status="success"
    )
    db.add(activity)
    db.commit()
    
    return {
        "id": new_admin.id,
        "email": new_admin.email,
        "full_name": new_admin.full_name,
        "role": new_admin.role,
        "university_id": new_admin.university_id,
        "message": "Admin created successfully"
    }

@router.get("/admins")
async def get_all_admins(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(require_super_admin_user),
    db: Session = Depends(get_db),
):
    """Get all admin users"""
    admins = db.query(User).filter(
        User.role.in_([UserRole.ADMIN.value])
    ).offset(skip).limit(limit).all()
    
    total = db.query(User).filter(User.role == UserRole.ADMIN.value).count()
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "admins": [
            {
                "id": a.id,
                "email": a.email,
                "full_name": a.full_name,
                "university_id": a.university_id,
                "is_active": a.is_active,
                "created_at": a.created_at
            }
            for a in admins
        ]
    }

@router.delete("/admins/{admin_id}")
async def delete_admin(
    admin_id: int,
    current_user: User = Depends(require_super_admin_user),
    db: Session = Depends(get_db),
):
    """Delete an admin user"""
    admin = db.query(User).filter(User.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    if admin.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=400, detail="This user is not an admin")
    
    db.delete(admin)
    db.commit()
    
    return {"success": True, "message": "Admin deleted successfully"}
