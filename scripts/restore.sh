#!/bin/bash

# THUTOSHARE Restore Script
# Restores user data, documents, and uploaded files from a backup

set -e

if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore.sh <backup-file>"
    echo "Example: ./scripts/restore.sh backups/thuto_backup_20260528_120000.tar.gz"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "🔄 Starting restore from: $BACKUP_FILE"

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Get container name
CONTAINER_NAME=$(docker ps --filter "ancestor=thuto-platform-backend" --format "{{.Names}}" 2>/dev/null || echo "")

if [ -z "$CONTAINER_NAME" ]; then
    echo "⚠️  Backend container not found. Restoring to local filesystem..."
    
    # Restore to local filesystem
    echo "📁 Extracting backup..."
    tar -xzf "$BACKUP_FILE" -C .
    
    echo "✅ Restore completed!"
    echo "💡 Now run: docker-compose up --build"
else
    echo "📦 Restoring to container: $CONTAINER_NAME"
    
    # Create temporary directory for extraction
    TEMP_DIR=$(mktemp -d)
    trap "rm -rf $TEMP_DIR" EXIT
    
    # Extract backup
    echo "📁 Extracting backup..."
    tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"
    
    # Copy data to container
    if [ -d "$TEMP_DIR/data" ]; then
        echo "  → Restoring user data..."
        docker cp "$TEMP_DIR/data/." "$CONTAINER_NAME:/app/backend/data/" 2>/dev/null || echo "    ⚠️  Could not restore user data"
    fi
    
    if [ -d "$TEMP_DIR/uploads" ]; then
        echo "  → Restoring uploaded files..."
        docker cp "$TEMP_DIR/uploads/." "$CONTAINER_NAME:/app/backend/uploads/" 2>/dev/null || echo "    ⚠️  Could not restore uploads"
    fi
    
    # Restart backend to apply changes
    echo "🔄 Restarting backend container..."
    docker-compose restart backend
    
    echo "✅ Restore completed!"
    echo "💡 Check the app at http://localhost:5173"
fi
