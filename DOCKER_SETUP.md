# Docker Setup Guide for THUTOSHARE

This guide explains how to run THUTOSHARE using Docker containers.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- Git (for cloning the repository)

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/THABANGLIBRARY.git
cd THABANGLIBRARY
```

### 2. Run with Docker Compose
```bash
docker-compose up --build
```

This will:
- Build the backend container
- Build the frontend container
- Start both services
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`

### 3. Access the Application
- Open your browser and go to: `http://localhost:5173`

## Stopping the Containers

Press `Ctrl+C` in the terminal, or run:
```bash
docker-compose down
```

## Running Individual Containers

### Backend Only
```bash
docker build -f Dockerfile.backend -t thutoshare-backend .
docker run -p 5000:5000 thutoshare-backend
```

### Frontend Only
```bash
docker build -f Dockerfile.frontend -t thutoshare-frontend .
docker run -p 5173:5173 thutoshare-frontend
```

## Development Mode

For development with hot reloading, run the services locally (without Docker):

### Terminal 1 - Backend
```bash
cd Backend
npm install
npm start
```

### Terminal 2 - Frontend
```bash
cd Frontend
npm install
npm run dev
```

## Docker Images

- **Backend**: Node.js 20-Alpine with Express server
- **Frontend**: Multi-stage build - Node.js 20-Alpine with Vite build, then served with `serve`

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "5001:5000"  # Use 5001 instead
  - "5174:5173"  # Use 5174 instead
```

### Clear Docker Cache
```bash
docker-compose down -v
docker system prune
docker-compose up --build
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```
