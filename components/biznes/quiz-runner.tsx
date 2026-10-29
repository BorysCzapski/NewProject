"use client";

// ============================================================================
// components/biznes/quiz-runner.tsx
// Runs a list of questions in one of two modes:
//  - "practice" (Trening, zadania AI): feedback + explanation right after each
//    answer;
//  - "exam" (Test – wszystkie zadania): free navigation, no feedback until the
//    end, optional time limit, then a scored review.
// Open tasks (case studies) are written out, compared with the model answer
// and optionally graded by AI; they are not part of the numeric score.
// ============================================================================
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Clock, RotateCcw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { isCorrect, TYPE_LABELS } from "@/lib/biznes/quiz";
import { gradeOpenAnswer, type OpenGrade } from "@/lib/biznes/ai-actions";
import { getLesson } from "@/lib/biznes/lessons";
import { STATS_KEY, TESTS_KEY, useLocalState, type QuestionStats, type TestResult } from "@/lib/biznes/use-local-state";
import type { Question } from "@/lib/biznes/types";
import { RichText } from "./rich-text";

interface Props {
  questions: Question[];
  mode: "practice" | "exam";
  title: string;
  /** Seconds; exam mode only. */
  timeLimit?: number;
  onExit: () => void;
  onRetry?: (wrong: Question[]) => void;
}

const LETTERS = ["A", "B", "C", "D", "E"];

function displayOrder(q: Question): number[] {
  // True/false: store [fałsz, prawda]; show "Prawda" first.
  if (q.type === "tf") return [1, 0];
  return (q.options ?? []).map((_, i) => i);
}

