"use client";

// ============================================================================
// components/ui/cyrillic-keyboard.tsx
// On-screen Russian keyboard for users without a Cyrillic layout. Rendered
// under answer inputs whenever the practiced content is Russian.
//
// It tracks the last focused <input>/<textarea> on the page (so it works
// with any number of gap inputs without wiring per-field state) and inserts
// the tapped character at the caret. React controlled inputs ignore direct
// .value writes, so we go through the native value setter and dispatch an
// "input" event — React's onChange picks it up as if the user typed.
// ============================================================================
import { useEffect, useRef, useState } from "react";
import { Delete, ChevronDown, ChevronUp, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Standard ЙЦУКЕН layout — all 33 letters.
const ROWS = [
  ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
  ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
  ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "ё"],
];

type EditableField = HTMLInputElement | HTMLTextAreaElement;

function isEditableField(el: unknown): el is EditableField {
  if (el instanceof HTMLTextAreaElement) return true;
  return (
    el instanceof HTMLInputElement &&
    (el.type === "text" || el.type === "search" || el.type === "")
  );
}

/** Insert `text` at the caret of a React-controlled input/textarea. */
function insertIntoField(field: EditableField, text: string, backspace: boolean) {
  const start = field.selectionStart ?? field.value.length;
  const end = field.selectionEnd ?? field.value.length;

  let next: string;
  let caret: number;
  if (backspace) {
    if (start === end && start > 0) {
      // Delete the char before the caret (code-point safe for BMP Cyrillic).
      next = field.value.slice(0, start - 1) + field.value.slice(end);
      caret = start - 1;
    } else {
      next = field.value.slice(0, start) + field.value.slice(end);
      caret = start;
    }
  } else {
    next = field.value.slice(0, start) + text + field.value.slice(end);
    caret = start + text.length;
  }

  // React overrides the value property on the element instance; the native
  // prototype setter bypasses that so the dispatched event carries the new
  // value into React's synthetic onChange.
  const proto =
    field instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (!setter) return;
  setter.call(field, next);
  field.dispatchEvent(new Event("input", { bubbles: true }));

  field.focus();
  field.setSelectionRange(caret, caret);
}

export function CyrillicKeyboard({ className }: { className?: string }) {
  const lastField = useRef<EditableField | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  const [shift, setShift] = useState(false);

  useEffect(() => {
    // Remember the last text field the user focused anywhere on the page,
    // except fields inside the keyboard itself (it has none, but be safe).
    function onFocusIn(e: FocusEvent) {
      const target = e.target;
      if (rootRef.current?.contains(target as Node)) return;
      if (isEditableField(target)) lastField.current = target;
    }
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, []);

  function tap(char: string | null) {
    const field = lastField.current;
    // Field may have been unmounted (e.g. next exercise) — ignore then.
    if (!field || !field.isConnected) return;
    if (char === null) {
      insertIntoField(field, "", true);
    } else {
      insertIntoField(field, shift ? char.toUpperCase() : char, false);
      if (shift) setShift(false); // shift acts once, like a phone keyboard
    }
  }

  // Buttons use onPointerDown+preventDefault so tapping them never steals
  // focus from the input (which would hide the caret position).
  const keyProps = (handler: () => void) => ({
    type: "button" as const,
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      handler();
    },
  });

  return (
    <div
      ref={rootRef}
      className={cn(
        "rounded-(--radius-control) border border-border bg-surface-muted p-2",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted"
      >
        Klawiatura: cyrylica
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-1.5">
          {ROWS.map((row, i) => (
            <div key={i} className="flex justify-center gap-1">
              {row.map((ch) => (
                <button
                  key={ch}
                  {...keyProps(() => tap(ch))}
                  className="h-9 min-w-0 flex-1 rounded-md bg-surface text-base leading-none text-foreground shadow-sm active:bg-primary-soft"
                >
                  {shift ? ch.toUpperCase() : ch}
                </button>
              ))}
            </div>
          ))}
          <div className="flex justify-center gap-1">
            <button
              {...keyProps(() => setShift((s) => !s))}
              className={cn(
                "flex h-9 flex-[2] items-center justify-center rounded-md shadow-sm",
                shift ? "bg-primary text-primary-foreground" : "bg-surface text-foreground"
              )}
              aria-label="Wielkie litery"
            >
              <ArrowBigUp className="h-5 w-5" />
            </button>
            <button
              {...keyProps(() => tap(" "))}
              className="h-9 flex-[6] rounded-md bg-surface text-sm text-foreground-muted shadow-sm active:bg-primary-soft"
            >
              spacja
            </button>
            <button
              {...keyProps(() => tap(null))}
              className="flex h-9 flex-[2] items-center justify-center rounded-md bg-surface text-foreground shadow-sm active:bg-danger-soft"
              aria-label="Usuń znak"
            >
              <Delete className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
