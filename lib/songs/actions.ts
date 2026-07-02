"use server";

// ============================================================================
// lib/songs/actions.ts
// Server Actions backing the songs module: starting a new song (creating it
// via lib/songs/create-song.ts and redirecting to it), checking a line-level
// or word-level Polish translation with Claude, and persisting the result
// into song_translation_attempts. Also records the "song" activity once a
// full practice pass through a song is finished.
// ============================================================================
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { askClaudeForJSON } from "@/lib/anthropic";
import { createSong } from "@/lib/songs/create-song";
import { ACTIVITY_TYPES } from "@/lib/constants";
import type { Song } from "@/lib/types/database";

/** Creates a new song from pasted lyrics and redirects to its practice page. */
export async function startSong(title: string, artist: string, lyrics: string): Promise<never> {
  const profile = await requireProfile();
  const song: Song = await createSong({
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

const CHECK_SCHEMA = {
  isCorrect: { type: "boolean" },
  feedback: { type: "string" },
  suggestion: {
    type: "string",
    description: "lepsza wersja tłumaczenia, jeśli potrzebna, inaczej pusty string",
  },
};

async function runCheck(system: string, prompt: string): Promise<TranslationCheckResult> {
  try {
    return await askClaudeForJSON<TranslationCheckResult>({ system, prompt, schema: CHECK_SCHEMA });
  } catch {
    throw new Error("Nie udało się sprawdzić tłumaczenia przez AI. Spróbuj ponownie.");
  }
}

/** Checks a whole-line Polish translation of `originalLine` and records the attempt. */
export async function checkLineTranslation(
  songId: string,
  lineIndex: number,
  originalLine: string,
  userTranslation: string
): Promise<TranslationCheckResult> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const trimmed = userTranslation.trim();
  if (!trimmed) throw new Error("Wpisz tłumaczenie przed wysłaniem.");

  const result = await runCheck(
    "Jesteś nauczycielem sprawdzającym tłumaczenie linijki tekstu piosenki z angielskiego na polski. " +
      "Akceptuj sensowne, poprawne tłumaczenia — nie tylko dosłowne, poetyckie/swobodne też mogą być " +
      "poprawne jeśli oddają sens. Odpowiadasz PO POLSKU, krótko. Jeśli tłumaczenie jest błędne lub " +
      "można je poprawić, zaproponuj lepszą wersję.",
    `Oryginalna linijka (angielski): "${originalLine}"\nTłumaczenie ucznia (polski): "${trimmed}"`
  );

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

/**
 * Checks a single word's Polish translation, in the context of the line it
 * came from. `allOtherWordsCorrect` reflects the caller's session-local
 * tracking of every other word in that line already being confirmed correct
 * — the persisted row is only marked is_correct once the whole line is done
 * word-by-word, so it contributes to line-level ("song_translation" homework)
 * progress the same way a correct line-mode attempt does.
 */
export async function checkWordTranslation(
  songId: string,
  lineIndex: number,
  line: string,
  word: string,
  userTranslation: string,
  allOtherWordsCorrect: boolean
): Promise<TranslationCheckResult> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const trimmed = userTranslation.trim();
  if (!trimmed) throw new Error("Wpisz tłumaczenie słowa przed wysłaniem.");

  const result = await runCheck(
    "Jesteś nauczycielem sprawdzającym tłumaczenie POJEDYNCZEGO SŁOWA z angielskiego na polski, w " +
      "kontekście linijki tekstu piosenki, z której pochodzi — weź pod uwagę, że znaczenie słowa może " +
      "zależeć od kontekstu. Akceptuj sensowne, poprawne tłumaczenia. Odpowiadasz PO POLSKU, krótko. " +
      "Jeśli tłumaczenie jest błędne lub można je poprawić, zaproponuj lepszą wersję.",
    `Linijka (kontekst): "${line}"\nSłowo do przetłumaczenia: "${word}"\nTłumaczenie ucznia (polski): "${trimmed}"`
  );

  const { error } = await supabase.from("song_translation_attempts").insert({
    user_id: profile.id,
    song_id: songId,
    line_index: lineIndex,
    user_translation: trimmed,
    is_correct: result.isCorrect && allOtherWordsCorrect,
    ai_feedback: result.feedback,
  });
  if (error) throw new Error("Nie udało się zapisać odpowiedzi.");

  return result;
}

/** Marks a fully completed practice pass through a song (every line correct at least once). */
export async function completeSongPractice(): Promise<void> {
  await requireProfile();
  const supabase = await createClient();
  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.SONG });
}
