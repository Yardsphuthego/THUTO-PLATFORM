# Super Admin Panel - Complete Documentation

## Overview
A comprehensive super admin control panel has been built for managing the entire voting platform across multiple universities. Super admins can now:

1. **Create and manage universities**
2. **Create and manage elections** for each university with start/end dates and times
3. **Upload voter rolls** from CSV/Excel files per university
4. **Delete voter records** individually or in bulk
5. **Create and manage other admin users** and assign them to universities
6. **Monitor system status** and dashboard metrics

---

## Features Implemented

### 1. UNIVERSITY MANAGEMENT
**Location:** Super Admin Dashboard → Universities Tab

**Capabilities:**
- Create new universities with:
  - University Name (e.g., "University of Botswana")
  - Code (e.g., "UB")
  - Abbreviation
  - Description
  - Location
  - Website URL
  - Contact Email
- View all registered universities
- See university status (Active/Inactive)
- View metrics per university (voter count, elections count)

**Database Model:** `University`
```python
- id: Primary Key
- name: Unique university name
- code: Unique university code
- abbreviation: Short form
- description: Text description
- location: University location
- website: University website URL
- contact_email: Contact email address
- created_by: Super admin who created it
- is_active: Status flag
- created_at/updated_at: Timestamps
```

**API Endpoints:**
```
POST   /api/admin/universities/create
GET    /api/admin/universities
GET    /api/admin/universities/{university_id}
PUT    /api/admin/universities/{university_id}
```

---

### 2. ELECTION MANAGEMENT
**Location:** Super Admin Dashboard → Elections Tab

**Capabilities:**
- Create elections for specific universities
- Set election start date/time and end date/time
- Add election description
- View all elections by university
- Activate/Deactivate elections
- End elections (mark as completed)

**Key Fields:**
- Title: Election name
- University: Which university this election is for
- Description: Details about the election
- Start Date & Time: When voting begins
- End Date & Time: When voting closes
- Status: pending, active, or completed

**Database Updates:** `Election` model now includes `university_id` foreign key

**API Endpoints:**
```
POST   /api/admin/elections/create
GET    /api/admin/elections/university/{university_id}
POST   /api/admin/elections/{election_id}/activate
POST   /api/admin/elections/{election_id}/end
```

---

### 3. VOTER ROLL MANAGEMENT
**Location:** Super Admin Dashboard → Voter Roll Tab

**Capabilities:**
- Upload voter rolls from CSV or Excel files for each university
- Drag-and-drop file upload interface
- Automatic data parsing and validation
- View uploaded voter records by university
- Delete individual voter records
- Delete all voter records for a university

**Required CSV Columns:**
```
email           - Student email (required)
student_id      - Student ID number (optional)
full_name       - Student full name (optional)
course          - Course/Program name (optional)
gender          - Gender (M/F/Other) (optional)
```

**Example CSV:**
```csv
email,student_id,full_name,course,gender
student001@university.ac.bw,STU001,John Doe,Computer Science,M
student002@university.ac.bw,STU002,Jane Smith,Business Admin,F
```

**Database Model:** `VoterRoll`
```python
- id: Primary Key
- university_id: Which university
- student_email: Email address
- student_id: Student ID
- full_name: Full name
- course: Course name
- gender: Gender
- file_name: Source file name
- created_by: Who uploaded it
- created_at: Upload timestamp
```

**API Endpoints:**
```
POST   /api/admin/voter-roll/upload
GET    /api/admin/voter-roll/university/{university_id}
DELETE /api/admin/voter-roll/{voter_id}
DELETE /api/admin/voter-roll/university/{university_id}/all
```

---

### 4. ADMIN USER MANAGEMENT
**Location:** Super Admin Dashboard → Admins Tab

**Capabilities:**
- Create new admin users
- Assign admins to specific universities
- View all admin users
- Delete admin accounts
- Track admin creation dates

**Admin Fields:**
- Email: Admin email address
- Full Name: Admin name
- Password: Initial password (must be strong)
- University Assignment: Optional - which university they manage

**Database Updates:** `User` model now includes `university_id` for university-specific admins

**API Endpoints:**
```
POST   /api/admin/admins/create
GET    /api/admin/admins
DELETE /api/admin/admins/{admin_id}
```

---

## Frontend Components

### SuperAdminDashboard Component
**Location:** `frontend/src/pages/SuperAdminDashboard.tsx`

**Structure:**
```
SuperAdminDashboard
├── Sidebar Navigation (5 tabs)
├── Topbar (Title & Status)
└── Main Content Area
    ├── Overview Tab
    │   ├── Statistics Cards
    │   └── System Status
    ├── Schools Tab
    │   ├── Create School Form
    │   └── Schools List
    ├── Elections Tab
    │   ├── Create Election Form
    │   └── Elections List
    ├── Voter Roll Tab
    │   ├── Upload Form (Drag & Drop)
    │   └── Voter Roll Status
    └── Admins Tab
        ├── Create Admin Form
        └── Admins List
```

