// ============================================================================
// components/gitara/lesson/rich-text.tsx
// The lightweight markup every GtrBlock text field uses: **pogrubienie** for
// key terms and `kod` for fret/finger/chord notation (e.g. `x32010`, `2fr`).
//
// Its own renderer rather than an import of Algorytmy's or Geografia's, for
// the reason each of theirs gives: the markup a subject needs follows from
// what it talks about, and duplicating a dozen lines is cheaper than an
// import that couples two unrelated mini-apps.
// ============================================================================
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

const SEGMENT_RE = /(\*\*[^*]+\*\*|`[^`]+`)/g;

export function RichText({
  text,
  className,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: ElementType;
}) {
  const parts = text.split(SEGMENT_RE).filter((p) => p.length > 0);

  return (
    <Tag className={cn("whitespace-pre-line leading-relaxed", className)}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={i}
              className="rounded bg-surface-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </Tag>
  );
}
