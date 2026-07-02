// ============================================================================
// app/(main)/loading.tsx
// Fallback UI Next.js shows while a page inside the (main) shell is loading
// (route-level Suspense boundary). Kept generic since it covers every
// module page.
// ============================================================================
export default function MainLoading() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <div className="h-7 w-40 animate-pulse rounded-full bg-surface-muted" />
      <div className="h-24 animate-pulse rounded-(--radius-card) bg-surface-muted" />
      <div className="h-24 animate-pulse rounded-(--radius-card) bg-surface-muted" />
      <div className="h-24 animate-pulse rounded-(--radius-card) bg-surface-muted" />
    </div>
  );
}
