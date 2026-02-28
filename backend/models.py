from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    genre = Column(String, nullable=True)
    cover_url = Column(String, nullable=True)
    openlibrary_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    excerpts = relationship("Excerpt", back_populates="book")


class Excerpt(Base):
    __tablename__ = "excerpts"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    text = Column(Text, nullable=False)
    page_number = Column(Integer, nullable=True)
    chapter = Column(String, nullable=True)
    # source: 'readwise', 'clippings', or 'manual'
    source = Column(String, default="manual")
    tags = Column(JSON, default=list)
    readwise_id = Column(String, nullable=True, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    book = relationship("Book", back_populates="excerpts")
    likes = relationship("Like", back_populates="excerpt")
    impressions = relationship("Impression", back_populates="excerpt")


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    excerpt_id = Column(Integer, ForeignKey("excerpts.id"), nullable=False)
    liked_at = Column(DateTime, default=datetime.utcnow)

    excerpt = relationship("Excerpt", back_populates="likes")


class Impression(Base):
    __tablename__ = "impressions"

    id = Column(Integer, primary_key=True, index=True)
    excerpt_id = Column(Integer, ForeignKey("excerpts.id"), nullable=False)
    # Deliberately no session_duration or scroll_time — we only track SHOWN
    shown_at = Column(DateTime, default=datetime.utcnow)

    excerpt = relationship("Excerpt", back_populates="impressions")
