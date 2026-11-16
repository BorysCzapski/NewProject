"use client";

// ============================================================================
// components/writing/writing-task-detail.tsx
// Renders a writing task in one of two modes: the compose form (before the
// user has submitted) or the AI-graded review, including a small ephemeral
// (client-only, not persisted) follow-up chat that continues the dialog
// sparked by the AI's follow-up question.
// ============================================================================
import { useState } from "react";
import { Loader2, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/writing/score-badge";
import { WritingHintsCard } from "@/components/writing/writing-hints";
import { CyrillicKeyboard } from "@/components/ui/cyrillic-keyboard";
import { cn } from "@/lib/utils";
import { submitWriting, askFollowup, type WordCorrection } from "@/lib/writing/actions";
import type { WritingSuggestion } from "@/lib/writing/hints-core";
import { WRITING_TASK_TYPE_LABELS } from "@/lib/constants";
import type { TargetLanguage, WritingSubmission, WritingTask } from "@/lib/types/database";

const COMPOSE_PLACEHOLDER: Record<TargetLanguage, string> = {
  en: "Napisz swoją odpowiedź po angielsku…",
  es: "Napisz swoją odpowiedź po hiszpańsku…",
  ru: "Napisz swoją odpowiedź po rosyjsku…",
};

export function WritingTaskDetail({
  task,
  initialSubmission,
}: {
  task: WritingTask;
  initialSubmission: WritingSubmission | null;
}) {
  const [submission, setSubmission] = useState<WritingSubmission | null>(initialSubmission);
  // Tylko dla świeżo ocenionej pracy — propozycji nie zapisujemy w bazie.
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([]);

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
        <WritingReview task={task} submission={submission} suggestions={suggestions} />
      ) : (
        <ComposeForm
          task={task}
          onSubmitted={(graded, tips) => {
            setSuggestions(tips);
            setSubmission(graded);
          }}
        />
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
  onSubmitted: (submission: WritingSubmission, suggestions: WritingSuggestion[]) => void;
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
      if (result.ok) onSubmitted(result.data.submission, result.data.suggestions);
      else setError(result.error);
    } catch {
      setError("Nie udało się wysłać pracy. Spróbuj ponownie.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <WritingHintsCard taskId={task.id} text={content} />
      <Card>
        <CardTitle>Twoja odpowiedź</CardTitle>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={pending}
          rows={8}
          placeholder={COMPOSE_PLACEHOLDER[task.language]}
          className={cn(
            "mt-3 w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground",
            "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary",
            "disabled:opacity-70"
          )}
        />
        {task.language === "ru" && !pending && <CyrillicKeyboard className="mt-2" />}
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
    </>
  );
}

interface ChatMessage {
  role: "ai" | "user";
  text: string;
  /** Word-level corrections for this (user) message, from the AI's next reply. */
  corrections?: WordCorrection[];
}

function WritingReview({
  task,
  submission,
  suggestions,
}: {
  task: WritingTask;
  submission: WritingSubmission;
  suggestions: WritingSuggestion[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    submission.ai_followup_question ? [{ role: "ai", text: submission.ai_followup_question }] : []
  );
  const [reply, setReply] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Client-only: the chat isn't persisted, so "ending" it just stops the
  // student from continuing an otherwise open-ended AI dialog.
  const [ended, setEnded] = useState(false);

  async function handleReply() {
    if (!reply.trim() || pending) return;
    const userMessage = reply.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setReply("");
    setPending(true);
    setError(null);
    try {
      const result = await askFollowup(task.id, userMessage);
      if (result.ok) {
        const { reply: aiReply, corrections } = result.data;
        setMessages((prev) => {
          // The message we just pushed (the student's turn this reply grades)
          // is still the last one — nothing else appends while pending.
          const withCorrections = corrections.length
            ? prev.map((m, i) => (i === prev.length - 1 ? { ...m, corrections } : m))
            : prev;
          return [...withCorrections, { role: "ai", text: aiReply }];
        });
      } else {
        setError(result.error);
      }
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

      {suggestions.length > 0 && (
        <Card>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            <CardTitle>Da się jeszcze ładniej</CardTitle>
          </div>
          <CardDescription className="mt-1">
            Twoje wersje są poprawne — to tylko opcjonalne pomysły, jak powiedzieć to naturalniej.
          </CardDescription>
          <ul className="mt-3 flex flex-col gap-3">
            {suggestions.map((s, i) => (
              <li key={i} className="rounded-(--radius-control) bg-surface-muted px-3 py-2 text-sm leading-relaxed">
                <p className="text-foreground-muted line-through decoration-foreground-muted/40">{s.original}</p>
                <p className="font-medium text-foreground">{s.better}</p>
                <p className="mt-0.5 text-xs text-foreground-muted">{s.why}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {messages.length > 0 && (
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Porozmawiaj dalej</CardTitle>
              <CardDescription className="mt-1">
                Krótka rozmowa uzupełniająca — nie jest zapisywana.
              </CardDescription>
            </div>
            {!ended && (
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-foreground-muted"
                onClick={() => setEnded(true)}
              >
                <X className="h-3.5 w-3.5" />
                Zakończ rozmowę
              </Button>
            )}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn("flex flex-col", message.role === "ai" ? "items-start" : "items-end")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-(--radius-control) px-3 py-2 text-sm leading-relaxed",
                    message.role === "ai"
                      ? "self-start bg-surface-muted text-foreground"
                      : "self-end bg-primary-soft text-primary"
                  )}
                >
                  {message.text}
                </div>
                {message.corrections && message.corrections.length > 0 && (
                  <div className="mt-1 flex max-w-[85%] flex-col gap-1 rounded-(--radius-control) border border-warning/30 bg-warning-soft px-3 py-2 text-xs text-foreground">
                    {message.corrections.map((c, ci) => (
                      <p key={ci}>
                        <span className="font-medium text-danger">{c.wrong}</span>
                        {" → "}
                        <span className="font-medium text-accent">{c.correct}</span>
                        {c.note && <span className="text-foreground-muted"> — {c.note}</span>}
                      </p>
                    ))}
                  </div>
                )}
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

          {ended ? (
            <p className="mt-3 text-sm text-foreground-muted">Rozmowa zakończona.</p>
          ) : (
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
          )}
        </Card>
      )}
    </div>
  );
}
