"use client";

// ============================================================================
// components/maturalnik/ink-canvas.tsx
// Fork of components/matma/problem/ink-canvas.tsx for Maturalnik's "rozwiąż
// na tablecie" scratchpad. Same pointer-events/pressure/undo-redo mechanics,
// but with capabilities Matma's canvas doesn't need: loading a PRIOR drawing
// back in on mount (`initialImageUrl`, a signed URL — Matma's attempts are
// write-once submissions, never reloaded), a debounced `onAutosave` callback
// (Matma only grabs the drawing once, on submit), and a STROKE eraser
// (removes a whole pen stroke in one tap/swipe, not just the pixels directly
// under the cursor — see the "stroke tracking" section below).
//
// Kept as a separate component rather than parameterizing the Matma one: the
// two apps' canvases now diverge in mount behavior and save semantics, and
// forcing one component to serve both would mean threading optional
// load/autosave props through a component whose header comment explicitly
// documents "write-once, never reloaded" as a deliberate Matma design choice.
//
// Stroke tracking: the canvas is still plain raster (no persisted vector
// format — a reloaded prior drawing is just a flattened image), but WITHIN
// one mount we also keep each pen stroke's point path in memory so the
// stroke eraser can hit-test "is this point near stroke N" and erase that
// whole stroke by re-stroking its exact path in paper color (generously
// padded), rather than requiring the student to carefully scrub over every
// pixel. Strokes made in a PREVIOUS session (i.e. baked into a loaded prior
// image) aren't in this list and can only be pixel-erased — same limitation
// as "flattening" ink in any paper/scan-based tool.
// ============================================================================
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Eraser, PenTool, Redo2, Scissors, Trash2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;
const FALLBACK_STROKE_WIDTH = 2.5;
const AUTOSAVE_DEBOUNCE_MS = 2500;
// Extra radius (beyond the stroke's own width) a tap/drag point must be
// within to count as "touching" a stroke for the stroke eraser.
const STROKE_ERASER_HIT_PADDING = 10;
// Raw canvas pixel colors (not Tailwind/theme classes) — the scratchpad is a
// fixed white-paper surface regardless of app theme, same rationale as Matma's.
const PAPER_COLOR = "#ffffff";
const INK_COLOR = "#1e293b";

export interface InkCanvasHandle {
  /** Current scratchpad drawing as a "data:image/png;base64,..." string. */
  getDataUrl: () => string;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  /** Max half-width along the stroke — pressure varies per point, so we take
   * the widest point for a conservative (slightly over-eager) hit test. */
  maxHalfWidth: number;
}

type Tool = "pen" | "pixel-eraser" | "stroke-eraser";

function strokeWidthForPressure(pressure: number): number {
  return pressure > 0 ? 1 + pressure * 6 : FALLBACK_STROKE_WIDTH;
}

/** Shortest distance from point p to the segment ab. */
function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

function distanceToStroke(p: Point, stroke: Stroke): number {
  if (stroke.points.length === 1) return Math.hypot(p.x - stroke.points[0].x, p.y - stroke.points[0].y);
  let min = Infinity;
  for (let i = 1; i < stroke.points.length; i++) {
    min = Math.min(min, distanceToSegment(p, stroke.points[i - 1], stroke.points[i]));
  }
  return min;
}

interface InkCanvasProps {
  className?: string;
  /** Signed URL of a previously-saved drawing to load on mount, instead of a
   * blank page. Null/undefined = start blank. */
  initialImageUrl?: string | null;
  /** Called (debounced ~2.5s after the last stroke, and flushed on
   * unmount/visibility change) with the current drawing, so the caller can
   * persist it without a server round trip per stroke. */
  onAutosave?: (dataUrl: string) => void;
}

