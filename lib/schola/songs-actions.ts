"use server";
// ============================================================================
// lib/schola/songs-actions.ts
// Song library CRUD. Any Schola member can create/edit/delete any song —
// no per-row ownership, no admin/user split (see 0009_schola.sql RLS).
// created_by/updated_by are stamped purely for attribution, not enforced.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireScholaMember } from "@/lib/schola/get-member";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";

export interface SongInput {
  title: string;
  lyrics_chordpro: string;
  tags: string[];
  youtube_url: string;
  sheet_music_url: string;
}

function revalidateSongs() {
  revalidatePath("/schola/piosenki");
  revalidatePath("/schola");
}

export async function createScholaSong(input: SongInput): Promise<ActionResult<{ id: string }>> {
  const member = await requireScholaMember();

  if (!input.title.trim()) return actionFailure("Podaj tytuł pieśni.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schola_songs")
    .insert({
      title: input.title.trim(),
      lyrics_chordpro: input.lyrics_chordpro,
      tags: input.tags,
      youtube_url: input.youtube_url.trim() || null,
      sheet_music_url: input.sheet_music_url.trim() || null,
      created_by: member.id,
      updated_by: member.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[schola] song create failed:", error);
    return actionFailure("Nie udało się zapisać pieśni.");
  }

  revalidateSongs();
  return { ok: true, data: { id: data.id as string } };
}

export async function updateScholaSong(id: string, input: SongInput): Promise<ActionResult<null>> {
  const member = await requireScholaMember();

  if (!input.title.trim()) return actionFailure("Podaj tytuł pieśni.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("schola_songs")
    .update({
      title: input.title.trim(),
      lyrics_chordpro: input.lyrics_chordpro,
      tags: input.tags,
      youtube_url: input.youtube_url.trim() || null,
      sheet_music_url: input.sheet_music_url.trim() || null,
      updated_by: member.id,
    })
    .eq("id", id);

  if (error) {
    console.error("[schola] song update failed:", error);
    return actionFailure("Nie udało się zaktualizować pieśni.");
  }

  revalidateSongs();
  revalidatePath(`/schola/piosenki/${id}`);
  return { ok: true, data: null };
}

export async function deleteScholaSong(id: string): Promise<ActionResult<null>> {
  await requireScholaMember();
  const supabase = await createClient();

  // Also removes it from any Mass plan referencing it (ON DELETE CASCADE
  // on schola_mass_plan_items.song_id — plans are living working
  // documents, not an audit trail).
  const { error } = await supabase.from("schola_songs").delete().eq("id", id);
  if (error) {
    console.error("[schola] song delete failed:", error);
    return actionFailure("Nie udało się usunąć pieśni.");
  }

  revalidateSongs();
  return { ok: true, data: null };
}
