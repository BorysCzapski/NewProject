// ============================================================================
// lib/songs/create-song.ts
// Inserts a songs row (title/artist/lyrics as pasted by a user or admin).
// Shared by the songs practice module and the homework admin creator
// (type = 'song_translation'). Language-scoped so learners only see songs in
// the language they're studying.
// ============================================================================
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Song, TargetLanguage } from "@/lib/types/database";

export async function createSong(params: {
  language: TargetLanguage;
  title: string;
  artist?: string;
  lyrics: string;
  createdBy?: string | null;
}): Promise<Song> {
  const lyrics = params.lyrics.trim();
  if (!lyrics) {
    throw new Error("Tekst piosenki nie może być pusty.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("songs")
    .insert({
      language: params.language,
      title: params.title.trim() || "Bez tytułu",
      artist: params.artist?.trim() || null,
      lyrics,
      created_by: params.createdBy ?? null,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error("Nie udało się zapisać piosenki.");
  }
  return data as Song;
}
