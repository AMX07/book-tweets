from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models import Book, Excerpt, Like, Impression

router = APIRouter(prefix="/api")


class BookCreate(BaseModel):
    title: str
    author: str
    genre: Optional[str] = None
    cover_url: Optional[str] = None


class ExcerptCreate(BaseModel):
    book_id: int
    text: str
    page_number: Optional[int] = None
    chapter: Optional[str] = None
    tags: list[str] = []


class ExcerptOut(BaseModel):
    id: int
    text: str
    page_number: Optional[int]
    chapter: Optional[str]
    tags: list
    source: str
    liked: bool
    like_count: int
    book_id: int
    book_title: str
    book_author: str
    book_cover_url: Optional[str]

    model_config = {"from_attributes": True}


@router.get("/books")
def list_books(db: Session = Depends(get_db)):
    books = db.query(Book).all()
    return [{"id": b.id, "title": b.title, "author": b.author, "genre": b.genre, "cover_url": b.cover_url} for b in books]


@router.post("/books")
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    db_book = Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return {"id": db_book.id, "title": db_book.title, "author": db_book.author}


@router.get("/excerpts")
def list_excerpts(db: Session = Depends(get_db)):
    excerpts = db.query(Excerpt).all()
    liked_ids = {l.excerpt_id for l in db.query(Like).all()}
    return [_format_excerpt(e, liked_ids) for e in excerpts]


@router.post("/excerpts")
def create_excerpt(excerpt: ExcerptCreate, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == excerpt.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db_excerpt = Excerpt(**excerpt.model_dump())
    db.add(db_excerpt)
    db.commit()
    db.refresh(db_excerpt)
    return {"id": db_excerpt.id, "text": db_excerpt.text[:80] + "..."}


@router.post("/excerpts/{excerpt_id}/impression")
def record_impression(excerpt_id: int, db: Session = Depends(get_db)):
    excerpt = db.query(Excerpt).filter(Excerpt.id == excerpt_id).first()
    if not excerpt:
        raise HTTPException(status_code=404, detail="Excerpt not found")
    db.add(Impression(excerpt_id=excerpt_id))
    db.commit()
    return {"ok": True}


def _format_excerpt(excerpt: Excerpt, liked_ids: set) -> dict:
    return {
        "id": excerpt.id,
        "text": excerpt.text,
        "page_number": excerpt.page_number,
        "chapter": excerpt.chapter,
        "tags": excerpt.tags or [],
        "source": excerpt.source,
        "liked": excerpt.id in liked_ids,
        "like_count": len(excerpt.likes),
        "book_id": excerpt.book_id,
        "book_title": excerpt.book.title,
        "book_author": excerpt.book.author,
        "book_cover_url": excerpt.book.cover_url,
    }
