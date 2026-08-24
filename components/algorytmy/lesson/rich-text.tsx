// ============================================================================
// components/algorytmy/lesson/rich-text.tsx
// The lightweight markup every AlgoBlock text field uses: **pogrubienie** for
// key terms and `kod` for identifiers, expressions and complexity classes.
//
// Its own renderer rather than an import of Geografia's, for the same reason
// Geografia's is not an import of Matma's: the markup a subject needs follows
// from what it talks about. Geography prose needs bold terms and the odd
// KaTeX formula; algorithm prose is full of `n // 2`, `dp[i]` and `O(n log n)`
// — inline code, and no LaTeX at all. Sharing one component would mean
// carrying KaTeX into a module that never renders a formula.
// ============================================================================
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

/** Splits on **bold** and `code` segments, keeping the delimiters for the pass below. */
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
