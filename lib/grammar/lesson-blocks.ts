// ============================================================================
// lib/grammar/lesson-blocks.ts
// Block types for interactive grammar lessons. A lesson is an ordered list
// of serializable blocks (safe to pass server -> client) rendered by
// components/grammar/lesson/*. Authored lesson content lives in
// lib/grammar/content/{a1,a2,b1,b2}.ts keyed by topic slug; topics without
// authored content fall back to the plain-text explanation from the DB.
// ============================================================================

/** Grammatical role of one chip in a formula — drives its color. */
export type FormulaRole =
  | "subject" // podmiot
  | "aux" // operator/czasownik posiłkowy (do/does/have/will...)
  | "verb" // czasownik główny
  | "object" // dopełnienie / reszta zdania
  | "negation" // not / n't
  | "qword" // słowo pytające (what/where...)
  | "other"; // przysłówki częstotliwości itp.

export interface FormulaPart {
  text: string;
  role: FormulaRole;
  /** Short note shown when the chip is tapped, e.g. "does → 3. osoba l.poj." */
  note?: string;
}

/** One tab of a formula block, e.g. "Twierdzenie" / "Przeczenie" / "Pytanie". */
export interface FormulaVariant {
  label: string;
  parts: FormulaPart[];
  example?: { en: string; pl: string };
}

/** A point or span on the tense timeline. Positions are 0-100; "now" is always drawn at 50. */
export interface TimelineMarker {
  /** Left edge position, 0-100 (50 = now). */
  at: number;
  /** If set, the marker is a span (state/duration) ending at this position. */
  to?: number;
  label: string;
  example?: { en: string; pl: string };
}

export interface ExampleItem {
  en: string;
  pl: string;
  /** Substring of `en` to visually highlight (the grammar point in action). */
  highlight?: string;
}

export interface CompareColumn {
  title: string;
  formula?: string;
  whenToUse: string;
  examples: string[];
}

export type GrammarBlock =
  | { type: "intro"; text: string }
  | {
      type: "formula";
      title?: string;
      caption?: string;
      variants: FormulaVariant[];
    }
  | {
      type: "timeline";
      title?: string;
      caption?: string;
      markers: TimelineMarker[];
    }
  | {
      type: "table";
      title?: string;
      caption?: string;
      headers: string[];
      rows: string[][];
    }
  | { type: "examples"; title?: string; items: ExampleItem[] }
  | { type: "compare"; title?: string; columns: CompareColumn[] }
  | { type: "tip"; variant: "tip" | "warning"; text: string }
  | {
      type: "quiz";
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };

export type GrammarLesson = GrammarBlock[];