function optionsOf(q: Question): string[] {
  return q.type === "tf" ? ["Fałsz", "Prawda"] : (q.options ?? []);
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function QuizRunner({ questions, mode, title, timeLimit, onExit, onRetry }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [openTexts, setOpenTexts] = useState<Record<string, string>>({});
  const [openSelf, setOpenSelf] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [remaining, setRemaining] = useState(timeLimit ?? 0);
  const [, setStats] = useLocalState<QuestionStats>(STATS_KEY, {});
  const [, setTests] = useLocalState<TestResult[]>(TESTS_KEY, []);
  const savedRef = useRef(false);

  const q = questions[index];
  const closed = useMemo(() => questions.filter((x) => x.type !== "open"), [questions]);
  const correctCount = closed.filter((x) => isCorrect(x, answers[x.id] ?? [])).length;

  const finish = useCallback(() => setFinished(true), []);

  // Exam timer: counts down locally and ends the test when it reaches zero.
  useEffect(() => {
    if (mode !== "exam" || !timeLimit || finished) return;
    let left = timeLimit;
    const id = window.setInterval(() => {
      left -= 1;
      setRemaining(left);
      if (left <= 0) {
        window.clearInterval(id);
        setFinished(true);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [mode, timeLimit, finished]);

  // Persist exam results + per-question stats once at the end.
  useEffect(() => {
    if (!finished || savedRef.current) return;
    savedRef.current = true;
    if (mode === "exam") {
      setStats((prev) => {
        const next = { ...prev };
        for (const x of closed) {
          if (!(x.id in answers)) continue;
          const s = next[x.id] ?? { ok: 0, wrong: 0 };
          next[x.id] = isCorrect(x, answers[x.id]) ? { ...s, ok: s.ok + 1 } : { ...s, wrong: s.wrong + 1 };
        }
        return next;
      });
    }
    setTests((prev) => [{ at: Date.now(), total: closed.length, correct: correctCount, label: title }, ...prev].slice(0, 30));
  }, [finished, mode, closed, answers, correctCount, title, setStats, setTests]);

  function recordPractice(question: Question, selected: number[]) {
    if (question.type === "open") return;
    const ok = isCorrect(question, selected);
    setStats((prev) => {
      const s = prev[question.id] ?? { ok: 0, wrong: 0 };
      return { ...prev, [question.id]: ok ? { ...s, ok: s.ok + 1 } : { ...s, wrong: s.wrong + 1 } };
    });
  }

  function select(i: number) {
    if (!q || q.type === "open") return;
    if (mode === "practice" && checked[q.id]) return;
    if (q.type === "multi") {
      setAnswers((a) => {
        const cur = a[q.id] ?? [];
        return { ...a, [q.id]: cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i] };
      });
    } else {
      setAnswers((a) => ({ ...a, [q.id]: [i] }));
      if (mode === "practice") {
        setChecked((c) => ({ ...c, [q.id]: true }));
        recordPractice(q, [i]);
      }
    }
  }

  function checkMulti() {
    if (!q) return;
    setChecked((c) => ({ ...c, [q.id]: true }));
    recordPractice(q, answers[q.id] ?? []);
  }

  if (questions.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-foreground-muted">Brak pytań dla tego wyboru.</p>
        <Button className="mt-3" variant="outline" onClick={onExit}>
          Wróć
        </Button>
      </Card>
    );
  }

  // ---------------------------------------------------------------- results
  if (finished || (mode === "practice" && index >= questions.length)) {
    const answeredClosed = closed.filter((x) => (answers[x.id] ?? []).length > 0);
    const pct = closed.length ? Math.round((correctCount / closed.length) * 100) : 0;
    const wrong = closed.filter((x) => !isCorrect(x, answers[x.id] ?? []));
    const opens = questions.filter((x) => x.type === "open");
    return (
      <div className="flex flex-col gap-4">
        <Card className="text-center">
          <p className="text-sm text-foreground-muted">{title}</p>
          <p className="mt-1 text-5xl font-bold tracking-tight text-foreground">{pct}%</p>
          <p className="mt-1 text-sm text-foreground-muted">
            {correctCount} / {closed.length} poprawnie
            {mode === "exam" && answeredClosed.length < closed.length ? ` · bez odpowiedzi: ${closed.length - answeredClosed.length}` : ""}
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {pct >= 90 ? "Znakomicie – jesteś gotowy na maturę!" : pct >= 70 ? "Dobrze! Jeszcze kilka rzeczy do dopracowania." : pct >= 50 ? "Niezły start – wróć do teorii i powtórz błędne." : "Zacznij od teorii i fiszek, potem wróć do zadań."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {onRetry && wrong.length > 0 && (
              <Button onClick={() => onRetry(wrong)}>
                <RotateCcw className="h-4 w-4" /> Powtórz błędne ({wrong.length})
              </Button>
            )}
            <Button variant="outline" onClick={onExit}>
              Zakończ
            </Button>
          </div>
        </Card>

        {wrong.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">Do poprawy</h2>
            {wrong.map((w) => (
              <ReviewItem key={w.id} q={w} selected={answers[w.id] ?? []} />
            ))}
          </section>
        )}

        {opens.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">Zadania otwarte – wzorcowe odpowiedzi</h2>
            {opens.map((o) => (
              <Card key={o.id}>
                <p className="text-sm font-medium text-foreground">{o.prompt}</p>
                {openTexts[o.id] && <p className="mt-2 rounded-lg bg-surface-muted p-2 text-sm text-foreground-muted">Twoja odpowiedź: {openTexts[o.id]}</p>}
                <p className="mt-2 text-sm text-foreground-muted">
                  <span className="font-semibold text-primary">Wzór: </span>
                  <RichText text={o.explanation} />
                </p>
              </Card>
            ))}
          </section>
        )}
      </div>
    );
  }

  const isChecked = mode === "practice" && checked[q.id];
  const selected = answers[q.id] ?? [];
  const order = displayOrder(q);
  const opts = optionsOf(q);
  const answeredCount = questions.filter((x) => (answers[x.id] ?? []).length > 0 || (x.type === "open" && openTexts[x.id])).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={onExit} className="text-sm text-foreground-muted underline-offset-2 hover:underline">
          ← Wyjdź
        </button>
        <p className="text-sm font-medium text-foreground-muted">
          {index + 1} / {questions.length}
        </p>
        {mode === "exam" && timeLimit ? (
          <p className={cn("flex items-center gap-1 text-sm font-semibold tabular-nums", remaining < 60 ? "text-danger" : "text-foreground")}>
            <Clock className="h-4 w-4" /> {formatTime(remaining)}
          </p>
        ) : (
          <span className="w-12" />
        )}
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={index + 1}>
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
          <span className="rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">{getLesson(q.lesson)?.short}</span>
          <span>{TYPE_LABELS[q.type]}</span>
          {q.source && <span className="opacity-70">· {q.source}</span>}
        </div>
        <p className="text-base font-semibold leading-snug text-foreground">{q.prompt}</p>
        {q.type === "multi" && <p className="-mt-2 text-xs text-foreground-muted">Zaznacz wszystkie poprawne odpowiedzi.</p>}

        {q.type === "open" ? (
          <OpenTask
            key={q.id}
            q={q}
            text={openTexts[q.id] ?? ""}
            onText={(t) => setOpenTexts((o) => ({ ...o, [q.id]: t }))}
            self={openSelf[q.id]}
            onSelf={(ok) => setOpenSelf((s) => ({ ...s, [q.id]: ok }))}
            showModel={mode === "practice"}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {order.map((i, pos) => {
              const isSel = selected.includes(i);
              const isRight = q.correct?.includes(i) ?? false;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(i)}
                  disabled={!!isChecked}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-(--radius-control) border px-3.5 py-3 text-left text-[15px] transition-colors",
                    !isChecked && (isSel ? "border-primary bg-primary-soft" : "border-border bg-surface hover:bg-surface-muted"),
                    isChecked && isRight && "border-primary bg-primary-soft",
                    isChecked && isSel && !isRight && "border-danger bg-danger-soft"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                      isSel || (isChecked && isRight) ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground-muted",
                      isChecked && isSel && !isRight && "border-danger bg-danger text-white"
                    )}
                  >
                    {isChecked && isRight ? <Check className="h-3.5 w-3.5" /> : isChecked && isSel ? <X className="h-3.5 w-3.5" /> : q.type === "tf" ? pos + 1 : LETTERS[pos]}
                  </span>
                  <span className="text-foreground">{opts[i]}</span>
                </button>
              );
            })}
          </div>
        )}

        {isChecked && q.type !== "open" && (
          <div
            className={cn(
              "rounded-(--radius-control) p-3 text-sm",
              isCorrect(q, selected) ? "bg-primary-soft text-foreground" : "bg-warning-soft text-foreground"
            )}
          >
            <p className="font-semibold">{isCorrect(q, selected) ? "Dobrze!" : "Niepoprawnie."}</p>
            <p className="mt-0.5 text-foreground-muted">
              <RichText text={q.explanation} />
            </p>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          <ChevronLeft className="h-4 w-4" /> Wstecz
        </Button>

        {mode === "practice" && q.type === "multi" && !isChecked ? (
          <Button size="sm" onClick={checkMulti} disabled={selected.length === 0}>
            Sprawdź
          </Button>
        ) : index < questions.length - 1 ? (
          <Button size="sm" onClick={() => setIndex((i) => i + 1)} disabled={mode === "practice" && q.type !== "open" && !isChecked}>
            Dalej <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" onClick={finish} disabled={mode === "practice" && q.type !== "open" && !isChecked}>
            Zakończ
          </Button>
        )}
      </div>

      {mode === "exam" && (
        <div className="flex flex-col gap-2 border-t border-border pt-3">
          <div className="flex flex-wrap gap-1.5">
            {questions.map((x, i) => {
              const done = (answers[x.id] ?? []).length > 0 || !!openTexts[x.id];
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Pytanie ${i + 1}`}
                  className={cn(
                    "h-8 w-8 rounded-lg border text-xs font-medium",
                    i === index ? "border-primary bg-primary text-primary-foreground" : done ? "border-primary/40 bg-primary-soft text-primary" : "border-border text-foreground-muted"
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <Button variant="secondary" onClick={finish}>
            Zakończ test ({answeredCount}/{questions.length} z odpowiedzią)
          </Button>
        </div>
      )}
    </div>
  );
}

function ReviewItem({ q, selected }: { q: Question; selected: number[] }) {
  const opts = optionsOf(q);
  return (
    <Card className="text-sm">
      <p className="font-medium text-foreground">{q.prompt}</p>
      <p className="mt-2 text-foreground-muted">
        <span className="font-semibold text-danger">Twoja odpowiedź: </span>
        {selected.length ? selected.map((i) => opts[i]).join("; ") : "brak"}
      </p>
      <p className="mt-1 text-foreground-muted">
        <span className="font-semibold text-primary">Poprawnie: </span>
        {(q.correct ?? []).map((i) => opts[i]).join("; ")}
      </p>
      <p className="mt-1 text-foreground-muted">
        <RichText text={q.explanation} />
      </p>
    </Card>
  );
}

function OpenTask({
  q,
  text,
  onText,
  self,
  onSelf,
  showModel,
}: {
  q: Question;
  text: string;
  onText: (t: string) => void;
  self: boolean | undefined;
  onSelf: (ok: boolean) => void;
  showModel: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const [grading, setGrading] = useState(false);
  const [grade, setGrade] = useState<OpenGrade | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function askAi() {
    setGrading(true);
    setError(null);
    const res = await gradeOpenAnswer({ lesson: q.lesson, task: q.prompt, modelAnswer: q.explanation, studentAnswer: text });
    setGrading(false);
    if (res.ok) setGrade(res.data);
    else setError(res.error);
  }

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => onText(e.target.value)}
        rows={5}
        placeholder="Wpisz swoją odpowiedź…"
        className="w-full rounded-(--radius-control) border border-border bg-surface p-3 text-[15px] text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none"
      />
      {showModel && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setRevealed(true)} disabled={revealed}>
            Pokaż wzór
          </Button>
          <Button size="sm" variant="secondary" onClick={askAi} isLoading={grading} disabled={text.trim().length < 3}>
            <Sparkles className="h-4 w-4" /> Oceń z AI
          </Button>
        </div>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
      {grade && (
        <div className="rounded-(--radius-control) bg-primary-soft p-3 text-sm">
          <p className="font-semibold text-foreground">Ocena AI: {grade.score}/100</p>
          <p className="mt-0.5 text-foreground-muted">{grade.verdict}</p>
          {grade.missing.length > 0 && (
            <ul className="mt-1 list-disc pl-5 text-foreground-muted">
              {grade.missing.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {revealed && (
        <div className="rounded-(--radius-control) bg-warning-soft p-3 text-sm">
          <p className="font-semibold text-foreground">Wzorcowa odpowiedź</p>
          <p className="mt-0.5 text-foreground-muted">
            <RichText text={q.explanation} />
          </p>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant={self === true ? "primary" : "outline"} onClick={() => onSelf(true)}>
              Zgadza się
            </Button>
            <Button size="sm" variant={self === false ? "danger" : "outline"} onClick={() => onSelf(false)}>
              Do poprawy
            </Button>
          </div>
        </div>
      )}
      {!showModel && <p className="text-xs text-foreground-muted">Wzorcowa odpowiedź pojawi się po zakończeniu testu.</p>}
    </div>
  );
}
