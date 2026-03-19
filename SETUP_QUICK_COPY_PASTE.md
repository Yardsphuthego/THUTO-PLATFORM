# ⚡ 15-MINUTE SETUP - Copy & Paste Commands

## Just Copy and Paste These Commands!

---

## STEP 1: PostgreSQL Setup (2 minutes)

```bash
# Open PostgreSQL
psql -U postgres
```

Then paste this inside psql:

```sql
CREATE USER voting_admin WITH PASSWORD 'thuto_secure_2024';
CREATE DATABASE thuto_voting OWNER voting_admin;
GRANT ALL PRIVILEGES ON DATABASE thuto_voting TO voting_admin;
ALTER USER voting_admin CREATEDB;
\q
```

---

## STEP 2: Configure Environment (1 minute)

```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/backend

cat > .env << 'EOF'
DATABASE_URL=postgresql://voting_admin:thuto_secure_2024@localhost:5432/thuto_voting
SECRET_KEY=your_super_secret_key_change_in_production_12345
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:3002"]
EOF

echo "✅ .env file created"
cat .env
```

---

## STEP 3: Initialize Database (1 minute)

```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM

python backend/init_db.py
```

You should see:
```
🔄 Initializing Thuto Voting Platform Database...
📊 Creating database tables...
✅ Tables created successfully!
👤 Creating super admin user...
✅ Super admin user created successfully!
📧 Email: admin@thuto.bac.ac.bw
🔐 Password: ThutoBAC@2024!Secure
✨ Database initialization complete!
```

---

## STEP 4: Install Dependencies (5 minutes)

```bash
# Backend
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/backend
pip install -r requirements.txt

# Frontend
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/frontend
npm install
```

---

## STEP 5: Start Backend (Terminal 1)

```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/backend

python -m uvicorn main:app --reload --port 8000
```

Wait for:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

---

## STEP 6: Start Frontend (Terminal 2)

```bash
cd /Users/mac1/THUTO\ VOTING\ PLATFORM/frontend

npm run dev
```

Wait for:
```
VITE v5.0.0  ready in XXX ms
➜  Local:   http://127.0.0.1:3002/
```

---

## STEP 7: Access Super Admin Login

**Open browser:**
```
http://localhost:3002/admin-login
```

**Login with:**
- Email: `admin@thuto.bac.ac.bw`
- Password: `ThutoBAC@2024!Secure`

**After login, visit admin dashboard:**
```
http://localhost:3002/admin
```

---

## ✅ YOU'RE DONE! 

Everything should now be working!

---

## 🔍 QUICK VERIFICATION

### Check Backend is Running
```bash
curl http://localhost:8000/docs
# Should open Swagger API docs
```

### Check Frontend is Running
```bash
open http://localhost:3002
# Should open home page
```

### Check Database
```bash
psql -U voting_admin -d thuto_voting
SELECT * FROM users;
\q
```

---

## 🎯 WHAT'S NEXT

1. ✅ Login page loads
2. ✅ Enter credentials
3. ✅ See admin dashboard
4. ✅ Explore features
5. ✅ **IMPORTANT: Change password!**

---

## ⚠️ COMMON ISSUES

### "Port 8000 already in use"
```bash
lsof -ti:8000 | xargs kill -9
python -m uvicorn main:app --reload --port 8001
```

### "Port 3002 already in use"
```bash
lsof -ti:3002 | xargs kill -9
# Then restart: npm run dev
```

### "Database connection error"
```bash
# Make sure PostgreSQL is running
brew services start postgresql@15

# Try connecting
psql -U voting_admin -d thuto_voting
```

### "Module not found"
```bash
# Reinstall
pip install -r requirements.txt --force-reinstall
npm install
```

---

## 📱 VERIFY EVERYTHING WORKS

- [ ] PostgreSQL running
- [ ] Backend server running on 8000
- [ ] Frontend server running on 3002
- [ ] Can access http://localhost:3002/admin-login
- [ ] Login form visible
- [ ] Can enter credentials
- [ ] Can login successfully
- [ ] Dashboard loads
- [ ] See KPI cards
- [ ] See user table
- [ ] See activity logs

---

## 🎉 COMPLETE!

Your super admin system is now fully operational!

- **Admin Login:** http://localhost:3002/admin-login
- **Dashboard:** http://localhost:3002/admin
- **API Docs:** http://localhost:8000/docs

---

## 📞 NEED HELP?

Check these files:
- **COMPLETE_SETUP_GUIDE.md** - Full detailed guide
- **SUPER_ADMIN_LOGIN_WALKTHROUGH.md** - Visual guide
- **API_DOCS.md** - API reference
- **COMMANDS.md** - All commands

---

**Everything is ready. Start managing!** 🚀
