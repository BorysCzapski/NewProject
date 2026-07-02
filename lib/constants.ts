// ============================================================================
// lib/constants.ts
// Shared, framework-agnostic constants used across the app (nav items, level
// labels, homework type metadata). Centralised so every module presents the
// same Polish copy instead of re-typing labels ad hoc.
// ============================================================================
import type { HomeworkType, UserLevel } from "@/lib/types/database";

export const LEVELS: UserLevel[] = ["A1", "A2", "B1", "B2"];

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

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "Home" },
  { href: "/nauka", label: "Nauka", icon: "BookOpen" },
  { href: "/prace-domowe", label: "Prace domowe", icon: "ClipboardList" },
  { href: "/kalendarz", label: "Kalendarz", icon: "Calendar" },
  { href: "/profil", label: "Profil", icon: "User" },
] as const;

export const HOMEWORK_TYPE_LABELS: Record<HomeworkType, string> = {
  song_translation: "Przetłumacz piosenkę",
  vocabulary_mastery: "Opanuj znaczenia słówek",
  training_count: "Wykonaj treningi",
  reading_count: "Przeczytaj teksty",
  flashcards_count: "Zrób fiszki",
  grammar_topic: "Zadanie gramatyczne",
  writing_task: "Zadanie z pisania",
  listening_task: "Zadanie ze słuchania",
};

export const MIN_MASTERY_THRESHOLD = 0.8; // 80% correct answers => "mastered"

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
} as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

export const WRITING_WORD_LIMITS: Record<UserLevel, { min: number; max: number }> = {
  A1: { min: 20, max: 50 },
  A2: { min: 30, max: 70 },
  B1: { min: 40, max: 90 },
  B2: { min: 50, max: 120 },
};
