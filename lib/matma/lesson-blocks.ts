// ============================================================================
// lib/matma/lesson-blocks.ts
// Block types for interactive math lessons. A lesson is an ordered list of
// serializable blocks (safe to pass server -> client), analogous to
// lib/grammar/lesson-blocks.ts, but extended with the interaction types the
// Matma spec requires: a "basics-recap" block (skippable, gated by a control
// quiz), step-by-step reveal, an interactive function plot with draggable
// parameters, manipulable SVG geometry, and a lightweight CSS-3D solid
// viewer for stereometry.
//
// TWO kinds of math-bearing string fields, rendered by components/matma
// /math.tsx:
//  - PURE KaTeX fields (named `formula`/`expression`, e.g. FormulaBlock
//    .expression, RevealStep.formula): raw KaTeX source, no delimiters,
//    e.g. "x^2 + \\sqrt{3}" — render with <Math>/<MathBlock>.
//  - MIXED PROSE fields (`text`, `statement`, MathExampleStep.text, quiz
//    `question`/`options`/`explanation`, etc.): Polish prose that may embed
//    KaTeX with $...$ (inline) or $$...$$ (display) delimiters, e.g.
//    "Rozwiąż nierówność $x^2 - 4 > 0$." — render with <MathText>.
// ============================================================================

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MathExampleStep {
  /** Plain-language description of this step. */
  text: string;
  /** Optional KaTeX source shown alongside the text. */
  formula?: string;
}

export interface MathExampleItem {
  /** KaTeX source of the problem statement/expression. */
  problem: string;
  steps: MathExampleStep[];
  /** KaTeX source of the final answer. */
  answer: string;
}

export interface FunctionPlotParam {
  /** Single-letter symbol used in `expression`, e.g. "a". */
  symbol: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

/**
 * `expression` is a tiny JS expression string evaluated for x in `domain`,
 * e.g. "a * Math.sin(b * x + c)". Only Math.* and the declared param symbols
 * plus "x" are in scope (see components/matma/lesson/function-plot.tsx).
 */
export interface FunctionPlotBlock {
  type: "function-plot";
  title?: string;
  caption?: string;
  expression: string;
  params: FunctionPlotParam[];
  domain: [number, number];
  range?: [number, number];
}

export interface RevealStep {
  /** What the student is asked to predict/compute before revealing. */
  prompt: string;
  kind: "input" | "choice";
  /** kind: "choice" */
  options?: string[];
  correctIndex?: number;
  /** kind: "input" — loosely normalized string comparison (whitespace/spaces around operators ignored). */
  acceptedAnswers?: string[];
  /** Shown after the student answers (right or wrong), explains the correct step. */
  reveal: string;
  /** Optional KaTeX shown as part of the reveal. */
  formula?: string;
}

export interface GeometryPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  /** Whether the student can drag this point. Default true. */
  draggable?: boolean;
}

export type GeometryMeasure =
  | { kind: "area"; label: string }
  | { kind: "perimeter"; label: string }
  | { kind: "distance"; from: string; to: string; label: string }
  | { kind: "angle"; at: string; from: string; to: string; label: string };

export interface GeometryShape {
  /** 0-100 viewBox units. */
  points: GeometryPoint[];
  /** Point-id pairs drawn as edges, in order. */
  edges: [string, string][];
  measures: GeometryMeasure[];
}

export interface GeometryBlock {
  type: "geometry";
  title?: string;
  caption?: string;
  shape: GeometryShape;
}

export type Solid3DShape = "cuboid" | "pyramid4" | "cylinder" | "cone" | "sphere" | "prism3";

export interface Solid3DSpec {
  shape: Solid3DShape;
  /** e.g. { a: 3, b: 4, c: 5 } for a cuboid, { r: 2, h: 5 } for a cylinder. */
  dimensions: Record<string, number>;
  labels?: Record<string, string>;
}

export interface Solid3DBlock {
  type: "solid3d";
  title?: string;
  caption?: string;
  solid: Solid3DSpec;
}

export type MathBlock =
  | { type: "intro"; text: string }
  | {
      type: "basics-recap";
      title: string;
      /** Short refresher content shown by default. */
      text: string;
      formula?: string;
      /** 2-3 question control quiz used when the student clicks "znam to, przejdź dalej". */
      controlQuiz: QuizQuestion[];
    }
  | { type: "definition"; term: string; text: string; formula?: string }
  | {
      type: "formula";
      title?: string;
      caption?: string;
      expression: string;
      variables?: { symbol: string; meaning: string }[];
    }
  | { type: "examples"; title?: string; items: MathExampleItem[] }
  | { type: "reveal-steps"; title?: string; problem: string; steps: RevealStep[] }
  | FunctionPlotBlock
  | GeometryBlock
  | Solid3DBlock
  | { type: "table"; title?: string; caption?: string; headers: string[]; rows: string[][] }
  | { type: "tip"; variant: "tip" | "warning"; text: string }
  | ({ type: "quiz" } & QuizQuestion);

export type MathLesson = MathBlock[];

/** Loose input-answer normalization for reveal-steps "input" checks. */
export function normalizeMathAnswer(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/,/g, ".")
    .replace(/\\cdot|\*/g, "*")
    .trim();
}

export function isAcceptedAnswer(raw: string, accepted: string[]): boolean {
  const normalized = normalizeMathAnswer(raw);
  return accepted.some((a) => normalizeMathAnswer(a) === normalized);
}
