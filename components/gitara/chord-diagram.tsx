"use client";

// ============================================================================
// components/gitara/chord-diagram.tsx
// The one SVG primitive every chord shape in this app draws through: the
// chord library (/gitara/akordy), the `chord-diagram` and `progression`
// lesson blocks, and the 5 CAGED shapes. One component, so a fret/finger/
// barre bug gets fixed once instead of found four times.
//
// Geometry follows a real chord chart: strings run left (low E) to right
// (high e), frets run top (nut) to bottom. A thick top line means "this is
// the nut, string 0 is open unless marked x"; a fret-number label to the
// left means the shape starts further up the neck (see FrettedChord.baseFret
// in lib/gitara/theory.ts).
// ============================================================================
import { Volume2 } from "lucide-react";
import { chordFrequencies, chordFretSpan, type FrettedChord } from "@/lib/gitara/theory";
import { playChordStrum } from "@/lib/gitara/audio-engine";
import { cn } from "@/lib/utils";

const STRINGS = 6;
const WIDTH = 100;
const LEFT = 16;
const RIGHT = 16;
const TOP = 22;
const FRET_GAP = 20;
const DOT_R = 7;

export function ChordDiagram({
  chord,
  label,
  size = "md",
  showPlay = true,
  className,
}: {
  chord: FrettedChord;
  label?: string;
  size?: "sm" | "md" | "lg";
  showPlay?: boolean;
  className?: string;
}) {
  const rows = Math.max(4, chordFretSpan(chord));
  const height = TOP + rows * FRET_GAP + 6;
  const stringGap = (WIDTH - LEFT - RIGHT) / (STRINGS - 1);
  const stringX = (i: number) => LEFT + i * stringGap;
  const fretY = (row: number) => TOP + row * FRET_GAP;
  const openNut = chord.baseFret === 1;

  const heightClass = { sm: "h-28", md: "h-36", lg: "h-44" }[size];

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        className={cn("w-full max-w-32", heightClass)}
        role="img"
        aria-label={label ? `Diagram akordu ${label}` : "Diagram akordu"}
      >
        {Array.from({ length: rows + 1 }, (_, row) => row)
          .filter((row) => !(row === 0 && openNut))
          .map((row) => (
            <line
              key={row}
              x1={stringX(0)}
              y1={fretY(row)}
              x2={stringX(5)}
              y2={fretY(row)}
              strokeWidth={1}
              className="stroke-border"
            />
          ))}

        {openNut ? (
          <line
            x1={stringX(0)}
            y1={fretY(0)}
            x2={stringX(5)}
            y2={fretY(0)}
            strokeWidth={3}
            className="stroke-foreground"
          />
        ) : (
          <text
            x={LEFT - 6}
            y={fretY(0) + FRET_GAP / 2 + 3}
            textAnchor="end"
            className="fill-foreground-muted text-[9px] font-medium"
          >
            {chord.baseFret}fr
          </text>
        )}

        {Array.from({ length: STRINGS }, (_, i) => (
          <line
            key={i}
            x1={stringX(i)}
            y1={fretY(0)}
            x2={stringX(i)}
            y2={fretY(rows)}
            strokeWidth={1}
            className="stroke-border"
          />
        ))}

        {chord.barre && (
          <rect
            x={stringX(chord.barre.fromString) - DOT_R}
            y={fretY(chord.barre.fret - chord.baseFret) + FRET_GAP / 2 - DOT_R}
            width={stringX(chord.barre.toString) - stringX(chord.barre.fromString) + DOT_R * 2}
            height={DOT_R * 2}
            rx={DOT_R}
            className="fill-primary"
          />
        )}

        {chord.frets.map((fret, i) => {
          if (fret === 0) {
            return (
              <circle
                key={i}
                cx={stringX(i)}
                cy={TOP - 10}
                r={4}
                strokeWidth={1.5}
                className="fill-none stroke-foreground"
              />
            );
          }
          if (fret === null) {
            return (
              <text
                key={i}
                x={stringX(i)}
                y={TOP - 6}
                textAnchor="middle"
                className="fill-foreground-muted text-[10px] font-bold"
              >
                x
              </text>
            );
          }
          return null;
        })}

        {chord.frets.map((fret, i) => {
          if (fret === null || fret === 0) return null;
          const coveredByBarre =
            chord.barre !== undefined &&
            fret === chord.barre.fret &&
            i >= chord.barre.fromString &&
            i <= chord.barre.toString;
          if (coveredByBarre) return null;

          const cy = fretY(fret - chord.baseFret) + FRET_GAP / 2;
          const finger = chord.fingers[i];
          return (
            <g key={i}>
              <circle cx={stringX(i)} cy={cy} r={DOT_R} className="fill-primary" />
              {finger != null && (
                <text
                  x={stringX(i)}
                  y={cy + 3}
                  textAnchor="middle"
                  className="fill-primary-foreground text-[9px] font-bold"
                >
                  {finger}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {label && <span className="text-sm font-semibold text-foreground">{label}</span>}

      {showPlay && (
        <button
          type="button"
          onClick={() => playChordStrum(chordFrequencies(chord))}
          className="flex items-center gap-1 text-xs font-medium text-primary active:opacity-70"
          aria-label={label ? `Odtwórz akord ${label}` : "Odtwórz akord"}
        >
          <Volume2 className="h-3.5 w-3.5" />
          Odtwórz
        </button>
      )}
    </div>
  );
}
