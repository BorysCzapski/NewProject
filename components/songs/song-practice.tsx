"use client";

// ============================================================================
// components/songs/song-practice.tsx
// Song practice UI: a mode toggle between "linijka po linijce" (whole-line
// translation) and "pojedyncze słowa" (tap a word, translate just that
// word). Tracks locally which lines have a correct attempt this session and
// fires the one-time "song" activity + completion summary once every line
// is done.
// ============================================================================
import { useRef, useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  checkLineTranslation,
  checkWordTranslation,
  completeSongPractice,
  type TranslationCheckResult,
} from "@/lib/songs/actions";
import type { Song } from "@/lib/types/database";

type Mode = "line" | "word";

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
          // Best-effort: streak/homework bump isn't critical enough to
          // surface as a blocking error here.
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
            onClick={() => setMode("word")}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              mode === "word" ? "bg-primary text-primary-foreground" : "text-foreground-muted"
            )}
          >
            Pojedyncze słowa
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
        <LineMode songId={song.id} lines={lines} completedLines={completedLines} onLineCorrect={markLineComplete} />
      ) : (
        <WordMode songId={song.id} lines={lines} completedLines={completedLines} onLineCorrect={markLineComplete} />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Line mode
// ----------------------------------------------------------------------------

function LineMode({
  songId,
  lines,
  completedLines,
  onLineCorrect,
}: {
  songId: string;
  lines: string[];
  completedLines: Set<number>;
  onLineCorrect: (lineIndex: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {lines.map((line, index) => (
        <LineRow
          key={index}
          songId={songId}
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
  songId,
  lineIndex,
  line,
  isDone,
  onCorrect,
}: {
  songId: string;
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
        const res = await checkLineTranslation(songId, lineIndex, line, value);
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
// Word mode
// ----------------------------------------------------------------------------

function splitWords(line: string): string[] {
  return line.split(/\s+/).filter(Boolean);
}

interface WordState {
  status: "correct" | "incorrect";
  feedback: string;
  suggestion: string;
}

function WordMode({
  songId,
  lines,
  completedLines,
  onLineCorrect,
}: {
  songId: string;
  lines: string[];
  completedLines: Set<number>;
  onLineCorrect: (lineIndex: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {lines.map((line, index) => (
        <WordLineRow
          key={index}
          songId={songId}
          lineIndex={index}
          line={line}
          isDone={completedLines.has(index)}
          onLineCorrect={() => onLineCorrect(index)}
        />
      ))}
    </div>
  );
}

function WordLineRow({
  songId,
  lineIndex,
  line,
  isDone,
  onLineCorrect,
}: {
  songId: string;
  lineIndex: number;
  line: string;
  isDone: boolean;
  onLineCorrect: () => void;
}) {
  const words = splitWords(line);
  const [wordStates, setWordStates] = useState<Record<number, WordState>>({});
  const [activeWord, setActiveWord] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleCheck(wordIndex: number) {
    if (!inputValue.trim() || pending) return;
    setError(null);
    const word = words[wordIndex];
    // Whether every OTHER word in this line is already confirmed correct
    // this session — if this one also comes back correct, the whole line
    // is done via word-by-word translation.
    const allOtherWordsCorrect = words.every((_, i) => i === wordIndex || wordStates[i]?.status === "correct");

    startTransition(async () => {
      try {
        const res = await checkWordTranslation(songId, lineIndex, line, word, inputValue, allOtherWordsCorrect);
        setWordStates((prev) => ({
          ...prev,
          [wordIndex]: { status: res.isCorrect ? "correct" : "incorrect", feedback: res.feedback, suggestion: res.suggestion },
        }));
        if (res.isCorrect) {
          setInputValue("");
          if (allOtherWordsCorrect) onLineCorrect();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nie udało się sprawdzić słowa.");
      }
    });
  }

  const activeState = activeWord !== null ? wordStates[activeWord] : undefined;

  return (
    <Card className={cn(isDone && "border-primary/40 bg-primary-soft/40")}>
      <div className="flex flex-wrap gap-1.5">
        {words.map((word, i) => {
          const status = wordStates[i]?.status;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActiveWord(i);
                setInputValue("");
              }}
              className={cn(
                "rounded-md px-1.5 py-0.5 text-base font-medium transition-colors",
                status === "correct" && "bg-primary-soft text-primary",
                status === "incorrect" && "bg-danger-soft text-danger",
                !status && "text-foreground hover:bg-surface-muted",
                activeWord === i && "ring-2 ring-primary"
              )}
            >
              {word}
            </button>
          );
        })}
      </div>

      {activeWord !== null && (
        <div className="mt-3 flex items-center gap-2">
          <span className="shrink-0 text-sm font-medium text-foreground-muted">{words[activeWord]}:</span>
          <input
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck(activeWord)}
            disabled={pending}
            placeholder="tłumaczenie słowa..."
            className={cn(
              "h-10 w-full rounded-(--radius-control) border border-border bg-surface px-3 text-sm text-foreground",
              "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70"
            )}
          />
          <Button size="sm" onClick={() => handleCheck(activeWord)} disabled={!inputValue.trim()} isLoading={pending}>
            Sprawdź
          </Button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      {activeState && (
        <p className={cn("mt-2 text-sm leading-relaxed", activeState.status === "correct" ? "text-primary" : "text-danger")}>
          {activeState.feedback}
          {activeState.suggestion && activeState.status === "incorrect" && (
            <span className="mt-1 block text-foreground-muted">Propozycja: {activeState.suggestion}</span>
          )}
        </p>
      )}
    </Card>
  );
}
