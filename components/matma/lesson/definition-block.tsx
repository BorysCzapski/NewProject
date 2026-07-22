// ============================================================================
// components/matma/lesson/definition-block.tsx
// A named definition: term + prose explanation + optional pure-KaTeX formula.
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { MathText, MathBlock as KatexBlock } from "@/components/matma/math";

export function DefinitionBlock({
  term,
  text,
  formula,
}: {
  term: string;
  text: string;
  formula?: string;
}) {
  return (
    <Card className="border-primary/30">
      <CardTitle className="flex items-center gap-2">
        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-primary">
          Definicja
        </span>
        {term}
      </CardTitle>
      <MathText text={text} className="mt-2 text-sm text-foreground" />
      {formula && <KatexBlock className="text-lg">{formula}</KatexBlock>}
    </Card>
  );
}
