import "server-only";

// ============================================================================
// lib/geografia/spaced-review.ts
// Light spaced-repetition, same fixed-interval design as
// lib/matma/spaced-review.ts: topics already "mastered" occasionally surface
// one quick check-in exercise so they don't quietly rot before the exam. A
// bad check-in naturally drags mastery_score/status back down on the next
// recomputeTopicProgress call (run right after grading, like any other
// attempt) — no special-case regression logic needed.
// ============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GeoExercise } from "@/lib/types/database";

const REVIEW_INTERVAL_DAYS = 5;

export interface SpacedReviewCandidate {
  topicId: string;
  topicTitle: string;
  exercise: GeoExercise;
}

/** One review candidate per study session, picked from the mastered topic
 * that's gone longest without a check-in (or was never reviewed at all). */
export async function getSpacedReviewCandidate(
  supabase: SupabaseClient,
  userId: string
): Promise<SpacedReviewCandidate | null> {
  const { data: masteredRows } = await supabase
    .from("geo_topic_progress")
    .select("topic_id, last_reviewed_at, geo_topics(id, title)")
    .eq("user_id", userId)
    .eq("status", "mastered");

  const mastered = (masteredRows ?? []) as unknown as Array<{
    topic_id: string;
    last_reviewed_at: string | null;
    geo_topics: { id: string; title: string };
  }>;
  if (mastered.length === 0) return null;

  const cutoff = Date.now() - REVIEW_INTERVAL_DAYS * 24 * 60 * 60 * 1000;
  const due = mastered
    .filter((m) => !m.last_reviewed_at || new Date(m.last_reviewed_at).getTime() < cutoff)
    .sort((a, b) => {
      const at = a.last_reviewed_at ? new Date(a.last_reviewed_at).getTime() : 0;
      const bt = b.last_reviewed_at ? new Date(b.last_reviewed_at).getTime() : 0;
      return at - bt; // longest-overdue first
    });
  if (due.length === 0) return null;

  const target = due[0];
  const { data: exerciseRows } = await supabase
    .from("geo_exercises")
    .select("*")
    .eq("topic_id", target.topic_id)
    .in("difficulty", [2, 3]);
  const exercises = (exerciseRows ?? []) as GeoExercise[];
  if (exercises.length === 0) return null;

  const exercise = exercises[Math.floor(Math.random() * exercises.length)];
  return { topicId: target.topic_id, topicTitle: target.geo_topics.title, exercise };
}
