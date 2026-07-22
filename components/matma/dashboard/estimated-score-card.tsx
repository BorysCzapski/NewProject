// ============================================================================
// components/matma/dashboard/estimated-score-card.tsx
// "Szacowany wynik na maturze" headline: current weighted estimate (see
// computeEstimatedScore in lib/matma/dashboard.ts) framed against the
// product's MIN_MASTERY_THRESHOLD (80%, 40/50 pkt) target — a thin marker on
// the background bar shows where that target sits. Caption stays
// informative, never discouraging, when the student is still below it.
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { MIN_MASTERY_THRESHOLD } from "@/lib/constants";
import { EXAM_MAX_POINTS } from "@/lib/matma/mock-exam";

export function EstimatedScoreCard({ estimate }: { estimate: { points: number; percent: number } }) {
  const targetPercent = Math.round(MIN_MASTERY_THRESHOLD * 100);
  const targetPoints = Math.round(MIN_MASTERY_THRESHOLD * EXAM_MAX_POINTS);
  const filledPercent = Math.min(100, Math.max(0, estimate.percent));
  const reachedTarget = estimate.percent >= targetPercent;

  const caption = reachedTarget
    ? `Szacowany wynik jest już na poziomie celu (${targetPoints}/${EXAM_MAX_POINTS} pkt) — utrzymuj regularną praktykę, żeby go nie stracić.`
    : `Brakuje ${Math.max(0, targetPoints - estimate.points)} pkt do celu ${targetPoints}/${EXAM_MAX_POINTS} pkt (${targetPercent}%) — każde ćwiczenie Cię do niego przybliża.`;

  return (
    <Card className="flex flex-col gap-3">
      <CardTitle>Szacowany wynik na maturze</CardTitle>

      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold text-foreground">
          {estimate.points}
          <span className="text-lg font-medium text-foreground-muted"> / {EXAM_MAX_POINTS} pkt</span>
        </p>
        <p className="text-2xl font-bold text-primary">{estimate.percent}%</p>
      </div>

      <div className="relative h-2.5 overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${filledPercent}%` }} />
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground/40"
          style={{ left: `${targetPercent}%` }}
          aria-hidden
        />
      </div>
      <p className="text-xs text-foreground-muted">
        Cel: {targetPoints}/{EXAM_MAX_POINTS} pkt ({targetPercent}%)
      </p>

      <p className="text-sm text-foreground-muted">{caption}</p>
    </Card>
  );
}
