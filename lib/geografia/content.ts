import "server-only";

// ============================================================================
// lib/geografia/content.ts
// Server-only read helpers over the shared content tables (geo_topics,
// geo_exercises, geo_map_tasks). No auth checks here — RLS already makes
// these tables select-true for any authenticated user; auth happens once, in
// the page via requireProfile()/requireAdmin(), same pattern as
// lib/matma/content.ts.
// ============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GeoExercise, GeoFile, GeoMapTask, GeoTopic } from "@/lib/types/database";

export async function getTopics(supabase: SupabaseClient): Promise<GeoTopic[]> {
  const { data } = await supabase.from("geo_topics").select("*").order("order_index");
  return (data ?? []) as GeoTopic[];
}

export async function getTopicBySlug(supabase: SupabaseClient, slug: string): Promise<GeoTopic | null> {
  const { data } = await supabase.from("geo_topics").select("*").eq("slug", slug).maybeSingle();
  return (data as GeoTopic) ?? null;
}

export async function getExercisesForTopic(supabase: SupabaseClient, topicId: string): Promise<GeoExercise[]> {
  const { data } = await supabase
    .from("geo_exercises")
    .select("*")
    .eq("topic_id", topicId)
    .order("difficulty");
  return (data ?? []) as GeoExercise[];
}

export async function getExerciseById(supabase: SupabaseClient, id: string): Promise<GeoExercise | null> {
  const { data } = await supabase.from("geo_exercises").select("*").eq("id", id).maybeSingle();
  return (data as GeoExercise) ?? null;
}

export async function getMapTaskForExercise(supabase: SupabaseClient, exerciseId: string): Promise<GeoMapTask | null> {
  const { data } = await supabase.from("geo_map_tasks").select("*").eq("exercise_id", exerciseId).maybeSingle();
  return (data as GeoMapTask) ?? null;
}

export async function getUserFiles(supabase: SupabaseClient, userId: string): Promise<GeoFile[]> {
  const { data } = await supabase
    .from("geo_files")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as GeoFile[];
}

export async function getFileById(supabase: SupabaseClient, id: string): Promise<GeoFile | null> {
  const { data } = await supabase.from("geo_files").select("*").eq("id", id).maybeSingle();
  return (data as GeoFile) ?? null;
}

/** Signs a temporary URL for a private uploaded PDF (the 'geografia-uploads'
 * bucket is not public — see 0015_geografia.sql) so the file viewer can embed
 * it without exposing a permanent public link. */
export async function getGeoFileSignedUrl(supabase: SupabaseClient, storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("geografia-uploads").createSignedUrl(storagePath, 3600);
  if (error) {
    console.error("[geografia] createSignedUrl failed:", error);
    return null;
  }
  return data?.signedUrl ?? null;
}

export async function getFavoriteExerciseIds(supabase: SupabaseClient, userId: string): Promise<Set<string>> {
  const { data } = await supabase.from("geo_favorites").select("exercise_id").eq("user_id", userId);
  return new Set((data ?? []).map((r) => r.exercise_id as string));
}
