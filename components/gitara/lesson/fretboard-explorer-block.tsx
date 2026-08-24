"use client";

// ============================================================================
// components/gitara/lesson/fretboard-explorer-block.tsx
// "Find every X on the neck" — a real note-finding exercise over the actual
// 6×N grid (lib/gitara/theory.ts's noteNameAt), not a canned picture of one.
// Tapping a correct fret plays its real pitch, so the check is both visual
// and audible. Not persisted anywhere: like the in-lesson quiz block, this is
// a comprehension check while reading, not a graded drill.
// ============================================================================
import { useMemo, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/gitara/lesson/rich-text";
import { OPEN_STRING_LABELS, STRING_COUNT, frequencyAt, noteNameAt } from "@/lib/gitara/theory";
import { playNote } from "@/lib/gitara/audio-engine";
import { cn } from "@/lib/utils";

const SINGLE_INLAY_FRETS = new Set([3, 5, 7, 9, 15, 17, 19, 21]);
const DOUBLE_INLAY_FRETS = new Set([12, 24]);

const VIEW_WIDTH = 100;
const MARGIN_LEFT = 8;
const MARGIN_RIGHT = 2;
const TOP = 6;
const NECK_HEIGHT = 42;
const VIEW_HEIGHT = TOP + NECK_HEIGHT + 12;

export function FretboardExplorerBlock({
  title,
  targetNote,
  frets = 12,
  caption,
}: {
  title: string;
  targetNote: string;
  frets?: number;
  caption?: string;
}) {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const totalCorrect = useMemo(() => {
    let count = 0;
    for (let s = 0; s < STRING_COUNT; s++) {
      for (let f = 0; f <= frets; f++) {
        if (noteNameAt(s, f) === targetNote) count++;
      }
    }
    return count;
  }, [frets, targetNote]);

  function handleClick(stringIndex: number, fret: number) {
    const key = `${stringIndex}-${fret}`;
    if (found.has(key)) return;
    if (noteNameAt(stringIndex, fret) === targetNote) {
      setFound((prev) => new Set(prev).add(key));
      playNote(frequencyAt(stringIndex, fret));
    } else {
      setWrong(key);
      setTimeout(() => setWrong((w) => (w === key ? null : w)), 400);
    }
  }

  const fretGap = (VIEW_WIDTH - MARGIN_LEFT - MARGIN_RIGHT) / frets;
  const stringGap = NECK_HEIGHT / (STRING_COUNT - 1);
  const fretX = (f: number) => MARGIN_LEFT + f * fretGap;
  const cellX = (f: number) => (f === 0 ? MARGIN_LEFT - 3 : MARGIN_LEFT + (f - 0.5) * fretGap);
  const stringY = (s: number) => TOP + s * stringGap;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <CardTitle>{title}</CardTitle>
        <span className="shrink-0 text-xs font-medium tabular-nums text-foreground-muted">
          {found.size} / {totalCorrect}
        </span>
      </div>
      <p className="text-sm text-foreground">
        Znajdź na gryfie wszystkie dźwięki <span className="font-semibold text-primary">{targetNote}</span>.
      </p>

      <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="w-full" role="img" aria-label="Gryf gitary">
        {Array.from({ length: frets + 1 }, (_, f) => (
          <line
            key={f}
            x1={fretX(f)}
            y1={TOP}
            x2={fretX(f)}
            y2={TOP + NECK_HEIGHT}
            strokeWidth={f === 0 ? 2 : 0.5}
            className={f === 0 ? "stroke-foreground" : "stroke-border"}
          />
        ))}
        {Array.from({ length: STRING_COUNT }, (_, s) => (
          <line
            key={s}
            x1={MARGIN_LEFT}
            y1={stringY(s)}
            x2={fretX(frets)}
            y2={stringY(s)}
            strokeWidth={0.5}
            className="stroke-border"
          />
        ))}

        {Array.from({ length: frets }, (_, i) => i + 1).map((f) => {
          const cx = MARGIN_LEFT + (f - 0.5) * fretGap;
          const cy = TOP + NECK_HEIGHT + 5;
          if (DOUBLE_INLAY_FRETS.has(f)) {
            return (
              <g key={f}>
                <circle cx={cx} cy={cy - 2} r={1.2} className="fill-border" />
                <circle cx={cx} cy={cy + 2} r={1.2} className="fill-border" />
              </g>
            );
          }
          if (SINGLE_INLAY_FRETS.has(f)) {
            return <circle key={f} cx={cx} cy={cy} r={1.2} className="fill-border" />;
          }
          return null;
        })}

        {Array.from({ length: STRING_COUNT }, (_, s) =>
          Array.from({ length: frets + 1 }, (_, f) => {
            const key = `${s}-${f}`;
            const cx = cellX(f);
            const cy = stringY(s);
            const isFound = found.has(key);
            const isWrong = wrong === key;
            const isRevealed = revealed && !isFound && noteNameAt(s, f) === targetNote;
            return (
              <g key={key}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  className="cursor-pointer fill-transparent"
                  onClick={() => handleClick(s, f)}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={1.8}
                  className={cn(
                    "pointer-events-none transition-colors",
                    isFound && "fill-accent",
                    isWrong && "fill-danger",
                    isRevealed && "fill-primary",
                    !isFound && !isWrong && !isRevealed && "fill-border/60"
                  )}
                />
              </g>
            );
          })
        )}
      </svg>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-foreground-muted">
          Struny od góry: {OPEN_STRING_LABELS.join(" · ")} (1. struna na dole)
        </span>
        <Button size="sm" variant="outline" onClick={() => setRevealed((r) => !r)}>
          {revealed ? "Ukryj" : "Pokaż wszystkie"}
        </Button>
      </div>

      {caption && <RichText text={caption} className="text-xs text-foreground-muted" />}
    </Card>
  );
}
