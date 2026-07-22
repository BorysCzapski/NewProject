"use client";

// ============================================================================
// components/matma/exam/exam-runner.tsx
// Full 180-min / 50-pkt mock exam runner: countdown timer, an exam-booklet
// style problem-number pill row (tap to jump), per-problem answer/method
// text fields with debounced autosave (no ink canvas in this pass — exam
// answers are text/method only here, to keep this area self-contained
// without the canvas component owned by a different parallel work area),
// and the "Zakończ i sprawdź" finish flow — also triggered automatically,
// with no extra confirmation, when the timer hits zero.
// ============================================================================
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MathText } from "@/components/matma/math";
import { ExamTimer } from "@/components/matma/exam/exam-timer";
import { finishMockExam, saveMockExamDraftAnswer } from "@/lib/matma/actions";
import { cn } from "@/lib/utils";
import type { MathMockExam, MathProblem } from "@/lib/types/database";

const AUTOSAVE_DELAY_MS = 3000;

const textareaClassName = cn(
  "w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground",
  "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary",
  "disabled:opacity-60"
);

interface DraftState {
  answerText: string;
  methodDescription: string;
}

function initialDrafts(exam: MathMockExam, problems: MathProblem[]): Record<string, DraftState> {
  const drafts: Record<string, DraftState> = {};
  for (const problem of problems) {
    const saved = exam.draft_answers[problem.id];
    drafts[problem.id] = {
      answerText: saved?.answerText ?? "",
      methodDescription: saved?.methodDescription ?? "",
    };
  }
  return drafts;
}

