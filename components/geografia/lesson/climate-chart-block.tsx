"use client";

// ============================================================================
// components/geografia/lesson/climate-chart-block.tsx
// Klimatogram: monthly precipitation as bars + mean monthly temperature as a
// line, on the twin axes Polish textbooks use (mm right, °C left). Reading
// one is a guaranteed matura skill, so this block doubles as an exercise:
// when the author supplies `answer`, the climate type is hidden behind a
// reveal button and the student first has to judge it themselves.
//
// The derived figures a student is always asked for (suma opadów, amplituda
// roczna) are computed by climateSummary() in lib/geografia/lesson-blocks.ts
// and shown ALWAYS — including before the reveal — because the point of the
// exercise is to reason from those numbers, not to recall them.
// ============================================================================
import { useState } from "react";
import { Eye } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/geografia/lesson/rich-text";
import { climateSummary, MONTH_LABELS, type MonthlySeries } from "@/lib/geografia/lesson-blocks";

const W = 320;
const H = 190;
const PAD_L = 26;
const PAD_R = 26;
const PAD_T = 10;
const PAD_B = 26;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

// Fixed temperature axis so klimatogramy from different stations stay
// visually comparable — a Sahara chart and a Siberian one must not silently
// use different scales when a student is asked to contrast them.
const T_MIN = -40;
const T_MAX = 40;

export function ClimateChartBlock({
  title,
  station,
  caption,
  temps,
  precip,
  answer,
}: {
  title?: string;
  station: string;
  caption?: string;
  temps: MonthlySeries;
  precip: MonthlySeries;
  answer?: { climate: string; reasoning: string };
}) {
  const [revealed, setRevealed] = useState(false);
  const summary = climateSummary(temps, precip);

  // Precipitation axis: round the max up to a clean 50 mm step, min 100.
  const precipMax = Math.max(100, Math.ceil(Math.max(...precip) / 50) * 50);
  const barW = PLOT_W / 12;

  const yTemp = (t: number) => PAD_T + PLOT_H - ((t - T_MIN) / (T_MAX - T_MIN)) * PLOT_H;
  const yPrecip = (p: number) => PAD_T + PLOT_H - (p / precipMax) * PLOT_H;

  const linePoints = temps
    .map((t, i) => `${PAD_L + barW * i + barW / 2},${yTemp(t)}`)
    .join(" ");

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <CardTitle>{title ?? `Klimatogram — ${station}`}</CardTitle>
        {caption && <RichText text={caption} className="mt-0.5 text-sm text-foreground-muted" />}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Klimatogram: ${station}`}>
        {/* 0 °C reference — the freezing line students must read off. */}
        <line
          x1={PAD_L}
          x2={W - PAD_R}
          y1={yTemp(0)}
          y2={yTemp(0)}
          className="stroke-border"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        {precip.map((p, i) => {
          const h = PAD_T + PLOT_H - yPrecip(p);
          return (
            <rect
              key={i}
              x={PAD_L + barW * i + barW * 0.15}
              y={yPrecip(p)}
              width={barW * 0.7}
              height={Math.max(0, h)}
              className="fill-blue-500/70"
            />
          );
        })}
        <polyline points={linePoints} fill="none" className="stroke-red-500" strokeWidth={2} strokeLinejoin="round" />
        {temps.map((t, i) => (
          <circle key={i} cx={PAD_L + barW * i + barW / 2} cy={yTemp(t)} r={2} className="fill-red-500" />
        ))}

        {/* Axes */}
        <line x1={PAD_L} x2={PAD_L} y1={PAD_T} y2={PAD_T + PLOT_H} className="stroke-border" />
        <line x1={W - PAD_R} x2={W - PAD_R} y1={PAD_T} y2={PAD_T + PLOT_H} className="stroke-border" />
        <line x1={PAD_L} x2={W - PAD_R} y1={PAD_T + PLOT_H} y2={PAD_T + PLOT_H} className="stroke-border" />

        {[T_MAX, 20, 0, -20, T_MIN].map((t) => (
          <text key={t} x={PAD_L - 3} y={yTemp(t) + 3} textAnchor="end" className="fill-red-500 text-[8px]">
            {t}
          </text>
        ))}
        {[precipMax, precipMax / 2, 0].map((p) => (
          <text key={p} x={W - PAD_R + 3} y={yPrecip(p) + 3} className="fill-blue-500 text-[8px]">
            {p}
          </text>
        ))}
        {MONTH_LABELS.map((m, i) => (
          <text
            key={m}
            x={PAD_L + barW * i + barW / 2}
            y={H - PAD_B + 11}
            textAnchor="middle"
            className="fill-foreground-muted text-[7px]"
          >
            {m}
          </text>
        ))}
        <text x={PAD_L - 3} y={PAD_T - 2} textAnchor="end" className="fill-red-500 text-[8px] font-semibold">
          °C
        </text>
        <text x={W - PAD_R + 3} y={PAD_T - 2} className="fill-blue-500 text-[8px] font-semibold">
          mm
        </text>
      </svg>

      <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <Stat label="Suma opadów" value={`${summary.annualPrecip} mm`} />
        <Stat label="Amplituda roczna" value={`${summary.amplitude} °C`} />
        <Stat label="Śr. temperatura" value={`${summary.meanTemp} °C`} />
        <Stat label="Najzimniejszy m-c" value={`${summary.minTemp} °C`} />
      </div>

      {answer && (
        <div>
          {revealed ? (
            <div className="rounded-(--radius-control) bg-accent-soft px-3 py-2.5">
              <p className="text-sm font-semibold text-accent">{answer.climate}</p>
              <RichText text={answer.reasoning} className="mt-0.5 text-sm text-foreground" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-foreground-muted">
                Zanim sprawdzisz: jaki to klimat? Popatrz na amplitudę, porę roku z maksimum opadów i temperaturę
                najzimniejszego miesiąca.
              </p>
              <Button variant="outline" size="sm" className="self-start" onClick={() => setRevealed(true)}>
                <Eye className="h-4 w-4" />
                Pokaż odpowiedź
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-(--radius-control) bg-surface-muted px-2.5 py-1.5">
      <p className="text-xs text-foreground-muted">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}
