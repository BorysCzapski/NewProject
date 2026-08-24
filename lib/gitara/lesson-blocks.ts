// ============================================================================
// lib/gitara/lesson-blocks.ts
// Block types for Gitara lessons. A lesson is an ordered GtrBlock[] stored as
// jsonb in gtr_lessons.content and rendered by
// components/gitara/lesson/block-renderer.tsx.
//
// Its own block set rather than a shared one, for the same reason every
// sibling app (Algorytmy, Geografia, ...) has its own — see
// lib/algorytmy/lesson-blocks.ts's module comment. A guitar lesson doesn't
// need a klimatogram or a sorting animation; it needs to SHOW a chord shape
// on a fretboard, let the student hear it, and let them find a note by ear
// and by eye. `chord-diagram`, `caged-shapes`, `fretboard-explorer`,
// `rhythm-values` and `progression` are not decoration — each runs real
// music theory (lib/gitara/theory.ts) over authored data, the same
// "the visualiser IS the explanation" stance the interactive blocks in every
// other subject take.
// ============================================================================
import type { FrettedChord } from "@/lib/gitara/theory";

export interface GtrStep {
  title: string;
  text: string;
}

export interface GtrCompareRow {
  aspect: string;
  left: string;
  right: string;
}

/** One chord shown in a `chord-diagram` or `progression` block. `slug` links
 * back to the chord library (/gitara/akordy/[slug]) when the chord has an
 * entry there; omit it for a one-off shape authored only for this lesson. */
export interface GtrLessonChord {
  label: string;
  slug?: string;
  chord: FrettedChord;
}

export type GtrBlock =
  // ——— proza i materiał referencyjny ———
  | { type: "intro"; text: string }
  | { type: "definition"; term: string; text: string; note?: string }
  | { type: "tip"; variant: "tip" | "warning" | "key"; text: string }
  | { type: "steps"; title: string; steps: GtrStep[] }
  | { type: "compare"; title: string; leftLabel: string; rightLabel: string; rows: GtrCompareRow[] }
  | { type: "table"; title?: string; caption?: string; headers: string[]; rows: string[][] }
  | {
      type: "tab";
      title: string;
      /** Raw 6-line tab excerpt, low E to high e, monospace. */
      tabText: string;
      caption?: string;
    }

  // ——— bloki interaktywne ———
  | {
      type: "chord-diagram";
      title: string;
      chords: GtrLessonChord[];
      caption?: string;
    }
  | {
      type: "progression";
      title: string;
      chords: GtrLessonChord[];
      bpm?: number;
      caption?: string;
    }
  | {
      /** Always the 5 root-C shapes from lib/gitara/theory.ts — see that
       * file's module comment for why C is the fixed teaching example. */
      type: "caged-shapes";
      title: string;
      caption?: string;
    }
  | {
      type: "fretboard-explorer";
      title: string;
      /** The note the student practises finding across the neck. */
      targetNote: string;
      frets?: number;
      caption?: string;
    }
  | {
      type: "rhythm-values";
      title: string;
      bpm?: number;
      caption?: string;
    }
  | {
      type: "quiz";
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };

export type GtrLesson = GtrBlock[];
