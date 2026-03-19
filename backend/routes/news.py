from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from db.database import get_db
from models.models import News, University, User

router = APIRouter()

@router.post("/", response_model=dict)
async def create_news(
    title: str,
    content: str,
    category: str,
    university_id: int = None,
    created_by: int = 1,
    db: Session = Depends(get_db)
):
    """Create a new news article"""
    news = News(
        title=title,
        content=content,
        category=category,
        university_id=university_id,
        created_by=created_by,
        is_published=True
    )
    db.add(news)
    db.commit()
    db.refresh(news)
    
    return {"message": "News article created successfully", "news_id": news.id}

@router.get("/")
async def get_all_news(limit: int = 50, db: Session = Depends(get_db)):
    """Get all published news articles"""
    news_list = db.query(News).filter(News.is_published == True).order_by(News.created_at.desc()).limit(limit).all()
    return {
        "total": len(news_list),
        "articles": [
            {
                "id": n.id,
                "title": n.title,
                "content": n.content,
                "category": n.category,
                "created_at": n.created_at.isoformat(),
                "author": n.author.full_name if n.author else "Unknown"
            }
            for n in news_list
        ]
    }

@router.get("/category/{category}")
async def get_news_by_category(category: str, db: Session = Depends(get_db)):
    """Get news articles by category"""
    news_list = db.query(News).filter(
        News.category == category,
        News.is_published == True
    ).order_by(News.created_at.desc()).all()
    
    return {
        "category": category,
        "total": len(news_list),
        "articles": [
            {
                "id": n.id,
                "title": n.title,
                "content": n.content,
                "created_at": n.created_at.isoformat()
            }
            for n in news_list
        ]
    }

@router.get("/{news_id}")
async def get_news(news_id: int, db: Session = Depends(get_db)):
    """Get a specific news article"""
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News article not found"
        )
    
    return {
        "id": news.id,
        "title": news.title,
        "content": news.content,
        "category": news.category,
        "created_at": news.created_at.isoformat(),
        "author": news.author.full_name if news.author else "Unknown"
    }

@router.put("/{news_id}", response_model=dict)
async def update_news(
    news_id: int,
    title: str = None,
    content: str = None,
    category: str = None,
    db: Session = Depends(get_db)
):
    """Update a news article"""
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News article not found"
        )
    
    if title:
        news.title = title
    if content:
        news.content = content
    if category:
        news.category = category
    
    news.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "News article updated successfully"}

@router.delete("/{news_id}", response_model=dict)
async def delete_news(news_id: int, db: Session = Depends(get_db)):
    """Delete a news article"""
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News article not found"
        )
    
    db.delete(news)
    db.commit()
    
    return {"message": "News article deleted successfully"}
