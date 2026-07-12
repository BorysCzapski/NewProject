"use client";

// ============================================================================
// components/songs/song-practice.tsx
// Song practice UI with two sensible modes:
//  - "Linijka po linijce": translate each whole line to Polish (AI-graded).
//  - "Słówka": tap any word to reveal its contextual meaning (glossary hint,
//    not graded) — replaces the old nonsensical word-by-word grading.
// Tracks locally which lines have a correct attempt this session and fires the
// one-time "song" activity + completion summary once every line is done.
// ============================================================================
import { useRef, useState, useTransition } from "react";
import { Check, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  checkLineTranslation,
  completeSongPractice,
  explainWord,
  type TranslationCheckResult,
  type WordMeaning,
} from "@/lib/songs/actions";
import type { Song } from "@/lib/types/database";

type Mode = "line" | "words";

export function SongPractice({ song, lines }: { song: Song; lines: string[] }) {
  const [mode, setMode] = useState<Mode>("line");
  const [completedLines, setCompletedLines] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const firedRef = useRef(false);

  function markLineComplete(lineIndex: number) {
    setCompletedLines((prev) => {
      if (prev.has(lineIndex)) return prev;
      const next = new Set(prev);
      next.add(lineIndex);
      if (next.size === lines.length && !firedRef.current) {
        firedRef.current = true;
        setFinished(true);
        completeSongPractice().catch(() => {
          // Best-effort: streak/homework bump isn't critical enough to block on.
        });
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge>
          {completedLines.size}/{lines.length} linii ukończonych
        </Badge>
        <div className="flex gap-1 rounded-full bg-surface-muted p-1">
          <button
            type="button"
            onClick={() => setMode("line")}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              mode === "line" ? "bg-primary text-primary-foreground" : "text-foreground-muted"
            )}
          >
            Linijka po linijce
          </button>
          <button
            type="button"
            onClick={() => setMode("words")}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              mode === "words" ? "bg-primary text-primary-foreground" : "text-foreground-muted"
            )}
          >
            Słówka
          </button>
        </div>
      </div>

      {finished && (
        <Card className="bg-primary-soft">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <CardTitle className="text-primary">Piosenka ukończona!</CardTitle>
          </div>
          <CardDescription className="mt-1">
            Przetłumaczyłeś/aś poprawnie wszystkie linijki tej piosenki.
          </CardDescription>
        </Card>
      )}

      {mode === "line" ? (
        <LineMode song={song} lines={lines} completedLines={completedLines} onLineCorrect={markLineComplete} />
      ) : (
        <WordsMode song={song} lines={lines} />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Line mode — translate whole lines (graded)
// ----------------------------------------------------------------------------

function LineMode({
  song,
  lines,
  completedLines,
  onLineCorrect,
}: {
  song: Song;
  lines: string[];
  completedLines: Set<number>;
  onLineCorrect: (lineIndex: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {lines.map((line, index) => (
        <LineRow
          key={index}
          song={song}
          lineIndex={index}
          line={line}
          isDone={completedLines.has(index)}
          onCorrect={() => onLineCorrect(index)}
        />
      ))}
    </div>
  );
}

function LineRow({
  song,
  lineIndex,
  line,
  isDone,
  onCorrect,
}: {
  song: Song;
  lineIndex: number;
  line: string;
  isDone: boolean;
  onCorrect: () => void;
}) {
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<TranslationCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCheck() {
    if (!value.trim() || pending) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await checkLineTranslation(song.id, lineIndex, line, value, song.language);
        setResult(res);
        if (res.isCorrect) onCorrect();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nie udało się sprawdzić tłumaczenia.");
      }
    });
  }

  return (
    <Card className={cn(isDone && "border-primary/40 bg-primary-soft/40")}>
      <p className="text-base font-medium leading-relaxed text-foreground">{line}</p>
      <div className="mt-3 flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          disabled={pending}
          placeholder="Twoje tłumaczenie..."
          className={cn(
            "h-11 w-full rounded-(--radius-control) border border-border bg-surface px-3 text-sm text-foreground",
            "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70"
          )}
        />
        <Button size="sm" onClick={handleCheck} disabled={!value.trim()} isLoading={pending}>
          Sprawdź
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {result && (
        <p className={cn("mt-2 text-sm leading-relaxed", result.isCorrect ? "text-primary" : "text-danger")}>
          {result.feedback}
          {result.suggestion && !result.isCorrect && (
            <span className="mt-1 block text-foreground-muted">Propozycja: {result.suggestion}</span>
          )}
        </p>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------------
// Words mode — tap a word to reveal its meaning (glossary hint, not graded)
// ----------------------------------------------------------------------------

function splitWords(line: string): string[] {
  return line.split(/\s+/).filter(Boolean);
}

function WordsMode({ song, lines }: { song: Song; lines: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <Card className="bg-surface-muted">
        <CardDescription className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 shrink-0" />
          Dotknij dowolnego słowa, aby zobaczyć jego znaczenie w tym kontekście.
        </CardDescription>
      </Card>
      {lines.map((line, index) => (
        <WordLineRow key={index} songLanguage={song.language} line={line} />
      ))}
    </div>
  );
}

function WordLineRow({ songLanguage, line }: { songLanguage: Song["language"]; line: string }) {
  const words = splitWords(line);
  const [activeWord, setActiveWord] = useState<number | null>(null);
  const [meaning, setMeaning] = useState<WordMeaning | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function reveal(wordIndex: number) {
    setActiveWord(wordIndex);
    setMeaning(null);
    setError(null);
    startTransition(async () => {
      try {
        const res = await explainWord(line, words[wordIndex], songLanguage);
        setMeaning(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nie udało się pobrać znaczenia.");
      }
    });
  }

  return (
    <Card>
      <div className="flex flex-wrap gap-x-1.5 gap-y-2.5">
        {words.map((word, i) => (
          <button
            key={i}
            type="button"
            onClick={() => reveal(i)}
            className={cn(
              "min-h-9 rounded-md px-2 py-1.5 text-base font-medium leading-tight transition-colors",
              activeWord === i ? "bg-primary-soft text-primary ring-2 ring-primary" : "text-foreground hover:bg-surface-muted"
            )}
          >
            {word}
          </button>
        ))}
      </div>

      {activeWord !== null && (
        <div className="mt-3 rounded-(--radius-control) bg-surface-muted p-3 text-sm">
          <span className="font-semibold text-foreground">{words[activeWord]}</span>
          {pending && <span className="ml-2 text-foreground-muted">sprawdzam…</span>}
          {error && <span className="ml-2 text-danger">{error}</span>}
          {meaning && (
            <span className="mt-1 block text-foreground">
              {meaning.meaning}
              {meaning.note && <span className="mt-1 block text-foreground-muted">{meaning.note}</span>}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
