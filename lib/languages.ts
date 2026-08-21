// ============================================================================
// lib/languages.ts
// Language-aware helpers used by every AI content generator and grader. The
// app teaches a foreign language (en/es/ru) TO a Polish speaker, so prompts
// need the Polish name of the target language in the right grammatical case,
// plus the English name of the language (for the AI to actually write in it).
// Pure strings, safe to import anywhere.
// ============================================================================
import type { TargetLanguage } from "@/lib/types/database";

interface LanguageInfo {
  /** Polish name, nominative — "angielski". */
  pl: string;
  /** Polish name in the locative ("w języku ...") — "angielskim". */
  plLocative: string;
  /** English name of the language, for instructing the AI which language to write. */
  en: string;
  /** The single-language code the AI should think in. */
  code: TargetLanguage;
  /**
   * Characters a Polish keyboard cannot type directly, offered as an insert
   * bar beside answer fields (components/ui/accent-bar.tsx). Empty when the
   * Polish layout already covers the language (English) or when a full
   * on-screen keyboard exists instead (Russian —
   * components/ui/cyrillic-keyboard.tsx).
   */
  specialChars: string[];
}

const LANGUAGE_INFO: Record<TargetLanguage, LanguageInfo> = {
  en: { pl: "angielski", plLocative: "angielskim", en: "English", code: "en", specialChars: [] },
  es: {
    pl: "hiszpański",
    plLocative: "hiszpańskim",
    en: "Spanish",
    code: "es",
    specialChars: ["á", "é", "í", "ó", "ú", "ü", "ñ", "¿", "¡"],
  },
  ru: { pl: "rosyjski", plLocative: "rosyjskim", en: "Russian", code: "ru", specialChars: [] },
};

export function langInfo(language: TargetLanguage): LanguageInfo {
  return LANGUAGE_INFO[language] ?? LANGUAGE_INFO.en;
}

/** e.g. "angielskiego" (genitive) for prompts like "nauczyciel angielskiego". */
export function langGenitive(language: TargetLanguage): string {
  return { en: "angielskiego", es: "hiszpańskiego", ru: "rosyjskiego" }[language] ?? "angielskiego";
}

/**
 * A reusable system-prompt fragment establishing the AI as a teacher of the
 * given language for Polish learners, and telling it which language to write
 * foreign-language content in.
 */
export function teacherSystemPrompt(language: TargetLanguage): string {
  const info = langInfo(language);
  return (
    `Jesteś nauczycielem języka ${info.pl}ego dla Polaków. ` +
    `Treści w języku obcym piszesz PO ${info.pl.toUpperCase()}U (${info.en}), ` +
    `a wszelkie wyjaśnienia, feedback i polecenia PO POLSKU.`
  );
}
