// ============================================================================
// components/matma/lesson/formula-block.tsx
// A highlighted formula (pure KaTeX) with an optional legend of what each
// variable means.
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { MathBlock as KatexBlock, Math as InlineMath } from "@/components/matma/math";

export function FormulaBlock({
  title,
  caption,
  expression,
  variables,
}: {
  title?: string;
  caption?: string;
  expression: string;
  variables?: { symbol: string; meaning: string }[];
}) {
  return (
    <Card>
      {title && <CardTitle>{title}</CardTitle>}
      <KatexBlock className="text-xl">{expression}</KatexBlock>
      {variables && variables.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
          {variables.map((v, i) => (
            <li key={i} className="flex items-baseline gap-2 text-sm text-foreground-muted">
              <span className="font-medium text-foreground">
                <InlineMath>{v.symbol}</InlineMath>
              </span>
              <span>— {v.meaning}</span>
            </li>
          ))}
        </ul>
      )}
      {caption && <p className="mt-2 text-sm text-foreground-muted">{caption}</p>}
    </Card>
  );
}
