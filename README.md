# Bookmarks — Book Excerpt Feed

A scrolling feed of meaningful book excerpts, like Twitter/Instagram but for books.
The recommendation algorithm optimizes only for **explicit likes** — never for screen time or scroll depth.

## Features

- **Infinite scroll feed** — responsive on desktop and mobile
- **Like-based ranking** — the more you like, the smarter the feed gets
- **Kindle import via Readwise** — one-click sync of all your Kindle highlights
- **My Clippings.txt import** — upload directly from a physical Kindle
- **No dark patterns** — the algorithm never rewards compulsive scrolling

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 · TypeScript · Tailwind CSS · SWR |
| Backend | FastAPI · SQLAlchemy · SQLite |
| Algorithm | scikit-learn TF-IDF cosine similarity |

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
python seed.py          # seed with 24 sample excerpts from 5 classic books
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (auto-generated API docs)
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

## Importing Your Kindle Highlights

**Option A — Readwise (recommended):**
1. Sign up at readwise.io and install the browser extension
2. Readwise will sync your Kindle highlights automatically
3. Go to `/import` → paste your Readwise API token → click Import

**Option B — My Clippings.txt:**
1. Connect your Kindle via USB
2. Find `documents/My Clippings.txt`
3. Go to `/import` → upload the file

## How the Algorithm Works

The feed is ranked by a simple scoring function:

```
score = 0.6 × content_similarity   ← TF-IDF cosine sim to your liked excerpts
      + 0.2 × novelty_score        ← penalty for excerpts you've already seen
      + 0.2 × diversity_score      ← penalty for too many excerpts from one book
```

**What it deliberately ignores:**
- Time spent on an excerpt
- Scroll velocity or depth
- Session length
- Negative signals (skipping is not penalized)

Cold start (< 5 likes): random ordering while you explore.

## API

```
GET  /api/feed?page=1&page_size=10
GET  /api/books
GET  /api/excerpts
POST /api/excerpts
POST /api/excerpts/{id}/like
DELETE /api/excerpts/{id}/like
POST /api/excerpts/{id}/impression
POST /api/import/readwise           body: { api_token }
POST /api/import/clippings          multipart: file
```

Full interactive docs at `http://localhost:8000/docs`.
