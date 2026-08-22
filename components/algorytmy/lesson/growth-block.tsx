"use client";

// ============================================================================
// components/algorytmy/lesson/growth-block.tsx
// Plots how the standard complexity classes grow with n.
//
// Plain inline SVG with the repo's existing series colours, matching
// components/geografia/lesson/chart-block.tsx and
// components/matma/dashboard/progress-trend-chart.tsx — a theory lesson should
// not drag a charting library into its bundle for five polylines.
//
// The y axis is LINEAR and scaled to the largest curve, which flattens log n
// against n² almost to the axis. That is not a defect to fix with a log scale:
// the gap IS the lesson. A log axis would make every class look like a
// comfortably straight line and hide exactly the thing worth seeing.
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/algorytmy/lesson/rich-text";
import { ALGO_GROWTH_FUNCTIONS } from "@/lib/algorytmy/lesson-blocks";

const W = 320;
const H = 180;
const PAD_L = 30;
const PAD_R = 8;
const PAD_T = 8;
const PAD_B = 26;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

const SERIES_CLASSES = [
  { stroke: "stroke-primary", dot: "bg-primary" },
  { stroke: "stroke-accent", dot: "bg-accent" },
  { stroke: "stroke-warning", dot: "bg-warning" },
  { stroke: "stroke-danger", dot: "bg-danger" },
  { stroke: "stroke-foreground-muted", dot: "bg-foreground-muted" },
  { stroke: "stroke-foreground", dot: "bg-foreground" },
];

export function GrowthBlock({
  title,
  functions,
  maxN,
  caption,
}: {
  title: string;
  functions: string[];
  maxN: number;
  caption?: string;
}) {
  const samples = Array.from({ length: maxN }, (_, i) => i + 1);

  const series = functions.map((name) => {
    const fn = ALGO_GROWTH_FUNCTIONS[name];
    return { name, values: samples.map((n) => (fn ? fn(n) : 0)) };
  });

  const max = Math.max(...series.flatMap((s) => s.values), 1);
  const x = (i: number) => PAD_L + (i / Math.max(samples.length - 1, 1)) * PLOT_W;
  const y = (v: number) => PAD_T + PLOT_H - (v / max) * PLOT_H;

  return (
    <Card className="flex flex-col gap-2">
      <CardTitle>{title}</CardTitle>

      <div className="flex flex-wrap gap-3">
        {series.map((s, i) => (
          <span key={s.name} className="flex items-center gap-1.5 text-xs text-foreground-muted">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${SERIES_CLASSES[i % SERIES_CLASSES.length].dot}`}
            />
            {s.name}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[18rem]" role="img" aria-label={title}>
          {/* osie */}
          <line
            x1={PAD_L}
            y1={PAD_T}
            x2={PAD_L}
            y2={PAD_T + PLOT_H}
            className="stroke-border"
            strokeWidth={1}
          />
          <line
            x1={PAD_L}
            y1={PAD_T + PLOT_H}
            x2={PAD_L + PLOT_W}
            y2={PAD_T + PLOT_H}
            className="stroke-border"
            strokeWidth={1}
          />

          {series.map((s, i) => (
            <polyline
              key={s.name}
              points={s.values.map((v, j) => `${x(j)},${y(v)}`).join(" ")}
              fill="none"
              strokeWidth={1.6}
              strokeLinejoin="round"
              className={SERIES_CLASSES[i % SERIES_CLASSES.length].stroke}
            />
          ))}

          <text x={PAD_L - 4} y={PAD_T + 6} textAnchor="end" className="fill-foreground-muted text-[8px]">
            liczba operacji
          </text>
          <text
            x={PAD_L + PLOT_W}
            y={PAD_T + PLOT_H + 16}
            textAnchor="end"
            className="fill-foreground-muted text-[8px]"
          >
            n = {maxN}
          </text>
          <text x={PAD_L} y={PAD_T + PLOT_H + 16} textAnchor="start" className="fill-foreground-muted text-[8px]">
            n = 1
          </text>
        </svg>
      </div>

      {caption && <RichText text={caption} className="text-xs text-foreground-muted" />}
    </Card>
  );
}
