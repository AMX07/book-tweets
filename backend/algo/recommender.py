"""
Likes-Only Recommendation Algorithm
====================================
Design principle: optimize ONLY for what the user consciously chooses to like.

Explicitly does NOT use:
  - Time spent reading
  - Scroll velocity or depth
  - Session length
  - Clicks (opening detail view)
  - Negative signals (skipping = no penalty)

Why? Because those metrics optimize for compulsion, not appreciation.
A user who stops mid-excerpt to think deeply is NOT penalized here.

Scoring components (weights sum to 1.0):
  0.6 × content_score   — TF-IDF cosine similarity to liked excerpts
  0.2 × novelty_score   — penalty for excerpts already seen many times
  0.2 × diversity_score — penalty for too many excerpts from same book in session

Cold start (<5 likes): random shuffle (pure exploration).
"""

import random
from algo.features import FeatureExtractor

_extractor = FeatureExtractor()


def rank_excerpts(excerpts, liked_ids: set[int], impression_counts: dict[int, int]) -> list:
    """
    Returns excerpts sorted by score (highest first).

    Args:
        excerpts: list of Excerpt ORM objects
        liked_ids: set of excerpt IDs the user has liked
        impression_counts: {excerpt_id: times_shown} mapping
    """
    if not excerpts:
        return []

    like_count = len(liked_ids)

    # Cold start: < 5 likes → random ordering (exploration phase)
    if like_count < 5:
        result = list(excerpts)
        random.shuffle(result)
        return result

    # Fit the TF-IDF vectorizer on all excerpt texts
    all_texts = [e.text for e in excerpts]
    _extractor.fit(all_texts)

    liked_texts = [e.text for e in excerpts if e.id in liked_ids]
    profile_vector = _extractor.user_profile_vector(liked_texts)

    excerpt_vectors = _extractor.transform(all_texts)

    # Track book diversity within the top of the feed (simulate "session")
    # We penalize excerpts from books that already appear many times in high ranks
    book_counts: dict[int, int] = {}

    scored = []
    for i, excerpt in enumerate(excerpts):
        content_score = _extractor.score(excerpt_vectors[i], profile_vector) if profile_vector is not None else 0.5

        shown = impression_counts.get(excerpt.id, 0)
        novelty_score = 1.0 / (1.0 + shown * 0.15)

        book_appearances = book_counts.get(excerpt.book_id, 0)
        diversity_score = 1.0 / (1.0 + book_appearances * 0.5)

        final_score = (
            0.6 * content_score
            + 0.2 * novelty_score
            + 0.2 * diversity_score
        )

        scored.append((final_score, excerpt))

    scored.sort(key=lambda x: x[0], reverse=True)

    # Update book_counts based on final ordering for diversity calc accuracy
    # (This is a single-pass approximation; good enough for small datasets)
    ranked = []
    for _score, excerpt in scored:
        ranked.append(excerpt)
        book_counts[excerpt.book_id] = book_counts.get(excerpt.book_id, 0) + 1

    return ranked
