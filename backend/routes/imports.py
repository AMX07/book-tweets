from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from integrations.readwise import ReadwiseClient
from integrations.clippings import parse_clippings
from models import Book, Excerpt

router = APIRouter(prefix="/api/import")


class ReadwiseImportRequest(BaseModel):
    api_token: str


@router.post("/readwise")
async def import_from_readwise(req: ReadwiseImportRequest, db: Session = Depends(get_db)):
    client = ReadwiseClient(req.api_token)
    try:
        books_data = await client.get_books()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Readwise API error: {e}")

    created_excerpts = 0
    created_books = 0

    for book_data in books_data:
        # Upsert book by title+author
        db_book = db.query(Book).filter(
            Book.title == book_data["title"],
            Book.author == book_data["author"],
        ).first()

        if not db_book:
            db_book = Book(
                title=book_data["title"],
                author=book_data["author"],
                cover_url=book_data.get("cover_image_url"),
            )
            db.add(db_book)
            db.flush()
            created_books += 1

        for highlight in book_data["highlights"]:
            # Skip empty highlights
            if not highlight["text"].strip():
                continue
            # Deduplicate by readwise_id
            existing = db.query(Excerpt).filter(
                Excerpt.readwise_id == str(highlight["id"])
            ).first()
            if existing:
                continue

            db_excerpt = Excerpt(
                book_id=db_book.id,
                text=highlight["text"].strip(),
                page_number=highlight.get("location"),
                source="readwise",
                readwise_id=str(highlight["id"]),
                tags=[],
            )
            db.add(db_excerpt)
            created_excerpts += 1

    db.commit()
    return {
        "imported_books": created_books,
        "imported_excerpts": created_excerpts,
    }


@router.post("/clippings")
async def import_clippings(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename or not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Please upload a .txt file (My Clippings.txt)")

    content = await file.read()
    try:
        clippings = parse_clippings(content.decode("utf-8", errors="replace"))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {e}")

    created_excerpts = 0
    created_books = 0

    for clipping in clippings:
        db_book = db.query(Book).filter(
            Book.title == clipping["title"],
            Book.author == clipping["author"],
        ).first()

        if not db_book:
            db_book = Book(title=clipping["title"], author=clipping["author"])
            db.add(db_book)
            db.flush()
            created_books += 1

        # Deduplicate by exact text
        existing = db.query(Excerpt).filter(
            Excerpt.book_id == db_book.id,
            Excerpt.text == clipping["text"],
        ).first()
        if existing:
            continue

        db.add(Excerpt(
            book_id=db_book.id,
            text=clipping["text"],
            page_number=clipping.get("page_number"),
            source="clippings",
            tags=[],
        ))
        created_excerpts += 1

    db.commit()
    return {
        "imported_books": created_books,
        "imported_excerpts": created_excerpts,
    }
