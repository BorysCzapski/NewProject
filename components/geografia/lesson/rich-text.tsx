// ============================================================================
// components/geografia/lesson/rich-text.tsx
// Renders the lightweight markup every GeoBlock text field uses (see
// lib/geografia/lesson-blocks.ts): **pogrubienie** for key terms and $KaTeX$
// for the handful of formulas geography needs (przyrost naturalny, gradient
// termiczny, skala mapy).
//
// Deliberately a separate renderer from components/matma/math.tsx rather
// than an import of it: math lessons are formula-first and don't need bold,
// geography is vocabulary-first and needs bolded terms far more than it
// needs math. Sharing one component would mean bending both. KaTeX renders
// server-side (renderToString, no DOM), so this works in Server Components.
// ============================================================================
import "katex/dist/katex.min.css";
import katex from "katex";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

function renderMath(src: string): string {
  try {
    return katex.renderToString(src, { throwOnError: false, strict: "ignore" });
  } catch {
    return src;
  }
}

/** Splits on **bold** and $math$ segments, keeping the delimiters for the pass below. */
const SEGMENT_RE = /(\*\*[^*]+\*\*|\$[^$]+\$)/g;

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
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
          return (
            <span
              key={i}
              className="align-middle"
              dangerouslySetInnerHTML={{ __html: renderMath(part.slice(1, -1)) }}
            />
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </Tag>
  );
}

/** Display (centered, own line) formula for the `formula` block. */
export function FormulaDisplay({ expression, className }: { expression: string; className?: string }) {
  let html: string;
  try {
    html = katex.renderToString(expression, { throwOnError: false, displayMode: true, strict: "ignore" });
  } catch {
    html = expression;
  }
  return (
    <div
      className={cn("overflow-x-auto py-1 text-center", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
