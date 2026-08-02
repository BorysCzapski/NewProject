"use server";
// ============================================================================
// lib/schola/import-actions.ts
// The only place that actually writes AI-imported songs to the DB — both
// the PDF-split flow (app/api/schola/import-pdf/route.ts) and the photo-OCR
// flow (lib/schola/song-photo-actions.ts) only ever produce a draft; saving
// always goes through the same reviewed-by-a-human path as manual entry.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireScholaMember } from "@/lib/schola/get-member";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";

export interface DraftScholaSong {
  title: string;
  lyrics_chordpro: string;
  tags: string[];
}

export async function importScholaSongs(
  songs: DraftScholaSong[]
): Promise<ActionResult<{ inserted: number }>> {
  const member = await requireScholaMember();

  const cleaned = songs
    .map((s) => ({
      title: s.title.trim(),
      lyrics_chordpro: s.lyrics_chordpro,
      tags: s.tags,
    }))
    .filter((s) => s.title.length > 0);

  if (cleaned.length === 0) {
    return actionFailure("Brak pieśni do zapisania.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schola_songs")
    .insert(
      cleaned.map((s) => ({
        title: s.title,
        lyrics_chordpro: s.lyrics_chordpro,
        tags: s.tags,
        created_by: member.id,
        updated_by: member.id,
      }))
    )
    .select("id");

  if (error) {
    console.error("[schola] importScholaSongs failed:", error);
    return actionFailure("Nie udało się zapisać pieśni.");
  }

  revalidatePath("/schola/piosenki");
  revalidatePath("/schola");
  return { ok: true, data: { inserted: data?.length ?? 0 } };
}
