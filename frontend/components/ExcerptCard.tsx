import Image from "next/image";
import LikeButton from "./LikeButton";
import type { Excerpt } from "@/types";

interface ExcerptCardProps {
  excerpt: Excerpt;
}

const SOURCE_LABELS: Record<string, string> = {
  readwise: "Kindle via Readwise",
  clippings: "Kindle",
  manual: "Added manually",
};

export default function ExcerptCard({ excerpt }: ExcerptCardProps) {
  return (
    <article className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Book header */}
      <div className="flex gap-4 mb-4">
        {/* Book cover */}
        <div className="shrink-0">
          {excerpt.book_cover_url ? (
            <Image
              src={excerpt.book_cover_url}
              alt={`Cover of ${excerpt.book_title}`}
              width={48}
              height={64}
              className="rounded-lg object-cover shadow-sm"
              unoptimized
            />
          ) : (
            <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-stone-400 fill-current">
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
            </div>
          )}
        </div>

        {/* Book info */}
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{excerpt.book_title}</p>
          <p className="text-gray-500 text-sm truncate">{excerpt.book_author}</p>
          {excerpt.tags.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {excerpt.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Excerpt text — serif font for readability */}
      <blockquote className="font-serif text-[1.05rem] leading-relaxed text-gray-800 border-l-2 border-stone-200 pl-4">
        &ldquo;{excerpt.text}&rdquo;
      </blockquote>

      {/* Footer: source label + like button */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-stone-400">
          {excerpt.page_number ? `p. ${excerpt.page_number} · ` : ""}
          {SOURCE_LABELS[excerpt.source] ?? excerpt.source}
        </span>
        <LikeButton
          excerptId={excerpt.id}
          initialLiked={excerpt.liked}
          initialCount={excerpt.like_count}
        />
      </div>
    </article>
  );
}
