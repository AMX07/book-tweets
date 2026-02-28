export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm animate-pulse">
      <div className="flex gap-4">
        {/* Book cover placeholder */}
        <div className="shrink-0 w-12 h-16 bg-stone-200 rounded-lg" />

        <div className="flex-1 space-y-2">
          {/* Book title / author */}
          <div className="h-3 bg-stone-200 rounded w-1/3" />
          <div className="h-3 bg-stone-200 rounded w-1/4" />

          {/* Excerpt text lines */}
          <div className="pt-2 space-y-2">
            <div className="h-4 bg-stone-200 rounded w-full" />
            <div className="h-4 bg-stone-200 rounded w-full" />
            <div className="h-4 bg-stone-200 rounded w-4/5" />
            <div className="h-4 bg-stone-200 rounded w-3/5" />
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-4 flex justify-between items-center">
        <div className="h-3 bg-stone-200 rounded w-16" />
        <div className="h-5 bg-stone-200 rounded w-10" />
      </div>
    </div>
  );
}
