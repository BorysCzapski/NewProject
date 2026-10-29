"use client";

// ============================================================================
// components/biznes/flashcards-client.tsx
// Fiszki z pojęciami: choose lessons, flip cards, mark "Wiem" / "Jeszcze nie".
// Knowledge level (0–3) per card is kept in localStorage; "Do nauki" hides
// cards already at level 3.
// ============================================================================
import { useMemo, useState } from "react";
import { Eye, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FLASHCARDS } from "@/lib/biznes/flashcards";
import { shuffle } from "@/lib/biznes/quiz";
import { LESSONS, getLesson } from "@/lib/biznes/lessons";
import { CARDS_KEY, useLocalState, type CardLevels } from "@/lib/biznes/use-local-state";
import type { Flashcard, LessonId } from "@/lib/biznes/types";
import { LessonPicker } from "./lesson-picker";

const MAX_LEVEL = 3;

export function FlashcardsClient() {
  const [lessons, setLessons] = useState<LessonId[]>(LESSONS.map((l) => l.id));
  const [onlyToLearn, setOnlyToLearn] = useState(true);
  const [reverse, setReverse] = useState(false);
  const [levels, setLevels] = useLocalState<CardLevels>(CARDS_KEY, {});
  const [deck, setDeck] = useState<Flashcard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [gotIt, setGotIt] = useState(0);

  const counts = useMemo(() => {
    const c: Partial<Record<LessonId, number>> = {};
    for (const f of FLASHCARDS) c[f.lesson] = (c[f.lesson] ?? 0) + 1;
    return c;
  }, []);

  const mastered = FLASHCARDS.filter((f) => (levels[f.id] ?? 0) >= MAX_LEVEL).length;
  const pool = FLASHCARDS.filter((f) => lessons.includes(f.lesson) && (!onlyToLearn || (levels[f.id] ?? 0) < MAX_LEVEL));

  function start() {
    setDeck(shuffle(pool));
    setIndex(0);
    setFlipped(false);
    setGotIt(0);
  }

  function answer(known: boolean) {
    if (!deck) return;
    const card = deck[index];
    setLevels((prev) => ({ ...prev, [card.id]: known ? Math.min(MAX_LEVEL, (prev[card.id] ?? 0) + 1) : 0 }));
    if (known) setGotIt((n) => n + 1);
    // A missed card comes back later in the same session.
    if (!known) setDeck((d) => (d ? [...d, card] : d));
    setFlipped(false);
    setIndex((i) => i + 1);
  }

  if (deck) {
    const done = index >= deck.length;
    if (done) {
      return (
        <Card className="flex flex-col items-center gap-3 text-center">
          <p className="text-4xl">🎉</p>
          <p className="text-lg font-semibold text-foreground">Talia przerobiona!</p>
          <p className="text-sm text-foreground-muted">Zapamiętane w tej serii: {gotIt}.</p>
          <div className="flex gap-2">
            <Button onClick={start} disabled={pool.length === 0}>
              <RotateCcw className="h-4 w-4" /> Jeszcze raz
            </Button>
            <Button variant="outline" onClick={() => setDeck(null)}>
              Zakończ
            </Button>
          </div>
        </Card>
      );
    }

    const card = deck[index];
    const level = levels[card.id] ?? 0;
    const front = reverse ? card.definition : card.term;
    const back = reverse ? card.term : card.definition;

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm text-foreground-muted">
          <button type="button" onClick={() => setDeck(null)} className="underline-offset-2 hover:underline">
            ← Wyjdź
          </button>
          <span>
            {index + 1} / {deck.length}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(index / deck.length) * 100}%` }} />
        </div>

        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "Pokaż pojęcie" : "Pokaż odpowiedź"}
          className="rounded-(--radius-card) border border-border/70 bg-surface p-6 text-left shadow-(--shadow-card) transition-transform active:scale-[0.99]"
        >
          <div className="flex items-center justify-between text-xs text-foreground-muted">
            <span className="rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">{getLesson(card.lesson)?.short}</span>
            <span aria-label={`Poziom ${level} z ${MAX_LEVEL}`}>{"●".repeat(level)}{"○".repeat(MAX_LEVEL - level)}</span>
          </div>
          <div className="flex min-h-48 flex-col justify-center py-4">
            {!flipped ? (
              <p className="text-center text-2xl font-bold leading-snug text-foreground">{front}</p>
            ) : (
              <>
                <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-primary">{reverse ? "Pojęcie" : "Definicja"}</p>
                <p className="text-center text-lg leading-snug text-foreground">{back}</p>
              </>
            )}
          </div>
          {!flipped && (
            <p className="flex items-center justify-center gap-1 text-xs text-foreground-muted">
              <Eye className="h-3.5 w-3.5" /> Dotknij, aby odkryć
            </p>
          )}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" onClick={() => answer(false)} disabled={!flipped} className="border-danger/40 text-danger">
            <ThumbsDown className="h-5 w-5" /> Jeszcze nie
          </Button>
          <Button size="lg" onClick={() => answer(true)} disabled={!flipped}>
            <ThumbsUp className="h-5 w-5" /> Wiem
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground-muted">Opanowane pojęcia</p>
          <p className="text-2xl font-bold text-foreground">
            {mastered} <span className="text-base font-normal text-foreground-muted">/ {FLASHCARDS.length}</span>
          </p>
        </div>
        <div className="h-12 w-12 rounded-full border-4 border-primary-soft" style={{ background: `conic-gradient(var(--primary) ${(mastered / FLASHCARDS.length) * 360}deg, transparent 0)` }} aria-hidden />
      </Card>

      <LessonPicker value={lessons} onChange={setLessons} counts={counts} />

      <div className="flex flex-col gap-2">
        {(
          [
            ["Tylko do nauki (ukryj opanowane)", onlyToLearn, setOnlyToLearn],
            ["Odwrotnie: definicja → pojęcie", reverse, setReverse],
          ] as const
        ).map(([label, on, set]) => (
          <label key={label} className={cn("flex items-center justify-between gap-3 rounded-(--radius-control) border border-border bg-surface px-3.5 py-3 text-sm text-foreground")}>
            {label}
            <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="h-5 w-5 accent-[var(--primary)]" />
          </label>
        ))}
      </div>

      <Button size="lg" onClick={start} disabled={pool.length === 0}>
        {pool.length === 0 ? "Wszystko opanowane – zmień wybór" : `Zacznij naukę (${pool.length} fiszek)`}
      </Button>
      {mastered > 0 && (
        <button type="button" onClick={() => setLevels(() => ({}))} className="text-xs text-foreground-muted underline-offset-2 hover:underline">
          Zresetuj postęp fiszek
        </button>
      )}
    </div>
  );
}
