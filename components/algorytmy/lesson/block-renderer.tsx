// ============================================================================
// components/algorytmy/lesson/block-renderer.tsx
// Dispatches one AlgoBlock onto its component. Server Component: the static
// blocks render on the server, and only the interactive ones ship JavaScript.
//
// The switch is exhaustive over AlgoBlock — `never` in the default arm means
// adding a block type to lib/algorytmy/lesson-blocks.ts without handling it
// here is a compile error, not a silently blank space in a lesson.
// ============================================================================
import type { AlgoBlock } from "@/lib/algorytmy/lesson-blocks";
import {
  CodeBlock,
  CompareBlock,
  ComplexityBlock,
  DefinitionBlock,
  IntroBlock,
  StepsBlock,
  TableBlock,
  TipBlock,
} from "@/components/algorytmy/lesson/static-blocks";
import { SortingBlock } from "@/components/algorytmy/lesson/sorting-block";
import { TraversalBlock } from "@/components/algorytmy/lesson/traversal-block";
import { BinarySearchBlock } from "@/components/algorytmy/lesson/binary-search-block";
import { StructureOpsBlock } from "@/components/algorytmy/lesson/structure-ops-block";
import { GrowthBlock } from "@/components/algorytmy/lesson/growth-block";
import { QuizBlock } from "@/components/algorytmy/lesson/quiz-block";

export function BlockRenderer({ block }: { block: AlgoBlock }) {
  switch (block.type) {
    case "intro":
      return <IntroBlock text={block.text} />;
    case "definition":
      return <DefinitionBlock term={block.term} text={block.text} note={block.note} />;
    case "code":
      return (
        <CodeBlock
          title={block.title}
          language={block.language}
          code={block.code}
          caption={block.caption}
        />
      );
    case "complexity":
      return <ComplexityBlock title={block.title} rows={block.rows} note={block.note} />;
    case "steps":
      return <StepsBlock title={block.title} steps={block.steps} />;
    case "compare":
      return (
        <CompareBlock
          title={block.title}
          leftLabel={block.leftLabel}
          rightLabel={block.rightLabel}
          rows={block.rows}
        />
      );
    case "table":
      return (
        <TableBlock
          title={block.title}
          caption={block.caption}
          headers={block.headers}
          rows={block.rows}
        />
      );
    case "tip":
      return <TipBlock variant={block.variant} text={block.text} />;
    case "sorting":
      return (
        <SortingBlock
          title={block.title}
          algorithm={block.algorithm}
          values={block.values}
          caption={block.caption}
        />
      );
    case "traversal":
      return (
        <TraversalBlock
          title={block.title}
          algorithm={block.algorithm}
          nodes={block.nodes}
          edges={block.edges}
          startId={block.startId}
          caption={block.caption}
        />
      );
    case "binary-search":
      return (
        <BinarySearchBlock
          title={block.title}
          values={block.values}
          target={block.target}
          caption={block.caption}
        />
      );
    case "structure-ops":
      return (
        <StructureOpsBlock
          title={block.title}
          kind={block.kind}
          operations={block.operations}
          caption={block.caption}
        />
      );
    case "growth":
      return (
        <GrowthBlock
          title={block.title}
          functions={block.functions}
          maxN={block.maxN}
          caption={block.caption}
        />
      );
    case "quiz":
      return (
        <QuizBlock
          question={block.question}
          options={block.options}
          correctIndex={block.correctIndex}
          explanation={block.explanation}
        />
      );
    default: {
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}
