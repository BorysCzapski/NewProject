"use client";

// ============================================================================
// components/tracker/progress-chart.tsx
// Wykres postępu "jak na giełdzie": jeden punkt na zapisany dzień, połączony
// linią, z nagłówkiem-tickerem (ostatnia wartość + zmiana względem poprzedniego
// dnia). Punkt jest zielony, gdy dzień był lepszy od poprzedniego, czerwony,
// gdy gorszy, szary, gdy taki sam — a KOLOR NIGDY NIE JEST JEDYNYM nośnikiem:
// tooltip i ticker mają strzałki (▲ ▼ =) i liczby, a pod wykresem jest tabela.
//
// Jedna seria, więc bez legendy kategorii i bez palety wielu barw; linia ma
// kolor akcentu aplikacji, a kolory punktów to tokeny statusowe (accent/danger).
// Porównania (średnia, miejsce, "lepszy niż X% dni") zawsze liczone na całej
// historii, nie na widocznym zakresie — patrz lib/tracker/stats.ts.
// ============================================================================
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDayLong, formatDayTick, formatHours } from "@/lib/tracker/format";
import {
  METRICS,
  RANGES,
  compareDay,
  direction,
  visibleIndexes,
  type DayComparison,
  type DayPoint,
  type MetricKey,
  type RangeKey,
} from "@/lib/tracker/stats";

interface ChartRow {
  day: string;
  value: number;
  dir: "up" | "down" | "flat";
  cmp: DayComparison;
  note: string | null;
}

const ARROW = { up: "▲", down: "▼", flat: "=" } as const;
const DIR_COLOR = {
  up: "var(--color-accent)",
  down: "var(--color-danger)",
  flat: "var(--color-foreground-muted)",
} as const;
const DIR_TEXT = {
  up: "text-accent",
  down: "text-danger",
  flat: "text-foreground-muted",
} as const;

function formatValue(key: MetricKey, value: number): string {
  if (key === "hours") return formatHours(value);
  if (key === "tasks") return String(Math.round(value));
  return `${value.toLocaleString("pl-PL", { maximumFractionDigits: 2 })} zad./h`;
}

function formatDelta(key: MetricKey, delta: number): string {
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  const abs = Math.abs(delta);
  if (key === "hours") return `${sign}${formatHours(abs)}`;
  if (key === "tasks") return `${sign}${Math.round(abs)}`;
  return `${sign}${abs.toLocaleString("pl-PL", { maximumFractionDigits: 2 })} zad./h`;
}

function formatPct(pct: number | null): string {
  if (pct === null) return "";
  const sign = pct > 0 ? "+" : pct < 0 ? "−" : "";
  return ` (${sign}${Math.abs(pct).toLocaleString("pl-PL", { maximumFractionDigits: 1 })}%)`;
}

function ComparisonLines({ row, metric }: { row: ChartRow; metric: MetricKey }) {
  const { cmp } = row;
  return (
    <div className="flex flex-col gap-0.5 text-xs">
      {cmp.deltaPrev !== null ? (
        <p className={cn("font-medium", DIR_TEXT[row.dir])}>
          {ARROW[row.dir]} {row.dir === "flat" ? "tyle samo co poprzednio" : `${formatDelta(metric, cmp.deltaPrev)}${formatPct(cmp.pctPrev)} vs poprzedni dzień`}
        </p>
      ) : (
        <p className="text-foreground-muted">Pierwszy zapisany dzień</p>
      )}
      {cmp.avgOthers !== null && cmp.pctVsAvg !== null && (
        <p className="text-foreground-muted">
          Średnia pozostałych dni: {formatValue(metric, cmp.avgOthers)}
          {formatPct(cmp.pctVsAvg)}
        </p>
      )}
      {cmp.betterThanPct !== null && (
        <p className="text-foreground-muted">
          Lepiej niż {cmp.betterThanPct}% dni • miejsce {cmp.rank} z {cmp.total}
        </p>
      )}
    </div>
  );
}

function ChartTooltip({ active, payload, metric }: TooltipProps<number, string> & { metric: MetricKey }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as ChartRow;
  return (
    <div className="max-w-60 rounded-(--radius-control) border border-border bg-surface p-3 shadow-(--shadow-card)">
      <p className="text-xs text-foreground-muted">{formatDayLong(row.day)}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground">{formatValue(metric, row.value)}</p>
      <div className="mt-1">
        <ComparisonLines row={row} metric={metric} />
      </div>
      {row.note && <p className="mt-2 line-clamp-3 text-xs italic text-foreground">„{row.note}”</p>}
    </div>
  );
}

