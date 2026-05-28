# 📡 Admin API Documentation

## Base URL
```
http://localhost:8000/api/admin
```

## Authentication
All requests require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Dashboard Statistics
Get comprehensive system statistics for the admin dashboard.

**Endpoint:** `GET /dashboard/stats`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "users": {
    "total": 125,
    "students": 120,
    "admins": 5,
    "active": 115,
    "inactive": 10
  },
  "elections": {
    "total": 8,
    "active": 2,
    "completed": 6
  },
  "votes": {
    "total": 450,
    "recent_24h": 120
  },
  "activity": {
    "recent_24h": 35,
    "active_now": 12
  },
  "timestamp": "2024-02-15T10:30:00Z"
}
```

**Error Responses:**
- `403 Forbidden`: User is not an admin
- `500 Internal Server Error`: Database connection error

---

### 2. List Users
Retrieve paginated list of all users in the system.

**Endpoint:** `GET /users?limit=50&offset=0`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | integer | 50 | Number of users per page |
| offset | integer | 0 | Number of users to skip |
| role | string | - | Filter by role (student, admin, super_admin) |
| status | string | - | Filter by status (active, inactive) |

**Example Requests:**
```bash
# Get first 50 users
GET /users

# Get next 50 users
GET /users?limit=50&offset=50

# Get only admin users
GET /users?role=admin

# Get only inactive users
GET /users?status=inactive

# Get inactive admins
GET /users?role=admin&status=inactive
```

**Response (200 OK):**
```json
{
  "total": 125,
  "limit": 50,
  "offset": 0,
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@thuto.bac.ac.bw",
      "student_id": "NS24-001",
      "role": "student",
      "is_active": true,
      "is_voter": true,
      "created_at": "2024-01-15T10:30:00Z",
      "last_login": "2024-02-15T09:45:00Z",
      "profile_picture": "https://...",
      "vote_count": 5,
      "activity_count": 12
    }
  ]
}
```

---

### 3. Get User Details
Get detailed information about a specific user.

**Endpoint:** `GET /users/{user_id}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | integer | The ID of the user |

**Example Request:**
```bash
GET /users/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@thuto.bac.ac.bw",
  "student_id": "NS24-001",
  "role": "student",
  "is_active": true,
  "is_voter": true,
  "created_at": "2024-01-15T10:30:00Z",
  "last_login": "2024-02-15T09:45:00Z",
  "profile_picture": "https://...",
  "votes": [
    {
      "id": 1,
      "election_id": 5,
      "candidate_id": 12,
      "timestamp": "2024-02-14T14:30:00Z"
    }
  ],
  "activity_logs": [
    {
      "id": 1,
      "action": "login",
      "description": "User logged in",
      "timestamp": "2024-02-15T09:45:00Z"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found`: User does not exist
- `403 Forbidden`: Not authorized

---

### 4. Toggle User Status
Activate or deactivate a user account.

**Endpoint:** `POST /users/{user_id}/toggle-status`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | integer | The ID of the user |

**Request Body:**
```json
{
  "is_active": false
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/admin/users/1/toggle-status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@thuto.bac.ac.bw",
  "is_active": false,
  "message": "User status updated successfully"
}
```

**Error Responses:**
- `404 Not Found`: User does not exist
- `403 Forbidden`: Not authorized
- `400 Bad Request`: Invalid request body

---

### 5. Promote to Admin
Change a user's role from student to admin.

**Endpoint:** `POST /users/{user_id}/promote-to-admin`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | integer | The ID of the user to promote |

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/admin/users/1/promote-to-admin \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@thuto.bac.ac.bw",
  "role": "admin",
  "message": "User promoted to admin successfully"
}
```

**Error Responses:**
- `404 Not Found`: User does not exist
- `403 Forbidden`: Not authorized or already admin
- `400 Bad Request`: Cannot promote super admin

---

### 6. Demote to Student
Change a user's role from admin to student.

**Endpoint:** `POST /users/{user_id}/demote-to-student`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | integer | The ID of the user to demote |

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/admin/users/1/demote-to-student \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@thuto.bac.ac.bw",
  "role": "student",
  "message": "User demoted to student successfully"
}
```

**Error Responses:**
- `404 Not Found`: User does not exist
- `403 Forbidden`: Not authorized or not admin
- `400 Bad Request`: Cannot demote super admin

---

### 7. Activity Logs
Get audit trail of all system activities.

