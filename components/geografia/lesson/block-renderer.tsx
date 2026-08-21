"use client";

// ============================================================================
// components/geografia/lesson/block-renderer.tsx
// Switches a single GeoBlock onto its component. `recapText` is plumbing for
// the "quiz" case only: lesson-viewer.tsx tracks the nearest preceding
// intro/definition text as it walks the lesson in order and threads it here,
// so a wrong answer can re-show the relevant explanation inline. Same shape
// as components/matma/lesson/block-renderer.tsx.
//
// The switch is exhaustive over GeoBlock["type"]; TypeScript will flag a
// missing case if a new block type is added to lib/geografia/lesson-blocks.ts.
// ============================================================================
import {
  CaseStudyBlock,
  DefinitionBlock,
  IntroBlock,
  MnemonicBlock,
  TipBlock,
} from "@/components/geografia/lesson/text-blocks";
import {
  ClassificationBlock,
  CompareBlock,
  FormulaBlock,
  KeyNumbersBlock,
  TableBlock,
} from "@/components/geografia/lesson/data-blocks";
import { ProcessBlock } from "@/components/geografia/lesson/process-block";
import { TimelineBlock } from "@/components/geografia/lesson/timeline-block";
import { LayersBlock } from "@/components/geografia/lesson/layers-block";
import { ConcentricBlock } from "@/components/geografia/lesson/concentric-block";
import { CycleBlock } from "@/components/geografia/lesson/cycle-block";
import { ZonesBlock } from "@/components/geografia/lesson/zones-block";
import { ClimateChartBlock } from "@/components/geografia/lesson/climate-chart-block";
import { PopulationPyramidBlock } from "@/components/geografia/lesson/population-pyramid-block";
import { ChartBlock } from "@/components/geografia/lesson/chart-block";
import { MapExploreBlock } from "@/components/geografia/lesson/map-explore-block";
import { MatchingBlock } from "@/components/geografia/lesson/matching-block";
import { OrderingBlock } from "@/components/geografia/lesson/ordering-block";
import { QuizBlock } from "@/components/geografia/lesson/quiz-block";
import type { GeoBlock } from "@/lib/geografia/lesson-blocks";

export function GeoBlockRenderer({
  block,
  recapText,
  onQuizResult,
}: {
  block: GeoBlock;
  recapText?: string;
  onQuizResult?: (correct: boolean) => void;
}) {
  switch (block.type) {
    case "intro":
      return <IntroBlock text={block.text} />;
    case "definition":
      return <DefinitionBlock term={block.term} text={block.text} note={block.note} />;
    case "key-numbers":
      return <KeyNumbersBlock title={block.title} items={block.items} />;
    case "formula":
      return (
        <FormulaBlock
          title={block.title}
          expression={block.expression}
          variables={block.variables}
          caption={block.caption}
        />
      );
    case "table":
      return <TableBlock title={block.title} caption={block.caption} headers={block.headers} rows={block.rows} />;
    case "compare":
      return (
        <CompareBlock
          title={block.title}
          leftLabel={block.leftLabel}
          rightLabel={block.rightLabel}
          rows={block.rows}
        />
      );
    case "classification":
      return <ClassificationBlock title={block.title} caption={block.caption} groups={block.groups} />;
    case "case-study":
      return (
        <CaseStudyBlock title={block.title} region={block.region} text={block.text} takeaway={block.takeaway} />
      );
    case "mnemonic":
      return <MnemonicBlock title={block.title} text={block.text} expansion={block.expansion} />;
    case "tip":
      return <TipBlock variant={block.variant} text={block.text} />;
    case "process":
      return <ProcessBlock title={block.title} caption={block.caption} steps={block.steps} />;
    case "timeline":
      return <TimelineBlock title={block.title} caption={block.caption} events={block.events} />;
    case "layers":
      return (
        <LayersBlock
          title={block.title}
          caption={block.caption}
          orientation={block.orientation}
          layers={block.layers}
        />
      );
    case "concentric":
      return <ConcentricBlock title={block.title} caption={block.caption} shells={block.shells} />;
    case "cycle":
      return <CycleBlock title={block.title} caption={block.caption} stages={block.stages} />;
    case "zones":
      return <ZonesBlock title={block.title} caption={block.caption} zones={block.zones} />;
    case "climate-chart":
      return (
        <ClimateChartBlock
          title={block.title}
          station={block.station}
          caption={block.caption}
          temps={block.temps}
          precip={block.precip}
          answer={block.answer}
        />
      );
    case "population-pyramid":
      return (
        <PopulationPyramidBlock
          title={block.title}
          country={block.country}
          caption={block.caption}
          male={block.male}
          female={block.female}
          ageLabels={block.ageLabels}
          answer={block.answer}
        />
      );
    case "chart":
      return (
        <ChartBlock
          variant={block.variant}
          title={block.title}
          caption={block.caption}
          labels={block.labels}
          series={block.series}
          unit={block.unit}
        />
      );
    case "map-explore":
      return (
        <MapExploreBlock
          title={block.title}
          caption={block.caption}
          center={block.center}
          zoom={block.zoom}
          markers={block.markers}
        />
      );
    case "matching":
      return <MatchingBlock title={block.title} instruction={block.instruction} pairs={block.pairs} />;
    case "ordering":
      return (
        <OrderingBlock
          title={block.title}
          instruction={block.instruction}
          items={block.items}
          explanation={block.explanation}
        />
      );
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
