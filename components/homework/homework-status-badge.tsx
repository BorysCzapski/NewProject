// ============================================================================
// components/homework/homework-status-badge.tsx
// Small colored pill for a HomeworkStatus value, shared by the user's
// homework list and the admin completions table.
// ============================================================================
import { cn } from "@/lib/utils";
import type { HomeworkStatus } from "@/lib/types/database";

const STATUS_LABELS: Record<HomeworkStatus, string> = {
  todo: "Do zrobienia",
  in_progress: "W trakcie",
  completed: "Ukończone",
  overdue: "Po terminie",
};

const STATUS_CLASSES: Record<HomeworkStatus, string> = {
  todo: "bg-surface-muted text-foreground-muted",
  in_progress: "bg-primary-soft text-primary",
  completed: "bg-accent-soft text-accent",
  overdue: "bg-danger-soft text-danger",
};

export function HomeworkStatusBadge({ status, className }: { status: HomeworkStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        STATUS_CLASSES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
