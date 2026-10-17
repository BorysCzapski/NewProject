"use client";

// ============================================================================
// components/ink/ink-canvas.tsx
// Shared (Maturalnik, Informatyka) "rozwiąż na tablecie" scratchpad: a large fixed-size page
// (PAGE_WIDTH × PAGE_HEIGHT) shown through a zoomable, pannable viewport.
//
// - Drawing: Pointer Events (mouse / touch / pen), pressure-sensitive for pens.
// - Navigation: wheel pans, Ctrl/⌘+wheel (and trackpad pinch) zooms at the
//   cursor, two fingers pan + pinch-zoom, and the "Przesuń" tool pans with one
//   pointer. The +/− buttons and "Dopasuj" cover mouse-only setups.
// - Tools: pen, pixel eraser, STROKE eraser (removes a whole pen stroke in one
//   tap/swipe), hand.
// - Persistence: loads a prior drawing on mount (`initialImageUrl`), calls a
//   debounced `onAutosave`. Undo history is kept as async-encoded PNG blobs so
//   finishing a stroke on this large bitmap never blocks the UI thread.
//
// Stroke tracking: the bitmap is plain raster (no persisted vector format —
// a reloaded drawing is just a flattened image), but within one mount we keep
// every pen stroke's path so the stroke eraser can hit-test "is this point
// near stroke N" and erase that whole stroke by re-stroking its exact path in
// paper color. Strokes from a PREVIOUS session are baked into the loaded image
// and can only be pixel-erased or cleared — same as flattening ink on paper.
// ============================================================================
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Eraser,
  Hand,
  Maximize2,
  PenTool,
  Redo2,
  Scissors,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PAGE_WIDTH = 1200;
const PAGE_HEIGHT = 1800;
// Drawings saved before the page was enlarged are 600×450 — drawn back in at
// 2× so they keep their proportions instead of being stretched to the new page.
const LEGACY_WIDTH = 600;
const MAX_SCALE = 4;
const MAX_HISTORY = 50;
const AUTOSAVE_DEBOUNCE_MS = 2500;
const DEFAULT_STROKE_WIDTH = 4;
const PIXEL_ERASER_WIDTH = 28;
// Extra radius (beyond the stroke's own width) a tap/swipe must be within to
// count as touching a stroke for the stroke eraser.
const STROKE_ERASER_HIT_PADDING = 14;
// Raw canvas pixel colors (not Tailwind/theme classes) — the page is a fixed
// white-paper surface regardless of app theme.
const PAPER_COLOR = "#ffffff";
const INK_COLOR = "#1e293b";

export interface InkCanvasHandle {
  /** Current drawing as a "data:image/png;base64,..." string. */
  getDataUrl: () => string;
}

interface Point {
  x: number;
  y: number;
}

interface View {
  scale: number;
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  /** Widest half-width along the stroke — pressure varies per point, so we
   * take the max for a conservative (slightly over-eager) hit test. */
  maxHalfWidth: number;
}

type Tool = "pen" | "pixel-eraser" | "stroke-eraser" | "hand";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Keeps the page reachable: centered when smaller than the viewport on an
 * axis, otherwise not allowed to scroll past its edges. */
function clampView(view: View, viewportWidth: number, viewportHeight: number): View {
  const minScale = Math.min(viewportWidth / PAGE_WIDTH, viewportHeight / PAGE_HEIGHT);
  const scale = clamp(view.scale, minScale, MAX_SCALE);
  const scaledWidth = PAGE_WIDTH * scale;
  const scaledHeight = PAGE_HEIGHT * scale;
  return {
    scale,
    x: scaledWidth <= viewportWidth ? (viewportWidth - scaledWidth) / 2 : clamp(view.x, viewportWidth - scaledWidth, 0),
    y: scaledHeight <= viewportHeight ? (viewportHeight - scaledHeight) / 2 : clamp(view.y, viewportHeight - scaledHeight, 0),
  };
}

