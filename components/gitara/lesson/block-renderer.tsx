// ============================================================================
// components/gitara/lesson/block-renderer.tsx
// Dispatches one GtrBlock onto its component. Server Component: the static
// blocks render on the server, and only the interactive ones ship JavaScript.
//
// The switch is exhaustive over GtrBlock — `never` in the default arm means
// adding a block type to lib/gitara/lesson-blocks.ts without handling it
// here is a compile error, not a silently blank space in a lesson.
// ============================================================================
import type { GtrBlock } from "@/lib/gitara/lesson-blocks";
import {
  CompareBlock,
  DefinitionBlock,
  IntroBlock,
  StepsBlock,
  TableBlock,
  TabBlock,
  TipBlock,
} from "@/components/gitara/lesson/static-blocks";
import { QuizBlock } from "@/components/gitara/lesson/quiz-block";
import { ChordDiagramBlock } from "@/components/gitara/lesson/chord-diagram-block";
import { ProgressionBlock } from "@/components/gitara/lesson/progression-block";
import { CagedBlock } from "@/components/gitara/lesson/caged-block";
import { FretboardExplorerBlock } from "@/components/gitara/lesson/fretboard-explorer-block";
import { RhythmValuesBlock } from "@/components/gitara/lesson/rhythm-values-block";

export function BlockRenderer({ block }: { block: GtrBlock }) {
  switch (block.type) {
    case "intro":
      return <IntroBlock text={block.text} />;
    case "definition":
      return <DefinitionBlock term={block.term} text={block.text} note={block.note} />;
    case "tip":
      return <TipBlock variant={block.variant} text={block.text} />;
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
        <TableBlock title={block.title} caption={block.caption} headers={block.headers} rows={block.rows} />
      );
    case "tab":
      return <TabBlock title={block.title} tabText={block.tabText} caption={block.caption} />;
    case "chord-diagram":
      return <ChordDiagramBlock title={block.title} chords={block.chords} caption={block.caption} />;
    case "progression":
      return (
        <ProgressionBlock title={block.title} chords={block.chords} bpm={block.bpm} caption={block.caption} />
      );
    case "caged-shapes":
      return <CagedBlock title={block.title} caption={block.caption} />;
    case "fretboard-explorer":
      return (
        <FretboardExplorerBlock
          title={block.title}
          targetNote={block.targetNote}
          frets={block.frets}
          caption={block.caption}
        />
      );
    case "rhythm-values":
      return <RhythmValuesBlock title={block.title} bpm={block.bpm} caption={block.caption} />;
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
