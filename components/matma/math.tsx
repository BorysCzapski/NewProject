// ============================================================================
// components/matma/math.tsx
// KaTeX renderer shared by every Matma block/component. `katex/dist/katex
// .min.css` is an external stylesheet import, allowed anywhere under app/
// per Next.js 16 docs (colocated component imports) — it only ships to
// routes that actually render math, no changes to app/layout.tsx needed.
// Rendering happens SERVER-SIDE (katex.renderToString, no DOM dependency),
// so <Math> works in both Server and Client Components.
// ============================================================================
import "katex/dist/katex.min.css";
import katex from "katex";
import { cn } from "@/lib/utils";

function render(src: string, displayMode: boolean): string {
  try {
    return katex.renderToString(src, {
      throwOnError: false,
      displayMode,
      strict: "ignore",
    });
  } catch {
    return src;
  }
}

/** Inline math, e.g. within a sentence: "dla <Math>{"x \\ge 0"}</Math>". */
export function Math({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn("align-middle", className)}
      dangerouslySetInnerHTML={{ __html: render(children, false) }}
    />
  );
}

/** Block/display math, centered on its own line. */
export function MathBlock({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={cn("overflow-x-auto py-1 text-center", className)}
      dangerouslySetInnerHTML={{ __html: render(children, true) }}
    />
  );
}

/**
 * Renders a plain string that may mix prose with $inline$ and $$block$$
 * KaTeX segments — the format problem/lesson `statement`/`text` fields use
 * so authored content doesn't have to be split into separate fields.
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g).filter((p) => p.length > 0);
  return (
    <p className={cn("whitespace-pre-line leading-relaxed", className)}>
      {parts.map((part, i) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          return <MathBlock key={i}>{part.slice(2, -2)}</MathBlock>;
        }
        if (part.startsWith("$") && part.endsWith("$")) {
          return <Math key={i}>{part.slice(1, -1)}</Math>;
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
