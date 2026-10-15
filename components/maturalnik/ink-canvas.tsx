"use client";

// ============================================================================
// components/maturalnik/ink-canvas.tsx
// Fork of components/matma/problem/ink-canvas.tsx for Maturalnik's "rozwiąż
// na tablecie" scratchpad. Same pointer-events/pressure/undo-redo mechanics,
// but with two capabilities Matma's canvas doesn't need: loading a PRIOR
// drawing back in on mount (`initialImageUrl`, a signed URL — Matma's
// attempts are write-once submissions, never reloaded), and a debounced
// `onAutosave` callback (Matma only grabs the drawing once, on submit).
//
// Kept as a separate component rather than parameterizing the Matma one: the
// two apps' canvases now diverge in mount behavior and save semantics, and
// forcing one component to serve both would mean threading optional
// load/autosave props through a component whose header comment explicitly
// documents "write-once, never reloaded" as a deliberate Matma design choice.
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
const AUTOSAVE_DEBOUNCE_MS = 2500;
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

function strokeWidthForPressure(pressure: number): number {
  return pressure > 0 ? 1 + pressure * 6 : FALLBACK_STROKE_WIDTH;
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
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onAutosaveRef = useRef(onAutosave);
  onAutosaveRef.current = onAutosave;

  const [isErasing, setIsErasing] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [penDetected, setPenDetected] = useState(false);

  // Load a prior drawing if given, otherwise blank white "paper" — either
  // way, seed it as the first undo-history snapshot.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    function seedBlank() {
      ctx!.fillStyle = PAPER_COLOR;
      ctx!.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      historyRef.current = [canvas!.toDataURL("image/png")];
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
    scheduleAutosave();
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
    commitSnapshot();
  }

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
          <Button type="button" variant="outline" size="icon" onClick={handleClear} aria-label="Wyczyść">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});
