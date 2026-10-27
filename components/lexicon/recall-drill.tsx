"use client";

// ============================================================================
// components/lexicon/recall-drill.tsx
// "Trening fiszek": widzisz polskie słowo, WPISUJESZ angielskie. To aktywne
// przypominanie — trudniejsze niż odwracanie fiszki i bliższe temu, czego
// wymaga rozmowa albo wypracowanie, gdzie słowo trzeba wydobyć z głowy, a nie
// tylko rozpoznać.
//
// Przyjmujemy hasło główne i każdy wariant (lib/lexicon/recall.ts). Literówka
// to błąd, ale odpowiedź o jedną literę od poprawnej jest nazwana "prawie",
// żeby było widać, że uczeń zna słowo i myli się w pisowni. Błąd odkłada słowo
// o kilka kart (lokalny requeue, jak w components/matura/vocab-drill.tsx).
// ============================================================================
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { checkRecall, type RecallVerdict } from "@/lib/lexicon/recall";
import { cn } from "@/lib/utils";

export interface RecallEntry {
  id: string;
  term: string;
  alternatives: string[];
  part_of_speech: string;
  translation_pl: string;
  example: string;
  example_pl: string;
  note: string;
}

interface QueueItem {
  uid: string;
  entry: RecallEntry;
  /** true dla powtórki po błędzie — nie liczy się do "za pierwszym razem". */
  retry: boolean;
}

function speak(term: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(term);
  utterance.lang = "en-GB";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function RecallDrill({
  entries,
  backHref,
  recordAnswer,
  finishSession,
}: {
  entries: RecallEntry[];
  backHref: string;
  recordAnswer: (entryId: string, wasCorrect: boolean) => Promise<void>;
  finishSession: () => Promise<void>;
}) {
  const [queue, setQueue] = useState<QueueItem[]>(() =>
    entries.map((entry, i) => ({ uid: `${entry.id}-${i}`, entry, retry: false }))
  );
  const [typed, setTyped] = useState("");
  const [verdict, setVerdict] = useState<RecallVerdict | null>(null);
  // finished = karty zakończone poprawną odpowiedzią (w dowolnej próbie),
  // firstTry = z nich te, które poszły dobrze od razu. Powtórki po błędzie nie
  // zwiększają mianownika: ekran końcowy ma mówić prawdę o "za pierwszym razem".
  const [finished, setFinished] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const actionRef = useRef<HTMLDivElement | null>(null);
  const counter = useRef(entries.length);
  const finishedRef = useRef(false);

  const total = entries.length;
  const current = queue[0];

  // Po sprawdzeniu pole się blokuje i focus ucieka na stronę — bez tego Enter
  // nie przeszedłby do następnej karty. "Dalej" dostaje focus w następnej klatce.
  useEffect(() => {
    if (verdict === null) return;
    const frame = requestAnimationFrame(() => actionRef.current?.querySelector("button")?.focus());
    return () => cancelAnimationFrame(frame);
  }, [verdict]);

  function check() {
    if (!current || !typed.trim()) return;
    setVerdict(checkRecall(typed, current.entry.term, current.entry.alternatives));
  }

  /** "Nie wiem": odkrywa odpowiedź i liczy się jako błąd, bez zgadywania na ślepo. */
  function giveUp() {
    setVerdict({ correct: false, nearMiss: false });
  }

  function advance() {
    if (!current || !verdict) return;
    const wasCorrect = verdict.correct;
    void recordAnswer(current.entry.id, wasCorrect);

    let nextQueue = queue.slice(1);
    if (!wasCorrect) {
      const insertAt = Math.min(3, nextQueue.length);
      nextQueue = [
        ...nextQueue.slice(0, insertAt),
        { ...current, uid: `${current.entry.id}-${counter.current++}`, retry: true },
        ...nextQueue.slice(insertAt),
      ];
    } else {
      setFinished((value) => value + 1);
      if (!current.retry) setFirstTry((value) => value + 1);
    }

    setTyped("");
    setVerdict(null);

    if (nextQueue.length === 0) {
      setDone(true);
      if (!finishedRef.current) {
        finishedRef.current = true;
        void finishSession();
      }
    }
    setQueue(nextQueue);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    // Bez tego przeglądarka dokończyłaby Enter kliknięciem w przycisk, który
    // dostał focus w trakcie tego samego naciśnięcia (odpowiedź sprawdzona i
    // od razu pominięta).
    event.preventDefault();
    if (verdict === null) check();
    else advance();
  }

  if (entries.length === 0) {
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

  if (done || !current) {
    const percent = Math.round((firstTry / Math.max(total, 1)) * 100);
    return (
      <Card className="flex flex-col items-center gap-3 text-center">
        <p className="text-3xl font-bold text-primary">{percent}%</p>
        <p className="text-sm text-foreground-muted">
          {firstTry} z {total} słów przypomnianych za pierwszym razem. Powtórki zaplanowane.
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
  const forms = [entry.term, ...entry.alternatives];

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
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Napisz po angielsku</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{entry.translation_pl}</p>
          {entry.part_of_speech && <p className="mt-0.5 text-xs text-foreground-muted">{entry.part_of_speech}</p>}
        </div>

        <Input
          ref={inputRef}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={verdict !== null}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          placeholder="Po angielsku…"
          aria-label="Odpowiedź po angielsku"
          className={cn(
            verdict !== null && verdict.correct && "border-accent bg-accent-soft text-accent",
            verdict !== null && !verdict.correct && "border-danger bg-danger-soft text-danger"
          )}
        />

        {verdict !== null && (
          <div className="flex flex-col gap-1.5 rounded-(--radius-control) bg-surface-muted px-3 py-2.5">
            <div className="flex items-start justify-between gap-2">
              <p className={cn("flex items-center gap-1.5 text-sm font-semibold", verdict.correct ? "text-accent" : "text-danger")}>
                {verdict.correct ? <Check className="h-4 w-4 shrink-0" /> : <X className="h-4 w-4 shrink-0" />}
                <span>
                  {verdict.correct ? "Dobrze:" : verdict.nearMiss ? "Prawie — literówka. Poprawnie:" : "Poprawnie:"}{" "}
                  {forms.join(" / ")}
                </span>
              </p>
              <button
                type="button"
                onClick={() => speak(entry.term)}
                aria-label="Odtwórz wymowę"
                className="shrink-0 rounded-full p-1.5 text-foreground-muted active:bg-border/50"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            {entry.example && <p className="text-sm italic leading-relaxed text-foreground">{entry.example}</p>}
            {entry.example_pl && <p className="text-xs leading-relaxed text-foreground-muted">{entry.example_pl}</p>}
            {entry.note && <p className="text-xs leading-relaxed text-primary">💡 {entry.note}</p>}
          </div>
        )}

        <div ref={actionRef} className="flex flex-col gap-2">
          {verdict === null ? (
            <>
              <Button size="lg" onClick={check} disabled={!typed.trim()}>
                Sprawdź
              </Button>
              <Button variant="ghost" onClick={giveUp}>
                Nie wiem
              </Button>
            </>
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
