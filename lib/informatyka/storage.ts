// ============================================================================
// lib/informatyka/storage.ts
// Signed-URL helpers for the private buckets: informatyka-pages (exam paper
// crops) and informatyka-canvas (per-user drawings).
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Signed URLs for a list of page crops, in the same order (missing ones dropped). */
export async function getPageUrls(supabase: SupabaseClient, paths: string[]): Promise<string[]> {
  if (paths.length === 0) return [];
  const { data, error } = await supabase.storage.from("informatyka-pages").createSignedUrls(paths, 3600);
  if (error) {
    console.error("[informatyka] createSignedUrls failed:", error);
    return [];
  }
  const byPath = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return paths.map((p) => byPath.get(p)).filter((u): u is string => Boolean(u));
}

export async function getCanvasUrl(supabase: SupabaseClient, canvasPath: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("informatyka-canvas").createSignedUrl(canvasPath, 3600);
  if (error) {
    console.error("[informatyka] canvas createSignedUrl failed:", error);
    return null;
  }
  return data?.signedUrl ?? null;
}
