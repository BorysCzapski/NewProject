"use client";

// ============================================================================
// components/matma/lesson/block-renderer.tsx
// Switches a single MathBlock onto its component. `recapText` is plumbing
// only used by the "quiz" case: lesson-viewer.tsx tracks the nearest
// preceding intro/definition/formula block's text as it iterates the lesson
// in order and passes it down here, so a wrong quiz answer can show that
// text inline via QuizBlock's "Przypomnienie" box instead of just the
// explanation string. `onQuizResult` likewise just forwards through to the
// "quiz" case for callers (e.g. self-assessment/progress tracking) that want
// to know whether the student got it right.
// ============================================================================
import { IntroBlock } from "@/components/matma/lesson/intro-block";
import { DefinitionBlock } from "@/components/matma/lesson/definition-block";
import { FormulaBlock } from "@/components/matma/lesson/formula-block";
import { TableBlock } from "@/components/matma/lesson/table-block";
import { TipBlock } from "@/components/matma/lesson/tip-block";
import { ExamplesBlock } from "@/components/matma/lesson/examples-block";
import { QuizBlock } from "@/components/matma/lesson/quiz-block";
import { RevealStepsBlock } from "@/components/matma/lesson/reveal-steps-block";
import { BasicsRecapBlock } from "@/components/matma/lesson/basics-recap-block";
import { FunctionPlotBlock } from "@/components/matma/lesson/function-plot-block";
import { GeometryBlock } from "@/components/matma/lesson/geometry-block";
import { Solid3DBlock } from "@/components/matma/lesson/solid3d-block";
import type { MathBlock } from "@/lib/matma/lesson-blocks";

export function LessonBlockRenderer({
  block,
  onQuizResult,
  recapText,
}: {
  block: MathBlock;
  onQuizResult?: (correct: boolean) => void;
  recapText?: string;
}) {
  switch (block.type) {
    case "intro":
      return <IntroBlock text={block.text} />;

    case "basics-recap":
      return (
        <BasicsRecapBlock
          title={block.title}
          text={block.text}
          formula={block.formula}
          controlQuiz={block.controlQuiz}
        />
      );

    case "definition":
      return <DefinitionBlock term={block.term} text={block.text} formula={block.formula} />;

    case "formula":
      return (
        <FormulaBlock
          title={block.title}
          caption={block.caption}
          expression={block.expression}
          variables={block.variables}
        />
      );

    case "examples":
      return <ExamplesBlock title={block.title} items={block.items} />;

    case "reveal-steps":
      return <RevealStepsBlock title={block.title} problem={block.problem} steps={block.steps} />;

    case "function-plot":
      return (
        <FunctionPlotBlock
          title={block.title}
          caption={block.caption}
          expression={block.expression}
          params={block.params}
          domain={block.domain}
          range={block.range}
        />
      );

    case "geometry":
      return <GeometryBlock title={block.title} caption={block.caption} shape={block.shape} />;

    case "solid3d":
      return <Solid3DBlock title={block.title} caption={block.caption} solid={block.solid} />;

    case "table":
      return (
        <TableBlock title={block.title} caption={block.caption} headers={block.headers} rows={block.rows} />
      );

    case "tip":
      return <TipBlock variant={block.variant} text={block.text} />;

    case "quiz":
      return (
        <QuizBlock
          question={block.question}
          options={block.options}
          correctIndex={block.correctIndex}
          explanation={block.explanation}
          recapText={recapText}
          onResult={onQuizResult}
        />
      );
  }
}
