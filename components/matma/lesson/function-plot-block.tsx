"use client";

// ============================================================================
// components/matma/lesson/function-plot-block.tsx
// A live, param-draggable function plot rendered as a hand-rolled SVG path
// (no chart library is installed). `expression` is a tiny JS expression
// string (e.g. "a * Math.sin(b * x + c)") evaluated at ~200 sample points
// across `domain` via the Function constructor — only Math, the declared
// param symbols, and x are ever in scope. Moving a param slider recomputes
// the path purely client-side, no server round-trip.
// ============================================================================
import { useMemo, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import type { FunctionPlotParam } from "@/lib/matma/lesson-blocks";

const SVG_WIDTH = 320;
const SVG_HEIGHT = 220;
const PADDING = 26;
const SAMPLES = 200;

/** Builds `f(x, params) -> number` from the authored expression string. Any
 * runtime error (bad expression, division by zero producing Infinity, etc.)
 * degrades to NaN for that sample rather than throwing — the point just gets
 * skipped when drawing the path. */
function buildEvaluator(
  expression: string,
  paramSymbols: string[]
): (x: number, params: Record<string, number>) => number {
  let fn: (...args: unknown[]) => unknown;
  try {
    // Authored lesson content, tiny math expressions only.
    fn = new Function("x", ...paramSymbols, "Math", `"use strict"; return (${expression});`) as (
      ...args: unknown[]
    ) => unknown;
  } catch {
    fn = () => NaN;
  }
  return (x: number, params: Record<string, number>) => {
    try {
      const args = paramSymbols.map((s) => params[s]);
      const y = fn(x, ...args, Math);
      return typeof y === "number" && Number.isFinite(y) ? y : NaN;
    } catch {
      return NaN;
    }
  };
}

export function FunctionPlotBlock({
  title,
  caption,
  expression,
  params,
  domain,
  range,
}: {
  title?: string;
  caption?: string;
  expression: string;
  params: FunctionPlotParam[];
  domain: [number, number];
  range?: [number, number];
}) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(params.map((p) => [p.symbol, p.default]))
  );

  const paramSymbols = useMemo(() => params.map((p) => p.symbol), [params]);
  const evaluate = useMemo(() => buildEvaluator(expression, paramSymbols), [expression, paramSymbols]);

  const [xMin, xMax] = domain;

  const { points, yMin, yMax } = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    let localMin = Infinity;
    let localMax = -Infinity;
    for (let i = 0; i <= SAMPLES; i++) {
      const x = xMin + ((xMax - xMin) * i) / SAMPLES;
      const y = evaluate(x, values);
      if (Number.isFinite(y)) {
        pts.push({ x, y });
        if (y < localMin) localMin = y;
        if (y > localMax) localMax = y;
      }
    }
    if (!Number.isFinite(localMin) || !Number.isFinite(localMax)) {
      localMin = -1;
      localMax = 1;
    }
    if (localMin === localMax) {
      localMin -= 1;
      localMax += 1;
    }
    return {
      points: pts,
      yMin: range ? range[0] : localMin,
      yMax: range ? range[1] : localMax,
    };
  }, [evaluate, values, xMin, xMax, range]);

  const plotW = SVG_WIDTH - 2 * PADDING;
  const plotH = SVG_HEIGHT - 2 * PADDING;
  const toSvgX = (x: number) => PADDING + ((x - xMin) / (xMax - xMin || 1)) * plotW;
  const toSvgY = (y: number) => SVG_HEIGHT - PADDING - ((y - yMin) / (yMax - yMin || 1)) * plotH;

  const pathD = points
    .map((p, i) => `${i === 0 || !Number.isFinite(points[i - 1]?.y) ? "M" : "L"}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`)
    .join(" ");

  const showXAxis = yMin < 0 && yMax > 0;
  const showYAxis = xMin < 0 && xMax > 0;

  return (
    <Card>
      {title && <CardTitle>{title}</CardTitle>}
      <div className="mt-2 -mx-1 overflow-x-auto">
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full" style={{ minWidth: 260 }}>
          <rect
            x={PADDING}
            y={PADDING}
            width={plotW}
            height={plotH}
            className="fill-none stroke-border"
            strokeWidth={1}
          />
          {showXAxis && (
            <line
              x1={PADDING}
              x2={SVG_WIDTH - PADDING}
              y1={toSvgY(0)}
              y2={toSvgY(0)}
              className="stroke-border"
              strokeWidth={1.5}
            />
          )}
          {showYAxis && (
            <line
              x1={toSvgX(0)}
              x2={toSvgX(0)}
              y1={PADDING}
              y2={SVG_HEIGHT - PADDING}
              className="stroke-border"
              strokeWidth={1.5}
            />
          )}
          {pathD && (
            <path
              d={pathD}
              className="fill-none stroke-primary"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          <text x={PADDING} y={SVG_HEIGHT - 6} fontSize={9} className="fill-foreground-muted">
            {xMin}
          </text>
          <text x={SVG_WIDTH - PADDING} y={SVG_HEIGHT - 6} fontSize={9} textAnchor="end" className="fill-foreground-muted">
            {xMax}
          </text>
          <text x={2} y={PADDING + 9} fontSize={9} className="fill-foreground-muted">
            {yMax.toFixed(1)}
          </text>
          <text x={2} y={SVG_HEIGHT - PADDING} fontSize={9} className="fill-foreground-muted">
            {yMin.toFixed(1)}
          </text>
        </svg>
      </div>

      {params.length > 0 && (
        <div className="mt-3 flex flex-col gap-3">
          {params.map((p) => (
            <div key={p.symbol}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  {p.label} ({p.symbol})
                </span>
                <span className="tabular-nums text-foreground-muted">{values[p.symbol]}</span>
              </div>
              <input
                type="range"
                min={p.min}
                max={p.max}
                step={p.step}
                value={values[p.symbol]}
                onChange={(e) => setValues((v) => ({ ...v, [p.symbol]: Number(e.target.value) }))}
                className="w-full accent-primary"
              />
            </div>
          ))}
        </div>
      )}

      {caption && <p className="mt-3 text-sm text-foreground-muted">{caption}</p>}
    </Card>
  );
}
