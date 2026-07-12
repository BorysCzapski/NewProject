"use client";

// ============================================================================
// components/grammar/lesson/grammar-lesson.tsx
// Renders an interactive grammar lesson: maps the topic's authored blocks
// (lib/grammar/content/*) onto their components. Static block types (intro,
// tip, table) are rendered inline here; interactive ones have their own
// components in this directory.
// ============================================================================
import { Lightbulb, TriangleAlert } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FormulaBlock } from "@/components/grammar/lesson/formula-block";
import { TimelineBlock } from "@/components/grammar/lesson/timeline-block";
import { ExamplesBlock } from "@/components/grammar/lesson/examples-block";
import { QuizBlock } from "@/components/grammar/lesson/quiz-block";
import { CompareBlock } from "@/components/grammar/lesson/compare-block";
import type { GrammarBlock } from "@/lib/grammar/lesson-blocks";

export function GrammarLesson({ blocks }: { blocks: GrammarBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => (
        <LessonBlock key={i} block={block} />
      ))}
    </div>
  );
}

function LessonBlock({ block }: { block: GrammarBlock }) {
  switch (block.type) {
    case "intro":
      return <p className="text-base leading-relaxed text-foreground">{block.text}</p>;

    case "formula":
      return <FormulaBlock title={block.title} caption={block.caption} variants={block.variants} />;

    case "timeline":
      return <TimelineBlock title={block.title} caption={block.caption} markers={block.markers} />;

    case "table":
      return (
        <Card>
          {block.title && <CardTitle className="mb-3">{block.title}</CardTitle>}
          <div className="-mx-4 overflow-x-auto px-4">
            <table className="w-full min-w-max border-collapse text-sm">
              <thead>
                <tr>
                  {block.headers.map((header, i) => (
                    <th
                      key={i}
                      className="border-b-2 border-border px-2.5 py-2 text-left font-semibold text-foreground"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} className={cn(i % 2 === 1 && "bg-surface-muted/60")}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={cn(
                          "border-b border-border px-2.5 py-2 leading-relaxed",
                          j === 0 ? "font-medium text-foreground" : "text-foreground-muted"
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <p className="mt-2 text-sm text-foreground-muted">{block.caption}</p>}
        </Card>
      );

    case "examples":
      return <ExamplesBlock title={block.title} items={block.items} />;

    case "compare":
      return <CompareBlock title={block.title} columns={block.columns} />;

    case "tip":
      return (
        <div
          className={cn(
            "flex gap-2.5 rounded-(--radius-control) px-3.5 py-3",
            block.variant === "warning" ? "bg-warning-soft" : "bg-primary-soft"
          )}
        >
          {block.variant === "warning" ? (
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          ) : (
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          )}
          <p
            className={cn(
              "text-sm leading-relaxed",
              block.variant === "warning" ? "text-warning" : "text-primary"
            )}
          >
            {block.text}
          </p>
        </div>
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
  }
}