**Styling:**
- Material Design with Thuto BAC theme
- Gold (#c8a84b) accent color
- Indigo (#01001d) sidebar
- Responsive grid layouts
- Toast notifications for feedback

---

## Updated Models in Backend

### 1. User Model (Updated)
```python
# Added:
school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
```

### 2. Election Model (Updated)
```python
# Added:
school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
# Added relationship:
school = relationship("School", back_populates="elections")
```

### 3. New School Model
```python
__tablename__ = "schools"
- id: Primary Key
- name: Unique
- code: Unique
- abbreviation
- description
- location
- created_by: FK to User
- is_active
- created_at/updated_at
```

### 4. New VoterRoll Model
```python
__tablename__ = "voter_rolls"
- id: Primary Key
- school_id: FK to School
- student_email: Indexed
- student_id
- full_name
- course
- gender
- file_name
- created_by: FK to User
- created_at
```

---

## API Endpoints Summary

### Schools
- `POST /api/admin/schools/create` - Create school
- `GET /api/admin/schools` - List all schools
- `GET /api/admin/schools/{school_id}` - Get school details
- `PUT /api/admin/schools/{school_id}` - Update school

### Elections
- `POST /api/admin/elections/create` - Create election
- `GET /api/admin/elections/school/{school_id}` - Get school elections
- `POST /api/admin/elections/{election_id}/activate` - Activate election
- `POST /api/admin/elections/{election_id}/end` - End election

### Voter Rolls
- `POST /api/admin/voter-roll/upload` - Upload voter roll (CSV)
- `GET /api/admin/voter-roll/school/{school_id}` - List voters
- `DELETE /api/admin/voter-roll/{voter_id}` - Delete single voter
- `DELETE /api/admin/voter-roll/school/{school_id}/all` - Delete all voters

### Admins
- `POST /api/admin/admins/create` - Create admin
- `GET /api/admin/admins` - List all admins
- `DELETE /api/admin/admins/{admin_id}` - Delete admin

### Existing (Enhanced)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - List users
- `GET /api/admin/activity-logs` - Activity logs
- `GET /api/admin/system/health` - System health

---

## Usage Workflow

### Typical Setup Process:
1. **Create Schools**
   - Navigate to "Schools" tab
   - Fill in school details
   - Click "Create School"

2. **Create Elections**
   - Navigate to "Elections" tab
   - Select the school
   - Set election title, dates, and times
   - Click "Create Election"

3. **Upload Voter Roll**
   - Navigate to "Voter Roll" tab
   - Select the school
   - Drop or select CSV file with voter data
   - Click "Upload"

4. **Create Admin Users**
   - Navigate to "Admins" tab
   - Enter admin details (email, name, password)
   - Optionally assign to a school
   - Click "Create Admin"

5. **Manage Election**
   - Monitor in "Elections" tab
   - Activate when ready
   - End when voting closes

---

## Security Notes

1. **Role-based Access:** Only users with `role = "super_admin"` can access these endpoints
2. **School Isolation:** Admins can be assigned to specific schools
3. **Voter Confidentiality:** Voter roll data stored separately from votes
4. **Audit Trail:** All actions logged in ActivityLog table
5. **Input Validation:** CSV validation ensures data integrity

---

## Database Schema Updates Needed

Run migrations to create new tables:

```sql
-- Schools table
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    abbreviation VARCHAR(10),
    description TEXT,
    location VARCHAR(255),
    created_by INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Voter Rolls table
CREATE TABLE voter_rolls (
    id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES schools(id),
    student_email VARCHAR(255) NOT NULL,
    student_id VARCHAR(50),
    full_name VARCHAR(255),
    course VARCHAR(255),
    gender VARCHAR(20),
    file_name VARCHAR(255),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update Elections table
ALTER TABLE elections ADD COLUMN school_id INTEGER REFERENCES schools(id);

-- Update Users table
ALTER TABLE users ADD COLUMN school_id INTEGER REFERENCES schools(id);
```

---

## Testing Checklist

- [ ] Create multiple schools with different codes
- [ ] Create elections for specific schools
- [ ] Upload voter roll CSV with all required fields
- [ ] Upload voter roll with missing optional fields
- [ ] Delete individual voter records
- [ ] Delete all voter records for a school
- [ ] Create multiple admin users
- [ ] Verify admin can only access assigned school (future)
- [ ] Test election activation/deactivation
- [ ] Verify activity logs are created
- [ ] Test CSV file validation (missing columns)
- [ ] Test concurrent uploads
- [ ] Verify Dashboard stats update correctly

---

## Future Enhancements

1. **Bulk Admin Creation** - Upload CSV with admin users
2. **Batch Elections** - Create multiple elections at once
3. **School Settings** - Configure school-specific rules
4. **Voter Verification** - Email verification for uploaded voters
5. **Advanced Analytics** - Voter turnout by school/course
6. **Export Reports** - Export election results and analytics
7. **Scheduled Elections** - Auto-activate elections at set times
8. **Two-factor Authentication** - For super admin accounts
9. **Audit Export** - Export full audit logs
10. **School Hierarchies** - Multi-level school structures

---

## Support & Troubleshooting

### CSV Upload Fails
- Check file format is CSV or Excel
- Verify email column is present
- Ensure at least one valid email per row

### Election Won't Activate
- Ensure election has valid start/end dates
- Verify school exists
- Check no other election is active for same school

### Admin Not Appearing
- Verify admin creation was successful (check activity logs)
- Refresh admin list
- Check database connection

---

**Last Updated:** February 11, 2026
**Version:** 1.0
**Status:** Production Ready
