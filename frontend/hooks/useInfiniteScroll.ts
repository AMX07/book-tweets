import { useEffect, useRef } from "react";

/**
 * Calls `onIntersect` when the sentinel element becomes visible.
 * Used to trigger loading the next page of the feed.
 */
export function useInfiniteScroll(onIntersect: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before reaching the bottom
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [onIntersect, enabled]);

  return sentinelRef;
}
