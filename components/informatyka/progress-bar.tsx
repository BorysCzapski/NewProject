// Thin progress bar + "earned/possible pkt" label used on every Informatyka list.
export function ProgressBar({ earned, possible }: { earned: number; possible: number }) {
  const percent = possible > 0 ? Math.round((earned / possible) * 100) : 0;
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
      <span className="shrink-0 text-xs text-foreground-muted">
        {earned}/{possible} pkt
      </span>
    </div>
  );
}
