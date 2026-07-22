"use client";

// ============================================================================
// components/matma/lesson/solid3d-block.tsx
// A CSS-only rotating solid (three.js is not installed). Every face of every
// Solid3DShape is built from ONE general primitive — faceFromCorners() below
// places a flat width×height div so its three reference corners land exactly
// on three given 3D points (CSS px space: X right, Y down, Z toward viewer),
// via a `matrix3d()` transform. Cuboids get 6 exact rectangular faces;
// cylinders/cones/prisms/pyramids are all built from the same regular-N-gon
// prism/pyramid helpers (a triangular prism is just an N=3 prism, a square
// pyramid an N=4 pyramid, a cylinder/cone a large-N prism/pyramid with round
// caps) — a clean, correctly-proportioned approximation, not a photoreal
// render. Two range sliders spin the whole assembly by setting rotateX/
// rotateY on the outer "stage" div; every face recomputes for free because
// they're nested inside it with `transform-style: preserve-3d`.
// ============================================================================
import { useMemo, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Solid3DShape, Solid3DSpec } from "@/lib/matma/lesson-blocks";

type Vec3 = [number, number, number];

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function length(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2]);
}
function normalize(a: Vec3): Vec3 {
  const n = length(a) || 1;
  return [a[0] / n, a[1] / n, a[2] / n];
}

interface Face {
  key: string;
  width: number;
  height: number;
  matrix3d: string;
  tone: "light" | "mid" | "dark";
  clipPath?: string;
  /** Circular face (cylinder/cone caps, sphere) — rendered via border-radius. */
  roundCap?: boolean;
  /** Hollow decorative circle (sphere equator), border only, no fill. */
  ring?: boolean;
}

/** The one primitive every face is built from: places a flat width×height
 * div so its local (0,0)/(width,0)/(0,height) corners land exactly on
 * p0/p1/p2 in shared 3D scene space. */
function faceFromCorners(p0: Vec3, p1: Vec3, p2: Vec3, tone: Face["tone"], key: string): Face {
  const width = length(sub(p1, p0));
  const height = length(sub(p2, p0));
  const d1 = sub(p1, p0);
  const d2 = sub(p2, p0);
  const ex: Vec3 = width > 0 ? [d1[0] / width, d1[1] / width, d1[2] / width] : [1, 0, 0];
  const ey: Vec3 = height > 0 ? [d2[0] / height, d2[1] / height, d2[2] / height] : [0, 1, 0];
  const ez = normalize(cross(ex, ey));
  const m = [...ex, 0, ...ey, 0, ...ez, 0, ...p0, 1];
  return { key, width, height, matrix3d: `matrix3d(${m.join(",")})`, tone };
}

function ring(sides: number, radius: number, y: number): Vec3[] {
  const verts: Vec3[] = [];
  for (let i = 0; i < sides; i++) {
    const theta = (i / sides) * Math.PI * 2;
    verts.push([radius * Math.cos(theta), y, radius * Math.sin(theta)]);
  }
  return verts;
}

/** Cap facing "up" (outward normal -Y) — used for a prism's top ring. */
function topCapFace(
  verts: Vec3[],
  radius: number,
  y: number,
  tone: Face["tone"],
  key: string,
  round: boolean
): Face {
  const p0: Vec3 = [-radius, y, -radius];
  const p1: Vec3 = [radius, y, -radius];
  const p2: Vec3 = [-radius, y, radius];
  const face = faceFromCorners(p0, p1, p2, tone, key);
  if (round) return { ...face, roundCap: true };
  const clip = verts
    .map((v) => `${(((v[0] - p0[0]) / (2 * radius)) * 100).toFixed(1)}% ${(((v[2] - p0[2]) / (2 * radius)) * 100).toFixed(1)}%`)
    .join(",");
  return { ...face, clipPath: `polygon(${clip})` };
}

/** Cap facing "down" (outward normal +Y) — a prism's bottom ring, or a
 * pyramid/cone's single base ring. */
