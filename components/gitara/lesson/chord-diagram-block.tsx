// ============================================================================
// components/gitara/lesson/chord-diagram-block.tsx
// A grid of chord shapes for the lesson to introduce — Server Component,
// since only the tap-to-play control inside ChordDiagram itself needs JS.
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { ChordDiagram } from "@/components/gitara/chord-diagram";
import { RichText } from "@/components/gitara/lesson/rich-text";
import type { GtrLessonChord } from "@/lib/gitara/lesson-blocks";

export function ChordDiagramBlock({
  title,
  chords,
  caption,
}: {
  title: string;
  chords: GtrLessonChord[];
  caption?: string;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <CardTitle>{title}</CardTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {chords.map((c, i) => (
          <ChordDiagram key={i} chord={c.chord} label={c.label} size="sm" />
        ))}
      </div>
      {caption && <RichText text={caption} className="text-xs text-foreground-muted" />}
    </Card>
  );
}
