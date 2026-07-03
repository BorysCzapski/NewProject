import { cn } from "@/lib/utils";

export function HomeworkProgressBar({
  current,
  target,
  className,
}: {
  current: number;
  target: number;
  className?: string;
}) {
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const isDone = current >= target;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
        <div
          className={cn("h-full rounded-full transition-all", isDone ? "bg-accent" : "bg-primary")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-14 shrink-0 text-right text-xs font-medium text-foreground-muted">
        {current}/{target}
      </span>
    </div>
  );
}