export const InkCanvas = forwardRef<InkCanvasHandle, InkCanvasProps>(function InkCanvas(
  { className, initialImageUrl, onAutosave },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const currentStrokePointsRef = useRef<Point[]>([]);
  const currentStrokeMaxHalfWidthRef = useRef(0);
  // Hit-testable strokes from THIS mount only (see file header) — kept in
  // lockstep with historyRef/historyIndexRef so undo/redo restores both the
  // pixels and which strokes the stroke eraser can still find.
  const strokesRef = useRef<Stroke[]>([]);
  const historyRef = useRef<string[]>([]);
  const strokesHistoryRef = useRef<Stroke[][]>([]);
  const historyIndexRef = useRef(-1);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onAutosaveRef = useRef(onAutosave);
  onAutosaveRef.current = onAutosave;

  const [tool, setTool] = useState<Tool>("pen");
  const toolRef = useRef<Tool>("pen");
  toolRef.current = tool;
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [penDetected, setPenDetected] = useState(false);

  // Load a prior drawing if given, otherwise blank white "paper" — either
  // way, seed it as the first undo-history snapshot (with no hit-testable
  // strokes yet, see file header).
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    function seedBlank() {
      ctx!.fillStyle = PAPER_COLOR;
      ctx!.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      historyRef.current = [canvas!.toDataURL("image/png")];
      strokesHistoryRef.current = [[]];
      strokesRef.current = [];
      historyIndexRef.current = 0;
    }

    if (!initialImageUrl) {
      seedBlank();
      return;
    }

    const img = new Image();
    // Supabase Storage signed-URL responses carry permissive CORS, needed so
    // a later toDataURL()/getDataUrl() call doesn't throw on a tainted canvas.
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      historyRef.current = [canvas.toDataURL("image/png")];
      strokesHistoryRef.current = [[]];
      strokesRef.current = [];
      historyIndexRef.current = 0;
    };
    img.onerror = () => {
      console.error("[maturalnik] failed to load saved canvas, starting blank");
      seedBlank();
    };
    img.src = initialImageUrl;
  }, [initialImageUrl]);

  // Flush a pending autosave on unmount so a drawing made just before
  // navigating away isn't lost to the debounce window.
  useEffect(() => {
    const canvas = canvasRef.current;
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
        if (canvas && onAutosaveRef.current) onAutosaveRef.current(canvas.toDataURL("image/png"));
      }
    };
  }, []);

  function scheduleAutosave() {
    if (!onAutosaveRef.current) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas && onAutosaveRef.current) onAutosaveRef.current(canvas.toDataURL("image/png"));
    }, AUTOSAVE_DEBOUNCE_MS);
  }

  useImperativeHandle(
    ref,
    () => ({
      getDataUrl: () => canvasRef.current?.toDataURL("image/png") ?? "",
    }),
    []
  );

  function getPoint(e: ReactPointerEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  /** Commits the current canvas pixels + the given stroke list as one
   * undo-history entry. `nextStrokes` defaults to the live strokesRef (the
   * common case — finishing a pen/pixel-eraser stroke doesn't change which
   * strokes exist); the stroke eraser passes the post-removal list. */
  function commitSnapshot(nextStrokes: Stroke[] = strokesRef.current) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const keptHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    const keptStrokes = strokesHistoryRef.current.slice(0, historyIndexRef.current + 1);
    keptHistory.push(dataUrl);
    keptStrokes.push(nextStrokes);
    historyRef.current = keptHistory;
    strokesHistoryRef.current = keptStrokes;
    strokesRef.current = nextStrokes;
    historyIndexRef.current = keptHistory.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
    scheduleAutosave();
  }

  function restoreSnapshot(index: number) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const src = historyRef.current[index];
    if (!src) return;
    strokesRef.current = strokesHistoryRef.current[index] ?? [];
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    img.src = src;
  }

  /** Erases one whole stroke by re-stroking its exact path in paper color,
   * padded wider than the original ink — NOT a full-canvas redraw, so it
   * composes correctly with any earlier pixel-eraser touch-ups elsewhere on
   * the canvas (a redraw-from-strokes approach would silently undo those). */
  function paintOverStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
    if (stroke.points.length === 0) return;
    ctx.strokeStyle = PAPER_COLOR;
    ctx.fillStyle = PAPER_COLOR;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = stroke.maxHalfWidth * 2 + STROKE_ERASER_HIT_PADDING;
    if (stroke.points.length === 1) {
      ctx.beginPath();
      ctx.arc(stroke.points[0].x, stroke.points[0].y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    ctx.stroke();
  }

  /** Erases every stroke touching `point` (there's usually at most one, but
   * a dense scribble could overlap several) — called on every pointer move
   * while the stroke eraser is active, so one swipe clears a whole line. */
  function eraseStrokesAt(point: Point) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return false;

    const hit = strokesRef.current.filter(
      (s) => distanceToStroke(point, s) <= s.maxHalfWidth + STROKE_ERASER_HIT_PADDING
    );
    if (hit.length === 0) return false;
    for (const stroke of hit) paintOverStroke(ctx, stroke);
    strokesRef.current = strokesRef.current.filter((s) => !hit.includes(s));
    return true;
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (e.pointerType === "pen") setPenDetected(true);

    isDrawingRef.current = true;
    const point = getPoint(e);
    lastPointRef.current = point;

    if (toolRef.current === "stroke-eraser") {
      eraseStrokesAt(point);
      return;
    }

    const width = strokeWidthForPressure(e.pressure);
    currentStrokePointsRef.current = [point];
    currentStrokeMaxHalfWidthRef.current = width / 2;

    ctx.fillStyle = toolRef.current === "pixel-eraser" ? PAPER_COLOR : INK_COLOR;
    ctx.beginPath();
    ctx.arc(point.x, point.y, width / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const point = getPoint(e);

    if (toolRef.current === "stroke-eraser") {
      eraseStrokesAt(point);
      lastPointRef.current = point;
      return;
    }

    if (!lastPointRef.current) return;
    const width = strokeWidthForPressure(e.pressure);
    currentStrokePointsRef.current.push(point);
    currentStrokeMaxHalfWidthRef.current = Math.max(currentStrokeMaxHalfWidthRef.current, width / 2);

    ctx.strokeStyle = toolRef.current === "pixel-eraser" ? PAPER_COLOR : INK_COLOR;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function endStroke() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;

    if (toolRef.current === "stroke-eraser") {
      commitSnapshot(strokesRef.current);
      return;
    }

    // Only real ink becomes a hit-testable stroke — a pixel-erase drag isn't
    // "a stroke" the stroke eraser should ever find and re-erase.
    const nextStrokes =
      toolRef.current === "pen" && currentStrokePointsRef.current.length > 0
        ? [
            ...strokesRef.current,
            { points: currentStrokePointsRef.current, maxHalfWidth: currentStrokeMaxHalfWidthRef.current },
          ]
        : strokesRef.current;
    currentStrokePointsRef.current = [];
    commitSnapshot(nextStrokes);
  }

  function handleUndo() {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    restoreSnapshot(historyIndexRef.current);
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
    scheduleAutosave();
  }

  function handleRedo() {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    restoreSnapshot(historyIndexRef.current);
    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    scheduleAutosave();
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = PAPER_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    commitSnapshot([]);
  }

  const TOOLS: { id: Tool; label: string; icon: typeof PenTool }[] = [
    { id: "pen", label: "Pisz", icon: PenTool },
    { id: "pixel-eraser", label: "Gumka", icon: Eraser },
    { id: "stroke-eraser", label: "Kreska", icon: Scissors },
  ];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Twoje rozwiązanie</p>
          <p className="text-xs text-foreground-muted">Rysuj rysikiem albo palcem — zapisuje się automatycznie.</p>
        </div>
        {penDetected && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-muted px-2 py-1 text-[10px] font-medium text-foreground-muted">
            <PenTool className="h-3 w-3" /> Rysik
          </span>
        )}
      </div>

      <div
        className="overflow-hidden rounded-(--radius-card) border border-border"
        style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="h-full w-full touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endStroke}
          onPointerLeave={endStroke}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 rounded-full bg-surface-muted p-1">
          {TOOLS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTool(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                tool === id ? "bg-primary text-primary-foreground" : "text-foreground-muted"
              )}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <Button type="button" variant="outline" size="icon" disabled={!canUndo} onClick={handleUndo} aria-label="Cofnij">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" disabled={!canRedo} onClick={handleRedo} aria-label="Ponów">
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={handleClear} aria-label="Wyczyść">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});
