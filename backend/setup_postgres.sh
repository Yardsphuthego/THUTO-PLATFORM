#!/bin/bash

# PostgreSQL Database Setup Script
echo "🔄 Setting up PostgreSQL database for Thuto BAC..."

# Create database user
echo "👤 Creating database user 'voting_admin'..."
psql -U postgres -c "DROP USER IF EXISTS voting_admin;" 2>/dev/null
psql -U postgres -c "CREATE USER voting_admin WITH PASSWORD 'thuto_secure_2024';" 2>/dev/null
psql -U postgres -c "ALTER ROLE voting_admin CREATEDB;" 2>/dev/null

# Create database
echo "📊 Creating database 'thuto_voting'..."
psql -U postgres -c "DROP DATABASE IF EXISTS thuto_voting;" 2>/dev/null
psql -U postgres -c "CREATE DATABASE thuto_voting OWNER voting_admin;" 2>/dev/null

# Grant privileges
echo "🔐 Setting up database privileges..."
psql -U postgres -d thuto_voting -c "GRANT ALL PRIVILEGES ON DATABASE thuto_voting TO voting_admin;" 2>/dev/null

echo "✅ PostgreSQL database setup complete!"
echo ""
echo "Database Details:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: thuto_voting"
echo "  User: voting_admin"
echo "  Password: thuto_secure_2024"
echo ""
echo "Connection String:"
echo "  postgresql://voting_admin:thuto_secure_2024@localhost:5432/thuto_voting"
