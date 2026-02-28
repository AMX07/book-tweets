from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Excerpt, Like

router = APIRouter(prefix="/api")


@router.post("/excerpts/{excerpt_id}/like")
def like_excerpt(excerpt_id: int, db: Session = Depends(get_db)):
    excerpt = db.query(Excerpt).filter(Excerpt.id == excerpt_id).first()
    if not excerpt:
        raise HTTPException(status_code=404, detail="Excerpt not found")

    existing = db.query(Like).filter(Like.excerpt_id == excerpt_id).first()
    if existing:
        return {"liked": True, "like_count": len(excerpt.likes)}

    db.add(Like(excerpt_id=excerpt_id))
    db.commit()
    db.refresh(excerpt)
    return {"liked": True, "like_count": len(excerpt.likes)}


@router.delete("/excerpts/{excerpt_id}/like")
def unlike_excerpt(excerpt_id: int, db: Session = Depends(get_db)):
    excerpt = db.query(Excerpt).filter(Excerpt.id == excerpt_id).first()
    if not excerpt:
        raise HTTPException(status_code=404, detail="Excerpt not found")

    like = db.query(Like).filter(Like.excerpt_id == excerpt_id).first()
    if like:
        db.delete(like)
        db.commit()
        db.refresh(excerpt)

    return {"liked": False, "like_count": len(excerpt.likes)}