export function ProgressChart({ points, today }: { points: DayPoint[]; today: string }) {
  const [metric, setMetric] = useState<MetricKey>("hours");
  const [range, setRange] = useState<RangeKey>("30");

  const rows: ChartRow[] = useMemo(() => {
    const visible = visibleIndexes(points, range, today);
    return visible.map((index) => {
      const cmp = compareDay(points, index, metric);
      return {
        day: points[index].day,
        value: cmp.value,
        dir: direction(cmp.deltaPrev),
        cmp,
        note: points[index].note,
      };
    });
  }, [points, metric, range, today]);

  const latest = rows[rows.length - 1];
  const average = rows.length ? rows.reduce((sum, r) => sum + r.value, 0) / rows.length : 0;
  const best = rows.reduce<ChartRow | null>((top, r) => (!top || r.value > top.value ? r : top), null);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
            {METRICS[metric].label}
            {latest && ` • ${formatDayTick(latest.day)}`}
          </p>
          {latest ? (
            <>
              <p className="mt-0.5 text-3xl font-bold tabular-nums text-foreground">
                {formatValue(metric, latest.value)}
              </p>
              <div className="mt-1">
                <ComparisonLines row={latest} metric={metric} />
              </div>
            </>
          ) : (
            <p className="mt-1 text-sm text-foreground-muted">Brak wpisów w tym zakresie.</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="tablist" aria-label="Metryka" className="flex gap-1">
          {(Object.keys(METRICS) as MetricKey[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={metric === key}
              onClick={() => setMetric(key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                metric === key ? "bg-primary text-primary-foreground" : "bg-surface-muted text-foreground-muted"
              )}
            >
              {METRICS[key].label}
            </button>
          ))}
        </div>
        <div role="tablist" aria-label="Zakres" className="flex gap-1">
          {RANGES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={range === key}
              onClick={() => setRange(key)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                range === key ? "bg-foreground text-surface" : "bg-surface-muted text-foreground-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="h-56 w-full" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                tickFormatter={formatDayTick}
                tick={{ fontSize: 11, fill: "var(--color-foreground-muted)" }}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
              />
              <YAxis
                domain={[0, "auto"]}
                tick={{ fontSize: 11, fill: "var(--color-foreground-muted)" }}
                axisLine={false}
                tickLine={false}
                width={44}
                allowDecimals={metric !== "tasks"}
              />
              <Tooltip
                content={<ChartTooltip metric={metric} />}
                cursor={{ stroke: "var(--color-foreground-muted)", strokeDasharray: "3 3" }}
              />
              {rows.length > 1 && (
                <ReferenceLine
                  y={average}
                  stroke="var(--color-foreground-muted)"
                  strokeDasharray="4 4"
                  label={{ value: "śr.", position: "insideTopRight", fontSize: 10, fill: "var(--color-foreground-muted)" }}
                />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-primary)"
                strokeWidth={2}
                isAnimationActive={false}
                dot={(props) => {
                  const { cx, cy, index, payload } = props as {
                    cx: number;
                    cy: number;
                    index: number;
                    payload: ChartRow;
                  };
                  const isLast = index === rows.length - 1;
                  return (
                    <circle
                      key={payload.day}
                      cx={cx}
                      cy={cy}
                      r={isLast ? 6 : 4}
                      fill={DIR_COLOR[payload.dir]}
                      stroke="var(--color-surface)"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 7, stroke: "var(--color-surface)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      <p className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-foreground-muted">
        <span className="text-accent">▲ lepiej niż poprzedni dzień</span>
        <span className="text-danger">▼ gorzej</span>
        <span>= tyle samo</span>
        <span>┄ średnia z zakresu</span>
      </p>

      {rows.length > 1 && best && (
        <p className="text-xs text-foreground-muted">
          Średnio {formatValue(metric, Math.round(average * 100) / 100)} na dzień • rekord w zakresie:{" "}
          {formatValue(metric, best.value)} ({formatDayTick(best.day)})
        </p>
      )}

      {rows.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-foreground-muted">Pokaż jako tabelę</summary>
          <div className="mt-2 max-h-64 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-foreground-muted">
                <tr>
                  <th className="py-1 pr-2 font-medium">Dzień</th>
                  <th className="py-1 pr-2 font-medium">{METRICS[metric].label}</th>
                  <th className="py-1 font-medium">vs poprzedni</th>
                </tr>
              </thead>
              <tbody>
                {[...rows].reverse().map((row) => (
                  <tr key={row.day} className="border-t border-border/60">
                    <td className="py-1 pr-2">{formatDayTick(row.day)}</td>
                    <td className="py-1 pr-2 tabular-nums">{formatValue(metric, row.value)}</td>
                    <td className={cn("py-1 tabular-nums", DIR_TEXT[row.dir])}>
                      {ARROW[row.dir]}
                      {row.cmp.deltaPrev !== null && row.dir !== "flat" ? ` ${formatDelta(metric, row.cmp.deltaPrev)}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </Card>
  );
}
