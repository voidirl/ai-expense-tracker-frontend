/** Placeholder block used while data is in flight. */
export default function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-control bg-surface-raised ${className}`}
    />
  );
}

export function SkeletonRows({ count = 4 }) {
  return (
    <div className="flex flex-col" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading expenses…</span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-line-subtle py-3.5 last:border-b-0"
        >
          <Skeleton className="h-2 w-2 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-2.5 w-1/5" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-[86px] rounded-panel" />
      ))}
    </div>
  );
}