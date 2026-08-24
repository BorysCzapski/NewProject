"use server";

// ============================================================================
// lib/gitara/import-actions.ts
// The only place that actually writes AI-imported songs to gtr_songs — the
// PDF-split flow (app/api/gitara/import-songbook/route.ts) only ever
// produces drafts; saving always goes through this reviewed-by-a-human path,
// same stance as lib/schola/import-actions.ts.
//
// Any authenticated family member can import (requireProfile, not
// requireAdmin) — gtr_songs_insert_own in the migration allows insert by
// auth.uid() = created_by, the same self-service-into-the-shared-bank policy
// algo_exercises uses, not Schola's members-only gate (this app has no such
// membership concept).
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";

export interface DraftGtrSong {
  title: string;
  artist: string;
  content_chordpro: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  title: string
): Promise<string> {
  const base = slugify(title) || "piosenka";
  for (let attempt = 0; attempt < 25; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const { data } = await supabase.from("gtr_songs").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
  }
  return `${base}-${Date.now()}`;
}

export async function importGtrSongs(
  songs: DraftGtrSong[]
): Promise<ActionResult<{ inserted: number }>> {
  const profile = await requireProfile();

  const cleaned = songs
    .map((s) => ({
      title: s.title.trim(),
      artist: s.artist.trim(),
      content_chordpro: s.content_chordpro,
    }))
    .filter((s) => s.title.length > 0 && s.content_chordpro.trim().length > 0);

  if (cleaned.length === 0) {
    return actionFailure("Brak piosenek do zapisania.");
  }

  const supabase = await createClient();
  const rows = [];
  for (const song of cleaned) {
    rows.push({
      slug: await uniqueSlug(supabase, song.title),
      title: song.title,
      artist: song.artist,
      content_chordpro: song.content_chordpro,
      source: "imported" as const,
      created_by: profile.id,
    });
  }

  const { data, error } = await supabase.from("gtr_songs").insert(rows).select("id");

  if (error) {
    console.error("[gitara] importGtrSongs failed:", error);
    return actionFailure("Nie udało się zapisać piosenek.");
  }

  revalidatePath("/gitara/piosenki");
  revalidatePath("/gitara");
  return { ok: true, data: { inserted: data?.length ?? 0 } };
}
