// ============================================================================
// components/writing/score-badge.tsx
// Colour-coded 0-100 AI score pill used on the writing hub and task detail.
// ============================================================================
import { cn } from "@/lib/utils";

export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  const tone =
    score >= 80
      ? "bg-primary-soft text-primary"
      : score >= 50
        ? "bg-warning-soft text-warning"
        : "bg-danger-soft text-danger";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tone,
        className
      )}
    >
      {score}/100
    </span>
  );
}
