from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import Vote, Election, Candidate, User
from schemas.schemas import VoteCreate, Vote as VoteSchema

router = APIRouter()

@router.post("/", response_model=dict)
async def cast_vote(vote: VoteCreate, voter_id: int, db: Session = Depends(get_db)):
    """Cast a vote in an election"""
    
    # Check if election exists and is active
    election = db.query(Election).filter(Election.id == vote.election_id).first()
    if not election:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Election not found"
        )
    
    if not election.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Election is not active"
        )
    
    # Check if candidate exists and belongs to this election
    candidate = db.query(Candidate).filter(
        Candidate.id == vote.candidate_id,
        Candidate.election_id == vote.election_id
    ).first()
    
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found in this election"
        )
    
    # Check if user has already voted in this election
    existing_vote = db.query(Vote).filter(
        Vote.election_id == vote.election_id,
        Vote.voter_id == voter_id
    ).first()
    
    if existing_vote:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already voted in this election"
        )
    
    # Create vote
    db_vote = Vote(
        election_id=vote.election_id,
        voter_id=voter_id,
        candidate_id=vote.candidate_id
    )
    
    # Increment candidate vote count
    candidate.votes_count += 1
    
    db.add(db_vote)
    db.add(candidate)
    db.commit()
    db.refresh(db_vote)
    
    return {"message": "Vote cast successfully", "vote_id": db_vote.id}

@router.get("/{election_id}/voter-status/{voter_id}")
async def get_voter_status(election_id: int, voter_id: int, db: Session = Depends(get_db)):
    """Check if voter has already voted in an election"""
    
    vote = db.query(Vote).filter(
        Vote.election_id == election_id,
        Vote.voter_id == voter_id
    ).first()
    
    return {"has_voted": vote is not None}

@router.get("/{election_id}")
async def get_election_votes(election_id: int, db: Session = Depends(get_db)):
    """Get all votes for an election (admin only)"""
    
    votes = db.query(Vote).filter(Vote.election_id == election_id).all()
    return votes
