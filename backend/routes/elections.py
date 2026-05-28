from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from core.dependencies import get_current_user, require_admin_user
from db.database import get_db
from models.models import Election, User, UserRole
from schemas.schemas import ElectionCreate, ElectionUpdate, Election as ElectionSchema

router = APIRouter()

@router.post("/", response_model=dict)
async def create_election(
    election: ElectionCreate,
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db),
):
    """Create a new election"""
    # Validate that end_date is after start_date
    if election.end_date <= election.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )

    target_university_id = election.university_id
    if current_user.role == UserRole.ADMIN.value:
        if current_user.university_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin account is not linked to any university",
            )
        if target_university_id is not None and target_university_id != current_user.university_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admins can only create elections for their assigned university",
            )
        target_university_id = current_user.university_id

    if target_university_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="University is required for election creation",
        )
    
    db_election = Election(
        title=election.title,
        description=election.description,
        university_id=target_university_id,
        start_date=election.start_date,
        end_date=election.end_date,
        created_by=current_user.id,
        status="pending"
    )
    db.add(db_election)
    db.commit()
    db.refresh(db_election)
    
    return {"message": "Election created successfully", "election_id": db_election.id}

@router.get("/{election_id}", response_model=ElectionSchema)
async def get_election(
    election_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get election by ID"""
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Election not found"
        )

    if (
        current_user.role == UserRole.ADMIN.value
        and election.university_id != current_user.university_id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access elections from your assigned university",
        )
    return election

@router.put("/{election_id}", response_model=ElectionSchema)
async def update_election(
    election_id: int,
    election_update: ElectionUpdate,
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db),
):
    """Update election information"""
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Election not found"
        )

    if (
        current_user.role == UserRole.ADMIN.value
        and election.university_id != current_user.university_id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only manage elections from your assigned university",
        )
    
    if election_update.title:
        election.title = election_update.title
    if election_update.description:
        election.description = election_update.description
    if election_update.university_id is not None:
        if (
            current_user.role == UserRole.ADMIN.value
            and election_update.university_id != current_user.university_id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admins cannot move elections to another university",
            )
        election.university_id = election_update.university_id
    if election_update.is_active is not None:
        election.is_active = election_update.is_active
        if election_update.is_active:
            election.status = "active"
            election.start_date = datetime.utcnow()
        else:
            election.status = "completed"
    
    db.add(election)
    db.commit()
    db.refresh(election)
    
    return election

@router.get("/")
async def list_elections(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all elections"""
    query = db.query(Election)
    if current_user.role == UserRole.ADMIN.value:
        if current_user.university_id is None:
            return []
        query = query.filter(Election.university_id == current_user.university_id)

    elections = query.all()
    return elections

@router.get("/{election_id}/results")
async def get_election_results(
    election_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get election results"""
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Election not found"
        )

    if (
        current_user.role == UserRole.ADMIN.value
        and election.university_id != current_user.university_id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access results from your assigned university",
        )
    
    return {
        "election_id": election.id,
        "title": election.title,
        "candidates": [
            {
                "id": c.id,
                "candidate_name": c.candidate_name or (c.candidate_user.full_name if c.candidate_user else "Unknown candidate"),
                "party_name": c.party_name,
                "candidate_photo": c.candidate_photo,
                "party_logo": c.party_logo,
                "position": c.position,
                "manifesto": c.biography or "",
                "votes": c.votes_count
            }
            for c in election.candidates
        ]
    }
