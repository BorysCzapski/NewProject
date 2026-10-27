"use client";

// ============================================================================
// components/lexicon/spelling-drill.tsx
// Ćwiczenie z pisowni: widzisz polskie znaczenie i angielskie słowo z jedną lub
// dwiema brakującymi literami ("ma_tress"), wpisujesz brakujące litery. Liczba
// luk rośnie z pudełkiem Leitnera: nowe słowo ma jedną lukę, znane — dwie.
//
// Sprawdzamy WSZYSTKIE luki naraz po "Sprawdź"/Enterze, a nie po każdej literze
// z osobna, bo natychmiastowa informacja o błędzie po pierwszej literze
// zamienia ćwiczenie w zgadywanie. Błąd odkłada słowo o kilka kart, już z
// INNYMI zasłoniętymi literami (inne ziarno), żeby nie zapamiętać maski
// zamiast pisowni — ten sam pomysł co lokalny requeue w components/matura/vocab-drill.tsx.
//
// Maska zależy od hasła i ziarna, nie od Math.random (lib/lexicon/spelling.ts),
// więc serwer i przeglądarka renderują to samo i hydratacja się nie rozjeżdża.
// ============================================================================
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { blanksForBox, buildPuzzle, checkAnswers, type SpellingPuzzle } from "@/lib/lexicon/spelling";
import { cn } from "@/lib/utils";

export interface SpellingEntry {
  id: string;
  term: string;
  part_of_speech: string;
  translation_pl: string;
  example: string;
  example_pl: string;
  note: string;
}

interface QueueItem {
  uid: string;
  entry: SpellingEntry;
  blanks: 1 | 2;
  seed: string;
  /** Pozycje liter zasłoniętych w poprzedniej, nieudanej próbie tego słowa. */
  avoid: number[];
}

function speak(term: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(term.replace(/\([^)]*\)/g, "").replace(/\bsth\b/g, "something"));
  utterance.lang = "en-GB";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

/** Komórki rozbite na słowa, żeby zawinięcie wiersza nie łamało wyrazu w pół. */
function groupWords(puzzle: SpellingPuzzle) {
  const words: SpellingPuzzle["cells"][] = [[]];
  for (const cell of puzzle.cells) {
    if (cell.char === " ") words.push([]);
    else words[words.length - 1].push(cell);
  }
  return words;
}

