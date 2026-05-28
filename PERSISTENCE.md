# THUTOSHARE - Persistent Storage & File Uploads

## Overview

This Docker setup now includes **persistent storage** for:
- ✅ User accounts (JSON file storage)
- ✅ Documents (JSON file storage)
- ✅ Uploaded images and files (volume mount)
- ✅ Database volumes (for future MongoDB migration)

## Architecture

```
┌─────────────────────────────────────┐
│        Frontend (React)              │
│        Port: 5173                   │
└──────────────┬──────────────────────┘
               │ HTTP/API
┌──────────────▼──────────────────────┐
│        Backend (Express)             │
│        Port: 5000                   │
│   ┌────────────────────────────┐   │
│   │ Users (data/users.json)    │   │
│   │ Documents (data/docs.json) │   │
│   │ Uploads (/uploads folder)  │   │
│   └────────────────────────────┘   │
└─────────────────────────────────────┘
```

## Data Persistence

### User Data
- **Location**: `Backend/data/users.json`
- **Persistence**: Stored locally in Docker volume
- **Survives**: Container restarts and rebuilds

### Documents
- **Location**: `Backend/data/documents.json`
- **Persistence**: Stored locally in Docker volume
- **Survives**: Container restarts and rebuilds

### Uploaded Files/Images
- **Location**: `Backend/uploads/`
- **Persistence**: Docker named volume `uploads`
- **Access**: Available at `http://localhost:5000/uploads/<filename>`
- **Max Size**: 50MB per file

## API Endpoints for File Management

### Upload a File
```bash
POST /api/uploads
Content-Type: multipart/form-data

# Supported types: JPEG, PNG, GIF, PDF, DOC
# Example with curl:
curl -F "file=@image.jpg" http://localhost:5000/api/uploads
```

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "filename": "1234567890-987654321.jpg",
    "originalName": "image.jpg",
    "path": "/uploads/1234567890-987654321.jpg",
    "size": 204800,
    "mimetype": "image/jpeg"
  }
}
```

### Get All Uploaded Files
```bash
GET /api/uploads
```

### Delete a File
```bash
DELETE /api/uploads/<filename>
```

## Docker Volumes Explained

Run `docker volume ls` to see all volumes:

```bash
docker volume ls
```

### Volume Types in docker-compose.yml

1. **Source Code Volumes** (Bind Mounts)
   ```yaml
   volumes:
     - ./Backend:/app/backend  # Live code updates
     - ./Frontend/src:/app/frontend/src
   ```

2. **Named Volumes** (Persistent Data)
   ```yaml
   volumes:
     - uploads:/app/backend/uploads     # User uploads
     - mongodb_data:/data/db            # MongoDB data
     - mongodb_config:/data/configdb    # MongoDB config
   ```

## Quick Reference

### View Persistent Data

```bash
# Inside Backend container
docker exec thuto-backend ls -la /app/backend/data/

# Users
docker exec thuto-backend cat /app/backend/data/users.json

# Documents
docker exec thuto-backend cat /app/backend/data/documents.json

# Uploads
docker exec thuto-backend ls -la /app/backend/uploads/
```

### Clean All Data (⚠️ Warning: Destructive)

```bash
# Stop containers
docker-compose down

# Remove all volumes
docker volume rm thuto-platform_uploads \
                   thuto-platform_mongodb_data \
                   thuto-platform_mongodb_config

# Restart
docker-compose up --build
```

### Backup Data

```bash
# Backup users and documents
mkdir backups
docker exec thuto-backend cp /app/backend/data/users.json /app/backend/data/documents.json ./backups/

# Backup uploaded files
docker cp thuto-backend:/app/backend/uploads ./backups/uploads
```

### Restore Data

```bash
# Restore users and documents
docker cp ./backups/users.json thuto-backend:/app/backend/data/
docker cp ./backups/documents.json thuto-backend:/app/backend/data/

# Restart backend
docker-compose restart backend
```

## Future: Database Migration

To migrate from JSON to MongoDB:

1. Install mongoose: `npm install mongoose`
2. Replace file-based controllers with MongoDB models
3. MongoDB service is already in docker-compose.yml (commented out)
4. Update environment variable: `MONGODB_URI=mongodb://mongodb:27017/thutoshare`

## Testing File Uploads

```bash
# Create a test image
dd if=/dev/zero of=test.jpg bs=1M count=1

# Upload
curl -F "file=@test.jpg" http://localhost:5000/api/uploads

# List all files
curl http://localhost:5000/api/uploads

# Access the file in browser
# http://localhost:5000/uploads/1234567890-987654321.jpg
```

## Important Notes

- **Data is NOT shared between machines** - Each Docker installation has its own volumes
- To share data with your friend, push code to GitHub and they'll start with fresh data
- For production, use a real database like PostgreSQL or MongoDB
- Never commit `Backend/data/` to git - it's in .gitignore
- File uploads are stored in Docker volumes, not in git
