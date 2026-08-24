"use client";

// ============================================================================
// components/algorytmy/lesson/stepper.tsx
// Shared shell for every interactive block: frame counter, prev/next, play,
// reset, and the caption line describing what the current frame is doing.
//
// Each visualiser computes its frames ONCE, up front, by actually running the
// algorithm (see e.g. sorting-block.tsx). The stepper then only walks an
// array. That split is what makes the blocks honest: nothing here can drift
// from the algorithm being taught, because there is no separate animation
// script to drift.
// ============================================================================
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/algorytmy/lesson/rich-text";
import { cn } from "@/lib/utils";

/** One rendered step of an algorithm: what to draw plus what is happening. */
export interface Frame<T> {
  state: T;
  /** One line of Polish describing this step. Shown under the visual. */
  note: string;
}

const FRAME_MS = 900;

export function Stepper<T>({
  title,
  frames,
  caption,
  render,
}: {
  title: string;
  frames: Frame<T>[];
  caption?: string;
  render: (state: T, index: number) => ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const last = Math.max(frames.length - 1, 0);
  const atEnd = index >= last;
  // Reaching the last frame stops playback by DERIVING it, rather than having
  // the effect clear `playing` — an effect that calls setState schedules an
  // extra render pass for something the render already knows.
  const isPlaying = playing && !atEnd;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => setIndex((i) => Math.min(i + 1, last)), FRAME_MS);
    return () => clearTimeout(timer);
  }, [isPlaying, index, last]);

  const current = frames[Math.min(index, last)];
  const progress = useMemo(() => (last === 0 ? 100 : (index / last) * 100), [index, last]);

  if (frames.length === 0) return null;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <CardTitle>{title}</CardTitle>
        <span className="shrink-0 text-xs tabular-nums text-foreground-muted">
          krok {index + 1} / {frames.length}
        </span>
      </div>

      <div className="min-h-[8rem]">{render(current.state, index)}</div>

      <p className="min-h-[2.5rem] rounded-(--radius-control) bg-surface-muted px-3 py-2 text-sm text-foreground">
        {current.note}
      </p>

      <div className="h-1 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-2">
        <StepperButton
          label="Poprzedni krok"
          onClick={() => {
            setPlaying(false);
            setIndex((i) => Math.max(i - 1, 0));
          }}
          disabled={index === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </StepperButton>

        <StepperButton
          label={isPlaying ? "Zatrzymaj" : "Odtwórz"}
          onClick={() => {
            // At the end, Play means "replay from the start" rather than
            // toggling a playback that has nowhere left to go.
            if (atEnd) {
              setIndex(0);
              setPlaying(true);
              return;
            }
            setPlaying((p) => !p);
          }}
          variant="primary"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </StepperButton>

        <StepperButton
          label="Następny krok"
          onClick={() => {
            setPlaying(false);
            setIndex((i) => Math.min(i + 1, last));
          }}
          disabled={atEnd}
        >
          <ChevronRight className="h-4 w-4" />
        </StepperButton>

        <StepperButton
          label="Od początku"
          onClick={() => {
            setPlaying(false);
            setIndex(0);
          }}
          disabled={index === 0}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </StepperButton>
      </div>

      {caption && <RichText text={caption} className="text-xs text-foreground-muted" />}
    </Card>
  );
}

function StepperButton({
  children,
  label,
  onClick,
  disabled,
  variant = "ghost",
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "ghost" | "primary";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full transition-opacity disabled:opacity-35",
        variant === "primary"
          ? "bg-primary text-primary-foreground active:opacity-80"
          : "bg-surface-muted text-foreground active:opacity-70"
      )}
    >
      {children}
    </button>
  );
}
