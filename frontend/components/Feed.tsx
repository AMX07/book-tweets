"use client";

import { useCallback, useEffect, useState } from "react";
import ExcerptCard from "./ExcerptCard";
import LoadingSkeleton from "./LoadingSkeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { initStore, getRankedFeed, recordImpression } from "@/lib/store";
import type { Excerpt } from "@/types";

const PAGE_SIZE = 10;

export default function Feed() {
  const [excerpts, setExcerpts] = useState<Excerpt[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initialise the store (seeds localStorage if empty) then load first page
  useEffect(() => {
    initStore();
    const result = getRankedFeed(1, PAGE_SIZE);
    setExcerpts(result.excerpts);
    setHasMore(result.hasMore);
    setIsLoading(false);
  }, []);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const result = getRankedFeed(nextPage, PAGE_SIZE);
    setExcerpts((prev) => [...prev, ...result.excerpts]);
    setHasMore(result.hasMore);
    setPage(nextPage);
    setIsLoadingMore(false);
  }, [page, hasMore, isLoadingMore]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !isLoadingMore);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => <LoadingSkeleton key={i} />)}
      </div>
    );
  }

  if (excerpts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 mx-auto mb-4 fill-stone-200">
          <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
        </svg>
        <p className="text-lg font-medium mb-1">No excerpts yet</p>
        <p className="text-sm">
          <a href="import" className="underline text-rose-500">Import from Readwise</a> to add your Kindle highlights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {excerpts.map((excerpt) => (
        <div
          key={excerpt.id}
          ref={(el) => {
            if (!el) return;
            const obs = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) {
                  recordImpression(excerpt.id);
                  obs.disconnect();
                }
              },
              { threshold: 0.5 }
            );
            obs.observe(el);
          }}
        >
          <ExcerptCard excerpt={excerpt} />
        </div>
      ))}

      <div ref={sentinelRef} className="h-1" />

      {isLoadingMore && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <LoadingSkeleton key={i} />)}
        </div>
      )}

      {!hasMore && excerpts.length > 0 && (
        <p className="text-center text-stone-400 text-sm py-8">
          You&apos;ve seen all your excerpts · Like more to refine your feed
        </p>
      )}
    </div>
  );
}
