"use client";

// ============================================================================
// components/matching/matching-game.tsx
// Client-driven "łączenie tłumaczeń" game: tap a foreign word (left column)
// then its Polish translation (right column) to draw a connecting line.
// Once every foreign word is connected the round is scored and saved.
// ============================================================================
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter, unstable_rethrow } from "next/navigation";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { shuffle } from "@/lib/vocabulary/word-utils";
import type { TargetLanguage, UserLevel, VocabularyWord } from "@/lib/types/database";
import { submitMatchingGame } from "@/lib/matching/actions";

interface Connection {
  leftId: string; // pair.id of the chosen foreign word
  rightId: string; // pair.id of the chosen Polish translation
  correct: boolean;
}

interface Line {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  correct: boolean;
}

export function MatchingGame({
  pairs,
  language,
  level,
  category,
}: {
  pairs: VocabularyWord[];
  language: TargetLanguage;
  level: UserLevel;
  category: string | null;
}) {
  const router = useRouter();

  // Each column shuffled independently; stable across renders via lazy init.
  const [leftItems] = useState(() => shuffle(pairs));
  const [rightItems] = useState(() => shuffle(pairs));

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef(new Map<string, HTMLButtonElement>());
  const rightRefs = useRef(new Map<string, HTMLButtonElement>());
  const submittedRef = useRef(false);

  const connectedLeft = new Set(connections.map((c) => c.leftId));
  const connectedRight = new Set(connections.map((c) => c.rightId));
  const done = connections.length === pairs.length;
  const score = connections.filter((c) => c.correct).length;

  function selectLeft(id: string) {
    if (connectedLeft.has(id) || done) return;
    setSelectedLeft((prev) => (prev === id ? null : id));
  }

  function selectRight(id: string) {
    if (!selectedLeft || connectedRight.has(id) || done) return;
    setConnections((prev) => [
      ...prev,
      { leftId: selectedLeft, rightId: id, correct: selectedLeft === id },
    ]);
    setSelectedLeft(null);
  }

  // Redraw the overlay lines whenever the set of connections (or the layout)
  // changes. Coordinates are measured relative to the game container.
  useLayoutEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const base = container.getBoundingClientRect();
      const next: Line[] = [];
      for (const conn of connections) {
        const leftEl = leftRefs.current.get(conn.leftId);
        const rightEl = rightRefs.current.get(conn.rightId);
        if (!leftEl || !rightEl) continue;
        const l = leftEl.getBoundingClientRect();
        const r = rightEl.getBoundingClientRect();
        next.push({
          key: `${conn.leftId}-${conn.rightId}`,
          x1: l.right - base.left,
          y1: l.top + l.height / 2 - base.top,
          x2: r.left - base.left,
          y2: r.top + r.height / 2 - base.top,
          correct: conn.correct,
        });
      }
      setLines(next);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [connections]);

  // Save the round exactly once when every foreign word is connected.
  useEffect(() => {
    if (!done || submittedRef.current) return;
    submittedRef.current = true;
    void (async () => {
      try {
        await submitMatchingGame(language, level, category, score, pairs.length);
      } catch (err) {
        unstable_rethrow(err);
      }
    })();
  }, [done, language, level, category, score, pairs.length]);

  function statusClasses(id: string, side: "left" | "right"): string {
    const conn =
      side === "left"
        ? connections.find((c) => c.leftId === id)
        : connections.find((c) => c.rightId === id);
    if (conn) {
      return conn.correct
        ? "border-accent bg-accent-soft text-accent"
        : "border-danger bg-danger-soft text-danger";
    }
    if (side === "left" && selectedLeft === id) {
      return "border-primary bg-primary-soft text-primary";
    }
    return "border-border bg-surface text-foreground";
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-sm font-medium text-foreground-muted">
        <span>Połącz słowa z tłumaczeniami</span>
        <span>
          {connections.length}/{pairs.length}
        </span>
      </div>

      {done && (
        <Card className="flex flex-col items-center gap-4 py-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Check className="h-8 w-8" />
          </span>
          <div>
            <CardTitle>Ukończono!</CardTitle>
            <CardDescription>
              Wynik: {score}/{pairs.length} poprawnych połączeń
            </CardDescription>
          </div>
          <Button size="lg" onClick={() => router.refresh()} className="w-full">
            <RotateCcw className="h-5 w-5" />
            Zagraj ponownie
          </Button>
        </Card>
      )}

      <div ref={containerRef} className="relative">
        {/* Overlay of connecting lines, drawn above the columns but click-through. */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {lines.map((line) => (
            <line
              key={line.key}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              strokeWidth={2}
              className={line.correct ? "stroke-accent" : "stroke-danger"}
            />
          ))}
        </svg>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            {leftItems.map((pair) => (
              <button
                key={pair.id}
                type="button"
                ref={(el) => {
                  if (el) leftRefs.current.set(pair.id, el);
                  else leftRefs.current.delete(pair.id);
                }}
                onClick={() => selectLeft(pair.id)}
                disabled={connectedLeft.has(pair.id) || done}
                className={cn(
                  "flex min-h-[44px] items-center justify-center rounded-xl border px-3 py-2 text-center text-sm font-medium transition-colors",
                  statusClasses(pair.id, "left")
                )}
              >
                {pair.word_en}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {rightItems.map((pair) => (
              <button
                key={pair.id}
                type="button"
                ref={(el) => {
                  if (el) rightRefs.current.set(pair.id, el);
                  else rightRefs.current.delete(pair.id);
                }}
                onClick={() => selectRight(pair.id)}
                disabled={!selectedLeft || connectedRight.has(pair.id) || done}
                className={cn(
                  "flex min-h-[44px] items-center justify-center rounded-xl border px-3 py-2 text-center text-sm font-medium transition-colors",
                  statusClasses(pair.id, "right")
                )}
              >
                {pair.translation_pl}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
