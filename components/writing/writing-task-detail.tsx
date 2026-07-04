"use client";

// ============================================================================
// components/writing/writing-task-detail.tsx
// Renders a writing task in one of two modes: the compose form (before the
// user has submitted) or the AI-graded review, including a small ephemeral
// (client-only, not persisted) follow-up chat that continues the dialog
// sparked by the AI's follow-up question.
// ============================================================================
import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/writing/score-badge";
import { cn } from "@/lib/utils";
import { submitWriting, askFollowup } from "@/lib/writing/actions";
import { WRITING_TASK_TYPE_LABELS } from "@/lib/constants";
import type { WritingSubmission, WritingTask } from "@/lib/types/database";

export function WritingTaskDetail({
  task,
  initialSubmission,
}: {
  task: WritingTask;
  initialSubmission: WritingSubmission | null;
}) {
  const [submission, setSubmission] = useState<WritingSubmission | null>(initialSubmission);

  return (
    <div>
      <Badge className="mb-2">{WRITING_TASK_TYPE_LABELS[task.task_type]}</Badge>
      <Card className="mb-5">
        <CardTitle>Polecenie</CardTitle>
        <p className="mt-2 text-base leading-relaxed text-foreground">{task.scenario}</p>
        <p className="mt-2 text-xs text-foreground-muted">
          Długość odpowiedzi: {task.min_words}-{task.max_words} słów
        </p>
      </Card>

      {submission ? (
        <WritingReview task={task} submission={submission} />
      ) : (
        <ComposeForm task={task} onSubmitted={setSubmission} />
      )}
    </div>
  );
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function ComposeForm({
  task,
  onSubmitted,
}: {
  task: WritingTask;
  onSubmitted: (submission: WritingSubmission) => void;
}) {
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = countWords(content);
  const outOfRange = content.trim().length > 0 && (wordCount < task.min_words || wordCount > task.max_words);

  async function handleSubmit() {
    if (!content.trim() || pending) return;
    setPending(true);
    setError(null);
    try {
      const result = await submitWriting(task.id, content);
      if (result.ok) onSubmitted(result.data);
      else setError(result.error);
    } catch {
      setError("Nie udało się wysłać pracy. Spróbuj ponownie.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardTitle>Twoja odpowiedź</CardTitle>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={pending}
        rows={8}
        placeholder="Napisz swoją odpowiedź po angielsku…"
        className={cn(
          "mt-3 w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground",
          "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary",
          "disabled:opacity-70"
        )}
      />
      <p
        className={cn(
          "mt-1.5 text-xs font-medium",
          outOfRange ? "text-warning" : "text-foreground-muted"
        )}
      >
        {wordCount} słów (zalecane: {task.min_words}-{task.max_words})
        {outOfRange && " — poza zalecanym zakresem, ale możesz wysłać"}
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
  );
}

interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

function WritingReview({ task, submission }: { task: WritingTask; submission: WritingSubmission }) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    submission.ai_followup_question ? [{ role: "ai", text: submission.ai_followup_question }] : []
  );
  const [reply, setReply] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReply() {
    if (!reply.trim() || pending) return;
    const userMessage = reply.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setReply("");
    setPending(true);
    setError(null);
    try {
      const result = await askFollowup(task.id, userMessage);
      if (result.ok) setMessages((prev) => [...prev, { role: "ai", text: result.data }]);
      else setError(result.error);
    } catch {
      setError("Nie udało się uzyskać odpowiedzi AI.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <div className="flex items-center justify-between">
          <CardTitle>Ocena AI</CardTitle>
          {submission.score !== null && <ScoreBadge score={submission.score} />}
        </div>
        {submission.ai_feedback && (
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
            {submission.ai_feedback}
          </p>
        )}
      </Card>

      <Card>
        <CardTitle>Twój tekst</CardTitle>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground-muted">
          {submission.content}
        </p>
      </Card>

      {submission.ai_corrected_version && (
        <Card>
          <CardTitle>Poprawiona wersja</CardTitle>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
            {submission.ai_corrected_version}
          </p>
        </Card>
      )}

      {messages.length > 0 && (
        <Card>
          <CardTitle>Porozmawiaj dalej</CardTitle>
          <CardDescription className="mt-1">
            Krótka rozmowa uzupełniająca — nie jest zapisywana.
          </CardDescription>
          <div className="mt-3 flex flex-col gap-2">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-(--radius-control) px-3 py-2 text-sm leading-relaxed",
                  message.role === "ai"
                    ? "self-start bg-surface-muted text-foreground"
                    : "self-end bg-primary-soft text-primary"
                )}
              >
                {message.text}
              </div>
            ))}
            {pending && (
              <p className="flex items-center gap-1.5 self-start text-xs text-foreground-muted">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                AI odpowiada…
              </p>
            )}
          </div>

          {error && <p className="mt-2 text-sm text-danger">{error}</p>}

          <div className="mt-3 flex items-center gap-2">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReply()}
              disabled={pending}
              placeholder="Napisz odpowiedź…"
              className={cn(
                "h-11 w-full rounded-(--radius-control) border border-border bg-surface px-3 text-sm text-foreground",
                "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary",
                "disabled:opacity-70"
              )}
            />
            <Button size="icon" onClick={handleReply} disabled={!reply.trim() || pending} aria-label="Wyślij">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