/** Zooms by `factor` keeping the page point under (cx, cy) fixed on screen. */
function zoomedView(view: View, factor: number, cx: number, cy: number): View {
  const scale = clamp(view.scale * factor, 0.01, MAX_SCALE);
  const pageX = (cx - view.x) / view.scale;
  const pageY = (cy - view.y) / view.scale;
  return { scale, x: cx - pageX * scale, y: cy - pageY * scale };
}

function strokeWidthFor(e: ReactPointerEvent): number {
  return e.pointerType === "pen" && e.pressure > 0 ? 2 + e.pressure * 8 : DEFAULT_STROKE_WIDTH;
}

/** Shortest distance from point p to the segment ab. */
function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared, 0, 1);
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
   * blank page. Read once — later changes of the prop are ignored, because a
   * parent re-render hands out a fresh signed URL and reloading from the last
   * saved copy would silently discard whatever was drawn since. */
  initialImageUrl?: string | null;
  /** Called (debounced ~2.5s after the last change, and flushed on unmount)
   * with the current drawing, so the caller can persist it without a server
   * round trip per stroke. */
  onAutosave?: (dataUrl: string) => void;
}

export const InkCanvas = forwardRef<InkCanvasHandle, InkCanvasProps>(function InkCanvas(
  { className, initialImageUrl, onAutosave },
  ref
) {
  const [initialUrl] = useState(initialImageUrl);

  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportSizeRef = useRef({ width: 0, height: 0 });
  const viewRef = useRef<View>({ scale: 1, x: 0, y: 0 });
  const userMovedViewRef = useRef(false);
  const readyRef = useRef(false);

  const pointersRef = useRef(new Map<number, Point>());
  const gestureRef = useRef<{ distance: number; midX: number; midY: number; view: View } | null>(null);
  const panRef = useRef<{ clientX: number; clientY: number; view: View } | null>(null);
  const drawingPointerIdRef = useRef<number | null>(null);
  const lastPointRef = useRef<Point | null>(null);
  const currentStrokePointsRef = useRef<Point[]>([]);
  const currentStrokeMaxHalfWidthRef = useRef(0);

  // Hit-testable strokes from THIS mount only (see file header) — kept in
  // lockstep with the history so undo/redo restores both pixels and strokes.
  const strokesRef = useRef<Stroke[]>([]);
  const historyRef = useRef<Promise<Blob>[]>([]);
  const strokesHistoryRef = useRef<Stroke[][]>([]);
  const historyIndexRef = useRef(-1);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onAutosaveRef = useRef(onAutosave);
  onAutosaveRef.current = onAutosave;

  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const [fitScale, setFitScale] = useState(1);
  const [tool, setTool] = useState<Tool>("pen");
  const toolRef = useRef<Tool>("pen");
  toolRef.current = tool;
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [penDetected, setPenDetected] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  function applyView(next: View) {
    const { width, height } = viewportSizeRef.current;
    const clamped = width > 0 ? clampView(next, width, height) : next;
    viewRef.current = clamped;
    setView(clamped);
  }

  function fitToWidth() {
    const { width } = viewportSizeRef.current;
    if (width <= 0) return;
    userMovedViewRef.current = false;
    applyView({ scale: width / PAGE_WIDTH, x: 0, y: 0 });
  }

  // Track the viewport's size: refit while the student hasn't navigated yet,
  // otherwise just keep their view inside the page bounds.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    function measure() {
      const rect = viewport!.getBoundingClientRect();
      viewportSizeRef.current = { width: rect.width, height: rect.height };
      setFitScale(rect.width / PAGE_WIDTH);
      if (userMovedViewRef.current) applyView(viewRef.current);
      else applyView({ scale: rect.width / PAGE_WIDTH, x: 0, y: 0 });
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  // Wheel needs a native non-passive listener to be able to preventDefault.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    function onWheel(e: WheelEvent) {
      const rect = viewport!.getBoundingClientRect();
      const previous = viewRef.current;
      const zooming = e.ctrlKey || e.metaKey;
      const next = zooming
        ? zoomedView(previous, Math.exp(-e.deltaY * 0.01), e.clientX - rect.left, e.clientY - rect.top)
        : { ...previous, x: previous.x - e.deltaX, y: previous.y - e.deltaY };
      const { width, height } = viewportSizeRef.current;
      const clamped = clampView(next, width, height);
      const unchanged =
        clamped.scale === previous.scale && clamped.x === previous.x && clamped.y === previous.y;
      // Browser page-zoom must never fire over the canvas; plain scrolling
      // only gets captured while the page can still move, so the rest of the
      // screen stays scrollable once the canvas hits its edge.
      if (zooming || !unchanged) e.preventDefault();
      if (unchanged) return;
      userMovedViewRef.current = true;
      viewRef.current = clamped;
      setView(clamped);
    }
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, []);

  function snapshot(): Promise<Blob> {
    const canvas = canvasRef.current;
    return new Promise((resolve) => {
      if (!canvas) return resolve(new Blob());
      canvas.toBlob((blob) => resolve(blob ?? new Blob()), "image/png");
    });
  }

  function resetHistory() {
    historyRef.current = [snapshot()];
    strokesHistoryRef.current = [[]];
    strokesRef.current = [];
    historyIndexRef.current = 0;
    setCanUndo(false);
    setCanRedo(false);
  }

  // Load a prior drawing if given, otherwise a blank white page — either way
  // seeded as the first undo entry. Drawing is disabled until this finishes,
  // otherwise a late-arriving image would paint over fresh ink.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    function paintBlank() {
      ctx!.fillStyle = PAPER_COLOR;
      ctx!.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    }
    function finish() {
      resetHistory();
      readyRef.current = true;
    }

    paintBlank();
    if (!initialUrl) {
      finish();
      return;
    }

    const img = new Image();
    // Supabase Storage signed-URL responses carry permissive CORS, needed so
    // a later toBlob()/toDataURL() doesn't throw on a tainted canvas.
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const factor = img.naturalWidth === LEGACY_WIDTH ? 2 : 1;
      ctx.drawImage(img, 0, 0, img.naturalWidth * factor, img.naturalHeight * factor);
      finish();
    };
    img.onerror = () => {
      console.error("[maturalnik] failed to load saved canvas, starting blank");
      finish();
    };
    img.src = initialUrl;
    // resetHistory only touches refs and state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

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
      autosaveTimerRef.current = null;
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

  /** Client coordinates → page (bitmap) coordinates, through whatever zoom/pan
   * transform the canvas element currently has. */
  function getPagePoint(clientX: number, clientY: number): Point {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * PAGE_WIDTH,
      y: ((clientY - rect.top) / rect.height) * PAGE_HEIGHT,
    };
  }

  /** Commits the current pixels + the given stroke list as one undo entry.
   * `nextStrokes` defaults to the live list (finishing a pen/pixel-eraser
   * stroke doesn't change which strokes exist); the stroke eraser passes the
   * post-removal list. */
  function commitSnapshot(nextStrokes: Stroke[] = strokesRef.current) {
    const history = historyRef.current.slice(0, historyIndexRef.current + 1);
    const strokesHistory = strokesHistoryRef.current.slice(0, historyIndexRef.current + 1);
    history.push(snapshot());
    strokesHistory.push(nextStrokes);
    while (history.length > MAX_HISTORY) {
      history.shift();
      strokesHistory.shift();
    }
    historyRef.current = history;
    strokesHistoryRef.current = strokesHistory;
    strokesRef.current = nextStrokes;
    historyIndexRef.current = history.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
    scheduleAutosave();
  }

  function restoreSnapshot(index: number) {
    const ctx = canvasRef.current?.getContext("2d");
    const entry = historyRef.current[index];
    if (!ctx || !entry) return;
    strokesRef.current = strokesHistoryRef.current[index] ?? [];
    entry
      .then((blob) => createImageBitmap(blob))
      .then((bitmap) => {
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
      })
      .catch((err) => console.error("[maturalnik] failed to restore canvas snapshot:", err));
  }

  /** Erases one whole stroke by re-stroking its exact path in paper color,
   * padded wider than the original ink — NOT a full-canvas redraw, so it
   * composes correctly with earlier pixel-eraser touch-ups elsewhere (a
   * redraw-from-strokes approach would silently undo those). */
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

  /** Erases every stroke touching `point` — called on every move while the
   * stroke eraser is active, so one swipe clears a whole line (or several). */
  function eraseStrokesAt(point: Point) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const hit = strokesRef.current.filter(
      (s) => distanceToStroke(point, s) <= s.maxHalfWidth + STROKE_ERASER_HIT_PADDING
    );
    if (hit.length === 0) return;
    for (const stroke of hit) paintOverStroke(ctx, stroke);
    strokesRef.current = strokesRef.current.filter((s) => !hit.includes(s));
  }

  function beginInteraction(e: ReactPointerEvent<HTMLDivElement>) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !readyRef.current) return;

    drawingPointerIdRef.current = e.pointerId;
    const point = getPagePoint(e.clientX, e.clientY);
    lastPointRef.current = point;

    if (toolRef.current === "stroke-eraser") {
      eraseStrokesAt(point);
      return;
    }

    const isPixelEraser = toolRef.current === "pixel-eraser";
    const width = isPixelEraser ? PIXEL_ERASER_WIDTH : strokeWidthFor(e);
    currentStrokePointsRef.current = [point];
    currentStrokeMaxHalfWidthRef.current = width / 2;

    ctx.fillStyle = isPixelEraser ? PAPER_COLOR : INK_COLOR;
    ctx.beginPath();
    ctx.arc(point.x, point.y, width / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function continueInteraction(e: ReactPointerEvent<HTMLDivElement>) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const point = getPagePoint(e.clientX, e.clientY);

    if (toolRef.current === "stroke-eraser") {
      eraseStrokesAt(point);
      lastPointRef.current = point;
      return;
    }

    const last = lastPointRef.current;
    if (!last) return;
    const isPixelEraser = toolRef.current === "pixel-eraser";
    const width = isPixelEraser ? PIXEL_ERASER_WIDTH : strokeWidthFor(e);
    currentStrokePointsRef.current.push(point);
    currentStrokeMaxHalfWidthRef.current = Math.max(currentStrokeMaxHalfWidthRef.current, width / 2);

    ctx.strokeStyle = isPixelEraser ? PAPER_COLOR : INK_COLOR;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function finishInteraction() {
    if (drawingPointerIdRef.current === null) return;
    drawingPointerIdRef.current = null;
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

  /** A second finger landed mid-stroke: that stroke was the start of a
   * pinch/pan, not ink — drop it by restoring the last committed state. */
  function cancelInteraction() {
    if (drawingPointerIdRef.current === null) return;
    drawingPointerIdRef.current = null;
    lastPointRef.current = null;
    currentStrokePointsRef.current = [];
    restoreSnapshot(historyIndexRef.current);
  }

  function startGesture() {
    const viewport = viewportRef.current;
    const [a, b] = [...pointersRef.current.values()];
    if (!viewport || !a || !b) return;
    const rect = viewport.getBoundingClientRect();
    gestureRef.current = {
      distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
      midX: (a.x + b.x) / 2 - rect.left,
      midY: (a.y + b.y) / 2 - rect.top,
      view: { ...viewRef.current },
    };
  }

  function updateGesture() {
    const viewport = viewportRef.current;
    const gesture = gestureRef.current;
    const [a, b] = [...pointersRef.current.values()];
    if (!viewport || !gesture || !a || !b) return;
    const rect = viewport.getBoundingClientRect();
    const distance = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
    const midX = (a.x + b.x) / 2 - rect.left;
    const midY = (a.y + b.y) / 2 - rect.top;
    // Zoom around where the fingers started, then shift by how far their
    // midpoint travelled — pinch and two-finger drag in one motion.
    const zoomed = zoomedView(gesture.view, distance / gesture.distance, gesture.midX, gesture.midY);
    userMovedViewRef.current = true;
    applyView({ ...zoomed, x: zoomed.x + (midX - gesture.midX), y: zoomed.y + (midY - gesture.midY) });
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (e.pointerType === "pen") setPenDetected(true);

    if (pointersRef.current.size >= 2) {
      cancelInteraction();
      panRef.current = null;
      startGesture();
      return;
    }

    const middleMouse = e.pointerType === "mouse" && e.button === 1;
    if (middleMouse || toolRef.current === "hand") {
      e.preventDefault();
      panRef.current = { clientX: e.clientX, clientY: e.clientY, view: { ...viewRef.current } };
      return;
    }
    if (e.pointerType === "mouse" && e.button !== 0) return;
    beginInteraction(e);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (gestureRef.current && pointersRef.current.size >= 2) {
      updateGesture();
      return;
    }
    const pan = panRef.current;
    if (pan) {
      userMovedViewRef.current = true;
      applyView({ ...pan.view, x: pan.view.x + (e.clientX - pan.clientX), y: pan.view.y + (e.clientY - pan.clientY) });
      return;
    }
    if (drawingPointerIdRef.current === e.pointerId) continueInteraction(e);
  }

  function handlePointerEnd(e: ReactPointerEvent<HTMLDivElement>) {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) gestureRef.current = null;
    if (pointersRef.current.size === 0) panRef.current = null;
    if (drawingPointerIdRef.current === e.pointerId) finishInteraction();
  }

  function zoomByButton(factor: number) {
    const { width, height } = viewportSizeRef.current;
    userMovedViewRef.current = true;
    applyView(zoomedView(viewRef.current, factor, width / 2, height / 2));
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
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !readyRef.current) return;
    ctx.fillStyle = PAPER_COLOR;
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    commitSnapshot([]);
    setConfirmingClear(false);
  }

  const TOOLS: { id: Tool; label: string; icon: typeof PenTool }[] = [
    { id: "pen", label: "Pisz", icon: PenTool },
    { id: "pixel-eraser", label: "Gumka", icon: Eraser },
    { id: "stroke-eraser", label: "Kreska", icon: Scissors },
    { id: "hand", label: "Przesuń", icon: Hand },
  ];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Twoje rozwiązanie</p>
          <p className="text-xs text-foreground-muted">
            Zapisuje się automatycznie. Kółko myszy przesuwa kartkę, Ctrl + kółko albo dwa palce przybliżają.
          </p>
        </div>
        {penDetected && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-muted px-2 py-1 text-[10px] font-medium text-foreground-muted">
            <PenTool className="h-3 w-3" /> Rysik
          </span>
        )}
      </div>

      <div
        ref={viewportRef}
        className={cn(
          "relative h-[60vh] min-h-[360px] w-full touch-none select-none overflow-hidden rounded-(--radius-card) border border-border bg-surface-muted lg:h-[78vh]",
          tool === "hand" ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair"
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <canvas
          ref={canvasRef}
          width={PAGE_WIDTH}
          height={PAGE_HEIGHT}
          className="absolute left-0 top-0 shadow-(--shadow-card)"
          style={{
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            transformOrigin: "0 0",
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          }}
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

        <div className="flex items-center gap-1.5">
          <Button type="button" variant="outline" size="icon" onClick={() => zoomByButton(1 / 1.25)} aria-label="Oddal">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-xs tabular-nums text-foreground-muted">
            {Math.round((view.scale / fitScale) * 100)}%
          </span>
          <Button type="button" variant="outline" size="icon" onClick={() => zoomByButton(1.25)} aria-label="Przybliż">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={fitToWidth} aria-label="Dopasuj do szerokości">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <Button type="button" variant="outline" size="icon" disabled={!canUndo} onClick={handleUndo} aria-label="Cofnij">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" disabled={!canRedo} onClick={handleRedo} aria-label="Ponów">
            <Redo2 className="h-4 w-4" />
          </Button>
          {confirmingClear ? (
            <>
              <Button type="button" variant="danger" size="sm" onClick={handleClear}>
                Wyczyść wszystko
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setConfirmingClear(false)}>
                Anuluj
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" size="sm" onClick={() => setConfirmingClear(true)}>
              <Trash2 className="h-4 w-4" /> Wyczyść
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
