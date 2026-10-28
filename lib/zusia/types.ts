// ============================================================================
// lib/zusia/types.ts
// Shared shapes for the ZUSia content (theory, questions, flashcards,
// crosswords, mind maps). The content itself is static TypeScript extracted
// from the "Lekcje z ZUS 2026/2027" textbook photos and the olympiad PDFs,
// so every mode (training, test, AI tasks) can be built without a database.
// ============================================================================

export type LessonId = "l1" | "l2" | "l3" | "l4" | "d1" | "d2";

export interface Lesson {
  id: LessonId;
  /** Short label for chips, e.g. "Lekcja 1". */
  short: string;
  title: string;
  subtitle: string;
  /** Where the material comes from (shown on the theory page). */
  source: string;
}

/** Text supports **bold** inline markup (see components/zusia/rich-text). */
export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "important"; title?: string; text: string }
  | { type: "example"; title: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export interface TheorySection {
  id: string;
  lesson: LessonId;
  title: string;
  blocks: Block[];
}

export type QuestionType = "single" | "multi" | "tf" | "open";

export interface Question {
  id: string;
  lesson: LessonId;
  type: QuestionType;
  prompt: string;
  /** single / multi: the options; tf: omitted. */
  options?: string[];
  /** single: [i]; multi: all correct indexes; tf: [1] = prawda, [0] = fałsz. */
  correct?: number[];
  /** Always shown after answering. For open tasks it is the model answer. */
  explanation: string;
  /** Where this task comes from: "podręcznik", "olimpiada 2017", "ZUSia". */
  source?: string;
}

export interface Flashcard {
  id: string;
  lesson: LessonId;
  term: string;
  definition: string;
}

export interface CrosswordEntry {
  answer: string;
  clue: string;
}

export interface Crossword {
  id: string;
  lesson: LessonId;
  title: string;
  entries: CrosswordEntry[];
}

export interface MindMapBranch {
  label: string;
  items: string[];
}

export interface MindMap {
  id: string;
  lesson: LessonId;
  center: string;
  branches: MindMapBranch[];
}
