#!/bin/bash

# THUTOSHARE Backup Script
# Backs up all user data, documents, and uploaded files

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/thuto_backup_$TIMESTAMP.tar.gz"

# Create backups directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🔄 Starting THUTOSHARE backup..."

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Get container name
CONTAINER_NAME=$(docker ps --filter "ancestor=thuto-platform-backend" --format "{{.Names}}" 2>/dev/null || echo "")

if [ -z "$CONTAINER_NAME" ]; then
    echo "⚠️  Backend container not found. Backing up local files..."
    
    if [ ! -d "Backend/data" ] && [ ! -d "Backend/uploads" ]; then
        echo "❌ No data to backup found locally."
        exit 1
    fi
    
    # Backup from local filesystem
    tar -czf "$BACKUP_FILE" \
        Backend/data/ \
        Backend/uploads/ 2>/dev/null || true
else
    echo "📦 Backing up from container: $CONTAINER_NAME"
    
    # Create temporary directory for extraction
    TEMP_DIR=$(mktemp -d)
    trap "rm -rf $TEMP_DIR" EXIT
    
    # Copy data from container
    echo "  → Exporting user data..."
    docker cp "$CONTAINER_NAME:/app/backend/data" "$TEMP_DIR/" 2>/dev/null || mkdir -p "$TEMP_DIR/data"
    
    echo "  → Exporting uploaded files..."
    docker cp "$CONTAINER_NAME:/app/backend/uploads" "$TEMP_DIR/" 2>/dev/null || mkdir -p "$TEMP_DIR/uploads"
    
    # Create archive
    tar -czf "$BACKUP_FILE" -C "$TEMP_DIR" data/ uploads/ 2>/dev/null || true
fi

if [ -f "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup completed successfully!"
    echo "📁 File: $BACKUP_FILE"
    echo "💾 Size: $SIZE"
    echo ""
    echo "💡 To restore this backup on another computer:"
    echo "   1. Copy this file to the THUTO-PLATFORM directory"
    echo "   2. Run: ./scripts/restore.sh backups/thuto_backup_$TIMESTAMP.tar.gz"
else
    echo "❌ Backup failed."
    exit 1
fi
