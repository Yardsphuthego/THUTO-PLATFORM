"""
Database initialization script
Creates tables and initializes super admin user
"""
import os
import sys
sys.path.insert(0, '/Users/mac1/THUTO VOTING PLATFORM/backend')

from db.database import Base, engine, SessionLocal, ensure_schema_updates
from models.models import User, UserRole, University
from core.security import get_password_hash
from sqlalchemy import text

def init_db():
    """Initialize database with tables and create demo users"""
    print("🔄 Initializing Thuto Voting Platform Database (PostgreSQL)...")
    
    # Create all tables
    print("📊 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    ensure_schema_updates()
    print("✅ Tables created successfully!")
    
    # Create database session
    db = SessionLocal()
    try:
        # Create super admin user if doesn't exist
        existing_super_admin = db.query(User).filter(User.email == "admin@thuto.bac.ac.bw").first()
        
        if not existing_super_admin:
            print("👤 Creating super admin user...")
            super_admin = User(
                email="admin@thuto.bac.ac.bw",
                full_name="System Administrator",
                student_id="ADM-001",
                hashed_password=get_password_hash("Thuto@2024"),
                role=UserRole.SUPER_ADMIN.value,
                is_active=True,
                is_voter=False
            )
            db.add(super_admin)
            db.commit()
            db.refresh(super_admin)
            existing_super_admin = super_admin
            print("✅ Super admin user created!")
            print("📧 Email: admin@thuto.bac.ac.bw")
            print("🔐 Password: Thuto@2024")
        else:
            print("ℹ️  Super admin user already exists")

        # Ensure there is at least one university for admin assignment
        default_university = db.query(University).filter(University.code == "BAC").first()
        if not default_university:
            print("🏫 Creating default university...")
            default_university = University(
                name="Botswana Accountancy College",
                code="BAC",
                abbreviation="BAC",
                description="Default university for admin scope",
                location="Gaborone",
                contact_email="info@bac.ac.bw",
                created_by=existing_super_admin.id,
                is_active=True,
            )
            db.add(default_university)
            db.commit()
            db.refresh(default_university)
            print("✅ Default university created!")
        else:
            print("ℹ️  Default university already exists")
        
        # Create super admin user with provided credentials
        existing_admin = db.query(User).filter(User.email == "ns24-035@thuto.bac.ac.bw").first()
        
        if not existing_admin:
            print("👤 Creating super admin user...")
            admin_user = User(
                email="ns24-035@thuto.bac.ac.bw",
                full_name="Admin User",
                student_id="ns24-035",
                hashed_password=get_password_hash("Yards@1625"),
                role=UserRole.SUPER_ADMIN.value,
                university_id=default_university.id,
                is_active=True,
                is_voter=False
            )
            db.add(admin_user)
            db.commit()
            print("✅ Super admin user created!")
            print("📧 Email: ns24-035@thuto.bac.ac.bw")
            print("🔐 Password: Yards@1625")
        else:
            updated = False
            if existing_admin.role != UserRole.SUPER_ADMIN.value:
                existing_admin.role = UserRole.SUPER_ADMIN.value
                updated = True
            if existing_admin.university_id != default_university.id:
                existing_admin.university_id = default_university.id
                updated = True
            if updated:
                db.add(existing_admin)
                db.commit()
                print("✅ Existing ns24 user updated as super admin")
            else:
                print("ℹ️  Super admin user already exists")

        # Create demo student user with known credentials for local testing
        existing_student = db.query(User).filter(User.email == "student@thuto.bac.ac.bw").first()

        if not existing_student:
            print("👤 Creating student user...")
            student_user = User(
                email="student@thuto.bac.ac.bw",
                full_name="Student User",
                student_id="STU-001",
                hashed_password=get_password_hash("Student@2024"),
                role=UserRole.STUDENT.value,
                is_active=True,
                is_voter=True
            )
            db.add(student_user)
            db.commit()
            print("✅ Student user created!")
            print("📧 Email: student@thuto.bac.ac.bw")
            print("🔐 Password: Student@2024")
        else:
            print("ℹ️  Student user already exists")
            
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()
    
    print("\n✨ Database initialization complete!")

if __name__ == "__main__":
    init_db()