**Endpoint:** `GET /activity-logs?limit=100&offset=0`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | integer | 100 | Number of logs per page |
| offset | integer | 0 | Number of logs to skip |
| action | string | - | Filter by action type |
| user_id | integer | - | Filter by user ID |
| status | string | - | Filter by status (success, failed) |

**Example Requests:**
```bash
# Get recent activity logs
GET /activity-logs

# Get failed activities
GET /activity-logs?status=failed

# Get activities by specific user
GET /activity-logs?user_id=1

# Get login activities
GET /activity-logs?action=login
```

**Response (200 OK):**
```json
{
  "total": 250,
  "limit": 100,
  "offset": 0,
  "logs": [
    {
      "id": 1,
      "user_id": 1,
      "user": {
        "name": "John Doe",
        "email": "john@thuto.bac.ac.bw"
      },
      "action": "vote_cast",
      "description": "User voted in election ID 5",
      "resource_type": "vote",
      "resource_id": 45,
      "ip_address": "192.168.1.100",
      "status": "success",
      "created_at": "2024-02-15T10:30:00Z"
    },
    {
      "id": 2,
      "user_id": 2,
      "user": {
        "name": "Jane Smith",
        "email": "jane@thuto.bac.ac.bw"
      },
      "action": "login",
      "description": "User logged in",
      "resource_type": "user",
      "resource_id": 2,
      "ip_address": "192.168.1.101",
      "status": "success",
      "created_at": "2024-02-15T09:45:00Z"
    }
  ]
}
```

**Action Types:**
- `login` - User login
- `logout` - User logout
- `vote_cast` - Vote submitted
- `user_created` - New user registered
- `user_promoted` - User promoted to admin
- `user_demoted` - User demoted to student
- `user_deactivated` - User account deactivated
- `election_created` - New election created
- `election_started` - Election started

---

### 8. System Health
Check system connectivity and health status.

**Endpoint:** `GET /system/health`

**Example Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/admin/system/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-02-15T10:30:00Z",
  "uptime_seconds": 86400,
  "version": "1.0.0"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Connection refused",
  "timestamp": "2024-02-15T10:30:00Z"
}
```

---

## Error Codes

| Code | Error | Description |
|------|-------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User lacks required permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Database connection failed |

---

## Rate Limiting

No explicit rate limiting is currently implemented. This should be added for production.

---

## Pagination

All list endpoints support pagination with `limit` and `offset` parameters:

```bash
# Get first 50 items
GET /users?limit=50&offset=0

# Get next 50 items
GET /users?limit=50&offset=50

# Get previous 50 items
GET /users?limit=50&offset=0
```

---

## Filtering

Supported filters depend on the endpoint:

**Users Endpoint:**
- `role` - Filter by user role
- `status` - Filter by active/inactive status

**Activity Logs Endpoint:**
- `action` - Filter by action type
- `user_id` - Filter by user
- `status` - Filter by success/failed

---

## Authentication Example

```bash
# Login to get token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@thuto.bac.ac.bw",
    "password": "ThutoBAC@2024!Secure"
  }'

# Response contains access_token
# Use token in subsequent requests

curl -H "Authorization: Bearer ACCESS_TOKEN" \
  http://localhost:8000/api/admin/dashboard/stats
```

---

## Response Format

All responses are JSON-formatted with appropriate HTTP status codes:

**Success Response:**
```json
{
  "data": { /* response data */ },
  "status": "success",
  "timestamp": "2024-02-15T10:30:00Z"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "status": "error",
  "code": "ERROR_CODE",
  "timestamp": "2024-02-15T10:30:00Z"
}
```

---

## Performance Notes

- Dashboard stats endpoint caches results for 30 seconds
- User lists return maximum 100 items per page
- Activity logs return maximum 200 items per page
- Database queries are optimized with proper indexing

---

## Testing the API

### Using cURL
```bash
# Get dashboard stats
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/admin/dashboard/stats

# List users
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/admin/users
```

### Using Postman
1. Import collection from `postman_collection.json` (if available)
2. Add token to "Authorization" tab
3. Use provided templates for each endpoint

### Using Python
```python
import requests

headers = {"Authorization": f"Bearer {token}"}
response = requests.get(
    "http://localhost:8000/api/admin/dashboard/stats",
    headers=headers
)
print(response.json())
```

---

## Support

For API issues or questions:
- Check error response messages for details
- Review activity logs for failed operations
- Check backend console for debug logs
- Verify authentication token is valid and not expired
