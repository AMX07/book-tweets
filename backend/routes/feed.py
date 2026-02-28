from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Excerpt, Like, Impression
from algo.recommender import rank_excerpts

router = APIRouter(prefix="/api")


@router.get("/feed")
def get_feed(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    all_excerpts = db.query(Excerpt).all()
    liked_ids = {l.excerpt_id for l in db.query(Like).all()}
    impression_counts = _get_impression_counts(db)

    ranked = rank_excerpts(all_excerpts, liked_ids, impression_counts)

    start = (page - 1) * page_size
    end = start + page_size
    page_excerpts = ranked[start:end]

    return {
        "page": page,
        "page_size": page_size,
        "total": len(ranked),
        "has_more": end < len(ranked),
        "excerpts": [
            {
                "id": e.id,
                "text": e.text,
                "page_number": e.page_number,
                "chapter": e.chapter,
                "tags": e.tags or [],
                "source": e.source,
                "liked": e.id in liked_ids,
                "like_count": len(e.likes),
                "book_id": e.book_id,
                "book_title": e.book.title,
                "book_author": e.book.author,
                "book_cover_url": e.book.cover_url,
            }
            for e in page_excerpts
        ],
    }


def _get_impression_counts(db: Session) -> dict[int, int]:
    impressions = db.query(Impression).all()
    counts: dict[int, int] = {}
    for imp in impressions:
        counts[imp.excerpt_id] = counts.get(imp.excerpt_id, 0) + 1
    return counts
