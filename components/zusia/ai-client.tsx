"use client";

// ============================================================================
// components/zusia/ai-client.tsx
// Zadania wygenerowane przez AI: choose lessons, kind (quiz / przypadki),
// difficulty and amount; the server action grounds the model in the lesson
// theory. The result runs through the same QuizRunner as Trening.
// ============================================================================
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { generateAiTasks } from "@/lib/zusia/ai-actions";
import { LESSONS } from "@/lib/zusia/theory";
import { shuffleOptions } from "@/lib/zusia/quiz";
import type { LessonId, Question } from "@/lib/zusia/types";
import { LessonPicker } from "./lesson-picker";
import { QuizRunner } from "./quiz-runner";

type Kind = "quiz" | "case";
type Difficulty = "latwy" | "sredni" | "trudny";

export function AiClient() {
  const [lessons, setLessons] = useState<LessonId[]>(["l1"]);
  const [kind, setKind] = useState<Kind>("quiz");
  const [difficulty, setDifficulty] = useState<Difficulty>("sredni");
  const [count, setCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<{ id: number; questions: Question[] } | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    const res = await generateAiTasks({ lessons, count, kind, difficulty });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSession({ id: Date.now(), questions: res.data.map(shuffleOptions) });
  }

  if (session) {
    return (
      <div className="flex flex-col gap-3">
        <QuizRunner
          key={session.id}
          questions={session.questions}
          mode="practice"
          title="Zadania AI"
          onExit={() => setSession(null)}
        />
        <Button variant="outline" onClick={generate} isLoading={loading}>
          <Sparkles className="h-4 w-4" /> Wygeneruj kolejne
        </Button>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  }

  const choice = <T extends string>(label: string, value: T, set: (v: T) => void, options: Array<[T, string]>) => (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map(([v, text]) => (
          <button
            key={v}
            type="button"
            aria-pressed={value === v}
            onClick={() => set(v)}
            className={cn(
              "rounded-(--radius-control) border py-2 text-sm font-medium transition-colors",
              value === v ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground-muted"
            )}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex gap-3 bg-primary-soft">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <p className="text-sm text-foreground-muted">
          AI układa <strong className="text-foreground">nowe</strong> zadania wyłącznie na podstawie teorii z wybranych działów – nie wymyśla przepisów. Zadania-przypadki możesz napisać własnymi słowami i dostać ocenę.
        </p>
      </Card>

      <LessonPicker value={lessons} onChange={setLessons} />

      {choice<Kind>("Rodzaj zadań", kind, setKind, [
        ["quiz", "Pytania testowe"],
        ["case", "Przypadki (otwarte)"],
      ])}
      {choice<Difficulty>("Poziom", difficulty, setDifficulty, [
        ["latwy", "Łatwy"],
        ["sredni", "Średni"],
        ["trudny", "Olimpijski"],
      ])}
      {choice<string>("Liczba zadań", String(count), (v) => setCount(Number(v)), [
        ["4", "4"],
        ["6", "6"],
        ["10", "10"],
      ])}

      {error && <p className="rounded-(--radius-control) bg-danger-soft p-3 text-sm text-danger">{error}</p>}

      <Button size="lg" onClick={generate} isLoading={loading} disabled={lessons.length === 0 || lessons.length > LESSONS.length}>
        <Sparkles className="h-5 w-5" /> {loading ? "Generuję…" : "Wygeneruj zadania"}
      </Button>
    </div>
  );
}
