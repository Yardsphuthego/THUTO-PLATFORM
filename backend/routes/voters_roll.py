from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime
from db.database import get_db
from models.models import VoterRoll, University, User
import csv
from io import StringIO

router = APIRouter()

@router.post("/upload")
async def upload_voters_roll(
    university_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload a voters roll CSV file for a university"""
    # Verify university exists
    university = db.query(University).filter(University.id == university_id).first()
    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found"
        )
    
    try:
        # Read CSV file
        contents = await file.read()
        decoded_content = contents.decode('utf-8')
        csv_reader = csv.DictReader(StringIO(decoded_content))
        
        voter_count = 0
        for row in csv_reader:
            voter_roll = VoterRoll(
                university_id=university_id,
                student_email=row.get('email', ''),
                student_id=row.get('student_id', ''),
                full_name=row.get('full_name', ''),
                course=row.get('course', ''),
                file_name=file.filename,
                created_by=1  # Default super admin
            )
            db.add(voter_roll)
            voter_count += 1
        
        db.commit()
        
        return {
            "message": "Voters roll uploaded successfully",
            "university_id": university_id,
            "voters_added": voter_count,
            "file_name": file.filename
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing file: {str(e)}"
        )

@router.get("/university/{university_id}")
async def get_voters_roll(university_id: int, db: Session = Depends(get_db)):
    """Get voters roll for a university"""
    voters = db.query(VoterRoll).filter(VoterRoll.university_id == university_id).all()
    return {
        "university_id": university_id,
        "total_voters": len(voters),
        "voters": [
            {
                "id": v.id,
                "email": v.student_email,
                "student_id": v.student_id,
                "full_name": v.full_name,
                "course": v.course
            }
            for v in voters
        ]
    }

@router.delete("/{voter_id}")
async def delete_voter(voter_id: int, db: Session = Depends(get_db)):
    """Delete a voter from the roll"""
    voter = db.query(VoterRoll).filter(VoterRoll.id == voter_id).first()
    if not voter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voter not found"
        )
    
    db.delete(voter)
    db.commit()
    
    return {"message": "Voter deleted successfully"}

@router.get("/university/{university_id}/count")
async def get_voters_count(university_id: int, db: Session = Depends(get_db)):
    """Get count of voters for a university"""
    count = db.query(VoterRoll).filter(VoterRoll.university_id == university_id).count()
    return {"university_id": university_id, "voter_count": count}