export function ExamRunner({ exam, problems }: { exam: MathMockExam; problems: MathProblem[] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, DraftState>>(() => initialDrafts(exam, problems));
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFinishing, startFinishTransition] = useTransition();

  // Refs so the debounce/unmount/timer callbacks always see the latest
  // values without having to be re-created (and re-subscribed) every render.
  // Per the react-hooks refs rule these are only ever written from inside
  // event handlers (updateDraft/goToProblem below), never during render.
  const draftsRef = useRef(drafts);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentProblem = problems[currentIndex] as MathProblem | undefined;
  const currentProblemIdRef = useRef(currentProblem?.id);

  const flushSave = useCallback(
    (problemId: string | undefined) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      if (!problemId) return;
      const draft = draftsRef.current[problemId];
      if (!draft) return;
      // Fire-and-forget: autosave must never block navigation or typing.
      saveMockExamDraftAnswer(exam.id, problemId, {
        answerText: draft.answerText.trim() ? draft.answerText : null,
        methodDescription: draft.methodDescription.trim() ? draft.methodDescription : null,
        canvasImageDataUrl: null,
      }).catch(() => {
        // Transient autosave hiccup — the next debounce/blur/finish flush will retry.
      });
    },
    [exam.id]
  );

  function scheduleSave(problemId: string) {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => flushSave(problemId), AUTOSAVE_DELAY_MS);
  }

  // Flush any pending debounced edit once, on unmount (e.g. exam finished).
  useEffect(() => {
    return () => flushSave(currentProblemIdRef.current);
  }, [flushSave]);

  function updateDraft(problemId: string, patch: Partial<DraftState>) {
    // Written synchronously (not via a setState updater) so flushSave always
    // sees the just-typed value even if it runs before the next re-render
    // commits (e.g. a blur that follows a keystroke within the same tick).
    const next = { ...draftsRef.current, [problemId]: { ...draftsRef.current[problemId], ...patch } };
    draftsRef.current = next;
    setDrafts(next);
    scheduleSave(problemId);
  }

  function goToProblem(index: number) {
    if (index === currentIndex || index < 0 || index >= problems.length) return;
    flushSave(currentProblem?.id);
    currentProblemIdRef.current = problems[index]?.id;
    setCurrentIndex(index);
  }

  const finish = useCallback(() => {
    setError(null);
    flushSave(currentProblemIdRef.current);
    startFinishTransition(async () => {
      try {
        const result = await finishMockExam(exam.id);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        // Server Component parent re-fetches the now-completed exam row.
        router.refresh();
      } catch {
        setError("Nie udało się zakończyć egzaminu. Spróbuj ponownie.");
      }
    });
  }, [exam.id, flushSave, router]);

  if (!currentProblem) {
    return (
      <Card className="mx-auto mt-6 max-w-lg text-center text-sm text-foreground-muted">
        Ten egzamin nie ma żadnych zadań.
      </Card>
    );
  }

  const draft = drafts[currentProblem.id] ?? { answerText: "", methodDescription: "" };

  return (
    <div>
      <div
        className="sticky top-0 z-30 border-b border-border bg-background/95 px-5 pb-3 backdrop-blur"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
              Egzamin próbny
            </p>
            <p className="text-sm text-foreground-muted">
              Zadanie {currentIndex + 1} z {problems.length}
            </p>
          </div>
          <ExamTimer startedAt={exam.started_at} timeLimitSeconds={exam.time_limit_seconds} onExpire={finish} />
        </div>
        <div className="mx-auto mt-3 flex max-w-lg gap-1.5 overflow-x-auto pb-1">
          {problems.map((p, i) => {
            const hasDraft = !!(drafts[p.id]?.answerText.trim() || drafts[p.id]?.methodDescription.trim());
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => goToProblem(i)}
                className={cn(
                  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  i === currentIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-muted text-foreground-muted hover:bg-surface"
                )}
              >
                {i + 1}
                {hasDraft && i !== currentIndex && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Card className="flex flex-col gap-2">
          <p className="text-xs font-medium text-foreground-muted">{currentProblem.points_max} pkt</p>
          <MathText text={currentProblem.content.statement} className="text-base text-foreground" />
        </Card>

        <Card className="flex flex-col gap-4">
          {currentProblem.is_proof ? (
            <div>
              <Label htmlFor="exam-answer">Twój dowód / tok rozumowania</Label>
              <textarea
                id="exam-answer"
                rows={8}
                value={draft.answerText}
                disabled={isFinishing}
                onChange={(e) => updateDraft(currentProblem.id, { answerText: e.target.value })}
                onBlur={() => flushSave(currentProblem.id)}
                placeholder="Zapisz tu pełny tok dowodu…"
                className={textareaClassName}
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="exam-answer">Twoja odpowiedź (wynik)</Label>
              <Input
                id="exam-answer"
                value={draft.answerText}
                disabled={isFinishing}
                onChange={(e) => updateDraft(currentProblem.id, { answerText: e.target.value })}
                onBlur={() => flushSave(currentProblem.id)}
                placeholder="np. x = 3"
              />
            </div>
          )}

          <div>
            <Label htmlFor="exam-method">Opisz metodę / kluczowe kroki</Label>
            <textarea
              id="exam-method"
              rows={4}
              value={draft.methodDescription}
              disabled={isFinishing}
              onChange={(e) => updateDraft(currentProblem.id, { methodDescription: e.target.value })}
              onBlur={() => flushSave(currentProblem.id)}
              placeholder="Krótko opisz, jak podszedłeś/-aś do zadania — liczą się punkty cząstkowe za metodę."
              className={textareaClassName}
            />
          </div>
        </Card>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={currentIndex === 0}
            onClick={() => goToProblem(currentIndex - 1)}
          >
            <ChevronLeft className="h-4 w-4" /> Poprzednie
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={currentIndex === problems.length - 1}
            onClick={() => goToProblem(currentIndex + 1)}
          >
            Następne <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {confirmFinish ? (
          <Card className="flex flex-col gap-3 bg-warning-soft">
            <div className="flex gap-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <p className="text-sm text-foreground">
                Na pewno chcesz zakończyć egzamin teraz? Wszystkie odpowiedzi zostaną ocenione, a
                egzaminu nie da się już wznowić.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={isFinishing}
                onClick={() => setConfirmFinish(false)}
              >
                Wróć do egzaminu
              </Button>
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                isLoading={isFinishing}
                onClick={finish}
              >
                Tak, zakończ i sprawdź
              </Button>
            </div>
          </Card>
        ) : (
          <Button
            type="button"
            size="lg"
            variant="danger"
            className="w-full"
            disabled={isFinishing}
            onClick={() => setConfirmFinish(true)}
          >
            <Send className="h-4 w-4" /> Zakończ i sprawdź
          </Button>
        )}

        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    </div>
  );
}
