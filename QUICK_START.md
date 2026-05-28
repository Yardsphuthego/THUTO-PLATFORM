# 🚀 Quick Start - Super Admin System

## Prerequisites Check

Before you begin, ensure you have:
- ✅ PostgreSQL installed and running
- ✅ Python 3.8+ installed
- ✅ Node.js installed (for frontend)
- ✅ Git (for version control)

## 5-Minute Setup

### Step 1: Install Backend Dependencies
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/backend
pip install -r requirements.txt
```

### Step 2: Create PostgreSQL Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Run these commands:
CREATE USER voting_admin WITH PASSWORD 'thuto_secure_2024';
CREATE DATABASE thuto_voting OWNER voting_admin;
GRANT ALL PRIVILEGES ON DATABASE thuto_voting TO voting_admin;
ALTER USER voting_admin CREATEDB;

# Exit psql
\q
```

### Step 3: Configure Environment
Create `backend/.env`:
```
DATABASE_URL=postgresql://voting_admin:thuto_secure_2024@localhost:5432/thuto_voting
SECRET_KEY=your_secret_key_change_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Step 4: Initialize Database
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM
python backend/init_db.py
```

Expected output:
```
🔄 Initializing Thuto Voting Platform Database...
✅ Super admin created: admin@thuto.bac.ac.bw
```

### Step 5: Start Backend Server
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/backend
python -m uvicorn main:app --reload --port 8000
```

### Step 6: Start Frontend Server (in new terminal)
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/frontend
npm run dev
```

## Access Admin Dashboard

1. **Open Browser**: http://localhost:3002
2. **Login**:
   - Email: `admin@thuto.bac.ac.bw`
   - Password: `ThutoBAC@2024!Secure`
3. **Go to Admin**: Click your profile → Admin Dashboard or navigate to http://localhost:3002/admin

## Default Credentials

| Field | Value |
|-------|-------|
| Email | admin@thuto.bac.ac.bw |
| Password | ThutoBAC@2024!Secure |
| Role | Super Admin |

⚠️ **CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN**

## What You Get

✅ Complete admin dashboard with:
- Real-time system statistics
- User management interface
- Activity logging and audit trails
- System health monitoring
- Apple-inspired design
- Role-based access control

## API Documentation

### Dashboard Stats
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/admin/dashboard/stats
```

### List Users
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/admin/users
```

### View Activity Logs
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/admin/activity-logs
```

## Troubleshooting

### "Database connection refused"
```bash
# Start PostgreSQL
brew services start postgresql@15

# Verify it's running
brew services list
```

### "Module not found" errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### "Port 8000 already in use"
```bash
# Kill the process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
python -m uvicorn main:app --port 8001
```

### Admin button not appearing
- Refresh the page
- Clear browser cache
- Check that your user has `super_admin` role

## Features Overview

### 📊 Dashboard
- System-wide statistics
- Real-time KPIs
- Health indicators

### 👥 User Management
- View all users
- Toggle active status
- Manage roles (promote/demote)
- Search and filter

### 📋 Activity Logs
- Audit trail of all actions
- Filter by type and date
- Export logs
- Real-time updates

### 🎯 System Monitoring
- Database connectivity
- Active users count
- Vote tracking
- Election management

## Next Steps

1. ✅ Initialize database
2. ✅ Start servers
3. ✅ Login as admin
4. ✅ Change password
5. ✅ Explore dashboard
6. ✅ Create additional admins
7. ✅ Monitor system activity

## Security Checklist

- [ ] Database initialized with super admin
- [ ] PostgreSQL user created with strong password
- [ ] Environment variables configured
- [ ] Default admin password changed
- [ ] HTTPS configured (for production)
- [ ] Regular backups enabled
- [ ] Activity logs reviewed regularly

## Support & Documentation

- Full setup guide: See `ADMIN_SETUP.md`
- API documentation: See `API_DOCS.md` (if available)
- Troubleshooting: See `TROUBLESHOOTING.md`

---

**You're all set! Your super admin system is ready to manage the voting platform!** 🎉
