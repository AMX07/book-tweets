"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface LikeButtonProps {
  excerptId: number;
  initialLiked: boolean;
  initialCount: number;
}

export default function LikeButton({ excerptId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;

    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((c) => c + (newLiked ? 1 : -1));
    setLoading(true);

    try {
      const method = newLiked ? "POST" : "DELETE";
      await fetch(`${API}/api/excerpts/${excerptId}/like`, { method });
    } catch {
      // Revert on failure
      setLiked(!newLiked);
      setCount((c) => c + (newLiked ? -1 : 1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={liked ? "Unlike" : "Like"}
      className={`flex items-center gap-1.5 text-sm transition-all duration-150 select-none
        ${liked ? "text-rose-500" : "text-gray-400 hover:text-rose-400"}
        ${loading ? "opacity-60 cursor-wait" : "cursor-pointer"}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`w-5 h-5 transition-transform duration-150 ${liked ? "scale-110 fill-rose-500" : "fill-none stroke-current"}`}
        strokeWidth={liked ? 0 : 1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
      {count > 0 && <span className="font-medium">{count}</span>}
    </button>
  );
}
