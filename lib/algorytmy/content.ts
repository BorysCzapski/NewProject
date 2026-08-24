// ============================================================================
// lib/algorytmy/content.ts
// Read-side queries for Algorytmy: topics, lessons and the "przerobione"
// markers. Everything here is shared content plus the caller's own progress —
// nothing writes.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AlgoBlock } from "@/lib/algorytmy/lesson-blocks";
import type { AlgoLesson, AlgoTopic } from "@/lib/types/database";

export async function getTopics(supabase: SupabaseClient): Promise<AlgoTopic[]> {
  const { data } = await supabase.from("algo_topics").select("*").order("order_index");
  return (data ?? []) as AlgoTopic[];
}

export async function getTopicBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<AlgoTopic | null> {
  const { data } = await supabase.from("algo_topics").select("*").eq("slug", slug).maybeSingle();
  return (data as AlgoTopic | null) ?? null;
}

export async function getLessonsForTopic(
  supabase: SupabaseClient,
  topicId: string
): Promise<AlgoLesson[]> {
  const { data } = await supabase
    .from("algo_lessons")
    .select("*")
    .eq("topic_id", topicId)
    .order("order_index");
  return (data ?? []) as AlgoLesson[];
}

export async function getLessonBySlug(
  supabase: SupabaseClient,
  topicId: string,
  slug: string
): Promise<AlgoLesson | null> {
  const { data } = await supabase
    .from("algo_lessons")
    .select("*")
    .eq("topic_id", topicId)
    .eq("slug", slug)
    .maybeSingle();
  return (data as AlgoLesson | null) ?? null;
}

/** Ids of every lesson the student has marked as done, across all topics —
 * one query rather than one per topic, since the dashboard needs them all. */
export async function getCompletedLessonIds(
  supabase: SupabaseClient,
  userId: string
): Promise<Set<string>> {
  const { data } = await supabase
    .from("algo_lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId);
  return new Set((data ?? []).map((row) => (row as { lesson_id: string }).lesson_id));
}

/** The stored jsonb is unknown[] at the DB-type level to avoid a type cycle
 * (see AlgoLesson.content); this is the one place that cast happens. */
export function lessonBlocks(lesson: AlgoLesson): AlgoBlock[] {
  return lesson.content as AlgoBlock[];
}
