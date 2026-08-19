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
import type { GeoExercise, GeoFile, GeoLesson, GeoMapTask, GeoTopic } from "@/lib/types/database";

export async function getTopics(supabase: SupabaseClient): Promise<GeoTopic[]> {
  const { data } = await supabase.from("geo_topics").select("*").order("order_index");
  return (data ?? []) as GeoTopic[];
}

export async function getTopicBySlug(supabase: SupabaseClient, slug: string): Promise<GeoTopic | null> {
  const { data } = await supabase.from("geo_topics").select("*").eq("slug", slug).maybeSingle();
  return (data as GeoTopic) ?? null;
}

// ----------------------------------------------------------------------------
// Theory (geo_lessons / geo_lesson_progress, 0018_geografia_lessons.sql)
// ----------------------------------------------------------------------------

export async function getLessonsForTopic(supabase: SupabaseClient, topicId: string): Promise<GeoLesson[]> {
  const { data } = await supabase
    .from("geo_lessons")
    .select("*")
    .eq("topic_id", topicId)
    .order("order_index");
  return (data ?? []) as GeoLesson[];
}

export async function getLessonBySlug(
  supabase: SupabaseClient,
  topicId: string,
  slug: string
): Promise<GeoLesson | null> {
  const { data } = await supabase
    .from("geo_lessons")
    .select("*")
    .eq("topic_id", topicId)
    .eq("slug", slug)
    .maybeSingle();
  return (data as GeoLesson) ?? null;
}

export async function getCompletedLessonIds(supabase: SupabaseClient, userId: string): Promise<Set<string>> {
  const { data } = await supabase.from("geo_lesson_progress").select("lesson_id").eq("user_id", userId);
  return new Set((data ?? []).map((r) => r.lesson_id as string));
}

export interface NextLesson {
  lessonTitle: string;
  lessonSlug: string;
  topicTitle: string;
  topicSlug: string;
  ckeNumber: string;
  readingMinutes: number;
  doneCount: number;
  totalCount: number;
}

/**
 * The first lesson the student hasn't marked as read, in curriculum order
 * (topic order_index, then lesson order_index) — the "Kontynuuj naukę"
 * entry point on the dashboard. Returns null once everything is read.
 */
export async function getNextLesson(supabase: SupabaseClient, userId: string): Promise<NextLesson | null> {
  const [{ data: rows }, completed] = await Promise.all([
    supabase
      .from("geo_lessons")
      .select("id, slug, title, reading_minutes, order_index, geo_topics(slug, title, cke_number, order_index)")
      .order("order_index"),
    getCompletedLessonIds(supabase, userId),
  ]);

  const lessons = (rows ?? []) as unknown as Array<{
    id: string;
    slug: string;
    title: string;
    reading_minutes: number;
    order_index: number;
    geo_topics: { slug: string; title: string; cke_number: string; order_index: number } | null;
  }>;
  if (lessons.length === 0) return null;

  // Curriculum order: topic first, then lesson within the topic. Sorting in
  // code rather than SQL — PostgREST can't order by an embedded table's column.
  const ordered = lessons
    .filter((l) => l.geo_topics)
    .sort((a, b) =>
      a.geo_topics!.order_index !== b.geo_topics!.order_index
        ? a.geo_topics!.order_index - b.geo_topics!.order_index
        : a.order_index - b.order_index
    );

  const next = ordered.find((l) => !completed.has(l.id));
  if (!next) return null;

  return {
    lessonTitle: next.title,
    lessonSlug: next.slug,
    topicTitle: next.geo_topics!.title,
    topicSlug: next.geo_topics!.slug,
    ckeNumber: next.geo_topics!.cke_number,
    readingMinutes: next.reading_minutes,
    doneCount: ordered.filter((l) => completed.has(l.id)).length,
    totalCount: ordered.length,
  };
}

/** Lesson counts per topic, for the topic list's "X lekcji teorii" line. */
export async function getLessonCountsByTopic(supabase: SupabaseClient): Promise<Map<string, number>> {
  const { data } = await supabase.from("geo_lessons").select("topic_id");
  const counts = new Map<string, number>();
  for (const row of (data ?? []) as Array<{ topic_id: string }>) {
    counts.set(row.topic_id, (counts.get(row.topic_id) ?? 0) + 1);
  }
  return counts;
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
