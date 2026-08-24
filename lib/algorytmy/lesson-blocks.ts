// ============================================================================
// lib/algorytmy/lesson-blocks.ts
// Block types for Algorytmy lessons. A lesson is an ordered AlgoBlock[] stored
// as jsonb in algo_lessons.content and rendered by
// components/algorytmy/lesson/block-renderer.tsx.
//
// Its own block set rather than a shared one, for the same reason Geografia
// has its own (lib/geografia/lesson-blocks.ts) instead of reusing Linguo's:
// the blocks that carry the teaching are subject-specific. A geography lesson
// needs a klimatogram; an algorithms lesson needs to SHOW the array being
// sorted, step by step, with the comparisons highlighted. Prose about
// quicksort is the one thing that reliably fails to teach quicksort.
//
// That is why the interactive blocks here are not decoration. `sorting`,
// `traversal`, `binary-search` and `structure-ops` each run the real algorithm
// over authored input and let the student step through it — the visualiser IS
// the explanation, and the surrounding text is the commentary.
// ============================================================================

/** Languages the `code` block knows how to label. Rendering is plain
 * monospace — no syntax highlighter dependency for a handful of snippets. */
export type AlgoCodeLanguage = "python" | "javascript" | "pseudokod";

export interface AlgoComplexityRow {
  operation: string;
  /** Big-O strings, written plainly: "O(1)", "O(log n)", "O(n log n)". */
  best?: string;
  average?: string;
  worst: string;
  note?: string;
}

export interface AlgoStep {
  title: string;
  text: string;
}

export interface AlgoCompareRow {
  aspect: string;
  left: string;
  right: string;
}

/** Sorting algorithms the visualiser can actually run — see
 * components/algorytmy/lesson/sorting-block.tsx, which reimplements each one
 * as a generator of frames rather than animating a canned recording. */
export type AlgoSortingAlgorithm = "bubble" | "insertion" | "selection" | "merge" | "quick";

export type AlgoTraversalAlgorithm = "bfs" | "dfs";

export interface AlgoGraphNode {
  id: string;
  label: string;
  /** Position on a 0–100 grid; the renderer scales it to the viewport. */
  x: number;
  y: number;
}

export interface AlgoGraphEdge {
  from: string;
  to: string;
  weight?: number;
}

/** One operation in a stack/queue animation. `value` is required for push. */
export interface AlgoStructureOp {
  op: "push" | "pop";
  value?: string;
}

export type AlgoBlock =
  // ——— proza i materiał referencyjny ———
  | { type: "intro"; text: string }
  | { type: "definition"; term: string; text: string; note?: string }
  | {
      type: "code";
      title?: string;
      language: AlgoCodeLanguage;
      code: string;
      caption?: string;
    }
  | { type: "complexity"; title?: string; rows: AlgoComplexityRow[]; note?: string }
  | { type: "steps"; title: string; steps: AlgoStep[] }
  | {
      type: "compare";
      title: string;
      leftLabel: string;
      rightLabel: string;
      rows: AlgoCompareRow[];
    }
  | { type: "table"; title?: string; caption?: string; headers: string[]; rows: string[][] }
  | { type: "tip"; variant: "tip" | "warning" | "exam"; text: string }

  // ——— bloki interaktywne ———
  | {
      type: "sorting";
      title: string;
      algorithm: AlgoSortingAlgorithm;
      /** Starting array. Keep it short — 6–10 values stay readable on a phone. */
      values: number[];
      caption?: string;
    }
  | {
      type: "traversal";
      title: string;
      algorithm: AlgoTraversalAlgorithm;
      nodes: AlgoGraphNode[];
      edges: AlgoGraphEdge[];
      startId: string;
      caption?: string;
    }
  | {
      type: "binary-search";
      title: string;
      /** Must be sorted ascending — the build script enforces it. */
      values: number[];
      target: number;
      caption?: string;
    }
  | {
      type: "structure-ops";
      title: string;
      kind: "stack" | "queue";
      operations: AlgoStructureOp[];
      caption?: string;
    }
  | {
      type: "growth";
      title: string;
      /** Which curves to plot, e.g. ["1", "log n", "n", "n log n", "n^2"]. */
      functions: string[];
      /** Largest n on the x axis. */
      maxN: number;
      caption?: string;
    }
  | {
      type: "quiz";
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };

export type AlgoLesson = AlgoBlock[];

/** Growth functions the `growth` block can plot, and how to evaluate them.
 * Kept here rather than in the component so the build script can validate a
 * lesson's `functions` against the same list. */
export const ALGO_GROWTH_FUNCTIONS: Record<string, (n: number) => number> = {
  "1": () => 1,
  "log n": (n) => Math.log2(Math.max(n, 1)),
  "n": (n) => n,
  "n log n": (n) => n * Math.log2(Math.max(n, 1)),
  "n^2": (n) => n * n,
  "2^n": (n) => Math.pow(2, n),
};
