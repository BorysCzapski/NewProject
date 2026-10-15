// ============================================================================
// lib/maturalnik/storage.ts
// Signed-URL helpers for the two private buckets — maturalnik-problems (the
// book scans) and maturalnik-canvas (per-user drawings). Same pattern as
// lib/matma/spaced-review.ts's getCanvasSignedUrl: buckets are private, so
// client-side <img>/canvas loads need a signed URL, never the raw path.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getProblemImageSignedUrl(supabase: SupabaseClient, imagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("maturalnik-problems").createSignedUrl(imagePath, 3600);
  if (error) {
    console.error("[maturalnik] problem image createSignedUrl failed:", error);
    return null;
  }
  return data?.signedUrl ?? null;
}

export async function getCanvasSignedUrl(supabase: SupabaseClient, canvasPath: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("maturalnik-canvas").createSignedUrl(canvasPath, 3600);
  if (error) {
    console.error("[maturalnik] canvas createSignedUrl failed:", error);
    return null;
  }
  return data?.signedUrl ?? null;
}
