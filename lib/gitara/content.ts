// ============================================================================
// lib/gitara/content.ts
// Read-side queries for Gitara: topics, lessons, chords, songs and the
// "przerobione" markers. Everything here is shared content plus the caller's
// own progress — nothing writes.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GtrBlock } from "@/lib/gitara/lesson-blocks";
import type { FrettedChord } from "@/lib/gitara/theory";
import type { GtrChord, GtrLesson, GtrSong, GtrTopic } from "@/lib/types/database";

export async function getTopics(supabase: SupabaseClient): Promise<GtrTopic[]> {
  const { data } = await supabase.from("gtr_topics").select("*").order("order_index");
  return (data ?? []) as GtrTopic[];
}

export async function getTopicBySlug(supabase: SupabaseClient, slug: string): Promise<GtrTopic | null> {
  const { data } = await supabase.from("gtr_topics").select("*").eq("slug", slug).maybeSingle();
  return (data as GtrTopic | null) ?? null;
}

export async function getLessonsForTopic(
  supabase: SupabaseClient,
  topicId: string
): Promise<GtrLesson[]> {
  const { data } = await supabase
    .from("gtr_lessons")
    .select("*")
    .eq("topic_id", topicId)
    .order("order_index");
  return (data ?? []) as GtrLesson[];
}

export async function getLessonBySlug(
  supabase: SupabaseClient,
  topicId: string,
  slug: string
): Promise<GtrLesson | null> {
  const { data } = await supabase
    .from("gtr_lessons")
    .select("*")
    .eq("topic_id", topicId)
    .eq("slug", slug)
    .maybeSingle();
  return (data as GtrLesson | null) ?? null;
}

/** Ids of every lesson the student has marked as done, across all działy —
 * one query rather than one per topic, since the dashboard needs them all. */
export async function getCompletedLessonIds(
  supabase: SupabaseClient,
  userId: string
): Promise<Set<string>> {
  const { data } = await supabase
    .from("gtr_lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId);
  return new Set((data ?? []).map((row) => (row as { lesson_id: string }).lesson_id));
}

/** The stored jsonb is unknown[] at the DB-type level to avoid a type cycle
 * (see GtrLesson.content); this is the one place that cast happens. */
export function lessonBlocks(lesson: GtrLesson): GtrBlock[] {
  return lesson.content as GtrBlock[];
}

/** Same cast pattern as lessonBlocks, for GtrChord.positions. */
export function chordShape(chord: GtrChord): FrettedChord {
  return chord.positions as FrettedChord;
}

export async function getChords(supabase: SupabaseClient): Promise<GtrChord[]> {
  const { data } = await supabase.from("gtr_chords").select("*").order("order_index");
  return (data ?? []) as GtrChord[];
}

export async function getChordBySlug(supabase: SupabaseClient, slug: string): Promise<GtrChord | null> {
  const { data } = await supabase.from("gtr_chords").select("*").eq("slug", slug).maybeSingle();
  return (data as GtrChord | null) ?? null;
}

export async function getSongs(supabase: SupabaseClient): Promise<GtrSong[]> {
  const { data } = await supabase.from("gtr_songs").select("*").order("title");
  return (data ?? []) as GtrSong[];
}

export async function getSongBySlug(supabase: SupabaseClient, slug: string): Promise<GtrSong | null> {
  const { data } = await supabase.from("gtr_songs").select("*").eq("slug", slug).maybeSingle();
  return (data as GtrSong | null) ?? null;
}

/** Total practised seconds across every kind, for the /gitara/postepy stat. */
export async function getTotalPracticeSeconds(supabase: SupabaseClient, userId: string): Promise<number> {
  const { data } = await supabase
    .from("gtr_practice_sessions")
    .select("duration_seconds")
    .eq("user_id", userId);
  return (data ?? []).reduce((sum, row) => sum + (row as { duration_seconds: number }).duration_seconds, 0);
}
