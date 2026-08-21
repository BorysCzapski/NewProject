"use client";

// ============================================================================
// components/matura/vocab-drill.tsx
// The vocabulary trainer. Two question types, chosen per entry from how well
// the student already knows it:
//
//   box 0-1  ROZPOZNAWANIE — target word shown, tap to reveal the Polish,
//            then self-assess. Cheap, and the only sensible way to meet a word
//            for the first time.
//   box 2+   PRODUKCJA — Polish shown, the student TYPES the target word. Much
//            harder, and much closer to what the exam asks for: środki
//            językowe and wypowiedź pisemna both need the word produced from
//            nothing, not merely recognised in a list.
//
// A miss requeues the entry a few cards later, so a session ends with the hard
// words seen twice — the same local-requeue trick as
// components/vocabulary/flashcard-trainer.tsx.
//
// Typing is compared case-insensitively but NOT accent-insensitively, and an
// article on a Spanish noun is optional ("el hospital" accepts "hospital"):
// the drill is testing the word, not whether the student retyped the whole
// dictionary headword.
// ============================================================================
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AccentBar } from "@/components/ui/accent-bar";
import { cn } from "@/lib/utils";
import { recordVocabAnswer, finishVocabSession } from "@/lib/matura/vocab-actions";
import type { MaturaVocabEntry } from "@/lib/types/database";

/** Boxes below this get recognition questions, at or above get production. */
const PRODUCTION_FROM_BOX = 2;

interface QueueItem {
  uid: string;
  entry: MaturaVocabEntry;
  produce: boolean;
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Accepted spellings of a term: the term itself, and — for languages that put
 * the article in the headword — the bare noun. */
function acceptedForms(term: string): string[] {
  const forms = [term];
  const withoutArticle = term.replace(/^(el|la|los|las|un|una|the|a|an)\s+/i, "");
  if (withoutArticle !== term) forms.push(withoutArticle);
  // "(el) coche" style optional articles in authored content.
  const withoutParens = term.replace(/\([^)]*\)\s*/g, "").trim();
  if (withoutParens && withoutParens !== term) forms.push(withoutParens);
  return forms;
}

function isTypedCorrect(term: string, value: string): boolean {
  return acceptedForms(term).some((form) => normalize(form) === normalize(value));
}

