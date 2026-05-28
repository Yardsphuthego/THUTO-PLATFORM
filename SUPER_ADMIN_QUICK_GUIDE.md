# Super Admin Features - Quick Reference Guide

## Dashboard Navigation

```
┌─────────────────────────────────────────────┐
│              SUPER ADMIN DASHBOARD          │
├──────────────┬──────────────────────────────┤
│ SIDEBAR      │ MAIN CONTENT AREA           │
│              │                              │
│ 📊 Overview  │ ┌────────────────────────┐  │
│ � Universities│ │ Statistics Cards       │  │
│ 🗳️ Elections │ │ • Universities: 2       │  │
│ 📋 Voters    │ │ • Elections: 1         │  │
│ 👑 Admins    │ │ • Admins: 2            │  │
│              │ │ • Votes: 4821          │  │
│              │ └────────────────────────┘  │
│              │ System Status: ✅ Active    │
│              │                              │
└──────────────┴──────────────────────────────┘
```

---

## Tab 1: OVERVIEW

### What You See:
- Dashboard statistics in 4 cards
- System health status (Database, API)
- Quick glance at platform metrics

### Actions:
- Monitor overall platform status
- Track total resources created

---

## Tab 2: UNIVERSITIES

### What You See:

**Left Side - Create University Form:**
```
┌─────────────────────┐
│  CREATE UNIVERSITY  │
├─────────────────────┤
│ University Name*    │
│ [                 ] │
│                     │
│ Code (e.g. UB)*    │
│ [    ]              │
│                     │
│ Abbreviation*       │
│ [    ]              │
│                     │
│ Description        │
│ [              ]   │
│ [              ]   │
│                     │
│ Location           │
│ [                 ] │
│                     │
│ Website URL        │
│ [                 ] │
│                     │
│ Contact Email      │
│ [                 ] │
│                     │
│ [ CREATE UNIVERSITY]│
└─────────────────────┘
```

**Right Side - Universities List:**
```
┌──────────────────────────────┐
│   REGISTERED UNIVERSITIES    │
├──────────────────────────────┤
│ Botswana University Science  │
│ BUST · Botswana University...│
│ Status: [Active ✓]           │
├──────────────────────────────┤
│ University of Botswana       │
│ UB · University of Botswana..│
│ Status: [Active ✓]           │
└──────────────────────────────┘
```

### Actions:
1. Fill form on left with university details
2. Click "CREATE UNIVERSITY"
3. New university appears in list on right
4. Update university details
5. View voter count and elections per university

---

## Tab 3: ELECTIONS

### What You See:

**Left Side - Create Election Form:**
```
┌──────────────────────────────┐
│   CREATE ELECTION            │
├──────────────────────────────┤
│ Election Title*              │
│ [SRC Elections 2026       ]  │
│                              │
│ Select University*           │
│ [University of Botswana   ▼]│
│                              │
│ Description                  │
│ [                         ]  │
│ [                         ]  │
│                              │
│ Start Date*                  │
│ [2026-02-10]                 │
│                              │
│ Start Time                   │
│ [08:00]                      │
│                              │
│ End Date*                    │
│ [2026-02-12]                 │
│                              │
│ End Time                     │
│ [16:00]                      │
│                              │
│ [ CREATE ELECTION ]          │
└──────────────────────────────┘
```

**Right Side - Elections List:**
```
┌──────────────────────────────┐
│   ACTIVE ELECTIONS           │
├──────────────────────────────┤
│ SRC Elections 2026           │
│ University of Botswana       │
│ Feb 10 to Feb 12             │
│ Status: [active]   4821 votes│
│                              │
│ [ Activate ]  [ End ]        │
└──────────────────────────────┘
```

### Actions:
1. Select university from dropdown
2. Enter election details
3. Set start and end dates with times
4. Click "CREATE ELECTION"
5. Election appears in list
6. Activate when ready
7. End when voting closes

---

## Tab 4: VOTER ROLL

### What You See:

**Left Side - Upload Form:**
```
┌──────────────────────────────┐
│   UPLOAD VOTER ROLL          │
├──────────────────────────────┤
│ Select University*           │
│ [University of Botswana   ▼] │
│                              │
│    ┌────────────────────┐    │
│    │  📄 DROP FILES     │    │
│    │   HERE             │    │
│    │                    │    │
│    │ or click to browse │    │
│    └────────────────────┘    │
│                              │
│ 📋 Required Columns:         │
│ email, student_id,           │
│ full_name, course, gender    │
│                              │
│ [ UPLOAD ]                   │
└──────────────────────────────┘
```

**Right Side - Voter Status:**
```
┌──────────────────────────────┐
│   VOTER ROLL STATUS          │
├──────────────────────────────┤
│ University of Botswana       │
│ Uploaded voters: 745         │
│ [ View ]  [ Delete ]         │
│                              │
│ Botswana University Sci & Tech│
│ Uploaded voters: 612         │
│ [ View ]  [ Delete ]         │
│                              │
│ Tertiary Education Uni       │
│ Uploaded voters: 425         │
│ [ View ]  [ Delete ]         │
└──────────────────────────────┘
```