function bottomCapFace(
  verts: Vec3[],
  radius: number,
  y: number,
  tone: Face["tone"],
  key: string,
  round: boolean
): Face {
  const p0: Vec3 = [-radius, y, -radius];
  const p1: Vec3 = [-radius, y, radius];
  const p2: Vec3 = [radius, y, -radius];
  const face = faceFromCorners(p0, p1, p2, tone, key);
  if (round) return { ...face, roundCap: true };
  const clip = verts
    .map((v) => `${(((v[2] - p0[2]) / (2 * radius)) * 100).toFixed(1)}% ${(((v[0] - p0[0]) / (2 * radius)) * 100).toFixed(1)}%`)
    .join(",");
  return { ...face, clipPath: `polygon(${clip})` };
}

const TRIANGLE_CLIP = "polygon(0% 0%,100% 0%,0% 100%)";

/** Regular N-gon prism: two rings (top at y=-halfH, bottom at y=+halfH)
 * joined by N flat rectangular side panels. N=3 is a triangular prism; a
 * large N with round caps approximates a cylinder. */
function prismFaces(sides: number, radius: number, halfH: number, capShape: "polygon" | "circle"): Face[] {
  const top = ring(sides, radius, -halfH);
  const bottom = ring(sides, radius, halfH);
  const faces: Face[] = [];
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    faces.push(faceFromCorners(top[j], top[i], bottom[j], "mid", `side-${i}`));
  }
  faces.push(topCapFace(top, radius, -halfH, "light", "cap-top", capShape === "circle"));
  faces.push(bottomCapFace(bottom, radius, halfH, "dark", "cap-bottom", capShape === "circle"));
  return faces;
}

/** Regular N-gon pyramid: an apex point at y=-halfH above a single base ring
 * at y=+halfH, joined by N triangular side panels. N=4 is a square pyramid;
 * a large N with a round base approximates a cone. */
function pyramidFaces(sides: number, radius: number, halfH: number, capShape: "polygon" | "circle"): Face[] {
  const apex: Vec3 = [0, -halfH, 0];
  const base = ring(sides, radius, halfH);
  const faces: Face[] = [];
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    faces.push({ ...faceFromCorners(apex, base[i], base[j], "mid", `side-${i}`), clipPath: TRIANGLE_CLIP });
  }
  faces.push(bottomCapFace(base, radius, halfH, "dark", "cap-base", capShape === "circle"));
  return faces;
}

function cuboidFaces(hx: number, hy: number, hz: number): Face[] {
  return [
    faceFromCorners([-hx, -hy, hz], [hx, -hy, hz], [-hx, hy, hz], "light", "front"),
    faceFromCorners([hx, -hy, -hz], [-hx, -hy, -hz], [hx, hy, -hz], "dark", "back"),
    faceFromCorners([hx, -hy, hz], [hx, -hy, -hz], [hx, hy, hz], "mid", "right"),
    faceFromCorners([-hx, -hy, -hz], [-hx, -hy, hz], [-hx, hy, -hz], "mid", "left"),
    faceFromCorners([-hx, -hy, -hz], [hx, -hy, -hz], [-hx, -hy, hz], "light", "top"),
    faceFromCorners([-hx, hy, hz], [hx, hy, hz], [-hx, hy, -hz], "dark", "bottom"),
  ];
}

/** A shaded disc (rotation-invariant silhouette, like a real sphere) plus one
 * decorative equatorial ring that visibly spins with the sliders. */
function sphereFaces(radius: number): Face[] {
  const ball: Face = {
    ...faceFromCorners([-radius, -radius, 0], [radius, -radius, 0], [-radius, radius, 0], "mid", "ball"),
    roundCap: true,
  };
  const equator: Face = {
    ...faceFromCorners([-radius, 0, -radius], [radius, 0, -radius], [-radius, 0, radius], "light", "equator"),
    roundCap: true,
    ring: true,
  };
  return [ball, equator];
}

const TARGET_PX = 104; // the solid's largest extent maps to roughly this many px

