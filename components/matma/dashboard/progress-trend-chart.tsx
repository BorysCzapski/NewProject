// ============================================================================
// components/matma/dashboard/progress-trend-chart.tsx
// Plain SVG line chart of the estimated exam score over time (no chart
// library installed). Needs at least 2 snapshots to draw a meaningful line —
// shows a placeholder message instead of an empty/broken chart otherwise.
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import type { MathProgressSnapshot } from "@/lib/types/database";

const WIDTH = 300;
const HEIGHT = 120;
const PADDING = 10;

export function ProgressTrendChart({ snapshots }: { snapshots: MathProgressSnapshot[] }) {
  return (
    <Card className="flex flex-col gap-3">
      <CardTitle>Trend wyniku w czasie</CardTitle>
      {snapshots.length < 2 ? (
        <p className="py-6 text-center text-sm text-foreground-muted">
          Wykres pojawi się, gdy zbierzemy więcej danych o Twoich postępach (co najmniej dwa pomiary).
        </p>
      ) : (
        <TrendSvg snapshots={snapshots} />
      )}
    </Card>
  );
}

function TrendSvg({ snapshots }: { snapshots: MathProgressSnapshot[] }) {
  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.snapshot_at).getTime() - new Date(b.snapshot_at).getTime()
  );
  const times = sorted.map((s) => new Date(s.snapshot_at).getTime());
  const minTime = times[0];
  const maxTime = times[times.length - 1];
  const timeSpan = maxTime - minTime || 1;

  const usableWidth = WIDTH - PADDING * 2;
  const usableHeight = HEIGHT - PADDING * 2;

  const points = sorted.map((s, i) => {
    const x = PADDING + ((times[i] - minTime) / timeSpan) * usableWidth;
    const clamped = Math.min(100, Math.max(0, s.estimated_percent));
    const y = PADDING + usableHeight - (clamped / 100) * usableHeight;
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  return (
    <div className="text-primary">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Wykres trendu szacowanego wyniku w czasie"
      >
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="currentColor" />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-foreground-muted">
        <span>
          {formatDate(first.snapshot_at)} · {first.estimated_percent}%
        </span>
        <span>
          {formatDate(last.snapshot_at)} · {last.estimated_percent}%
        </span>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit" }).format(new Date(iso));
}
