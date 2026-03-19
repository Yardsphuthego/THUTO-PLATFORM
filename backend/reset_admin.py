"""Reset demo admin/student users with known passwords."""
import sys
sys.path.insert(0, '/Users/mac1/THUTO VOTING PLATFORM/backend')

from db.database import SessionLocal, ensure_schema_updates
from models.models import User, UserRole, University
from core.security import get_password_hash

def reset_admins():
    db = SessionLocal()
    try:
        ensure_schema_updates()

        default_university = db.query(University).filter(University.code == "BAC").first()
        if not default_university:
            default_university = University(
                name="Botswana Accountancy College",
                code="BAC",
                abbreviation="BAC",
                description="Default university for admin scope",
                location="Gaborone",
                contact_email="info@bac.ac.bw",
                created_by=None,
                is_active=True,
            )
            db.add(default_university)
            db.commit()
            db.refresh(default_university)
            print("🏫 Created default university for admin assignment")

        # Delete demo users so credentials are refreshed
        db.query(User).filter(
            User.email.in_(
                [
                    "admin@thuto.bac.ac.bw",
                    "ns24-035@thuto.bac.ac.bw",
                    "student@thuto.bac.ac.bw",
                ]
            )
        ).delete(synchronize_session=False)
        db.commit()
        print("🗑️  Deleted old demo users")
        
        # Create super admin
        admin1 = User(
            email="admin@thuto.bac.ac.bw",
            full_name="System Administrator",
            student_id="ADM-001",
            hashed_password=get_password_hash("Thuto@2024"),
            role=UserRole.SUPER_ADMIN.value,
            is_active=True,
            is_voter=False
        )
        db.add(admin1)
        
        # Create second super admin
        admin2 = User(
            email="ns24-035@thuto.bac.ac.bw",
            full_name="Admin User",
            student_id="ns24-035",
            hashed_password=get_password_hash("Yards@1625"),
            role=UserRole.SUPER_ADMIN.value,
            university_id=default_university.id,
            is_active=True,
            is_voter=False
        )
        db.add(admin2)

        # Create demo student
        student = User(
            email="student@thuto.bac.ac.bw",
            full_name="Student User",
            student_id="STU-001",
            hashed_password=get_password_hash("Student@2024"),
            role=UserRole.STUDENT.value,
            is_active=True,
            is_voter=True
        )
        db.add(student)
        
        db.commit()
        print("✅ Created demo users with new password hashing:")
        print("   📧 admin@thuto.bac.ac.bw / Thuto@2024")
        print("   📧 ns24-035@thuto.bac.ac.bw / Yards@1625")
        print("   📧 student@thuto.bac.ac.bw / Student@2024")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_admins()