### CSV File Format:
```csv
email,student_id,full_name,course,gender
student001@university.ac.bw,STU001,Thabo Molefe,Business Admin,M
student002@university.ac.bw,STU002,Amogelang Kgosi,Computer Science,F
student003@university.ac.bw,STU003,Khumo Pitso,Engineering,M
```

### Actions:
1. Select university
2. Drag & drop CSV file OR click to browse
3. Click "UPLOAD"
4. Voters appear in status list
5. View individual voters
6. Delete single voter
7. Delete all voters for university

---

## Tab 5: ADMINS

### What You See:

**Left Side - Create Admin Form:**
```
┌──────────────────────────────┐
│   CREATE ADMIN               │
├──────────────────────────────┤
│ Email*                       │
│ [john.doe@university.ac.bw ] │
│                              │
│ Full Name*                   │
│ [John Doe                  ] │
│                              │
│ Password*                    │
│ [••••••••••••••••••••    ]   │
│                              │
│ Assign to University         │
│ [University of Botswana   ▼]│
│                              │
│ [ CREATE ADMIN ]             │
└──────────────────────────────┘
```

**Right Side - Admins List:**
```
┌──────────────────────────────┐
│   ADMIN USERS                │
├──────────────────────────────┤
│ John Doe                     │
│ john.doe@university.ac.bw    │
│ Assigned: UB                 │
│ [ Remove ]                   │
│                              │
│ Jane Smith                   │
│ jane.smith@university.ac.bw  │
│ Assigned: BUST               │
│ [ Remove ]                   │
│                              │
│ Bob Wilson                   │
│ bob.wilson@university.ac.bw  │
│ Assigned: Unassigned         │
│ [ Remove ]                   │
└──────────────────────────────┘
```

### Actions:
1. Enter admin email (must be valid)
2. Enter full name
3. Enter secure password
4. Optionally assign to university
5. Click "CREATE ADMIN"
6. Admin appears in list
7. Remove admin if needed

---

## Complete Workflow Example

### Scenario: Setting up SRC Elections across Multiple Universities

**Step 1: Create Universities**
1. Go to "Universities" tab
2. Create "University of Botswana" (UB)
3. Create "Botswana University Science & Tech" (BUST)
4. Create "Tertiary Education University" (TEU)
5. Create "Open University" (OU)

**Step 2: Create Elections**
1. Go to "Elections" tab
2. Create "SRC Elections 2026" for each university
3. Set dates: Feb 10-12, 2026
4. Set times: 08:00 - 16:00

**Step 3: Upload Voter Rolls**
1. Go to "Voter Roll" tab
2. For each university:
   - Select university
   - Upload voter CSV file
   - Wait for confirmation

**Step 4: Create Admin Users**
1. Go to "Admins" tab
2. Create admin for each university:
   - John (assigned to UB)
   - Jane (assigned to BUST)
   - Bob (assigned to TEU)
   - Alice (assigned to OU)

**Step 5: Monitor Dashboard**
1. Go to "Overview" tab
2. See:
   - 4 universities created
   - 4 elections created
   - 4 admins created
   - Voter rolls uploaded (~2,000 total)
   - System status: ✅ Active

**Step 6: Activate Elections**
1. Go to "Elections" tab
2. When ready to go live:
   - Click "Activate" on election
   - Students can now vote
3. Monitor vote count in Overview

**Step 7: End Elections**
1. When voting closes:
   - Go to "Elections" tab
   - Click "End" on election
   - Status changes to "completed"
   - Results can be announced

---

## Error Handling

### Common Issues:

**CSV Upload Fails**
- ❌ Missing "email" column
- ❌ No data rows
- ❌ Wrong file format
- ✅ Solution: Check CSV has all required columns

**University Won't Create**
- ❌ Duplicate university code
- ❌ Missing required field
- ✅ Solution: Use unique code, fill all required fields

**Election Won't Activate**
- ❌ No start/end date set
- ❌ End date before start date
- ✅ Solution: Set valid date/time range

**Admin Won't Create**
- ❌ Email already exists
- ❌ Invalid email format
- ✅ Solution: Use unique, valid email

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Create University | Tab→Enter |
| Upload File | Ctrl+U |
| Create Admin | Tab→Enter |
| Close Modal | Esc |

---

## Icons Legend

```
📊 Dashboard/Overview
🏫 Universities
🗳️ Elections/Voting
📋 Voter Roll/Records
👤 User/Admin
👑 Super Admin
✓ Active/Success
✗ Inactive/Delete
⚙️ Settings
📄 Document/File
🔍 View/Search
```

---

## Color Coding

```
🟢 Green = Active/Success
🔴 Red = Delete/Danger
🔵 Blue = Info/Pending
⚫ Gray = Inactive/Disabled
🟡 Gold = Important/Highlight
```

---

## Tips & Best Practices

✅ Create universities first
✅ Create elections for each university
✅ Prepare voter CSV beforehand
✅ Test with sample data
✅ Create admins after setup
✅ Check system status regularly
✅ Keep password secure
✅ Backup data regularly

---

**Last Updated:** February 11, 2026
**Quick Reference Version:** 2.0 (Multi-University Edition)
