"use client";

// ============================================================================
// components/prompt-forge/forge-workspace.tsx
// The Kuźnia session workspace: a chat with real multi-turn memory (unlike
// the writing module's ephemeral follow-up chat, every turn here is
// persisted and sent back as history) driving a live prompt draft, plus the
// AI's proactive suggestions and detected conflicts for that draft.
// ============================================================================
import { useEffect, useRef, useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { AlertTriangle, Check, Copy, Loader2, Send, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { deletePromptSession, sendForgeMessage } from "@/lib/prompt-forge/actions";
import type { PromptForgeConflict, PromptForgeMessage, PromptSession } from "@/lib/types/database";

export function ForgeWorkspace({ session }: { session: PromptSession }) {
  const [messages, setMessages] = useState<PromptForgeMessage[]>(session.messages);
  const [draft, setDraft] = useState(session.draft);
  const [suggestions, setSuggestions] = useState<string[]>(session.suggestions);
  const [conflicts, setConflicts] = useState<PromptForgeConflict[]>(session.conflicts);
  const [readyToCopy, setReadyToCopy] = useState(session.ready_to_copy);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const [deleting, startDeleteTransition] = useTransition();
  const startedRef = useRef(false);

  // Every state update this triggers happens inside startTransition, so
  // calling send() from the mount effect below never sets state synchronously
  // in the effect body.
  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    startTransition(async () => {
      setInput("");
      setError(null);
      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      try {
        const result = await sendForgeMessage(session.id, trimmed);
        if (result.ok) {
          setMessages(result.data.messages);
          setDraft(result.data.draft);
          setSuggestions(result.data.suggestions);
          setConflicts(result.data.conflicts);
          setReadyToCopy(result.data.readyToCopy);
        } else {
          setError(result.error);
        }
      } catch {
        setError("Nie udało się uzyskać odpowiedzi AI.");
      }
    });
  }

  // Fresh session (no messages yet): kick off the conversation with the goal
  // the user typed on the hub page, exactly once even under Strict Mode.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (session.messages.length === 0 && session.goal) send(session.goal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCopy() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      try {
        // On success the action redirects; on failure it RETURNS the error
        // (thrown Server Action errors are redacted in production).
        const result = await deletePromptSession(session.id);
        if (!result.ok) setError(result.error);
      } catch (err) {
        unstable_rethrow(err);
        setError("Nie udało się usunąć sesji.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Prompt</CardTitle>
          <div className="flex items-center gap-2">
            {readyToCopy && <Badge className="bg-accent-soft text-accent">Gotowy</Badge>}
            <Button size="sm" variant={copied ? "secondary" : "outline"} onClick={handleCopy} disabled={!draft}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Skopiowano" : "Kopiuj"}
            </Button>
          </div>
        </div>
        {draft ? (
          <pre className="mt-3 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-(--radius-control) bg-surface-muted p-3 text-xs leading-relaxed text-foreground">
            {draft}
          </pre>
        ) : (
          <CardDescription className="mt-2">Draft pojawi się po pierwszej wiadomości…</CardDescription>
        )}
      </Card>

      {conflicts.length > 0 && (
        <Card className="border-warning/40 bg-warning/5">
          <CardTitle className="flex items-center gap-1.5 text-warning">
            <AlertTriangle className="h-4 w-4" />
            Do rozstrzygnięcia
          </CardTitle>
          <div className="mt-2 flex flex-col gap-2">
            {conflicts.map((c, i) => (
              <div key={i} className="rounded-(--radius-control) bg-surface p-3">
                <p className="text-sm text-foreground">{c.issue}</p>
                <button
                  type="button"
                  onClick={() => send(`Zastosuj tę poprawkę: ${c.fix}`)}
                  disabled={pending}
                  className="mt-2 text-left text-sm font-medium text-primary disabled:opacity-50"
                >
                  → {c.fix}
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {suggestions.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground-muted">
            <Sparkles className="h-4 w-4" />
            Warto dodać
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => send(s)}
                disabled={pending}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-left text-xs text-foreground-muted transition-colors hover:bg-surface-muted disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardTitle>Rozmowa</CardTitle>
        <div className="mt-3 flex flex-col gap-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] whitespace-pre-line rounded-(--radius-control) px-3 py-2 text-sm leading-relaxed",
                m.role === "assistant"
                  ? "self-start bg-surface-muted text-foreground"
                  : "self-end bg-primary-soft text-primary"
              )}
            >
              {m.content}
            </div>
          ))}
          {pending && (
            <p className="flex items-center gap-1.5 self-start text-xs text-foreground-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Asystent odpowiada…
            </p>
          )}
        </div>

        {error && <p className="mt-2 text-sm text-danger">{error}</p>}

        <div className="mt-3 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            disabled={pending}
            placeholder="Napisz wiadomość…"
            className={cn(
              "h-11 w-full rounded-(--radius-control) border border-border bg-surface px-3 text-sm text-foreground",
              "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary",
              "disabled:opacity-70"
            )}
          />
          <Button size="icon" onClick={() => send(input)} disabled={!input.trim() || pending} aria-label="Wyślij">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Button variant="ghost" className="text-danger" onClick={handleDelete} isLoading={deleting}>
        <Trash2 className="h-4 w-4" />
        Usuń sesję
      </Button>
    </div>
  );
}
