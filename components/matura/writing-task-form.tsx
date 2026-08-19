"use client";

// ============================================================================
// components/matura/writing-task-form.tsx
// Compose + AI-graded review for one "Wypowiedź pisemna" task. Unlike the
// exact-match TaskAttemptForm, grading is holistic (per-criterion CKE
// rubric breakdown from lib/matura/writing-grading.ts) and the student can
// freely resubmit a revised version — writing is iterative, not one-shot.
// ============================================================================
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { submitWritingTask } from "@/lib/matura/writing-actions";
import { MATURA_WRITING_WORD_RANGE } from "@/lib/matura/constants";
import { langInfo } from "@/lib/languages";
import { AccentBar } from "@/components/matura/accent-bar";
import type { MaturaLanguage, MaturaLevel, MaturaWritingSubmission, MaturaWritingTask } from "@/lib/types/database";

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function WritingTaskForm({
  task,
  language,
  level,
  initialSubmission,
}: {
  task: MaturaWritingTask;
  language: MaturaLanguage;
  level: MaturaLevel;
  initialSubmission: MaturaWritingSubmission | null;
}) {
  const [submission, setSubmission] = useState<MaturaWritingSubmission | null>(initialSubmission);

  if (submission) {
    return <SubmissionReview task={task} submission={submission} onRewrite={() => setSubmission(null)} />;
  }
  return <ComposeForm task={task} language={language} level={level} onSubmitted={setSubmission} />;
}

function ComposeForm({
  task,
  language,
  level,
  onSubmitted,
}: {
  task: MaturaWritingTask;
  language: MaturaLanguage;
  level: MaturaLevel;
  onSubmitted: (submission: MaturaWritingSubmission) => void;
}) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const range = MATURA_WRITING_WORD_RANGE[level];
  const wordCount = countWords(content);
  const belowFloor = content.trim().length > 0 && wordCount < range.floor;
  const outOfRange = content.trim().length > 0 && !belowFloor && (wordCount < range.min || wordCount > range.max);

  async function handleSubmit() {
    if (!content.trim() || pending) return;
    setPending(true);
    setError(null);
    const result = await submitWritingTask({ taskId: task.id, content });
    setPending(false);
    if (result.ok) onSubmitted(result.data);
    else setError(result.error);
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle>Polecenie</CardTitle>
        <p className="mt-2 text-base leading-relaxed text-foreground">{task.instructions}</p>
        <ul className="mt-3 flex flex-col gap-1.5">
          {task.content_points.map((point, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground-muted">
              <span className="shrink-0 font-semibold text-primary">{i + 1}.</span>
              {point}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Twoja odpowiedź</CardTitle>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={pending}
          rows={10}
          placeholder={`Napisz swoją odpowiedź w języku ${langInfo(language).plLocative}…`}
          className={cn(
            "mt-3 w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground",
            "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary",
            "disabled:opacity-70"
          )}
        />
        {language === "es" && (
          <AccentBar
            disabled={pending}
            onInsert={(char) => {
              const el = textareaRef.current;
              const start = el?.selectionStart ?? content.length;
              const end = el?.selectionEnd ?? content.length;
              setContent(content.slice(0, start) + char + content.slice(end));
              requestAnimationFrame(() => {
                if (!el) return;
                el.focus();
                const caret = start + char.length;
                el.setSelectionRange(caret, caret);
              });
            }}
          />
        )}
        <p
          className={cn(
            "mt-1.5 text-xs font-medium",
            belowFloor ? "text-danger" : outOfRange ? "text-warning" : "text-foreground-muted"
          )}
        >
          {wordCount} słów (wymagane: {range.min}-{range.max})
          {belowFloor && ` — poniżej ${range.floor} słów: liczy się tylko pierwsze kryterium (zasada gilotyny)`}
          {outOfRange && !belowFloor && " — poza wymaganym zakresem, ale możesz wysłać"}
        </p>

        {error && <p className="mt-2 text-sm text-danger">{error}</p>}

        <Button
          size="lg"
          className="mt-4 w-full"
          onClick={handleSubmit}
          disabled={!content.trim()}
          isLoading={pending}
        >
          {pending ? "AI ocenia Twoją pracę…" : "Wyślij do oceny"}
        </Button>
      </Card>
    </div>
  );
}

function SubmissionReview({
  task,
  submission,
  onRewrite,
}: {
  task: MaturaWritingTask;
  submission: MaturaWritingSubmission;
  onRewrite: () => void;
}) {
  const [modelAnswerOpen, setModelAnswerOpen] = useState(false);
  const { criteria, generalFeedback, improvementTip } = submission.ai_feedback;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center justify-between">
          <CardTitle>Ocena wg kryteriów CKE</CardTitle>
          <span className="shrink-0 text-2xl font-bold text-primary">
            {submission.points_awarded}
            <span className="text-base font-medium text-foreground-muted">/{submission.max_points}</span>
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {criteria.map((criterion) => (
            <div key={criterion.key}>
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-foreground">{criterion.label}</span>
                <span className="shrink-0 tabular-nums text-foreground-muted">
                  {criterion.pointsAwarded}/{criterion.pointsMax}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(criterion.pointsAwarded / criterion.pointsMax) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs leading-relaxed text-foreground-muted">{criterion.comment}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
          <p className="text-sm leading-relaxed text-foreground">{generalFeedback}</p>
          <p className="rounded-(--radius-control) bg-primary-soft px-3 py-2 text-sm text-primary">
            💡 {improvementTip}
          </p>
        </div>
      </Card>

      <Card>
        <CardTitle>Twój tekst</CardTitle>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground-muted">
          {submission.content}
        </p>
      </Card>

      <Card>
        <button
          type="button"
          onClick={() => setModelAnswerOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <div>
            <CardTitle>Wzorcowa odpowiedź</CardTitle>
            <CardDescription className="mt-0.5">Przykładowy tekst na pełną liczbę punktów</CardDescription>
          </div>
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 text-foreground-muted transition-transform", modelAnswerOpen && "rotate-180")}
          />
        </button>
        {modelAnswerOpen && (
          <>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">{task.model_answer}</p>
            <p className="mt-3 rounded-(--radius-control) bg-surface-muted px-3 py-2 text-xs leading-relaxed text-foreground-muted">
              {task.model_answer_notes}
            </p>
          </>
        )}
      </Card>

      <Button variant="outline" size="lg" onClick={onRewrite}>
        Napisz jeszcze raz
      </Button>
    </div>
  );
}
