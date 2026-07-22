// ============================================================================
// components/matma/lesson/intro-block.tsx
// Opening paragraph of a lesson — plain prose, may embed KaTeX.
// ============================================================================
import { MathText } from "@/components/matma/math";

export function IntroBlock({ text }: { text: string }) {
  return <MathText text={text} className="text-base text-foreground" />;
}