export function SpellingDrill({
  entries,
  boxes,
  backHref,
  recordAnswer,
  finishSession,
}: {
  entries: SpellingEntry[];
  /** entry id -> pudełko Leitnera; brak oznacza słowo niećwiczone. */
  boxes: Record<string, number>;
  backHref: string;
  recordAnswer: (entryId: string, wasCorrect: boolean) => Promise<void>;
  finishSession: () => Promise<void>;
}) {
  // Hasła, z których nie da się zrobić zagadki (np. same słowa funkcyjne),
  // odpadają od razu zamiast psuć sesję.
  const initialQueue = useMemo<QueueItem[]>(
    () =>
      entries
        .map((entry, i) => ({
          uid: `${entry.id}-${i}`,
          entry,
          blanks: blanksForBox(boxes[entry.id] ?? 0),
          seed: "0",
          avoid: [],
        }))
        .filter((item) => buildPuzzle(item.entry.term, item.blanks, item.seed, item.avoid) !== null),
    [entries, boxes]
  );

  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);
  const [typed, setTyped] = useState<string[]>([]);
  const [results, setResults] = useState<boolean[] | null>(null);
  // finished = karty zakończone poprawną odpowiedzią (w dowolnej próbie),
  // firstTry = z nich te, które poszły dobrze od razu. Powtórki po błędzie nie
  // zwiększają mianownika: ekran końcowy ma mówić prawdę o "za pierwszym razem".
  const [finished, setFinished] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [done, setDone] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const actionRef = useRef<HTMLDivElement | null>(null);
  const counter = useRef(initialQueue.length);
  const finishedRef = useRef(false);

  const total = initialQueue.length;
  const current = queue[0];
  const puzzle = useMemo(
    () => (current ? buildPuzzle(current.entry.term, current.blanks, current.seed, current.avoid) : null),
    [current]
  );

  // Po sprawdzeniu pola się blokują i focus ucieka na stronę — bez tego Enter
  // nie przeszedłby do następnej karty. Przycisk "Dalej" dostaje focus sam.
  useEffect(() => {
    if (results === null) return;
    const frame = requestAnimationFrame(() => actionRef.current?.querySelector("button")?.focus());
    return () => cancelAnimationFrame(frame);
  }, [results]);

  function focusBlank(index: number) {
    requestAnimationFrame(() => inputRefs.current[index]?.focus());
  }

  function handleChange(blank: number, value: string) {
    const letter = [...value].reverse().find((ch) => /[A-Za-z]/.test(ch)) ?? "";
    setTyped((current) => {
      const next = [...current];
      next[blank] = letter;
      return next;
    });
    if (letter && puzzle && blank < puzzle.answers.length - 1) focusBlank(blank + 1);
  }

  function handleKeyDown(blank: number, event: KeyboardEvent<HTMLInputElement>) {
    const key = event.key;
    if (key === "Enter") {
      // Bez tego przeglądarka dokończyłaby Enter kliknięciem w przycisk, który
      // dostał focus w trakcie tego samego naciśnięcia — i wynik byłby
      // sprawdzony oraz od razu pominięty.
      event.preventDefault();
      if (results === null) check();
      else advance();
    } else if (key === "Backspace" && !typed[blank] && blank > 0) {
      focusBlank(blank - 1);
    } else if (key === "ArrowLeft" && blank > 0) {
      focusBlank(blank - 1);
    } else if (key === "ArrowRight" && puzzle && blank < puzzle.answers.length - 1) {
      focusBlank(blank + 1);
    }
  }

  const allFilled = puzzle ? puzzle.answers.every((_, i) => (typed[i] ?? "").trim() !== "") : false;

  function check() {
    if (!puzzle || !allFilled) return;
    setResults(checkAnswers(puzzle, typed));
  }

  function advance() {
    if (!current || !results) return;
    const wasCorrect = results.every(Boolean);
    void recordAnswer(current.entry.id, wasCorrect);

    let nextQueue = queue.slice(1);
    if (!wasCorrect) {
      const insertAt = Math.min(3, nextQueue.length);
      const attempt = counter.current++;
      nextQueue = [
        ...nextQueue.slice(0, insertAt),
        {
          ...current,
          uid: `${current.entry.id}-${attempt}`,
          seed: String(attempt),
          avoid: puzzle ? puzzle.cells.flatMap((cell, index) => (cell.blank !== null ? [index] : [])) : [],
        },
        ...nextQueue.slice(insertAt),
      ];
    } else {
      setFinished((value) => value + 1);
      // Ziarno "0" ma tylko pierwsze podejście do słowa; powtórki dostają kolejne.
      if (current.seed === "0") setFirstTry((value) => value + 1);
    }

    setTyped([]);
    setResults(null);

    if (nextQueue.length === 0) {
      setDone(true);
      if (!finishedRef.current) {
        finishedRef.current = true;
        void finishSession();
      }
    }
    setQueue(nextQueue);
    focusBlank(0);
  }

  if (initialQueue.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-foreground-muted">
          Nie ma teraz nic do ćwiczenia w tej talii. Wróć jutro albo wybierz inną.
        </p>
        <Link href={backHref}>
          <Button variant="outline">Wróć</Button>
        </Link>
      </Card>
    );
  }

  if (done || !current || !puzzle) {
    const percent = Math.round((firstTry / Math.max(total, 1)) * 100);
    return (
      <Card className="flex flex-col items-center gap-3 text-center">
        <p className="text-3xl font-bold text-primary">{percent}%</p>
        <p className="text-sm text-foreground-muted">
          {firstTry} z {total} słów napisanych dobrze za pierwszym razem. Powtórki zaplanowane.
        </p>
        <Link href={backHref} className="w-full">
          <Button className="w-full" size="lg">
            Gotowe
          </Button>
        </Link>
      </Card>
    );
  }

  const entry = current.entry;
  const wasCorrect = results?.every(Boolean) ?? false;
  const words = groupWords(puzzle);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted">
          <ArrowLeft className="h-4 w-4" />
          Przerwij
        </Link>
        <span className="text-xs tabular-nums text-foreground-muted">
          {Math.min(finished + 1, total)}/{total}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(finished / total) * 100}%` }} />
      </div>

      <Card key={current.uid} className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Uzupełnij {puzzle.answers.length === 1 ? "brakującą literę" : "brakujące litery"}
            </p>
            <p className="mt-1 text-xl font-semibold text-foreground">{entry.translation_pl}</p>
            {entry.part_of_speech && <p className="mt-0.5 text-xs text-foreground-muted">{entry.part_of_speech}</p>}
          </div>
          <button
            type="button"
            onClick={() => speak(entry.term)}
            aria-label="Odtwórz wymowę"
            className="shrink-0 rounded-full bg-surface-muted p-2.5 text-foreground-muted active:bg-border/50"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-end gap-x-4 gap-y-3" aria-label={`Słowo do uzupełnienia, ${puzzle.answers.length} brakujące litery`}>
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-flex items-end whitespace-nowrap text-2xl font-semibold text-foreground">
              {word.map((cell, cellIndex) =>
                cell.blank === null ? (
                  <span key={cellIndex} className="px-px">
                    {cell.char}
                  </span>
                ) : (
                  <input
                    key={cellIndex}
                    ref={(element) => {
                      inputRefs.current[cell.blank as number] = element;
                    }}
                    value={typed[cell.blank] ?? ""}
                    onChange={(e) => handleChange(cell.blank as number, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(cell.blank as number, e)}
                    onFocus={(e) => e.target.select()}
                    disabled={results !== null}
                    maxLength={2}
                    autoFocus={cell.blank === 0}
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck={false}
                    inputMode="text"
                    aria-label={`Brakująca litera ${cell.blank + 1}`}
                    className={cn(
                      "mx-0.5 h-11 w-9 rounded-(--radius-control) border-2 bg-surface text-center text-2xl font-semibold uppercase text-foreground",
                      "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
                      results === null && "border-border",
                      results !== null && results[cell.blank] && "border-accent bg-accent-soft text-accent",
                      results !== null && !results[cell.blank] && "border-danger bg-danger-soft text-danger"
                    )}
                  />
                )
              )}
            </span>
          ))}
        </div>

        {results !== null && (
          <div className="flex flex-col gap-1.5 rounded-(--radius-control) bg-surface-muted px-3 py-2.5">
            <p className={cn("flex items-center gap-1.5 text-sm font-semibold", wasCorrect ? "text-accent" : "text-danger")}>
              {wasCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              {wasCorrect ? "Dobrze:" : "Poprawnie:"} {entry.term}
            </p>
            {entry.example && <p className="text-sm italic leading-relaxed text-foreground">{entry.example}</p>}
            {entry.example_pl && <p className="text-xs leading-relaxed text-foreground-muted">{entry.example_pl}</p>}
            {entry.note && <p className="text-xs leading-relaxed text-primary">💡 {entry.note}</p>}
          </div>
        )}

        <div ref={actionRef} className="flex flex-col">
          {results === null ? (
            <Button size="lg" onClick={check} disabled={!allFilled}>
              Sprawdź
            </Button>
          ) : (
            <Button size="lg" onClick={advance}>
              Dalej
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