function buildSolidFaces(shape: Solid3DShape, dimensions: Record<string, number>): Face[] {
  const values = Object.values(dimensions).filter((v): v is number => typeof v === "number");
  const pick = (key: string, index: number, fallback: number) =>
    typeof dimensions[key] === "number" ? dimensions[key] : (values[index] ?? fallback);

  switch (shape) {
    case "cuboid": {
      const a = pick("a", 0, 3);
      const b = pick("b", 1, 4);
      const c = pick("c", 2, 3);
      const scale = TARGET_PX / (Math.max(a, b, c) || 1);
      return cuboidFaces((a * scale) / 2, (b * scale) / 2, (c * scale) / 2);
    }
    case "cylinder": {
      const r = pick("r", 0, 2);
      const h = pick("h", 1, 4);
      const scale = TARGET_PX / (Math.max(r * 2, h) || 1);
      return prismFaces(28, r * scale, (h * scale) / 2, "circle");
    }
    case "cone": {
      const r = pick("r", 0, 2);
      const h = pick("h", 1, 4);
      const scale = TARGET_PX / (Math.max(r * 2, h) || 1);
      return pyramidFaces(28, r * scale, (h * scale) / 2, "circle");
    }
    case "prism3": {
      const a = pick("a", 0, 3);
      const h = pick("h", 1, 4);
      const circumradius = a / (2 * Math.sin(Math.PI / 3));
      const scale = TARGET_PX / (Math.max(circumradius * 2, h) || 1);
      return prismFaces(3, circumradius * scale, (h * scale) / 2, "polygon");
    }
    case "pyramid4": {
      const a = pick("a", 0, 3);
      const h = pick("h", 1, 4);
      const circumradius = a / (2 * Math.sin(Math.PI / 4));
      const scale = TARGET_PX / (Math.max(circumradius * 2, h) || 1);
      return pyramidFaces(4, circumradius * scale, (h * scale) / 2, "polygon");
    }
    case "sphere": {
      const r = pick("r", 0, 2.5);
      const scale = TARGET_PX / (2 * r || 1);
      return sphereFaces(r * scale);
    }
  }
}

export function Solid3DBlock({
  title,
  caption,
  solid,
}: {
  title?: string;
  caption?: string;
  solid: Solid3DSpec;
}) {
  const [rotateX, setRotateX] = useState(-18);
  const [rotateY, setRotateY] = useState(32);

  const faces = useMemo(
    () => buildSolidFaces(solid.shape, solid.dimensions),
    [solid.shape, solid.dimensions]
  );

  return (
    <Card>
      {title && <CardTitle>{title}</CardTitle>}

      <div className="mt-3 flex justify-center" style={{ perspective: 640 }}>
        <div
          className="relative"
          style={{
            width: 160,
            height: 160,
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        >
          <div className="absolute left-1/2 top-1/2" style={{ transformStyle: "preserve-3d" }}>
            {faces.map((f) => (
              <div
                key={f.key}
                className={cn(
                  "absolute left-0 top-0",
                  f.ring
                    ? "rounded-full border-2 border-primary/60 bg-transparent"
                    : cn(
                        "border border-background/40",
                        f.tone === "light" && "bg-primary/40",
                        f.tone === "mid" && "bg-primary/65",
                        f.tone === "dark" && "bg-primary/85",
                        f.roundCap && "rounded-full"
                      )
                )}
                style={{
                  width: f.width,
                  height: f.height,
                  transform: f.matrix3d,
                  transformOrigin: "0 0",
                  clipPath: f.clipPath,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-muted">
            Obrót poziomy
          </label>
          <input
            type="range"
            min={-180}
            max={180}
            value={rotateY}
            onChange={(e) => setRotateY(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-muted">
            Obrót pionowy
          </label>
          <input
            type="range"
            min={-180}
            max={180}
            value={rotateX}
            onChange={(e) => setRotateX(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {Object.keys(solid.dimensions).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-sm">
          {Object.entries(solid.dimensions).map(([key, value]) => (
            <span key={key} className="text-foreground-muted">
              <span className="font-medium text-foreground">{solid.labels?.[key] ?? key}</span> = {value}
            </span>
          ))}
        </div>
      )}

      {caption && <p className="mt-3 text-sm text-foreground-muted">{caption}</p>}
    </Card>
  );
}
