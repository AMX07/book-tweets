"""
Readwise API client.

Readwise syncs Kindle highlights (and highlights from other sources) via
their browser extension. No official Amazon Kindle API exists — Readwise
is the most reliable way to programmatically access Kindle highlights.

API docs: https://readwise.io/api_deets
Rate limit: 240 requests / minute
"""
import httpx

READWISE_BASE = "https://readwise.io/api/v2"


class ReadwiseClient:
    def __init__(self, api_token: str):
        self.headers = {"Authorization": f"Token {api_token}"}

    async def get_books(self) -> list[dict]:
        """
        Fetch all books with their highlights.
        Returns a list of dicts: {title, author, cover_image_url, highlights: [...]}
        """
        async with httpx.AsyncClient(headers=self.headers, timeout=30) as client:
            books = await self._paginate(client, f"{READWISE_BASE}/books/", {"category": "books"})
            result = []
            for book in books:
                highlights = await self._paginate(
                    client,
                    f"{READWISE_BASE}/highlights/",
                    {"book_id": book["id"]},
                )
                result.append({
                    "title": book.get("title", "Unknown Title"),
                    "author": book.get("author", "Unknown Author"),
                    "cover_image_url": book.get("cover_image_url"),
                    "highlights": [
                        {
                            "id": h["id"],
                            "text": h["text"],
                            "location": h.get("location"),
                            "note": h.get("note"),
                            "tags": [t["name"] for t in h.get("tags", [])],
                        }
                        for h in highlights
                    ],
                })
            return result

    async def _paginate(self, client: httpx.AsyncClient, url: str, params: dict) -> list:
        """Follow Readwise pagination (next cursor)."""
        results = []
        next_url = url
        while next_url:
            resp = await client.get(next_url, params=params if next_url == url else {})
            resp.raise_for_status()
            data = resp.json()
            results.extend(data.get("results", []))
            next_url = data.get("next")
        return results
