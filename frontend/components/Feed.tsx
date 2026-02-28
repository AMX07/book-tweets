"use client";

import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import ExcerptCard from "./ExcerptCard";
import LoadingSkeleton from "./LoadingSkeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { FeedResponse } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PAGE_SIZE = 10;

function fetcher(url: string) {
  return fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to fetch feed");
    return r.json();
  });
}

export default function Feed() {
  const { data, error, size, setSize, isLoading, isValidating } = useSWRInfinite<FeedResponse>(
    (pageIndex) => `${API}/api/feed?page=${pageIndex + 1}&page_size=${PAGE_SIZE}`,
    fetcher,
    { revalidateFirstPage: false }
  );

  const allExcerpts = data ? data.flatMap((page) => page.excerpts) : [];
  const hasMore = data ? data[data.length - 1]?.has_more : false;
  const isLoadingMore = isValidating && size > 1;

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      setSize((s) => s + 1);
    }
  }, [isLoadingMore, hasMore, setSize]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !isLoadingMore);

  // Record impressions for shown excerpts (fire-and-forget)
  const recordImpression = useCallback((excerptId: number) => {
    fetch(`${API}/api/excerpts/${excerptId}/impression`, { method: "POST" }).catch(() => {});
  }, []);

  if (error) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg mb-2">Could not load your feed</p>
        <p className="text-sm">Make sure the backend is running on port 8000</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (allExcerpts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 mx-auto mb-4 fill-stone-200">
          <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
        </svg>
        <p className="text-lg font-medium mb-1">No excerpts yet</p>
        <p className="text-sm">
          <a href="/import" className="underline text-rose-500">Import from Readwise</a> or run{" "}
          <code className="bg-stone-100 px-1 rounded text-xs">python seed.py</code> to add sample excerpts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allExcerpts.map((excerpt) => (
        <div
          key={excerpt.id}
          // Intersection observer for impressions (fires once per render)
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

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {isLoadingMore && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      )}

      {!hasMore && allExcerpts.length > 0 && (
        <p className="text-center text-stone-400 text-sm py-8">
          You&apos;ve seen all your excerpts · Like more to refine your feed
        </p>
      )}
    </div>
  );
}
