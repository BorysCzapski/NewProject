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

// ----------------------------------------------------------------------------
// Drill blocks
//
// The blocks above PRESENT grammar; the ones below make the student produce
// it mid-lesson, which is the difference between reading a rule and knowing
// it. They stay purely didactic — like `quiz`, nothing here is persisted or
// graded; the graded work lives in the exercise/task tables.
//
// New blocks name their fields `text`/`pl` rather than following the older
// `en`/`pl` pair used by ExampleItem and FormulaVariant. Those two predate
// multilingual content and now hold Spanish and Russian in a field called
// `en`; there is no reason to spread that.
// ----------------------------------------------------------------------------

export interface FillGapItem {
  /** Sentence text before the gap. */
  before: string;
  /** Sentence text after the gap. */
  after: string;
  /**
   * Every spelling that counts as correct — the first is treated as the
   * canonical answer and shown when the student gives up. Comparison is
   * case- and whitespace-insensitive but NOT accent-insensitive: on a Spanish
   * lesson "esta" must not pass for "está", since a missing tilde is exactly
   * the error the exam penalises.
   */
  accept: string[];
  /** Optional nudge shown before answering, e.g. the infinitive to conjugate. */
  hint?: string;
  /** Polish translation of the completed sentence, shown after answering. */
  pl?: string;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface OrderWordsItem {
  /**
   * The chunks in their CORRECT order. The renderer shuffles them for display,
   * so authored content can never disagree with itself about the answer.
   */
  correct: string[];
  /** Polish translation, shown once solved. */
  pl?: string;
  /** Why this order — e.g. "zaimek dopełnienia stoi przed odmienionym czasownikiem". */
  note?: string;
}

/** One column of a conjugation/declension paradigm; `forms` lines up with the
 * block's `persons`, index for index. */
export interface ConjugationColumn {
  label: string;
  forms: string[];
}

export interface FlashcardItem {
  front: string;
  back: string;
  example?: string;
}

export interface PhraseGroup {
  label: string;
  phrases: { text: string; pl: string }[];
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
    }
  | {
      type: "fillGap";
      title?: string;
      instruction?: string;
      items: FillGapItem[];
    }
  | {
      type: "matchPairs";
      title?: string;
      instruction?: string;
      pairs: MatchPair[];
    }
  | {
      type: "orderWords";
      title?: string;
      instruction?: string;
      items: OrderWordsItem[];
    }
  | {
      type: "conjugation";
      title?: string;
      caption?: string;
      /** Row labels — "yo", "tú", … or "I", "you", … */
      persons: string[];
      columns: ConjugationColumn[];
      /** Forms to flag as irregular once revealed (exact string match). */
      highlight?: string[];
    }
  | {
      type: "flashcards";
      title?: string;
      cards: FlashcardItem[];
    }
  | {
      type: "keyPhrases";
      title?: string;
      caption?: string;
      groups: PhraseGroup[];
    };

export type GrammarLesson = GrammarBlock[];
