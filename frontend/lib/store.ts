/**
 * Client-side store for GitHub Pages deployment.
 * All data lives in localStorage — no backend needed.
 *
 * Storage keys:
 *   bm_excerpts     → Excerpt[]          (all excerpts)
 *   bm_likes        → number[]           (liked excerpt IDs)
 *   bm_impressions  → Record<id, count>  (shown counts — for novelty only)
 */

import type { Excerpt } from "@/types";
import { SEED_EXCERPTS } from "./seed-data";

const EXCERPTS_KEY = "bm_excerpts";
const LIKES_KEY = "bm_likes";
const IMPRESSIONS_KEY = "bm_impressions";

// ─── Low-level localStorage helpers ─────────────────────────────────────────

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Initialisation ──────────────────────────────────────────────────────────

/**
 * Called once on app mount. Seeds localStorage with sample data
 * if no excerpts exist yet.
 */
export function initStore() {
  const existing = read<Excerpt[]>(EXCERPTS_KEY, []);
  if (existing.length === 0) {
    write(EXCERPTS_KEY, SEED_EXCERPTS);
  }
}

// ─── Excerpts ────────────────────────────────────────────────────────────────

export function getAllExcerpts(): Excerpt[] {
  return read<Excerpt[]>(EXCERPTS_KEY, []);
}

/** Add new excerpts (from Readwise / Clippings import). Deduplicates by text. */
export function addExcerpts(incoming: Omit<Excerpt, "id" | "liked" | "like_count">[]): number {
  const existing = getAllExcerpts();
  const existingTexts = new Set(existing.map((e) => e.text.trim()));

  const nextId = existing.length > 0 ? Math.max(...existing.map((e) => e.id)) + 1 : 1;
  let added = 0;

  const fresh: Excerpt[] = incoming
    .filter((e) => !existingTexts.has(e.text.trim()))
    .map((e, i) => ({
      ...e,
      id: nextId + i,
      liked: false,
      like_count: 0,
    }));

  write(EXCERPTS_KEY, [...existing, ...fresh]);
  added = fresh.length;
  return added;
}

// ─── Likes ───────────────────────────────────────────────────────────────────

export function getLikedIds(): Set<number> {
  return new Set(read<number[]>(LIKES_KEY, []));
}

export function toggleLike(excerptId: number): boolean {
  const ids = getLikedIds();
  const nowLiked = !ids.has(excerptId);

  if (nowLiked) {
    ids.add(excerptId);
  } else {
    ids.delete(excerptId);
  }

  write(LIKES_KEY, Array.from(ids));

  // Also update the like_count in the excerpts array
  const excerpts = getAllExcerpts();
  const updated = excerpts.map((e) =>
    e.id === excerptId
      ? { ...e, liked: nowLiked, like_count: Math.max(0, e.like_count + (nowLiked ? 1 : -1)) }
      : e
  );
  write(EXCERPTS_KEY, updated);

  return nowLiked;
}

// ─── Impressions ─────────────────────────────────────────────────────────────

export function recordImpression(excerptId: number) {
  const counts = read<Record<number, number>>(IMPRESSIONS_KEY, {});
  counts[excerptId] = (counts[excerptId] ?? 0) + 1;
  write(IMPRESSIONS_KEY, counts);
}

function getImpressionCounts(): Record<number, number> {
  return read<Record<number, number>>(IMPRESSIONS_KEY, {});
}

// ─── Recommendation Algorithm ─────────────────────────────────────────────────
//
// Optimizes ONLY for explicit likes. Does NOT use:
//   - Time spent reading
//   - Scroll speed or depth
//   - Session length
//   - Negative signals (skipping is not penalized)
//
// Score = 0.6 × content_similarity + 0.2 × novelty + 0.2 × book_diversity

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with","by",
  "from","is","are","was","were","be","been","being","have","has","had","do",
  "does","did","will","would","could","should","may","might","must","that",
  "this","it","its","we","our","you","your","he","she","they","their","not",
  "no","so","then","when","where","who","which","what","how","i","me","my",
  "him","his","her","us","them","just","more","most","much","such","same",
  "can","all","any","if","as","than","about","after","before","some","very",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/** Build a word → frequency map from all liked excerpt texts. */
function buildLikedProfile(likedTexts: string[]): Map<string, number> {
  const profile = new Map<string, number>();
  for (const text of likedTexts) {
    for (const word of tokenize(text)) {
      profile.set(word, (profile.get(word) ?? 0) + 1);
    }
  }
  return profile;
}

/** How well does this excerpt match the user's liked-content profile? */
function contentScore(text: string, profile: Map<string, number>): number {
  if (profile.size === 0) return 0.5; // no likes yet → neutral
  const words = new Set(tokenize(text));
  if (words.size === 0) return 0;

  let matchWeight = 0;
  for (const word of words) {
    const freq = profile.get(word) ?? 0;
    if (freq > 0) matchWeight += Math.log(1 + freq);
  }
  // Normalize: log(2) ≈ 0.693 is the weight for a word seen once
  return Math.min(1, matchWeight / (words.size * Math.log(2)));
}

export function getRankedFeed(page: number, pageSize: number): {
  excerpts: Excerpt[];
  hasMore: boolean;
  total: number;
} {
  const allExcerpts = getAllExcerpts();
  const likedIds = getLikedIds();
  const impressions = getImpressionCounts();

  // Cold start: < 5 likes → random shuffle
  if (likedIds.size < 5) {
    const shuffled = [...allExcerpts].sort(() => Math.random() - 0.5);
    const start = (page - 1) * pageSize;
    return {
      excerpts: shuffled.slice(start, start + pageSize).map((e) => ({
        ...e,
        liked: likedIds.has(e.id),
      })),
      hasMore: start + pageSize < shuffled.length,
      total: shuffled.length,
    };
  }

  const likedTexts = allExcerpts.filter((e) => likedIds.has(e.id)).map((e) => e.text);
  const profile = buildLikedProfile(likedTexts);

  // Score all excerpts
  const bookCounts: Record<number, number> = {};
  const scored = allExcerpts.map((excerpt) => {
    const cs = contentScore(excerpt.text, profile);
    const shown = impressions[excerpt.id] ?? 0;
    const novelty = 1 / (1 + shown * 0.15);
    const bookAppearances = bookCounts[excerpt.book_id] ?? 0;
    const diversity = 1 / (1 + bookAppearances * 0.5);
    const score = 0.6 * cs + 0.2 * novelty + 0.2 * diversity;
    return { excerpt, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Count books in ranked order for diversity
  const ranked = scored.map(({ excerpt }) => {
    bookCounts[excerpt.book_id] = (bookCounts[excerpt.book_id] ?? 0) + 1;
    return { ...excerpt, liked: likedIds.has(excerpt.id) };
  });

  const start = (page - 1) * pageSize;
  return {
    excerpts: ranked.slice(start, start + pageSize),
    hasMore: start + pageSize < ranked.length,
    total: ranked.length,
  };
}
