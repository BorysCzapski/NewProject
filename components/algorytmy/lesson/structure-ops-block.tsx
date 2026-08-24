"use client";

// ============================================================================
// components/algorytmy/lesson/structure-ops-block.tsx
// Replays a sequence of push/pop operations on a stack or a queue.
//
// One component for both, because the operations are identical and only the
// END the element leaves from differs — the same symmetry the lesson makes and
// the same one traversal-block.tsx relies on. Rendering them side by side in
// two blocks with identical operations is what makes LIFO and FIFO click.
// ============================================================================
import { useMemo } from "react";
import { Stepper, type Frame } from "@/components/algorytmy/lesson/stepper";
import type { AlgoStructureOp } from "@/lib/algorytmy/lesson-blocks";
import { cn } from "@/lib/utils";

interface StructureState {
  items: string[];
  /** Index just added, or null. */
  added: number | null;
  /** Value just removed, or null. */
  removed: string | null;
}

function run(kind: "stack" | "queue", operations: AlgoStructureOp[]): Frame<StructureState>[] {
  const frames: Frame<StructureState>[] = [];
  const items: string[] = [];

  frames.push({
    state: { items: [], added: null, removed: null },
    note: kind === "stack" ? "Pusty stos. Dokładamy i zdejmujemy z wierzchu." : "Pusta kolejka. Dokładamy na koniec, zdejmujemy z początku.",
  });

  for (const operation of operations) {
    if (operation.op === "push") {
      items.push(operation.value ?? "");
      frames.push({
        state: { items: [...items], added: items.length - 1, removed: null },
        note:
          kind === "stack"
            ? `push(${operation.value}) — element ląduje na wierzchu.`
            : `enqueue(${operation.value}) — element ustawia się na końcu.`,
      });
    } else {
      // The build script guarantees this is never a pop on empty.
      const removed = kind === "stack" ? items.pop()! : items.shift()!;
      frames.push({
        state: { items: [...items], added: null, removed },
        note:
          kind === "stack"
            ? `pop() — zdejmujemy ${removed}, czyli element włożony NAJPÓŹNIEJ.`
            : `dequeue() — zdejmujemy ${removed}, czyli element włożony NAJWCZEŚNIEJ.`,
      });
    }
  }

  frames.push({
    state: { items: [...items], added: null, removed: null },
    note: items.length > 0 ? `Zostało: ${items.join(", ")}.` : "Struktura jest pusta.",
  });
  return frames;
}

export function StructureOpsBlock({
  title,
  kind,
  operations,
  caption,
}: {
  title: string;
  kind: "stack" | "queue";
  operations: AlgoStructureOp[];
  caption?: string;
}) {
  const frames = useMemo(() => run(kind, operations), [kind, operations]);

  return (
    <Stepper
      title={title}
      frames={frames}
      caption={caption}
      render={(state) => (
        <div className="flex flex-col items-center gap-2">
          {kind === "stack" ? (
            // Stack grows upward, so the newest element is drawn on top.
            <div className="flex min-h-[7rem] w-32 flex-col-reverse items-stretch justify-start gap-1 rounded-(--radius-control) border-x-2 border-b-2 border-border p-1.5">
              {state.items.length === 0 && (
                <span className="py-6 text-center text-xs text-foreground-muted">pusto</span>
              )}
              {state.items.map((item, i) => (
                <div
                  key={`${item}-${i}`}
                  className={cn(
                    "rounded-(--radius-control) px-2 py-1.5 text-center text-sm font-medium transition-colors",
                    state.added === i ? "bg-accent text-accent-foreground" : "bg-primary-soft text-foreground"
                  )}
                >
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[4rem] w-full items-center gap-1.5 overflow-x-auto rounded-(--radius-control) border-y-2 border-border px-2 py-2">
              <span className="shrink-0 text-[0.65rem] uppercase tracking-wide text-foreground-muted">
                wyjście
              </span>
              {state.items.length === 0 && (
                <span className="flex-1 text-center text-xs text-foreground-muted">pusto</span>
              )}
              {state.items.map((item, i) => (
                <div
                  key={`${item}-${i}`}
                  className={cn(
                    "shrink-0 rounded-(--radius-control) px-3 py-1.5 text-sm font-medium transition-colors",
                    state.added === i ? "bg-accent text-accent-foreground" : "bg-primary-soft text-foreground"
                  )}
                >
                  {item}
                </div>
              ))}
              <span className="shrink-0 text-[0.65rem] uppercase tracking-wide text-foreground-muted">
                wejście
              </span>
            </div>
          )}

          {state.removed && (
            <p className="text-xs text-foreground-muted">
              Zdjęte: <span className="font-bold text-foreground">{state.removed}</span>
            </p>
          )}
        </div>
      )}
    />
  );
}
