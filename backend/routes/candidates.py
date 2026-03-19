from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.dependencies import get_current_user, require_admin_user
from db.database import get_db
from models.models import Candidate, Election, User, UserRole
from schemas.schemas import CandidateCreate

router = APIRouter()


def serialize_candidate(candidate: Candidate) -> dict:
    linked_user = candidate.candidate_user
    candidate_name = candidate.candidate_name or (linked_user.full_name if linked_user else "Unknown candidate")

    return {
        "id": candidate.id,
        "election_id": candidate.election_id,
        "user_id": candidate.user_id,
        "candidate_name": candidate_name,
        "party_name": candidate.party_name,
        "candidate_photo": candidate.candidate_photo,
        "party_logo": candidate.party_logo,
        "position": candidate.position,
        "manifesto": candidate.biography or "",
        "votes_count": candidate.votes_count,
        "created_at": candidate.created_at,
    }

@router.post("/", response_model=dict)
async def create_candidate(
    candidate: CandidateCreate,
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db),
):
    """Create a new candidate for an election"""
    # Verify election exists
    election = db.query(Election).filter(Election.id == candidate.election_id).first()
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
            detail="You can only manage candidates for elections in your assigned university",
        )
    
    linked_user = None
    if candidate.user_id is not None:
        linked_user = db.query(User).filter(User.id == candidate.user_id).first()
        if not linked_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
    
    db_candidate = Candidate(
        election_id=candidate.election_id,
        user_id=candidate.user_id,
        candidate_name=candidate.candidate_name or (linked_user.full_name if linked_user else None),
        party_name=candidate.party_name,
        candidate_photo=candidate.candidate_photo,
        party_logo=candidate.party_logo,
        position=candidate.position,
        biography=candidate.manifesto or candidate.biography or ""
    )
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    
    return {"message": "Candidate created successfully", "candidate_id": db_candidate.id}

@router.get("/")
async def list_candidates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all candidates"""
    query = db.query(Candidate)
    if current_user.role == UserRole.ADMIN.value:
        if current_user.university_id is None:
            return []
        query = query.join(Election, Candidate.election_id == Election.id).filter(
            Election.university_id == current_user.university_id
        )

    candidates = query.order_by(Candidate.created_at.desc()).all()
    return [serialize_candidate(candidate) for candidate in candidates]

@router.get("/election/{election_id}")
async def get_election_candidates(
    election_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all candidates for an election"""
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
            detail="You can only access candidates for your assigned university elections",
        )

    candidates = (
        db.query(Candidate)
        .filter(Candidate.election_id == election_id)
        .order_by(Candidate.created_at.desc())
        .all()
    )
    return [serialize_candidate(candidate) for candidate in candidates]

@router.get("/{candidate_id}", response_model=dict)
async def get_candidate(
    candidate_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get candidate by ID"""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )

    election = db.query(Election).filter(Election.id == candidate.election_id).first()
    if (
        current_user.role == UserRole.ADMIN.value
        and election
        and election.university_id != current_user.university_id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access candidates in your assigned university",
        )

    return serialize_candidate(candidate)

@router.delete("/{candidate_id}", response_model=dict)
async def delete_candidate(
    candidate_id: int,
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db),
):
    """Delete a candidate"""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )

    election = db.query(Election).filter(Election.id == candidate.election_id).first()
    if (
        current_user.role == UserRole.ADMIN.value
        and election
        and election.university_id != current_user.university_id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only remove candidates in your assigned university",
        )
    
    db.delete(candidate)
    db.commit()
    
    return {"message": "Candidate deleted successfully"}
