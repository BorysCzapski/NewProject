"use server";

// ============================================================================
// lib/songs/actions.ts
// Server Actions backing the songs module. Two sensible activities:
//  - LINE mode: translate a whole line to Polish; AI grades it (accepting free
//    but meaning-preserving translations) and the attempt is persisted so it
//    counts toward song_translation homework.
//  - HINT mode ("słówka"): tap any word to get its contextual meaning. This
//    replaced the old "translate each word" grading, which was linguistically
//    nonsensical for songs (word order, idioms) — now it's a helpful glossary,
//    informational only, nothing is graded or stored.
// ============================================================================
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { askAIForJSON } from "@/lib/ai";
import { createSong } from "@/lib/songs/create-song";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { langInfo } from "@/lib/languages";
import type { Song, TargetLanguage } from "@/lib/types/database";

/** Creates a new song from pasted lyrics and redirects to its practice page. */
export async function startSong(title: string, artist: string, lyrics: string): Promise<never> {
  const profile = await requireProfile();
  const song: Song = await createSong({
    language: profile.target_language,
    title,
    artist: artist.trim() || undefined,
    lyrics,
    createdBy: profile.id,
  });
  redirect(`/nauka/piosenki/${song.id}`);
}

export interface TranslationCheckResult {
  isCorrect: boolean;
  feedback: string;
  suggestion: string;
}

/** Checks a whole-line Polish translation of `originalLine` and records the attempt. */
export async function checkLineTranslation(
  songId: string,
  lineIndex: number,
  originalLine: string,
  userTranslation: string,
  language: TargetLanguage
): Promise<TranslationCheckResult> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const trimmed = userTranslation.trim();
  if (!trimmed) throw new Error("Wpisz tłumaczenie przed wysłaniem.");

  const info = langInfo(language);
  let result: TranslationCheckResult;
  try {
    result = await askAIForJSON<TranslationCheckResult>({
      system:
        `Jesteś nauczycielem sprawdzającym tłumaczenie linijki tekstu piosenki z języka ${info.pl}ego ` +
        `na polski. Akceptuj sensowne, poprawne tłumaczenia — nie tylko dosłowne, poetyckie/swobodne ` +
        `też mogą być poprawne jeśli oddają sens. Odpowiadasz PO POLSKU, krótko. Jeśli tłumaczenie ` +
        `jest błędne lub można je poprawić, zaproponuj lepszą wersję.`,
      prompt: `Oryginalna linijka (${info.pl}): "${originalLine}"\nTłumaczenie ucznia (polski): "${trimmed}"`,
      schema: {
        isCorrect: { type: "boolean" },
        feedback: { type: "string" },
        suggestion: {
          type: "string",
          description: "lepsza wersja tłumaczenia, jeśli potrzebna, inaczej pusty string",
        },
      },
    });
  } catch {
    throw new Error("Nie udało się sprawdzić tłumaczenia przez AI. Spróbuj ponownie.");
  }

  const { error } = await supabase.from("song_translation_attempts").insert({
    user_id: profile.id,
    song_id: songId,
    line_index: lineIndex,
    user_translation: trimmed,
    is_correct: result.isCorrect,
    ai_feedback: result.feedback,
  });
  if (error) throw new Error("Nie udało się zapisać odpowiedzi.");

  return result;
}

export interface WordMeaning {
  meaning: string;
  note: string;
}

/**
 * Explains one word's meaning IN CONTEXT (glossary hint) — no grading, nothing
 * stored. This is the sensible replacement for word-by-word translation.
 */
export async function explainWord(
  line: string,
  word: string,
  language: TargetLanguage
): Promise<WordMeaning> {
  await requireProfile();
  const info = langInfo(language);

  try {
    return await askAIForJSON<WordMeaning>({
      system:
        `Jesteś słownikiem kontekstowym dla ucznia języka ${info.pl}ego. Wyjaśniasz znaczenie ` +
        `jednego słowa w kontekście linijki piosenki. Odpowiadasz PO POLSKU, bardzo krótko.`,
      prompt: `Linijka (${info.pl}): "${line}"\nSłowo do wyjaśnienia: "${word}"`,
      schema: {
        meaning: { type: "string", description: "polskie znaczenie słowa w tym kontekście (1-4 słowa)" },
        note: {
          type: "string",
          description: "krótka uwaga o użyciu/kontekście, jeśli warto, inaczej pusty string",
        },
      },
    });
  } catch {
    throw new Error("Nie udało się pobrać znaczenia słowa. Spróbuj ponownie.");
  }
}

/** Marks a fully completed practice pass through a song (every line correct at least once). */
export async function completeSongPractice(): Promise<void> {
  await requireProfile();
  const supabase = await createClient();
  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.SONG });
}
