from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from core.config import settings
from db.database import Base, engine, ensure_schema_updates
from models import models as db_models
from routes import auth, users, elections, votes, admin, candidates, voters_roll, news
import traceback

DEV_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app = FastAPI(
    title="Thuto BAC - Digital Voting Platform",
    description="A secure and scalable digital voting platform for educational institutions",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)
    ensure_schema_updates()

# Global exception handler for better error visibility
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"❌ Error: {exc}")
    traceback.print_exc()
    response = JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": type(exc).__name__}
    )
    origin = request.headers.get("origin")
    if origin and origin in DEV_CORS_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Vary"] = "Origin"
    return response

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=DEV_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(elections.router, prefix="/api/elections", tags=["Elections"])
app.include_router(votes.router, prefix="/api/votes", tags=["Votes"])
app.include_router(candidates.router, prefix="/api/candidates", tags=["Candidates"])
app.include_router(voters_roll.router, prefix="/api/voters-roll", tags=["Voters Roll"])
app.include_router(news.router, prefix="/api/news", tags=["News"])
app.include_router(admin.router, tags=["Admin"])

@app.get("/")
async def root():
    return {"message": "Welcome to Thuto BAC - Digital Voting Platform"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
