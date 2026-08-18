// ============================================================================
// components/geografia/dashboard/estimated-score-card.tsx
// "Poziom opanowania materiału" headline — an unweighted average across
// topics that have exercises (see lib/geografia/dashboard.ts), framed
// against MIN_MASTERY_THRESHOLD (80%) the same way Matma's estimated-score-
// card frames its exam-point estimate.
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { MIN_MASTERY_THRESHOLD } from "@/lib/constants";

export function EstimatedScoreCard({ percent }: { percent: number }) {
  const targetPercent = Math.round(MIN_MASTERY_THRESHOLD * 100);
  const filledPercent = Math.min(100, Math.max(0, percent));
  const reachedTarget = percent >= targetPercent;

  const caption = reachedTarget
    ? "Świetnie — Twój poziom opanowania materiału jest już na poziomie celu. Utrzymuj regularne powtórki, żeby go nie stracić."
    : `Brakuje ${Math.max(0, targetPercent - percent)} pkt proc. do celu ${targetPercent}% — każde ćwiczenie Cię do niego przybliża.`;

  return (
    <Card className="flex flex-col gap-3">
      <CardTitle>Poziom opanowania materiału</CardTitle>
      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold text-foreground">{percent}%</p>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${filledPercent}%` }} />
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground/40"
          style={{ left: `${targetPercent}%` }}
          aria-hidden
        />
      </div>
      <p className="text-xs text-foreground-muted">Cel: {targetPercent}%</p>
      <p className="text-sm text-foreground-muted">{caption}</p>
    </Card>
  );
}
