"use client";

// ============================================================================
// components/geografia/lesson/chart-block.tsx
// Generic bar/line chart for the statistical figures geography leans on —
// struktura zatrudnienia wg sektorów, dynamika ludności, udział źródeł
// energii, wielkość emisji. Plain inline SVG, matching the repo's existing
// no-chart-library approach (components/matma/dashboard/progress-trend-chart
// .tsx), so a theory lesson doesn't drag `recharts` into its bundle.
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/geografia/lesson/rich-text";

const W = 320;
const H = 170;
const PAD_L = 34;
const PAD_R = 8;
const PAD_T = 8;
const PAD_B = 30;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

const SERIES_CLASSES = [
  { fill: "fill-primary", stroke: "stroke-primary", dot: "bg-primary" },
  { fill: "fill-accent", stroke: "stroke-accent", dot: "bg-accent" },
  { fill: "fill-warning", stroke: "stroke-warning", dot: "bg-warning" },
];

export function ChartBlock({
  variant,
  title,
  caption,
  labels,
  series,
  unit,
}: {
  variant: "bar" | "line";
  title: string;
  caption?: string;
  labels: string[];
  series: { name: string; values: number[] }[];
  unit?: string;
}) {
  const allValues = series.flatMap((s) => s.values);
  const rawMax = Math.max(...allValues, 0);
  const rawMin = Math.min(...allValues, 0);
  const max = rawMax === 0 ? 1 : rawMax * 1.05;
  const min = rawMin < 0 ? rawMin * 1.05 : 0;

  const y = (v: number) => PAD_T + PLOT_H - ((v - min) / (max - min)) * PLOT_H;
  const slotW = PLOT_W / labels.length;

  return (
    <Card className="flex flex-col gap-2">
      <CardTitle>{title}</CardTitle>

      {series.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {series.map((s, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs text-foreground-muted">
              <span className={`h-2.5 w-2.5 rounded-sm ${SERIES_CLASSES[i % SERIES_CLASSES.length].dot}`} />
              {s.name}
            </span>
          ))}
        </div>
      )}

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={title}>
        {/* gridlines + y labels */}
        {[0, 0.5, 1].map((f) => {
          const value = min + (max - min) * f;
          return (
            <g key={f}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={y(value)}
                y2={y(value)}
                className="stroke-border"
                strokeWidth={1}
                strokeDasharray={f === 0 ? undefined : "3 3"}
              />
              <text x={PAD_L - 4} y={y(value) + 3} textAnchor="end" className="fill-foreground-muted text-[8px]">
                {formatTick(value)}
              </text>
            </g>
          );
        })}

        {variant === "bar"
          ? series.map((s, si) =>
              s.values.map((v, i) => {
                const groupW = (slotW * 0.7) / series.length;
                const x = PAD_L + slotW * i + slotW * 0.15 + groupW * si;
                const top = Math.min(y(v), y(0));
                return (
                  <rect
                    key={`${si}-${i}`}
                    x={x}
                    y={top}
                    width={groupW * 0.9}
                    height={Math.abs(y(v) - y(0))}
                    className={SERIES_CLASSES[si % SERIES_CLASSES.length].fill}
                    opacity={0.85}
                  />
                );
              })
            )
          : series.map((s, si) => (
              <polyline
                key={si}
                points={s.values.map((v, i) => `${PAD_L + slotW * i + slotW / 2},${y(v)}`).join(" ")}
                fill="none"
                className={SERIES_CLASSES[si % SERIES_CLASSES.length].stroke}
                strokeWidth={2}
                strokeLinejoin="round"
              />
            ))}

        {labels.map((label, i) => (
          <text
            key={i}
            x={PAD_L + slotW * i + slotW / 2}
            y={H - PAD_B + 12}
            textAnchor="middle"
            className="fill-foreground-muted text-[8px]"
          >
            {label}
          </text>
        ))}
        {unit && (
          <text x={PAD_L - 4} y={PAD_T - 1} textAnchor="end" className="fill-foreground-muted text-[8px] font-semibold">
            {unit}
          </text>
        )}
      </svg>

      {caption && <RichText text={caption} className="text-xs text-foreground-muted" />}
    </Card>
  );
}

function formatTick(value: number): string {
  if (Math.abs(value) >= 1000) return `${Math.round(value / 1000)}k`;
  return `${Math.round(value * 10) / 10}`;
}
