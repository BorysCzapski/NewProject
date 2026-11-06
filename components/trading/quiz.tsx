"use client";

// ============================================================================
// components/trading/quiz.tsx
// Quiz pytanie po pytaniu z natychmiastowym wyjaśnieniem. Na końcu wynik,
// lista lekcji do powtórki (z błędnych odpowiedzi) i zapis najlepszego
// wyniku w localStorage.
// ============================================================================
import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { lessonBySlug, type QuizQuestion } from "@/lib/trading/content";
import { useLocalState } from "@/lib/trading/use-local-state";

export interface QuizStats {
  best: number; // procent
  runs: number;
}
const EMPTY_STATS: QuizStats = { best: 0, runs: 0 };

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Quiz({ questions, size = 10 }: { questions: QuizQuestion[]; size?: number }) {
  const [round, setRound] = useState(0);
  // Nowa runda = nowe losowanie pytań.
  const deck = useMemo(() => {
    void round;
    return shuffled(questions).slice(0, size);
  }, [questions, size, round]);

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<QuizQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [stats, setStats] = useLocalState<QuizStats>("trading:quiz", EMPTY_STATS);
  const [saved, setSaved] = useState(false);

  const done = index >= deck.length;
  const q = deck[index];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
    else setWrong((w) => [...w, q]);
  }

  function next() {
    const nextIndex = index + 1;
    if (nextIndex >= deck.length && !saved) {
      const pct = Math.round((score / deck.length) * 100);
      setStats({ best: Math.max(stats.best, pct), runs: stats.runs + 1 });
      setSaved(true);
    }
    setIndex(nextIndex);
    setPicked(null);
  }

  function restart() {
    setRound((r) => r + 1);
    setIndex(0);
    setPicked(null);
    setWrong([]);
    setScore(0);
    setSaved(false);
  }

  if (done) {
    const pct = Math.round((score / deck.length) * 100);
    const weak = Array.from(new Set(wrong.map((w) => w.lesson)));
    return (
      <Card className="flex flex-col gap-4">
        <CardTitle>
          Wynik: {score}/{deck.length} ({pct}%)
        </CardTitle>
        <p className="text-sm text-foreground-muted">
          Najlepszy wynik: {Math.max(stats.best, pct)}% • rozegranych rund: {stats.runs}
        </p>
        {weak.length > 0 ? (
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Powtórz te lekcje:</p>
            <ul className="flex flex-col gap-1.5">
              {weak.map((slug) => (
                <li key={slug}>
                  <Link href={`/trading/lekcje/${slug}`} className="text-sm font-medium text-primary underline">
                    {lessonBySlug(slug)?.title ?? slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-primary">Bezbłędnie — wszystkie odpowiedzi poprawne.</p>
        )}
        <Button onClick={restart}>Jeszcze raz</Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-foreground-muted">
        <span>
          Pytanie {index + 1} z {deck.length}
        </span>
        <span>Punkty: {score}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(index / deck.length) * 100}%` }} />
      </div>
      <Card className="flex flex-col gap-3">
        <CardTitle className="text-lg leading-snug">{q.question}</CardTitle>
        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => {
            const isAnswer = picked !== null && i === q.answer;
            const isWrongPick = picked === i && i !== q.answer;
            return (
              <button
                key={i}
                type="button"
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={cn(
                  "flex min-h-12 items-center gap-2 rounded-(--radius-control) border px-4 py-3 text-left text-base transition-colors",
                  picked === null && "border-border bg-surface hover:border-primary/40 hover:bg-surface-muted",
                  isAnswer && "border-primary bg-primary-soft text-foreground",
                  isWrongPick && "border-danger bg-danger-soft text-foreground",
                  picked !== null && !isAnswer && !isWrongPick && "border-border bg-surface opacity-60"
                )}
              >
                {isAnswer && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />}
                {isWrongPick && <XCircle className="h-5 w-5 shrink-0 text-danger" />}
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="flex flex-col gap-3">
            <p className="rounded-(--radius-control) bg-surface-muted p-3 text-sm text-foreground">{q.explanation}</p>
            <Button onClick={next}>{index + 1 >= deck.length ? "Zobacz wynik" : "Dalej"}</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
