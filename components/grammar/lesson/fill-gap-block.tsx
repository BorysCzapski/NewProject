"use client";

// ============================================================================
// components/grammar/lesson/fill-gap-block.tsx
// Type-in gap drill inside a lesson: the student produces the form rather than
// picking it from options, which is what the "znajomość środków językowych"
// part of the arkusz actually asks for. Checked per item, with the accepted
// answer revealed on request.
//
// Matching is case- and whitespace-insensitive but NOT accent-insensitive —
// "esta" must not pass for "está", for the same reason lib/matura/grading.ts
// refuses to strip diacritics. Where the target language needs characters a
// Polish keyboard lacks, the caller passes `accentChars` and the field gets an
// insert bar so the app tests Spanish rather than keyboard layout.
// ============================================================================
import { useRef, useState } from "react";
import { Check, Eye, X } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AccentBar } from "@/components/ui/accent-bar";
import { cn } from "@/lib/utils";
import type { FillGapItem } from "@/lib/grammar/lesson-blocks";

type ItemState = { value: string; checked: boolean; revealed: boolean };

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function isCorrect(item: FillGapItem, value: string): boolean {
  return item.accept.some((accepted) => normalize(accepted) === normalize(value));
}

export function FillGapBlock({
  title,
  instruction,
  items,
  accentChars,
}: {
  title?: string;
  instruction?: string;
  items: FillGapItem[];
  accentChars?: string[];
}) {
  const [states, setStates] = useState<ItemState[]>(() =>
    items.map(() => ({ value: "", checked: false, revealed: false }))
  );
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function update(index: number, patch: Partial<ItemState>) {
    setStates((prev) => prev.map((state, i) => (i === index ? { ...state, ...patch } : state)));
  }

  function insertChar(index: number, char: string) {
    const element = inputRefs.current[index];
    const current = states[index].value;
    const start = element?.selectionStart ?? current.length;
    const end = element?.selectionEnd ?? current.length;
    update(index, { value: current.slice(0, start) + char + current.slice(end), checked: false });
    requestAnimationFrame(() => {
      if (!element) return;
      element.focus();
      const caret = start + char.length;
      element.setSelectionRange(caret, caret);
    });
  }

  const solved = states.filter((state, i) => state.checked && isCorrect(items[i], state.value)).length;

  return (
    <Card className="border-primary/30">
      <div className="flex items-baseline justify-between gap-2">
        <CardTitle>{title ?? "Uzupełnij luki"}</CardTitle>
        <span className="shrink-0 text-xs tabular-nums text-foreground-muted">
          {solved}/{items.length}
        </span>
      </div>
      {instruction && <p className="mt-1 text-sm text-foreground-muted">{instruction}</p>}

      <ol className="mt-3 flex flex-col gap-4">
        {items.map((item, i) => {
          const state = states[i];
          const correct = isCorrect(item, state.value);
          const showResult = state.checked || state.revealed;
          return (
            <li key={i} className="flex flex-col gap-1.5">
              <p className="text-sm leading-relaxed text-foreground">
                <span className="mr-1 font-semibold text-foreground-muted">{i + 1}.</span>
                {item.before}
                <span className="mx-1 inline-flex align-middle">
                  <Input
                    ref={(element) => {
                      inputRefs.current[i] = element;
                    }}
                    value={state.value}
                    onChange={(e) => update(i, { value: e.target.value, checked: false })}
                    onBlur={() => state.value.trim() && update(i, { checked: true })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        update(i, { checked: true });
                      }
                    }}
                    disabled={state.revealed}
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label={`Luka ${i + 1}`}
                    className={cn(
                      "h-9 w-36 px-2.5 text-sm",
                      showResult && correct && "border-accent bg-accent-soft text-accent",
                      state.checked && !correct && "border-danger bg-danger-soft text-danger"
                    )}
                  />
                </span>
                {item.after}
              </p>

              {item.hint && !showResult && (
                <p className="text-xs text-foreground-muted">Podpowiedź: {item.hint}</p>
              )}

              {accentChars && accentChars.length > 0 && !state.revealed && (
                <AccentBar
                  chars={accentChars}
                  className="mt-0"
                  onInsert={(char) => insertChar(i, char)}
                />
              )}

              {state.checked && correct && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-accent">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  Dobrze{item.pl ? ` — ${item.pl}` : ""}
                </p>
              )}

              {state.checked && !correct && !state.revealed && (
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-danger">
                    <X className="h-3.5 w-3.5 shrink-0" />
                    Jeszcze nie
                  </span>
                  <button
                    type="button"
                    onClick={() => update(i, { revealed: true })}
                    className="flex items-center gap-1 font-medium text-foreground-muted underline"
                  >
                    <Eye className="h-3.5 w-3.5 shrink-0" />
                    Pokaż odpowiedź
                  </button>
                </div>
              )}

              {state.revealed && (
                <p className="text-xs leading-relaxed text-foreground-muted">
                  Odpowiedź: <span className="font-semibold text-foreground">{item.accept[0]}</span>
                  {item.accept.length > 1 && ` (też: ${item.accept.slice(1).join(", ")})`}
                  {item.pl && ` — ${item.pl}`}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
