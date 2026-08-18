// ============================================================================
// components/matura/estimated-score-card.tsx
// "Szacowany wynik na maturze" headline — same shape as
// components/matma/dashboard/estimated-score-card.tsx, scoped to the
// student's chosen poziom (different max points per level).
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { MIN_MASTERY_THRESHOLD } from "@/lib/constants";
import { MATURA_MAX_POINTS, MATURA_LEVEL_LABELS } from "@/lib/matura/constants";
import type { MaturaLevel } from "@/lib/types/database";

export function EstimatedScoreCard({
  estimate,
  level,
}: {
  estimate: { points: number; percent: number };
  level: MaturaLevel;
}) {
  const maxPoints = MATURA_MAX_POINTS[level];
  const targetPercent = Math.round(MIN_MASTERY_THRESHOLD * 100);
  const targetPoints = Math.round(MIN_MASTERY_THRESHOLD * maxPoints);
  const filledPercent = Math.min(100, Math.max(0, estimate.percent));
  const reachedTarget = estimate.percent >= targetPercent;

  const caption = reachedTarget
    ? `Szacowany wynik jest już na poziomie celu (${targetPoints}/${maxPoints} pkt) — utrzymuj regularną praktykę, żeby go nie stracić.`
    : `Brakuje ${Math.max(0, targetPoints - estimate.points)} pkt do celu ${targetPoints}/${maxPoints} pkt (${targetPercent}%) — każde ćwiczenie Cię do niego przybliża.`;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <CardTitle>Szacowany wynik na maturze</CardTitle>
        <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground-muted">
          {MATURA_LEVEL_LABELS[level]}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold text-foreground">
          {estimate.points}
          <span className="text-lg font-medium text-foreground-muted"> / {maxPoints} pkt</span>
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
        Cel: {targetPoints}/{maxPoints} pkt ({targetPercent}%)
      </p>

      <p className="text-sm text-foreground-muted">{caption}</p>
    </Card>
  );
}
