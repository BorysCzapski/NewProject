"use client";

// ============================================================================
// components/mindmath/trainer.tsx
// Trening: wybór trybu/poziomu/długości → seria zadań z licznikiem czasu →
// podsumowanie z błędami. Zadania losujemy dopiero po kliknięciu "Start"
// (nie w renderze), czas liczymy od pierwszego zadania do ostatniej odpowiedzi.
// Wynik zapisuje Server Action; błąd zapisu nie psuje podsumowania.
// ============================================================================
import { useEffect, useRef, useState, useTransition } from "react";
import { RotateCcw, Timer } from "lucide-react";
import { saveMindMathSession } from "@/lib/mindmath/actions";
import { LEVELS, MODES, generateSession, type Level, type Problem } from "@/lib/mindmath/problems";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const COUNTS = [10, 20, 30];

interface Answered {
  problem: Problem;
  given: number | null;
  correct: boolean;
}

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function Trainer({ initialMode }: { initialMode: string }) {
  const [mode, setMode] = useState(MODES.some((m) => m.id === initialMode) ? initialMode : "mix");
  const [level, setLevel] = useState<Level>(1);
  const [count, setCount] = useState(10);

  const [phase, setPhase] = useState<"setup" | "running" | "done">("setup");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [answers, setAnswers] = useState<Answered[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);
  const startedAt = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => setElapsed((Date.now() - startedAt.current) / 1000), 250);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "running") inputRef.current?.focus();
  }, [phase, index]);

  function start() {
    setProblems(generateSession(mode, level, count));
    setAnswers([]);
    setIndex(0);
    setValue("");
    setElapsed(0);
    setSaveError(null);
    startedAt.current = Date.now();
    setPhase("running");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed === "") return;
    const given = Number(trimmed.replace(",", "."));
    const problem = problems[index];
    const entry: Answered = { problem, given: Number.isFinite(given) ? given : null, correct: given === problem.answer };
    const next = [...answers, entry];
    setAnswers(next);
    setValue("");

    if (index + 1 < problems.length) {
      setIndex(index + 1);
      return;
    }
    const seconds = Math.max(0.1, (Date.now() - startedAt.current) / 1000);
    setElapsed(seconds);
    setPhase("done");
    startTransition(async () => {
      const res = await saveMindMathSession({
        mode,
        level,
        total: next.length,
        correct: next.filter((a) => a.correct).length,
        seconds,
      });
      if (!res.ok) setSaveError(res.error);
    });
  }

  if (phase === "setup") {
    return (
      <div className="flex flex-col gap-5">
        <Card className="flex flex-col gap-3">
          <CardTitle>Tryb</CardTitle>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={cn(
                  "rounded-(--radius-control) border px-4 py-3 text-left transition-colors",
                  mode === m.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/50"
                )}
              >
                <p className="font-medium text-foreground">{m.label}</p>
                <p className="text-sm text-foreground-muted">{m.hint}</p>
              </button>
            ))}
          </div>
        </Card>
        <Card className="flex flex-col gap-4">
          <div>
            <CardTitle>Poziom</CardTitle>
            <Segmented
              options={LEVELS.map((l) => ({ value: l, label: l === 1 ? "Łatwy" : l === 2 ? "Średni" : "Trudny" }))}
              value={level}
              onChange={(v) => setLevel(v as Level)}
            />
          </div>
          <div>
            <CardTitle>Liczba zadań</CardTitle>
            <Segmented options={COUNTS.map((c) => ({ value: c, label: String(c) }))} value={count} onChange={setCount} />
          </div>
          <Button size="lg" onClick={start}>
            Start
          </Button>
        </Card>
      </div>
    );
  }

  if (phase === "running") {
    const problem = problems[index];
    return (
      <Card className="flex flex-col items-center gap-5 py-8">
        <div className="flex w-full items-center justify-between text-sm text-foreground-muted">
          <span className="tabular-nums">
            {index + 1} / {problems.length}
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <Timer className="h-4 w-4" />
            {fmt(elapsed)}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${(index / problems.length) * 100}%` }} />
        </div>
        <p className="text-center text-4xl font-bold tabular-nums text-foreground" aria-live="polite">
          {problem.text}
        </p>
        <form onSubmit={submit} className="flex w-full max-w-xs flex-col gap-3">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="numeric"
            autoComplete="off"
            aria-label="Twoja odpowiedź"
            className="text-center text-2xl"
          />
          <Button type="submit" disabled={value.trim() === ""}>
            Dalej (Enter)
          </Button>
        </form>
      </Card>
    );
  }

  const correctCount = answers.filter((a) => a.correct).length;
  const mistakes = answers.filter((a) => !a.correct);
  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col items-center gap-2 py-8 text-center">
        <p className="text-sm text-foreground-muted">Wynik</p>
        <p className="text-5xl font-bold tabular-nums text-foreground">
          {correctCount}/{answers.length}
        </p>
        <p className="text-foreground-muted">
          Czas {fmt(elapsed)} • średnio {(elapsed / answers.length).toFixed(1)} s na zadanie
        </p>
        {saveError && <p role="alert" className="text-sm text-danger">{saveError}</p>}
        <div className="mt-3 flex gap-2">
          <Button onClick={start}>
            <RotateCcw className="h-4 w-4" />
            Jeszcze raz
          </Button>
          <Button variant="outline" onClick={() => setPhase("setup")}>
            Zmień ustawienia
          </Button>
        </div>
      </Card>
      {mistakes.length > 0 && (
        <Card>
          <CardTitle>Do poprawy</CardTitle>
          <ul className="mt-2 flex flex-col">
            {mistakes.map((a, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3 border-t border-border/70 py-2 first:border-t-0">
                <span className="tabular-nums text-foreground">{a.problem.text}</span>
                <span className="text-sm tabular-nums">
                  <span className="text-danger line-through">{a.given ?? "—"}</span>{" "}
                  <span className="font-semibold text-primary">{a.problem.answer}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function Segmented<T extends number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="mt-2 flex gap-2" role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cn(
            "flex-1 rounded-(--radius-control) border px-3 py-2 text-sm font-medium transition-colors",
            value === o.value ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
