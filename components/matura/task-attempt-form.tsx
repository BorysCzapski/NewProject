"use client";

// ============================================================================
// components/matura/task-attempt-form.tsx
// Renders one exact-match task (środki językowe / czytanie / słuchanie) — a
// group of graded sub-items — as a single form — the whole task is
// submitted and graded at once, matching how CKE numbers a task as one unit
// (e.g. "zadanie 4.1-4.5"), unlike the grammar module's one-exercise-at-a-
// time stepper. Grading happens server-side (see submitTaskAttempt) — the
// client never sees correct answers before submitting. Listening tasks
// (content.youtubeVideoId set) embed the real recording via the same
// YoutubePlayer Linguo's listening module uses — no seek/gap-sync needed
// here, just playback.
// ============================================================================
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { YoutubePlayer } from "@/components/listening/youtube-player";
import { cn } from "@/lib/utils";
import { submitTaskAttempt } from "@/lib/matura/actions";
import type { MaturaTask, MaturaTaskItemResult } from "@/lib/types/database";

export function TaskAttemptForm({ task, backHref }: { task: MaturaTask; backHref: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ pointsAwarded: number; maxPoints: number; itemResults: MaturaTaskItemResult[] } | null>(null);

  const allAnswered = task.content.items.every((item) => (answers[item.id] ?? "").trim().length > 0);

  async function submit() {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError(null);
    const res = await submitTaskAttempt({ taskId: task.id, answers });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setResult({
      pointsAwarded: res.data.points_awarded,
      maxPoints: res.data.max_points,
      itemResults: res.data.item_results,
    });
  }

  const resultByItem = new Map((result?.itemResults ?? []).map((r) => [r.itemId, r]));

  return (
    <div className="flex flex-col gap-4">
      {task.content.youtubeVideoId && <YoutubePlayer videoId={task.content.youtubeVideoId} />}

      <Card>
        <CardDescription>{task.content.instructions}</CardDescription>
        {task.content.passage && (
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">{task.content.passage}</p>
        )}
      </Card>

      {task.content.items.map((item, i) => {
        const itemResult = resultByItem.get(item.id);
        return (
          <Card key={item.id}>
            <p className="text-xs font-semibold text-foreground-muted">Zadanie {i + 1}</p>
            <p className="mt-1 text-base leading-relaxed text-foreground">{item.prompt}</p>

            {item.type === "multiple_choice" ? (
              <div className="mt-3 flex flex-col gap-2">
                {(item.options ?? []).map((option) => {
                  const isSelected = answers[item.id] === option;
                  const isRightAnswer = item.correctAnswers.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={!!result}
                      onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: option }))}
                      className={cn(
                        "rounded-(--radius-control) border px-4 py-3 text-left text-base transition-colors",
                        !result && isSelected && "border-primary bg-primary-soft",
                        !result && !isSelected && "border-border bg-surface active:bg-surface-muted",
                        result && isRightAnswer && "border-primary bg-primary-soft text-primary",
                        result && isSelected && !isRightAnswer && "border-danger bg-danger-soft text-danger",
                        result && !isSelected && !isRightAnswer && "border-border bg-surface opacity-60"
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3">
                <Label htmlFor={`item-${item.id}`}>Twoja odpowiedź</Label>
                <Input
                  id={`item-${item.id}`}
                  value={answers[item.id] ?? ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  disabled={!!result}
                  placeholder="wpisz odpowiedź…"
                />
              </div>
            )}

            {itemResult && (
              <div
                className={cn(
                  "mt-3 flex items-start gap-2 rounded-(--radius-control) p-3 text-sm",
                  itemResult.isCorrect ? "bg-primary-soft text-primary" : "bg-danger-soft text-danger"
                )}
              >
                {itemResult.isCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <span>
                  {itemResult.isCorrect
                    ? "Poprawnie!"
                    : `Niepoprawnie. Poprawna odpowiedź: "${itemResult.correctAnswers[0]}"`}
                  {item.explanation && <span className="mt-1 block text-foreground-muted">{item.explanation}</span>}
                </span>
              </div>
            )}
          </Card>
        );
      })}

      {error && <p className="text-sm text-danger">{error}</p>}

      {!result && (
        <Button size="lg" onClick={submit} disabled={!allAnswered} isLoading={submitting}>
          Sprawdź całe zadanie
        </Button>
      )}

      {result && (
        <Card className="text-center">
          <CardTitle>
            Wynik: {result.pointsAwarded}/{result.maxPoints} pkt
          </CardTitle>
          <Link href={backHref}>
            <Button className="mt-4 w-full" size="lg">
              Wróć do listy zadań
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
