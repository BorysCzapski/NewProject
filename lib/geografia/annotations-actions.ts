"use server";

// ============================================================================
// lib/geografia/annotations-actions.ts
// Private per-user notes/highlights on an uploaded worksheet PDF. Product
// spec caps: content <= 2KB (also enforced by the DB check constraint, see
// 0015_geografia.sql) and <= 200 annotations per file (checked here, since a
// pre-insert COUNT is simpler than a trigger for one Server Action).
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import type { GeoAnnotation, GeoAnnotationType } from "@/lib/types/database";

const MAX_ANNOTATIONS_PER_FILE = 200;
const MAX_CONTENT_CHARS = 2000;

export async function createAnnotation(input: {
  fileId: string;
  pageNumber: number;
  type: GeoAnnotationType;
  content: string;
  excerpt?: string | null;
  color?: string | null;
}): Promise<ActionResult<GeoAnnotation>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const content = input.content.trim();
  if (!content) return actionFailure("Notatka nie może być pusta.");
  if (content.length > MAX_CONTENT_CHARS) return actionFailure("Notatka jest za długa (maksymalnie 2000 znaków).");

  const { count } = await supabase
    .from("geo_annotations")
    .select("id", { count: "exact", head: true })
    .eq("file_id", input.fileId)
    .eq("user_id", profile.id);
  if ((count ?? 0) >= MAX_ANNOTATIONS_PER_FILE) {
    return actionFailure(`Osiągnięto limit ${MAX_ANNOTATIONS_PER_FILE} adnotacji dla tego pliku.`);
  }

  const { data: inserted, error } = await supabase
    .from("geo_annotations")
    .insert({
      file_id: input.fileId,
      user_id: profile.id,
      page_number: input.pageNumber,
      type: input.type,
      content,
      excerpt: input.excerpt ?? null,
      color: input.color ?? null,
    })
    .select("*")
    .single();

  if (error || !inserted) {
    console.error("[geografia] annotation insert failed:", error);
    return actionFailure("Nie udało się zapisać notatki.");
  }
  revalidatePath(`/geografia/pliki/${input.fileId}`);
  return { ok: true, data: inserted as GeoAnnotation };
}

export async function updateAnnotation(id: string, content: string): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const trimmed = content.trim();
  if (!trimmed) return actionFailure("Notatka nie może być pusta.");
  if (trimmed.length > MAX_CONTENT_CHARS) return actionFailure("Notatka jest za długa (maksymalnie 2000 znaków).");

  const { error } = await supabase
    .from("geo_annotations")
    .update({ content: trimmed })
    .eq("id", id)
    .eq("user_id", profile.id);
  if (error) {
    console.error("[geografia] annotation update failed:", error);
    return actionFailure("Nie udało się zaktualizować notatki.");
  }
  return { ok: true, data: undefined };
}

export async function deleteAnnotation(id: string, fileId: string): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("geo_annotations").delete().eq("id", id).eq("user_id", profile.id);
  if (error) {
    console.error("[geografia] annotation delete failed:", error);
    return actionFailure("Nie udało się usunąć notatki.");
  }
  revalidatePath(`/geografia/pliki/${fileId}`);
  return { ok: true, data: undefined };
}

export async function deleteGeoFile(fileId: string): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: file } = await supabase
    .from("geo_files")
    .select("storage_path")
    .eq("id", fileId)
    .eq("user_id", profile.id)
    .maybeSingle();
  if (!file) return actionFailure("Nie znaleziono pliku.");

  await supabase.storage.from("geografia-uploads").remove([file.storage_path]);
  const { error } = await supabase.from("geo_files").delete().eq("id", fileId).eq("user_id", profile.id);
  if (error) {
    console.error("[geografia] file delete failed:", error);
    return actionFailure("Nie udało się usunąć pliku.");
  }
  revalidatePath("/geografia/wgraj");
  return { ok: true, data: undefined };
}
