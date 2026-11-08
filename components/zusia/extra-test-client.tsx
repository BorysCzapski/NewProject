"use client";

// ============================================================================
// components/zusia/extra-test-client.tsx
// „Test z materiałów dodatkowych": arkusz 2026 (lib/zusia/arkusz.ts) w trybie
// egzaminu — bez podpowiedzi do końca, opcjonalny limit czasu, wynik i analiza
// błędów (to samo QuizRunner co w „Test – wszystkie zadania").
//
// Domyślnie zadania i odpowiedzi zostają w oryginalnej kolejności: to arkusz z
// numeracją i kluczem, więc litery A–D mają odpowiadać wydrukowi. Mieszanie można
// włączyć, gdy ktoś woli sprawdzić wiedzę zamiast zapamiętanej kolejności.
// ============================================================================
import { useState } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ARKUSZ_2026, ARKUSZ_FIRST, ARKUSZ_LAST, ARKUSZ_TITLE } from "@/lib/zusia/arkusz";
import { shuffle, shuffleOptions } from "@/lib/zusia/quiz";
import { TESTS_KEY, useLocalState, type TestResult } from "@/lib/zusia/use-local-state";
import type { Question } from "@/lib/zusia/types";
import { QuizRunner } from "./quiz-runner";

const LIMITS: Array<{ label: string; seconds: number | undefined }> = [
  { label: "Bez limitu", seconds: undefined },
  { label: "30 min", seconds: 30 * 60 },
  { label: "60 min", seconds: 60 * 60 },
  { label: "90 min", seconds: 90 * 60 },
];

export function ExtraTestClient() {
  const [limit, setLimit] = useState<number | undefined>(undefined);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [session, setSession] = useState<{ id: number; questions: Question[]; limit?: number } | null>(null);

  function start() {
    const base = shuffleQuestions ? shuffle(ARKUSZ_2026) : ARKUSZ_2026;
    setSession({ id: Date.now(), questions: shuffleAnswers ? base.map(shuffleOptions) : base, limit });
  }

  if (session) {
    return (
      <QuizRunner
        key={session.id}
        questions={session.questions}
        mode="exam"
        title={ARKUSZ_TITLE}
        timeLimit={session.limit}
        recordStats={false}
        onExit={() => setSession(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-1.5">
        <p className="text-base font-semibold text-foreground">Arkusz 2026</p>
        <p className="text-sm text-foreground-muted">
          {ARKUSZ_2026.length} zadań jednokrotnego wyboru z kluczem odpowiedzi, przepisanych z wydruku „Lekcje z ZUS | Arkusz 2026”
          (zadania {ARKUSZ_FIRST}–{ARKUSZ_LAST}).
        </p>
      </Card>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">Limit czasu</p>
        <div className="grid grid-cols-4 gap-2">
          {LIMITS.map((l) => (
            <button
              key={l.label}
              type="button"
              aria-pressed={limit === l.seconds}
              onClick={() => setLimit(l.seconds)}
              className={cn(
                "rounded-(--radius-control) border py-2 text-xs font-medium",
                limit === l.seconds ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground-muted"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {(
          [
            ["Losowa kolejność zadań", shuffleQuestions, setShuffleQuestions],
            ["Losowa kolejność odpowiedzi (A–D nie będą jak na wydruku)", shuffleAnswers, setShuffleAnswers],
          ] as const
        ).map(([label, on, set]) => (
          <label key={label} className="flex items-center justify-between gap-3 rounded-(--radius-control) border border-border bg-surface px-3.5 py-3 text-sm text-foreground">
            {label}
            <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="h-5 w-5 shrink-0 accent-[var(--primary)]" />
          </label>
        ))}
      </div>

      <Card className="flex flex-col gap-3">
        <p className="text-sm text-foreground-muted">Odpowiedzi poznasz dopiero po zakończeniu testu.</p>
        <Button size="lg" onClick={start}>
          Rozpocznij test ({ARKUSZ_2026.length} zadań)
        </Button>
      </Card>

      <PastAttempts />
    </div>
  );
}

/**
 * Osobny komponent, żeby montował się od nowa przy każdym powrocie na ekran
 * startowy. useLocalState czyta localStorage tylko przy montowaniu, a wynik
 * zapisuje inna instancja (QuizRunner), więc lista trzymana w ExtraTestClient
 * nie pokazałaby podejścia, które właśnie się skończyło, aż do przeładowania.
 */
function PastAttempts() {
  const [results] = useLocalState<TestResult[]>(TESTS_KEY, []);
  const past = results.filter((r) => r.label === ARKUSZ_TITLE);
  if (past.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <History className="h-4 w-4 text-foreground-muted" /> Ostatnie podejścia do arkusza
      </h2>
      {past.slice(0, 5).map((r) => (
        <div key={r.at} className="flex items-center justify-between rounded-(--radius-control) border border-border bg-surface px-3.5 py-2.5 text-sm">
          <span className="min-w-0 truncate text-foreground-muted">{new Date(r.at).toLocaleDateString("pl-PL")}</span>
          <span className="shrink-0 font-semibold text-primary">
            {r.total ? Math.round((r.correct / r.total) * 100) : 0}% <span className="font-normal text-foreground-muted">({r.correct}/{r.total})</span>
          </span>
        </div>
      ))}
    </section>
  );
}
