# 💻 Command Reference - Super Admin System

## Prerequisites Setup

### Install PostgreSQL (macOS)
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Verify installation
psql --version
```

### Install Python Dependencies
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/backend
pip install -r requirements.txt

# Verify installation
pip list | grep -E "fastapi|sqlalchemy|psycopg2"
```

### Install Node Dependencies
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/frontend
npm install

# Verify installation
npm list react
```

---

## Database Setup Commands

### 1. Connect to PostgreSQL
```bash
# Connect as default postgres user
psql -U postgres

# Connect to specific database
psql -U postgres -d thuto_voting

# Connect to remote server
psql -h localhost -U voting_admin -d thuto_voting
```

### 2. Create Database and User
```bash
# Run these inside psql:
CREATE USER voting_admin WITH PASSWORD 'thuto_secure_2024';
CREATE DATABASE thuto_voting OWNER voting_admin;
GRANT ALL PRIVILEGES ON DATABASE thuto_voting TO voting_admin;
ALTER USER voting_admin CREATEDB;

# Exit psql
\q
```

### 3. Verify Database Setup
```bash
# Test connection
psql -U voting_admin -d thuto_voting -h localhost

# List databases
psql -U postgres -l

# List tables in database
psql -U voting_admin -d thuto_voting -c "\dt"

# Exit
\q
```

---

## Environment Configuration

### Create .env File
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/backend
cat > .env << 'EOF'
DATABASE_URL=postgresql://voting_admin:thuto_secure_2024@localhost:5432/thuto_voting
SECRET_KEY=your_super_secret_key_change_in_production_12345
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF

# Verify file was created
cat .env
```

### Update Environment Variables
```bash
# Edit the .env file
nano .env

# Or use VS Code
code .env
```

---

## Database Initialization

### Initialize Database with Admin User
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM
python backend/init_db.py
```

**Expected Output:**
```
🔄 Initializing Thuto Voting Platform Database...
📊 Creating database tables...
✅ Tables created successfully!
👤 Creating super admin user...
✅ Super admin user created successfully!
📧 Email: admin@thuto.bac.ac.bw
🔐 Password: ThutoBAC@2024!Secure
⚠️  IMPORTANT: Change this password after first login!

✨ Database initialization complete!
```

### Verify Database Initialization
```bash
# Connect to database
psql -U voting_admin -d thuto_voting

# List all tables
\dt

# Check users table
SELECT * FROM users;

# Check activity_logs table
SELECT * FROM activity_logs;

# Exit
\q
```

---

## Starting the Servers

### Terminal 1 - Start Backend Server
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/backend

# Start with hot reload
python -m uvicorn main:app --reload --port 8000

# Or without hot reload
python -m uvicorn main:app --port 8000

# Or with specific host
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Terminal 2 - Start Frontend Server
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/frontend

# Start development server
npm run dev

# Or build for production
npm run build

# Preview production build
npm run preview
```

**Expected Output:**
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://127.0.0.1:3002/
  ➜  press h to show help
```

---

## Accessing the Application

### Login to Admin Dashboard
```bash
# Open browser to frontend
open http://localhost:3002

# Or use curl to test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@thuto.bac.ac.bw",
    "password": "ThutoBAC@2024!Secure"
  }'
```

### Navigate to Admin Dashboard
```
1. Frontend: http://localhost:3002
2. Click Login
3. Enter email: admin@thuto.bac.ac.bw
4. Enter password: ThutoBAC@2024!Secure
5. Navigate to http://localhost:3002/admin
```

---

## API Testing Commands

### Using cURL

#### Get Dashboard Stats
```bash
# First, get a token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@thuto.bac.ac.bw",
    "password": "ThutoBAC@2024!Secure"
  }' | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# Then use the token to make requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/admin/dashboard/stats
```

#### List All Users
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/admin/users
```

#### Get User Details
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/admin/users/1
```

#### Toggle User Status
```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}' \
  http://localhost:8000/api/admin/users/1/toggle-status
