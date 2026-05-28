# THUTOSHARE Data Backup & Restore Guide

## Quick Start

### Backup Your Data

```bash
# Make scripts executable (first time only)
chmod +x ./scripts/backup.sh ./scripts/restore.sh

# Create a backup
./scripts/backup.sh
```

This creates a `.tar.gz` file with all your data in the `backups/` folder.

### Share with Your Friend

1. **Create backup** on your computer
   ```bash
   ./scripts/backup.sh
   ```

2. **Copy the backup file** from `backups/thuto_backup_YYYYMMDD_HHMMSS.tar.gz`

3. **Share it with your friend** (via USB, email, cloud storage, etc.)

### Restore on Friend's Computer

1. **Clone the project**
   ```bash
   git clone https://github.com/Yardsphuthego/THUTO-PLATFORM.git
   cd THUTO-PLATFORM
   ```

2. **Copy backup file** into the project folder

3. **Restore the backup**
   ```bash
   chmod +x ./scripts/backup.sh ./scripts/restore.sh
   
   ./scripts/restore.sh backups/thuto_backup_YYYYMMDD_HHMMSS.tar.gz
   ```

4. **Start the app**
   ```bash
   docker-compose up --build
   ```

Now they'll have all your users, documents, and images! 🎉

---

## What Gets Backed Up

✅ **User Data**
- All registered user accounts
- User details (name, email, password)
- Location: `Backend/data/users.json`

✅ **Documents**
- All created documents
- Document titles, content, metadata
- Location: `Backend/data/documents.json`

✅ **Uploaded Images**
- All images and files users uploaded
- Library images, document attachments
- Location: `Backend/uploads/`

---

## Advanced Usage

### Backup Without Docker (Local Files Only)

```bash
./scripts/backup.sh
```

The script automatically detects if Docker is running and backs up accordingly.

### Manual Backup

If scripts don't work, do it manually:

```bash
# Create backups directory
mkdir -p backups

# Backup everything
tar -czf backups/manual_backup.tar.gz Backend/data/ Backend/uploads/

# List what's in the backup
tar -tzf backups/manual_backup.tar.gz
```

### Manual Restore

```bash
# Extract backup
tar -xzf backups/manual_backup.tar.gz

# Files will be extracted to ./Backend/data and ./Backend/uploads
# Restart Docker
docker-compose down
docker-compose up --build
```

### View Backup Contents

```bash
# List files in backup without extracting
tar -tzf backups/thuto_backup_20260528_120000.tar.gz

# Example output:
# data/
# data/users.json
# data/documents.json
# uploads/
# uploads/image1.jpg
# uploads/image2.png
```

---

## Troubleshooting

### Script Permission Denied

```bash
# Make scripts executable
chmod +x ./scripts/backup.sh ./scripts/restore.sh

# Or set up all scripts
./scripts/setup.sh
```

### Docker Container Not Found

The scripts work both with and without running Docker:
- **With Docker**: Extracts directly from running container
- **Without Docker**: Uses local filesystem at `Backend/data/` and `Backend/uploads/`

### Backup File Too Large

The backup is compressed, so even with many images it should be small.

If it's very large:
1. Check if `node_modules` got included (shouldn't happen with .gitignore)
2. Delete old backups: `rm backups/thuto_backup_*.tar.gz`

### Restore Doesn't Show Data

1. Make sure containers are running: `docker ps`
2. Restart containers: `docker-compose restart backend`
3. Check backend logs: `docker-compose logs backend`

---

## Backup Strategy

### Daily Backups

Create a cron job to backup daily:

```bash
# Edit crontab
crontab -e

# Add this line (backups at 2 AM daily)
0 2 * * * cd /Users/mac1/Documents/THABANGLIBRARY && ./scripts/backup.sh
```

### Keep Recent Backups Only

```bash
# Delete backups older than 7 days
find backups/ -name "thuto_backup_*.tar.gz" -mtime +7 -delete
```

### Upload to Cloud

```bash
# After backup, upload to cloud storage
./scripts/backup.sh
aws s3 cp backups/thuto_backup_*.tar.gz s3://my-bucket/
```

---

## File Sizes

Typical backup sizes:
- Empty app: ~1 KB
- With 10 users: ~5 KB
- With 100 documents: ~50 KB
- With 10 images: ~2-5 MB (depends on image sizes)
- Full setup: Usually under 10 MB

---

## Security Notes

⚠️ **Important:**
- Backups contain user passwords (in plaintext)
- Keep backups in a secure location
- Never commit backups to git (they're in .gitignore)
- Consider encrypting backups for sensitive data:

```bash
# Encrypt backup
tar -czf - Backend/data/ Backend/uploads/ | openssl enc -aes-256-cbc -e -out backup.tar.gz.enc

# Decrypt backup
openssl enc -aes-256-cbc -d -in backup.tar.gz.enc | tar -xzf -
```
