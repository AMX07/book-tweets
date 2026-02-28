export interface Book {
  id: number;
  title: string;
  author: string;
  genre?: string;
  cover_url?: string;
}

export interface Excerpt {
  id: number;
  text: string;
  page_number?: number;
  chapter?: string;
  tags: string[];
  source: "readwise" | "clippings" | "manual";
  liked: boolean;
  like_count: number;
  book_id: number;
  book_title: string;
  book_author: string;
  book_cover_url?: string;
}

export interface FeedResponse {
  page: number;
  page_size: number;
  total: number;
  has_more: boolean;
  excerpts: Excerpt[];
}