```

#### Promote User to Admin
```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/admin/users/1/promote-to-admin
```

#### Get Activity Logs
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/admin/activity-logs
```

#### Check System Health
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/admin/system/health
```

### Using Python Requests

```bash
# Create test script
cat > test_api.py << 'EOF'
import requests

BASE_URL = "http://localhost:8000/api"

# Login
response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "admin@thuto.bac.ac.bw",
    "password": "ThutoBAC@2024!Secure"
})
token = response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Get dashboard stats
response = requests.get(f"{BASE_URL}/admin/dashboard/stats", headers=headers)
print("Dashboard Stats:", response.json())

# List users
response = requests.get(f"{BASE_URL}/admin/users", headers=headers)
print("Users:", response.json())

# Get activity logs
response = requests.get(f"{BASE_URL}/admin/activity-logs", headers=headers)
print("Activity Logs:", response.json())
EOF

python test_api.py
```

---

## Development Commands

### Frontend Development

#### Run Development Server
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/frontend
npm run dev
```

#### Build for Production
```bash
npm run build
```

#### Run Tests
```bash
npm run test
```

#### Check Formatting
```bash
npm run lint
```

### Backend Development

#### Run Development Server with Hot Reload
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/backend
python -m uvicorn main:app --reload --port 8000
```

#### Run Tests
```bash
pytest tests/ -v
```

#### Check Code Quality
```bash
flake8 .
black . --check
```

#### Format Code
```bash
black .
isort .
```

---

## Database Management Commands

### PostgreSQL Commands

#### Backup Database
```bash
# Backup to file
pg_dump -U voting_admin -d thuto_voting > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with compression
pg_dump -U voting_admin -d thuto_voting | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

#### Restore Database
```bash
# Restore from file
psql -U voting_admin -d thuto_voting < backup_2024_02_15.sql

# Restore from compressed file
gunzip -c backup_2024_02_15.sql.gz | psql -U voting_admin -d thuto_voting
```

#### Export Data
```bash
# Export users to CSV
psql -U voting_admin -d thuto_voting -c "COPY users TO STDOUT WITH CSV HEADER" > users.csv

# Export activity logs to CSV
psql -U voting_admin -d thuto_voting -c "COPY activity_logs TO STDOUT WITH CSV HEADER" > activity_logs.csv
```

#### Database Maintenance
```bash
# Connect to database
psql -U voting_admin -d thuto_voting

# Analyze table sizes
\dt+

# Check index information
\di+

# Check database statistics
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Exit
\q
```

---

## Troubleshooting Commands

### Check Services Status
```bash
# Check if PostgreSQL is running
brew services list

# Check if ports are in use
lsof -i :5432    # PostgreSQL
lsof -i :8000    # Backend
lsof -i :3002    # Frontend
```

### Restart Services
```bash
# Restart PostgreSQL
brew services restart postgresql@15

# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3002
lsof -ti:3002 | xargs kill -9
```

### View Logs
```bash
# Backend logs (already running in terminal)
# Frontend logs (already running in terminal)

# PostgreSQL logs
tail -f /usr/local/var/log/postgres.log
```

### Debug Requests
```bash
# Test backend connectivity
curl -v http://localhost:8000

# Test frontend connectivity
curl -v http://localhost:3002

# Check DNS resolution
nslookup localhost
```

---

## Deployment Commands

### Production Build

#### Build Frontend
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/frontend
npm run build

# Output in: dist/
ls -la dist/
```

#### Prepare Backend
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/backend

# Install production dependencies
pip install -r requirements-prod.txt

# Run migrations (if any)
python -m alembic upgrade head
```

### Docker Commands (Optional)

#### Build Docker Image
```bash
docker build -t thuto-voting-backend .
docker build -t thuto-voting-frontend -f frontend.Dockerfile .
```

#### Run Docker Containers
```bash
docker run -p 8000:8000 thuto-voting-backend
docker run -p 3002:3002 thuto-voting-frontend
```

---

## Cleanup Commands

