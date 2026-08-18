// ============================================================================
// lib/matura/grading.ts
// Programmatic grading for matura tasks: exact-normalized string match
// against a list of accepted answers (no AI, no fuzzy tolerance). Unlike
// Linguo's isCloseMatch (lib/utils.ts), this deliberately does NOT tolerate
// typos — a one-letter slip on a "środki językowe" item (e.g. "has been" vs
// "have been") is exactly the kind of grammatical mistake the exam is
// testing for, so accepted variants must be listed explicitly in
// correctAnswers rather than inferred by edit distance.
// ============================================================================
import type { MaturaTaskContent, MaturaTaskItemResult } from "@/lib/types/database";

function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, "")
    .replace(/\s+/g, " ");
}

export function gradeTaskItem(correctAnswers: string[], studentAnswer: string): boolean {
  const normalizedInput = normalize(studentAnswer);
  if (!normalizedInput) return false;
  return correctAnswers.some((accepted) => normalize(accepted) === normalizedInput);
}

export interface TaskGradingResult {
  pointsAwarded: number;
  maxPoints: number;
  itemResults: MaturaTaskItemResult[];
}

/** Grades every item in a task's content against the student's submitted answers. */
export function gradeTask(content: MaturaTaskContent, answers: Record<string, string>): TaskGradingResult {
  const itemResults: MaturaTaskItemResult[] = content.items.map((item) => {
    const studentAnswer = answers[item.id] ?? "";
    const isCorrect = gradeTaskItem(item.correctAnswers, studentAnswer);
    return { itemId: item.id, isCorrect, studentAnswer, correctAnswers: item.correctAnswers };
  });

  return {
    pointsAwarded: itemResults.filter((r) => r.isCorrect).length,
    maxPoints: content.items.length,
    itemResults,
  };
}