export function VocabDrill({
  entries,
  boxes,
  backHref,
  accentChars,
}: {
  entries: MaturaVocabEntry[];
  /** entry id -> current Leitner box; missing means never seen. */
  boxes: Record<string, number>;
  backHref: string;
  accentChars: string[];
}) {
  const [queue, setQueue] = useState<QueueItem[]>(() =>
    entries.map((entry, i) => ({
      uid: `${entry.id}-${i}`,
      entry,
      produce: (boxes[entry.id] ?? 0) >= PRODUCTION_FROM_BOX,
    }))
  );
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const [processed, setProcessed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const uidCounter = useRef(entries.length);
  const finishedRef = useRef(false);

  const total = entries.length;
  const current = queue[0];

  function advance(wasCorrect: boolean) {
    if (!current) return;
    void recordVocabAnswer(current.entry.id, wasCorrect);

    let nextQueue = queue.slice(1);
    if (!wasCorrect) {
      const insertAt = Math.min(3, nextQueue.length);
      nextQueue = [
        ...nextQueue.slice(0, insertAt),
        { ...current, uid: `${current.entry.id}-${uidCounter.current++}` },
        ...nextQueue.slice(insertAt),
      ];
    } else {
      setCorrect((value) => value + 1);
    }

    const nextProcessed = processed + 1;
    setProcessed(nextProcessed);
    setRevealed(false);
    setTyped("");
    setChecked(null);

    if (nextProcessed >= total && nextQueue.length === 0) {
      setDone(true);
      if (!finishedRef.current) {
        finishedRef.current = true;
        void finishVocabSession();
      }
    }
    setQueue(nextQueue);
  }

  function insertChar(char: string) {
    const element = inputRef.current;
    const start = element?.selectionStart ?? typed.length;
    const end = element?.selectionEnd ?? typed.length;
    setTyped(typed.slice(0, start) + char + typed.slice(end));
    requestAnimationFrame(() => {
      if (!element) return;
      element.focus();
      const caret = start + char.length;
      element.setSelectionRange(caret, caret);
    });
  }

  if (entries.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-foreground-muted">
          Nie ma teraz nic do powtórki. Wróć jutro albo weź nowy dział.
        </p>
        <Link href={backHref}>
          <Button variant="outline">Wróć</Button>
        </Link>
      </Card>
    );
  }

  if (done || !current) {
    const percent = total > 0 ? Math.round((correct / Math.max(processed, 1)) * 100) : 0;
    return (
      <Card className="flex flex-col items-center gap-3 text-center">
        <p className="text-3xl font-bold text-primary">{percent}%</p>
        <p className="text-sm text-foreground-muted">
          {correct} z {processed} odpowiedzi za pierwszym razem. Powtórki zaplanowane.
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
  const typedCorrect = checked !== null && isTypedCorrect(entry.term, typed);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Przerwij
        </Link>
        <span className="text-xs tabular-nums text-foreground-muted">
          {Math.min(processed + 1, total)}/{total}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(processed / total) * 100}%` }}
        />
      </div>

      {current.produce ? (
        // ---- PRODUKCJA -------------------------------------------------
        <Card className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Napisz w obcym języku</p>
            <p className="mt-1 text-xl font-semibold text-foreground">{entry.translation_pl}</p>
            {entry.part_of_speech && (
              <p className="mt-0.5 text-xs text-foreground-muted">{entry.part_of_speech}</p>
            )}
          </div>

          <Input
            ref={inputRef}
            value={typed}
            onChange={(e) => {
              setTyped(e.target.value);
              setChecked(null);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              if (checked === null) setChecked(true);
              else advance(typedCorrect);
            }}
            disabled={checked !== null}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Twoja odpowiedź…"
            aria-label="Twoja odpowiedź"
            className={cn(
              checked !== null && typedCorrect && "border-accent bg-accent-soft text-accent",
              checked !== null && !typedCorrect && "border-danger bg-danger-soft text-danger"
            )}
          />
          {checked === null && accentChars.length > 0 && (
            <AccentBar chars={accentChars} className="mt-0" onInsert={insertChar} />
          )}

          {checked !== null && (
            <div className="flex flex-col gap-1.5 rounded-(--radius-control) bg-surface-muted px-3 py-2.5">
              <p
                className={cn(
                  "flex items-center gap-1.5 text-sm font-semibold",
                  typedCorrect ? "text-accent" : "text-danger"
                )}
              >
                {typedCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                {entry.term}
              </p>
              {entry.example && (
                <p className="text-sm italic leading-relaxed text-foreground">{entry.example}</p>
              )}
              {entry.example_pl && (
                <p className="text-xs leading-relaxed text-foreground-muted">{entry.example_pl}</p>
              )}
              {entry.note && <p className="text-xs leading-relaxed text-primary">💡 {entry.note}</p>}
            </div>
          )}

          {checked === null ? (
            <Button size="lg" onClick={() => setChecked(true)} disabled={!typed.trim()}>
              Sprawdź
            </Button>
          ) : (
            <Button size="lg" onClick={() => advance(typedCorrect)}>
              Dalej
            </Button>
          )}
        </Card>
      ) : (
        // ---- ROZPOZNAWANIE ---------------------------------------------
        <Card className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className={cn(
              "flex min-h-32 flex-col items-center justify-center gap-1.5 rounded-(--radius-control) px-4 py-6 text-center transition-colors",
              revealed ? "bg-primary-soft" : "bg-surface-muted active:bg-border/50"
            )}
          >
            <span className="text-2xl font-semibold text-foreground">{entry.term}</span>
            {entry.part_of_speech && (
              <span className="text-xs text-foreground-muted">{entry.part_of_speech}</span>
            )}
            {!revealed && (
              <span className="mt-1 flex items-center gap-1 text-xs text-foreground-muted">
                <RotateCcw className="h-3 w-3" />
                dotknij, by sprawdzić
              </span>
            )}
            {revealed && (
              <span className="mt-1 text-lg font-semibold text-primary">{entry.translation_pl}</span>
            )}
          </button>

          {revealed && (
            <div className="flex flex-col gap-1.5 rounded-(--radius-control) bg-surface-muted px-3 py-2.5">
              {entry.example && (
                <p className="text-sm italic leading-relaxed text-foreground">{entry.example}</p>
              )}
              {entry.example_pl && (
                <p className="text-xs leading-relaxed text-foreground-muted">{entry.example_pl}</p>
              )}
              {entry.note && <p className="text-xs leading-relaxed text-primary">💡 {entry.note}</p>}
            </div>
          )}

          {revealed && (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="lg" onClick={() => advance(false)}>
                <X className="h-4 w-4" />
                Nie umiem
              </Button>
              <Button size="lg" onClick={() => advance(true)}>
                <Check className="h-4 w-4" />
                Umiem
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
