"use client";

// ============================================================================
// components/matura/accent-bar.tsx
// A row of Spanish-only characters that a Polish keyboard cannot type
// directly, inserted at the caret of the field it belongs to.
//
// Why this exists: lib/matura/grading.ts matches answers exactly and
// deliberately does NOT strip diacritics, because a missing tilde is a real
// error on the real exam ("esta" and "está" are different words). That rule is
// right, but it only works if the student CAN type the tilde — otherwise the
// app marks down keyboard layout rather than Spanish. Same problem, same
// answer as Linguo's components/ui/cyrillic-keyboard.tsx for Russian; this is
// its much smaller cousin, since Spanish needs nine characters, not an
// alphabet.
// ============================================================================
import { cn } from "@/lib/utils";

const SPANISH_CHARS = ["á", "é", "í", "ó", "ú", "ü", "ñ", "¿", "¡"];

export function AccentBar({
  onInsert,
  disabled,
  className,
}: {
  onInsert: (char: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mt-2 flex flex-wrap gap-1.5", className)}>
      {SPANISH_CHARS.map((char) => (
        <button
          key={char}
          type="button"
          disabled={disabled}
          // onMouseDown, not onClick: mousedown fires before the input loses
          // focus, so the caret position is still the one the student left.
          onMouseDown={(e) => {
            e.preventDefault();
            onInsert(char);
          }}
          aria-label={`Wstaw znak ${char}`}
          className={cn(
            "min-w-9 rounded-(--radius-control) border border-border bg-surface px-2.5 py-1.5",
            "text-base leading-none text-foreground tabular-nums",
            "active:bg-surface-muted disabled:opacity-40"
          )}
        >
          {char}
        </button>
      ))}
    </div>
  );
}
