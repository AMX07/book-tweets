"""
My Clippings.txt parser for physical Kindle devices.

The file lives at /documents/My Clippings.txt on your Kindle.
Format (each entry separated by "=========="):

Book Title (Author Name)
- Your Highlight on page 42 | Location 644-647 | Added on Monday, January 1, 2024 12:00:00 AM

The highlighted text goes here.

==========
"""
import re


def parse_clippings(content: str) -> list[dict]:
    """
    Parse a My Clippings.txt file and return a list of highlight dicts.

    Returns:
        List of {"title": str, "author": str, "text": str, "page_number": int|None}
    """
    SEPARATOR = "=========="
    entries = [e.strip() for e in content.split(SEPARATOR) if e.strip()]

    results = []
    for entry in entries:
        lines = [l for l in entry.strip().splitlines() if l.strip()]
        if len(lines) < 3:
            continue

        title, author = _parse_title_author(lines[0])
        metadata_line = lines[1] if len(lines) > 1 else ""
        text_lines = lines[2:]
        text = " ".join(text_lines).strip()

        if not text or len(text) < 10:
            continue

        # Skip bookmarks and notes (not highlights)
        if "Your Bookmark" in metadata_line or "Your Note" in metadata_line:
            continue

        page_number = _parse_page(metadata_line)

        results.append({
            "title": title,
            "author": author,
            "text": text,
            "page_number": page_number,
        })

    return results


def _parse_title_author(line: str) -> tuple[str, str]:
    """
    Parse "Book Title (Author Name)" → ("Book Title", "Author Name")
    Falls back to ("Unknown", "Unknown") if pattern doesn't match.
    """
    match = re.match(r"^(.+?)\s*\(([^)]+)\)\s*$", line.strip())
    if match:
        return match.group(1).strip(), match.group(2).strip()
    return line.strip(), "Unknown"


def _parse_page(metadata: str) -> int | None:
    """Extract page number from metadata line."""
    match = re.search(r"page\s+(\d+)", metadata, re.IGNORECASE)
    if match:
        return int(match.group(1))
    return None
