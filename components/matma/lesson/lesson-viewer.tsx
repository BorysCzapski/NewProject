"use client";

// ============================================================================
// components/matma/lesson/lesson-viewer.tsx
// Renders a whole lesson: maps every MathBlock through LessonBlockRenderer in
// order, tracking two things as it goes (both purely didactic, no server
// round-trip):
//  - `recapText`: the nearest preceding intro/definition/formula block's
//    explanatory text, threaded into any "quiz" block so a wrong answer can
//    show a "Przypomnienie" of the relevant material inline.
//  - the lesson's own "quiz"-type blocks, whose last few become the control
//    quiz self-assessment.tsx offers when the student picks "Muszę
//    powtórzyć" instead of "Tak, rozumiem".
// Ends with self-assessment.tsx.
// ============================================================================
import type { ReactNode } from "react";
import { LessonBlockRenderer } from "@/components/matma/lesson/block-renderer";
import { SelfAssessment } from "@/components/matma/lesson/self-assessment";
import type { MathBlock, QuizQuestion } from "@/lib/matma/lesson-blocks";

const MAX_RECAP_QUESTIONS = 3;

export function LessonViewer({
  blocks,
  topicSlug,
  lessonId,
}: {
  blocks: MathBlock[];
  topicSlug: string;
  lessonId: string;
}) {
  const rendered: ReactNode[] = [];
  const quizBlocks: Extract<MathBlock, { type: "quiz" }>[] = [];
  let recapText: string | undefined;

  blocks.forEach((block, i) => {
    // Capture the recap text as it stood BEFORE this block, so a "quiz"
    // block never recaps itself.
    rendered.push(<LessonBlockRenderer key={i} block={block} recapText={recapText} />);

    if (block.type === "intro" || block.type === "definition") {
      recapText = block.text;
    } else if (block.type === "formula" && block.caption) {
      recapText = block.caption;
    } else if (block.type === "quiz") {
      quizBlocks.push(block);
    }
  });

  const recapQuestions: QuizQuestion[] = quizBlocks.slice(-MAX_RECAP_QUESTIONS).map((b) => ({
    question: b.question,
    options: b.options,
    correctIndex: b.correctIndex,
    explanation: b.explanation,
  }));

  return (
    <div className="flex flex-col gap-4" data-lesson-id={lessonId}>
      {rendered}
      <SelfAssessment topicSlug={topicSlug} recapQuestions={recapQuestions} />
    </div>
  );
}
