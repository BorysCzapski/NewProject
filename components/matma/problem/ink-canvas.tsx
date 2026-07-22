"use client";

// ============================================================================
// components/matma/problem/ink-canvas.tsx
// The student's own scratchpad, always visible above the graded answer
// fields in ProblemSolver. Pure Pointer Events (works for mouse/touch/pen
// alike) with pressure-sensitive stroke width, an eraser toggle, undo/redo
// (snapshot-per-stroke history) and a clear button. Parent grabs the
// drawing on submit via the exposed `getDataUrl()` imperative handle.
//
// The canvas bitmap is deliberately an OPAQUE white "paper" surface (filled
// on mount/clear), independent of the app's light/dark theme, and the
// eraser paints back over strokes with that same paper color rather than
// using `destination-out` alpha-erasing. This is a deliberate deviation
// from the literal destination-out suggestion in the build spec: the ink
// snapshot can be sent straight to AI vision grading (see
// lib/matma/grading.ts, gradeProblemAttempt's canvasImageDataUrl path),
// which treats it like a scan of a paper worksheet — a transparent PNG
// would risk rendering as a black hole instead of blank paper in some image
// pipelines. Keeping the bitmap always fully opaque avoids that ambiguity
// entirely while still giving a fully working eraser.
// ============================================================================
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Eraser, PenTool, Redo2, Trash2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;
const FALLBACK_STROKE_WIDTH = 2.5;
// Raw canvas pixel colors (not Tailwind/theme classes) — see file header for
// why the scratchpad is a fixed white-paper surface regardless of app theme.
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

function strokeWidthForPressure(pressure: number): number {
  return pressure > 0 ? 1 + pressure * 6 : FALLBACK_STROKE_WIDTH;
}

export const InkCanvas = forwardRef<InkCanvasHandle, { className?: string }>(function InkCanvas(
  { className },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);

  const [isErasing, setIsErasing] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [penDetected, setPenDetected] = useState(false);

  // Blank white "paper" on mount, seeded as the first undo-history snapshot.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = PAPER_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    historyRef.current = [canvas.toDataURL("image/png")];
    historyIndexRef.current = 0;
  }, []);

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

  function commitSnapshot() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const kept = historyRef.current.slice(0, historyIndexRef.current + 1);
    kept.push(dataUrl);
    historyRef.current = kept;
    historyIndexRef.current = kept.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }

  function restoreSnapshot(index: number) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const src = historyRef.current[index];
    if (!src) return;
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    img.src = src;
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (e.pointerType === "pen") setPenDetected(true);

    isDrawingRef.current = true;
    const point = getPoint(e);
    lastPointRef.current = point;

    const width = strokeWidthForPressure(e.pressure);
    ctx.fillStyle = isErasing ? PAPER_COLOR : INK_COLOR;
    ctx.beginPath();
    ctx.arc(point.x, point.y, width / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !lastPointRef.current) return;

    const point = getPoint(e);
    const width = strokeWidthForPressure(e.pressure);
    ctx.strokeStyle = isErasing ? PAPER_COLOR : INK_COLOR;
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
    commitSnapshot();
  }

  function handleUndo() {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    restoreSnapshot(historyIndexRef.current);
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
  }

  function handleRedo() {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    restoreSnapshot(historyIndexRef.current);
    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = PAPER_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    commitSnapshot();
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Brudnopis</p>
          <p className="text-xs text-foreground-muted">
            Twoja własna przestrzeń robocza na obliczenia — osobna od pól z odpowiedzią poniżej. Dołączysz ją do
            oceny AI tylko, jeśli zaznaczysz to przy wysyłce.
          </p>
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

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 rounded-full bg-surface-muted p-1">
          <button
            type="button"
            onClick={() => setIsErasing(false)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              !isErasing ? "bg-primary text-primary-foreground" : "text-foreground-muted"
            )}
          >
            <PenTool className="h-3.5 w-3.5" /> Pisz
          </button>
          <button
            type="button"
            onClick={() => setIsErasing(true)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              isErasing ? "bg-primary text-primary-foreground" : "text-foreground-muted"
            )}
          >
            <Eraser className="h-3.5 w-3.5" /> Gumka
          </button>
        </div>
        <div className="flex gap-1.5">
          <Button type="button" variant="outline" size="icon" disabled={!canUndo} onClick={handleUndo} aria-label="Cofnij">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" disabled={!canRedo} onClick={handleRedo} aria-label="Ponów">
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={handleClear} aria-label="Wyczyść brudnopis">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});
