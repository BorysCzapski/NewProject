"use client";

// ============================================================================
// components/writing/writing-hints.tsx
// Karta "Przydatne słówka" nad polem pisania: słowa i zwroty, które mogą się przydać
// w odpowiedzi (z polskim znaczeniem). Ładuje się w tle, gdy uczeń zaczyna pisać —
// błąd nie blokuje pisania, tylko pokazuje "Spróbuj ponownie". Użyte w tekście słowa
// same się odhaczają, żeby było widać postęp, ale nic nie jest wymagane.
// ============================================================================
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Lightbulb, Loader2, RotateCw } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchWritingHints } from "@/lib/writing/hints-client";
import { isUsedInText, type WritingHint, type WritingHints } from "@/lib/writing/hints-core";

/** Podpowiedzi do zadania nie zmieniają się, więc po powrocie na ekran nie pytamy AI drugi raz. */
const CACHE = new Map<string, WritingHints>();

type State = { phase: "loading" } | { phase: "ready"; hints: WritingHints } | { phase: "error"; message: string };

export function WritingHintsCard({ taskId, text }: { taskId: string; text: string }) {
  const [state, setState] = useState<State>(() => {
    const cached = CACHE.get(taskId);
    return cached ? { phase: "ready", hints: cached } : { phase: "loading" };
  });
  const [open, setOpen] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (CACHE.has(taskId)) return;
    const controller = new AbortController();
    fetchWritingHints(taskId, controller.signal)
      .then((result) => {
        if (result.ok) {
          CACHE.set(taskId, result.data);
          setState({ phase: "ready", hints: result.data });
        } else {
          setState({ phase: "error", message: result.error });
        }
      })
      .catch(() => {
        // Przerwane przez zamknięcie ekranu — nic nie pokazujemy.
      });
    return () => controller.abort();
  }, [taskId, attempt]);

  const retry = useCallback(() => {
    setState({ phase: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return (
    <Card className="mb-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-warning" aria-hidden />
          <CardTitle>Przydatne słówka</CardTitle>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-foreground-muted transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div className="mt-3">
          {state.phase === "loading" && (
            <p className="flex items-center gap-2 text-sm text-foreground-muted" role="status">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Szukam słówek do tego tematu…
            </p>
          )}

          {state.phase === "error" && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-foreground-muted">{state.message}</p>
              <Button variant="ghost" size="sm" onClick={retry}>
                <RotateCw className="h-3.5 w-3.5" />
                Spróbuj ponownie
              </Button>
            </div>
          )}

          {state.phase === "ready" && <HintLists hints={state.hints} text={text} />}
        </div>
      )}
    </Card>
  );
}

function HintLists({ hints, text }: { hints: WritingHints; text: string }) {
  return (
    <div className="flex flex-col gap-4">
      <HintGroup title="Słowa" items={hints.words} text={text} />
      <HintGroup title="Zwroty" items={hints.phrases} text={text} />
      <p className="text-xs text-foreground-muted">
        To tylko podpowiedzi — użyj, których chcesz. Użyte słowa odhaczają się same.
      </p>
    </div>
  );
}

function HintGroup({ title, items, text }: { title: string; items: WritingHint[]; text: string }) {
  const used = useMemo(() => new Set(items.filter((h) => isUsedInText(text, h.term)).map((h) => h.term)), [items, text]);
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-foreground-muted">{title}</p>
      <ul className="flex flex-wrap gap-2">
        {items.map((hint) => {
          const done = used.has(hint.term);
          return (
            <li
              key={hint.term}
              className={cn(
                "flex items-center gap-1.5 rounded-(--radius-control) border px-2.5 py-1.5 text-sm",
                done ? "border-accent/40 bg-accent-soft" : "border-border bg-surface"
              )}
            >
              {done && <Check className="h-3.5 w-3.5 text-accent" aria-label="użyte" />}
              <span className="font-medium text-foreground">{hint.term}</span>
              <span className="text-foreground-muted">— {hint.translation}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
