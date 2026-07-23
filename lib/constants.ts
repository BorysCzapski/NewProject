// ============================================================================
// lib/constants.ts
// Shared, framework-agnostic constants used across the app (nav items, level
// labels, homework type metadata). Centralised so every module presents the
// same Polish copy instead of re-typing labels ad hoc.
// ============================================================================
import type { HomeworkType, TargetLanguage, UserLevel, WritingTaskType } from "@/lib/types/database";

export const LEVELS: UserLevel[] = ["A1", "A2", "B1", "B2"];

// Languages the app can teach (always to a Polish speaker). 'en' is the default.
export const LANGUAGES: TargetLanguage[] = ["en", "es", "ru"];

export const LANGUAGE_LABELS: Record<TargetLanguage, string> = {
  en: "Angielski",
  es: "Hiszpański",
  ru: "Rosyjski",
};

export const LANGUAGE_FLAGS: Record<TargetLanguage, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  ru: "🇷🇺",
};

export const LEVEL_LABELS: Record<UserLevel, string> = {
  A1: "A1 — Początkujący",
  A2: "A2 — Podstawowy",
  B1: "B1 — Średnio zaawansowany",
  B2: "B2 — Wyższy średnio zaawansowany",
};

export const LEVEL_DESCRIPTIONS: Record<UserLevel, string> = {
  A1: "Znam podstawowe słowa i zwroty, buduję proste zdania.",
  A2: "Poradzę sobie w prostych, codziennych sytuacjach.",
  B1: "Swobodnie piszę i mówię o znanych mi tematach.",
  B2: "Rozumiem złożone teksty i dyskutuję na wiele tematów.",
};

// Phoenix is a shell hosting mini-apps, so the bottom tab bar is PER-APP:
// inside /jezyki the Linguo tabs show (with a Phoenix-home tab first);
// everywhere else the platform-level tabs show. The bottom nav picks the
// set whose `prefix` matches the current pathname (longest wins).
export interface NavItem {
  href: string;
  label: string;
  icon:
    | "Home"
    | "BookOpen"
    | "ClipboardList"
    | "Calendar"
    | "User"
    | "LayoutGrid"
    | "Sun"
    | "Hammer"
    | "Calculator"
    | "Wallet"
    | "PiggyBank"
    | "TrendingUp"
    | "Target";
  /** Highlight only on exact pathname match (for app/platform home tabs). */
  exact?: boolean;
}

export const PHOENIX_NAV: NavItem[] = [
  { href: "/", label: "Start", icon: "Home", exact: true },
  { href: "/aplikacje", label: "Aplikacje", icon: "LayoutGrid" },
  { href: "/profil", label: "Profil", icon: "User" },
];

export const LINGUO_NAV: NavItem[] = [
  { href: "/", label: "Phoenix", icon: "Home", exact: true },
  { href: "/jezyki", label: "Dziś", icon: "Sun", exact: true },
  { href: "/jezyki/nauka", label: "Nauka", icon: "BookOpen" },
  { href: "/jezyki/prace-domowe", label: "Prace", icon: "ClipboardList" },
  { href: "/jezyki/kalendarz", label: "Kalendarz", icon: "Calendar" },
];

export const KUZNIA_NAV: NavItem[] = [
  { href: "/", label: "Phoenix", icon: "Home", exact: true },
  { href: "/kuznia", label: "Kuźnia", icon: "Hammer", exact: true },
];

export const MATMA_NAV: NavItem[] = [
  { href: "/", label: "Phoenix", icon: "Home", exact: true },
  { href: "/matma", label: "Dziś", icon: "Calculator", exact: true },
  { href: "/matma/nauka", label: "Nauka", icon: "BookOpen" },
  { href: "/matma/egzamin", label: "Egzamin", icon: "ClipboardList" },
  { href: "/matma/plan", label: "Plan", icon: "Calendar" },
];

export const PARAGONY_NAV: NavItem[] = [
  { href: "/", label: "Phoenix", icon: "Home", exact: true },
  { href: "/paragony", label: "Pulpit", icon: "Wallet", exact: true },
  { href: "/paragony/budzet", label: "Budżet", icon: "PiggyBank" },
  { href: "/paragony/etf", label: "ETF", icon: "TrendingUp" },
  { href: "/paragony/cele", label: "Cele", icon: "Target" },
];

/** Nav sets by route prefix; the longest matching prefix wins ("" = fallback). */
export const NAV_BY_PREFIX: Array<{ prefix: string; items: NavItem[] }> = [
  { prefix: "/jezyki", items: LINGUO_NAV },
  { prefix: "/kuznia", items: KUZNIA_NAV },
  { prefix: "/matma", items: MATMA_NAV },
  { prefix: "/paragony", items: PARAGONY_NAV },
  { prefix: "", items: PHOENIX_NAV },
];

export const HOMEWORK_TYPE_LABELS: Record<HomeworkType, string> = {
  song_translation: "Przetłumacz piosenkę",
  vocabulary_mastery: "Opanuj znaczenia słówek",
  training_count: "Wykonaj treningi",
  reading_count: "Przeczytaj teksty",
  flashcards_count: "Zrób fiszki",
  grammar_topic: "Zadanie gramatyczne",
  writing_task: "Zadanie z pisania",
  listening_task: "Zadanie ze słuchania",
  matching_game: "Gra: łączenie tłumaczeń",
};

// A learning-path stage completes when this share of the stage category's
// words has status "mastered" (a word masters at 2 net-correct reviews —
// see lib/vocabulary/progress.ts). Matma reuses the same constant, but
// applies it PER TOPIC (see lib/matma/progress.ts) instead of one global
// counter, so a weak department can't hide behind a strong one.
export const MIN_MASTERY_THRESHOLD = 0.8;

// activity_log.activity_type values written by record_activity() — the single
// vocabulary every module uses so streaks, the calendar and homework progress
// all agree on what "one activity" means.
export const ACTIVITY_TYPES = {
  FLASHCARDS: "flashcards",
  VOCABULARY: "vocabulary",
  GRAMMAR: "grammar",
  READING: "reading",
  WRITING: "writing",
  SONG: "song",
  LISTENING: "listening",
  MATCHING: "matching",
  MATH: "math",
} as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

export const WRITING_WORD_LIMITS: Record<UserLevel, { min: number; max: number }> = {
  A1: { min: 20, max: 50 },
  A2: { min: 30, max: 70 },
  B1: { min: 40, max: 90 },
  B2: { min: 50, max: 120 },
};

export const WRITING_TASK_TYPE_LABELS: Record<WritingTaskType, string> = {
  comment_reply: "Odpowiedź na komentarz",
  message_friend: "Wiadomość do znajomego",
  formal_email: "Formalny e-mail",
  question_answer: "Odpowiedź na pytanie",
};
