"use client";

// ============================================================================
// components/biznes/sheet-runner.tsx
// Solves a full exam sheet: context blocks are read-only, every task has an
// answer box, an AI check (graded against the matching knowledge-base
// articles - the sheets have no answer key) and a manual score the student
// can always override. Answers and scores live in localStorage per sheet; the
// final score is saved to the shared test history.
// ============================================================================
import { useState } from "react";
import { Check, ExternalLink, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { gradeSheetTask, type SheetGrade } from "@/lib/biznes/ai-actions";
import type { Sheet, SheetItem } from "@/lib/biznes/sheets";
import { TESTS_KEY, useLocalState, type TestResult } from "@/lib/biznes/use-local-state";

interface SheetState {
  answers: Record<string, string>;
  scores: Record<string, number>;
  grades: Record<string, SheetGrade>;
}
const EMPTY: SheetState = { answers: {}, scores: {}, grades: {} };

export function SheetRunner({ sheet }: { sheet: Sheet }) {
  const [state, update, ready] = useLocalState<SheetState>(`biznes:sheet:${sheet.slug}:v1`, EMPTY);
  const [, updateTests] = useLocalState<TestResult[]>(TESTS_KEY, []);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<{ id: string; message: string } | null>(null);
  const [saved, setSaved] = useState(false);

  const tasks = sheet.items.filter((i) => i.kind === "task");
  const total = tasks.reduce((n, t) => n + (state.scores[t.id] ?? 0), 0);
  const answered = tasks.filter((t) => (state.answers[t.id] ?? "").trim().length > 0).length;

  // A task's own wording is rarely enough: prepend the context of its zadanie.
  function taskPrompt(task: SheetItem): string {
    const ctx = sheet.items.find((i) => i.kind === "context" && i.number === task.number);
    return [ctx?.text, `Zadanie ${task.label}.`, task.text].filter(Boolean).join("\n\n");
  }

  async function check(task: SheetItem) {
    setBusy(task.id);
    setError(null);
    const res = await gradeSheetTask({ task: taskPrompt(task), points: task.points, studentAnswer: state.answers[task.id] ?? "" });
    setBusy(null);
    if (!res.ok) return setError({ id: task.id, message: res.error });
    update((s) => ({ ...s, grades: { ...s.grades, [task.id]: res.data }, scores: { ...s.scores, [task.id]: res.data.score } }));
  }

  function saveResult() {
    updateTests((prev) => [{ at: Date.now(), total: sheet.maxPoints, correct: total, label: `Arkusz: ${sheet.title}` }, ...prev].slice(0, 30));
    setSaved(true);
  }

  if (!ready) return <p className="text-sm text-foreground-muted">Wczytywanie…</p>;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex items-center justify-between gap-3 p-3.5">
        <div>
          <p className="text-xs text-foreground-muted">Twój wynik</p>
          <p className="text-xl font-bold text-foreground">
            {total} / {sheet.maxPoints} pkt
          </p>
          <p className="text-xs text-foreground-muted">
            odpowiedzi: {answered}/{tasks.length}
          </p>
        </div>
        <a href={sheet.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-medium text-primary">
          Oryginał z wykresami <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </Card>

      {sheet.items.map((item) =>
        item.kind === "context" ? (
          <section key={item.id} className="rounded-(--radius-card) bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Zadanie {item.label}</p>
            <p className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed text-foreground-muted">{item.text}</p>
          </section>
        ) : (
          <Card key={item.id} className="flex flex-col gap-3 p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">Zadanie {item.label}</p>
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                {item.points} pkt
              </span>
            </div>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground">{item.text}</p>

            <textarea
              value={state.answers[item.id] ?? ""}
              onChange={(e) => update((s) => ({ ...s, answers: { ...s.answers, [item.id]: e.target.value } }))}
              rows={4}
              placeholder="Wpisz swoją odpowiedź…"
              aria-label={`Odpowiedź do zadania ${item.label}`}
              className="w-full rounded-(--radius-control) border border-border bg-surface p-3 text-[15px] text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none"
            />

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => check(item)} isLoading={busy === item.id} disabled={(state.answers[item.id] ?? "").trim().length < 2}>
                <Sparkles className="h-4 w-4" /> Oceń z AI
              </Button>
              <div className="flex items-center gap-1" role="group" aria-label="Punkty">
                <span className="mr-1 text-xs text-foreground-muted">Punkty:</span>
                {Array.from({ length: item.points + 1 }, (_, p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => update((s) => ({ ...s, scores: { ...s.scores, [item.id]: p } }))}
                    className={cn(
                      "h-8 w-8 rounded-full border text-sm font-medium",
                      state.scores[item.id] === p ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-foreground"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {error?.id === item.id && <p className="text-sm text-danger">{error.message}</p>}
            {state.grades[item.id] && (
              <div className="rounded-(--radius-control) bg-primary-soft p-3 text-sm">
                <p className="font-semibold text-foreground">Ocena AI: {state.grades[item.id].score}/{item.points} pkt</p>
                <p className="mt-0.5 text-foreground-muted">{state.grades[item.id].verdict}</p>
                {state.grades[item.id].missing.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-foreground-muted">
                    {state.grades[item.id].missing.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-foreground">Wzór (AI)</p>
                <p className="text-foreground-muted">{state.grades[item.id].modelAnswer}</p>
              </div>
            )}
          </Card>
        )
      )}

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <Button size="lg" onClick={saveResult} disabled={saved}>
          <Check className="h-5 w-5" /> {saved ? "Wynik zapisany" : `Zapisz wynik (${total}/${sheet.maxPoints})`}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (window.confirm("Wyczyścić odpowiedzi i punkty tego arkusza?")) {
              update(() => EMPTY);
              setSaved(false);
            }
          }}
        >
          <RotateCcw className="h-4 w-4" /> Zacznij od nowa
        </Button>
      </div>
    </div>
  );
}
