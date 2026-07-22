"use client";

// ============================================================================
// components/matma/lesson/geometry-block.tsx
// A manipulable SVG figure on a 0-100 viewBox: draggable GeometryPoints
// (pointer-capture based dragging, clamped to the viewBox) redraw the edges
// live and recompute every `measures` entry (area via the shoelace formula,
// perimeter via summed edge distances, distance via Pythagoras, angle via a
// dot-product) straight from the current point positions — no server
// round-trip.
// ============================================================================
import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import type { GeometryMeasure, GeometryPoint, GeometryShape } from "@/lib/matma/lesson-blocks";

function dist(a: GeometryPoint, b: GeometryPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Best-effort ordered polygon vertex list for the shoelace formula, derived
 * by walking `edges` as a chain (edges are authored "in order" per the type
 * comment). Falls back to the raw authored point order if edges don't form a
 * clean walk (e.g. fewer than 3 points, or a non-cyclic edge list). */
function polygonOrder(points: GeometryPoint[], edges: [string, string][]): GeometryPoint[] {
  const byId = new Map(points.map((p) => [p.id, p]));
  if (edges.length < 3) return points;
  const ordered: GeometryPoint[] = [];
  for (let i = 0; i < edges.length; i++) {
    const [from] = edges[i];
    const point = byId.get(from);
    if (!point) return points;
    if (i > 0 && edges[i - 1][1] !== from) return points;
    ordered.push(point);
  }
  return ordered;
}

function shoelaceArea(vertices: GeometryPoint[]): number {
  let sum = 0;
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % vertices.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}

function angleDegrees(at: GeometryPoint, from: GeometryPoint, to: GeometryPoint): number {
  const v1 = { x: from.x - at.x, y: from.y - at.y };
  const v2 = { x: to.x - at.x, y: to.y - at.y };
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);
  if (mag1 === 0 || mag2 === 0) return 0;
  const cos = Math.min(1, Math.max(-1, (v1.x * v2.x + v1.y * v2.y) / (mag1 * mag2)));
  return (Math.acos(cos) * 180) / Math.PI;
}

export function GeometryBlock({
  title,
  caption,
  shape,
}: {
  title?: string;
  caption?: string;
  shape: GeometryShape;
}) {
  const [points, setPoints] = useState<GeometryPoint[]>(shape.points);
  const svgRef = useRef<SVGSVGElement>(null);
  const byId = new Map(points.map((p) => [p.id, p]));
  const vertices = polygonOrder(points, shape.edges);

  function clientToSvg(clientX: number, clientY: number): { x: number; y: number } | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const loc = pt.matrixTransform(ctm.inverse());
    return { x: Math.min(100, Math.max(0, loc.x)), y: Math.min(100, Math.max(0, loc.y)) };
  }

  function movePoint(id: string, clientX: number, clientY: number) {
    const loc = clientToSvg(clientX, clientY);
    if (!loc) return;
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, x: loc.x, y: loc.y } : p)));
  }

  function measureValue(m: GeometryMeasure): number {
    switch (m.kind) {
      case "area":
        return shoelaceArea(vertices);
      case "perimeter":
        return shape.edges.reduce((sum, [a, b]) => {
          const pa = byId.get(a);
          const pb = byId.get(b);
          return pa && pb ? sum + dist(pa, pb) : sum;
        }, 0);
      case "distance": {
        const from = byId.get(m.from);
        const to = byId.get(m.to);
        return from && to ? dist(from, to) : 0;
      }
      case "angle": {
        const at = byId.get(m.at);
        const from = byId.get(m.from);
        const to = byId.get(m.to);
        return at && from && to ? angleDegrees(at, from, to) : 0;
      }
    }
  }

  return (
    <Card>
      {title && <CardTitle>{title}</CardTitle>}
      <div className="mt-2">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="w-full touch-none select-none rounded-(--radius-control) bg-surface-muted"
          style={{ aspectRatio: "1 / 1" }}
        >
          {shape.edges.map(([a, b], i) => {
            const pa = byId.get(a);
            const pb = byId.get(b);
            if (!pa || !pb) return null;
            return (
              <line
                key={i}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                className="stroke-primary"
                strokeWidth={0.8}
              />
            );
          })}
          {points.map((p) => {
            const draggable = p.draggable !== false;
            return (
              <g key={p.id}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={draggable ? 3.2 : 2}
                  className={draggable ? "fill-primary" : "fill-foreground-muted"}
                  style={{ cursor: draggable ? "grab" : "default" }}
                  onPointerDown={(e: ReactPointerEvent<SVGCircleElement>) => {
                    if (!draggable) return;
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e: ReactPointerEvent<SVGCircleElement>) => {
                    if (!draggable || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
                    movePoint(p.id, e.clientX, e.clientY);
                  }}
                />
                <text x={p.x + 3.5} y={p.y - 3} fontSize={4.5} className="fill-foreground">
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-1.5 text-center text-xs text-foreground-muted">
          Przeciągnij zaznaczone punkty, by zobaczyć jak zmieniają się miary.
        </p>
      </div>

      {shape.measures.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
          {shape.measures.map((m, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-foreground-muted">{m.label}</span>
              <span className="font-semibold tabular-nums text-foreground">
                {measureValue(m).toFixed(2)}
                {m.kind === "angle" ? "°" : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {caption && <p className="mt-3 text-sm text-foreground-muted">{caption}</p>}
    </Card>
  );
}
