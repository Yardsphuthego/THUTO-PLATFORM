from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    database_url: str = "sqlite:///./thuto_voting.db"
    
    # Security
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # API
    api_version: str = "v1"
    api_title: str = "Thuto BAC API"
    
    class Config:
        env_file = Path(__file__).resolve().parents[1] / ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
