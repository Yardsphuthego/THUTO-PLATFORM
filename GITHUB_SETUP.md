# GitHub Setup Instructions

Follow these steps to push THUTOSHARE to GitHub:

## 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `THABANGLIBRARY`
3. Choose **Public** or **Private** as needed
4. Do NOT initialize with README (we already have one)
5. Click **Create repository**

## 2. Initialize Git Locally

```bash
cd /Users/mac1/Documents/THABANGLIBRARY

# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: THUTOSHARE collaborative document library"
```

## 3. Add Remote and Push

Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/THABANGLIBRARY.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## 4. Share with Your Friend

Your friend can now clone and run:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/THABANGLIBRARY.git
cd THABANGLIBRARY

# Run with Docker
docker-compose up --build
```

## Using SSH (Optional)

If you've set up SSH keys:

```bash
git remote add origin git@github.com:YOUR_USERNAME/THABANGLIBRARY.git
git push -u origin main
```

## Useful Git Commands

```bash
# Check status
git status

# View commit history
git log

# Make changes and commit
git add .
git commit -m "Description of changes"
git push

# Pull latest changes
git pull origin main
```