### Remove Temporary Files
```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM

# Remove Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete

# Remove Node modules (to reinstall)
rm -rf frontend/node_modules

# Remove venv (to recreate)
rm -rf venv
```

### Reset Database
```bash
# WARNING: This deletes all data!

# Drop database
psql -U postgres -c "DROP DATABASE thuto_voting;"

# Drop user
psql -U postgres -c "DROP USER voting_admin;"

# Recreate from scratch
psql -U postgres -f db_setup.sql
```

---

## Quick Start Sequence

### 1. Initial Setup (One-time)
```bash
# Navigate to project
cd /Users/mac1/THUTO\ VOTING\ PLATFORM

# Create PostgreSQL database
psql -U postgres
CREATE USER voting_admin WITH PASSWORD 'thuto_secure_2024';
CREATE DATABASE thuto_voting OWNER voting_admin;
GRANT ALL PRIVILEGES ON DATABASE thuto_voting TO voting_admin;
\q

# Create .env file
cat > backend/.env << 'EOF'
DATABASE_URL=postgresql://voting_admin:thuto_secure_2024@localhost:5432/thuto_voting
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF

# Initialize database
python backend/init_db.py
```

### 2. Daily Startup
```bash
# Terminal 1
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/backend
python -m uvicorn main:app --reload --port 8000

# Terminal 2
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/frontend
npm run dev

# Terminal 3
open http://localhost:3002
```

### 3. Stop Servers
```bash
# In each terminal: Ctrl+C
```

---

## Useful Aliases

Add these to your `.zshrc` or `.bashrc`:

```bash
# Navigate to project
alias thuto='cd /Users/mac1/THUTO\ VOTING\ PLATFORM'

# Start backend
alias thuto-backend='cd /Users/mac1/THUTO\ VOTING\ PLATFORM/backend && python -m uvicorn main:app --reload'

# Start frontend
alias thuto-frontend='cd /Users/mac1/THUTO\ VOTING\ PLATFORM/frontend && npm run dev'

# Connect to database
alias thuto-db='psql -U voting_admin -d thuto_voting'

# Initialize database
alias thuto-init='python /Users/mac1/THUTO\ VOTING\ PLATFORM/backend/init_db.py'

# Test API
alias thuto-test='python /Users/mac1/THUTO\ VOTING\ PLATFORM/test_api.py'
```

---

## Complete Workflow Example

```bash
# 1. Setup (first time only)
brew install postgresql@15
brew services start postgresql@15
psql -U postgres < db_setup.sql
cd /Users/mac1/THUTO\ VOTING\ PLATFORM
python backend/init_db.py

# 2. Daily development
cd /Users/mac1/THUTO\ VOTING\ PLATFORM

# Terminal 1
backend && python -m uvicorn main:app --reload --port 8000

# Terminal 2
frontend && npm run dev

# 3. Test API
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/admin/dashboard/stats

# 4. Shutdown
# Press Ctrl+C in each terminal
```

---

## Emergency Recovery

### If PostgreSQL Crashes
```bash
# Restart service
brew services restart postgresql@15

# Rebuild database if corrupted
brew services stop postgresql@15
rm -rf /usr/local/var/postgres/base/
brew services start postgresql@15
python backend/init_db.py
```

### If Frontend Won't Start
```bash
# Clear cache
rm -rf frontend/node_modules
cd frontend
npm install
npm run dev
```

### If Backend Won't Connect
```bash
# Check database connection
psql -U voting_admin -d thuto_voting

# Rebuild database if needed
python backend/init_db.py

# Restart backend
python -m uvicorn main:app --reload --port 8000
```

---

## Performance Testing

### Load Testing Frontend
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:3002

# Using hey
hey -n 1000 -c 10 http://localhost:3002
```

### Load Testing Backend
```bash
# Using Apache Bench
ab -n 100 -c 10 -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/admin/dashboard/stats

# Using locust (requires installation)
locust -f locustfile.py --host=http://localhost:8000
```

---

**Happy coding!** 🎉
