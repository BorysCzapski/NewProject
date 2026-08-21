// ============================================================================
// lib/geografia/exercise-stock.ts
// Geografia's half of the "practise a TYPE, not a numbered item" change — the
// counterpart of lib/matura/task-stock.ts, applied to geo_exercises.
//
// Geografia needed no new column for this. Its exercises have always carried a
// `type` (geo_exercise_type: mc | open | map, 0015_geografia.sql), and that
// enum IS the CKE task-type axis for this subject: zadanie zamknięte, zadanie
// otwarte, zadanie z mapą. The bank was simply never surfaced along it — the
// topic page listed exercises flat, each solved once and then marked done.
//
// Map exercises are not generated, for the reason lib/geografia/generate.ts
// already gives: plausible-looking coordinates need a human to verify, so map
// content stays hand-authored. That type therefore rotates over its curated
// bank instead of being topped up — the same shape as rozumienie ze słuchu in
// the Matura app, and for the same "the model cannot invent this" reason.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { generateExercisesForTopic } from "@/lib/geografia/generate";
import type { GeoExerciseType, GeoTopic } from "@/lib/types/database";

const STOCK_TARGET = 3;
const TOP_UP_BATCH = 3;

export interface GeoTypeDef {
  type: GeoExerciseType;
  label: string;
  description: string;
  /** See the file header: map content is hand-authored. */
  aiGeneratable: boolean;
}

export const GEO_EXERCISE_TYPES: GeoTypeDef[] = [
  {
    type: "mc",
    label: "Zadania zamknięte",
    description: "Jedna poprawna odpowiedź spośród podanych wariantów.",
    aiGeneratable: true,
  },
  {
    type: "open",
    label: "Zadania otwarte",
    description: "Krótka odpowiedź własna, oceniana według punktów klucza.",
    aiGeneratable: true,
  },
  {
    type: "map",
    label: "Zadania z mapą",
    description: "Wskaż obiekt, region albo warstwę na mapie.",
    aiGeneratable: false,
  },
];

export function getGeoType(type: string): GeoTypeDef | undefined {
  return GEO_EXERCISE_TYPES.find((t) => t.type === type);
}

export interface GeoTypeStats {
  typeDef: GeoTypeDef;
  completedCount: number;
  lastPoints: number | null;
  lastMaxPoints: number | null;
  averagePercent: number | null;
  freshAvailable: number;
}

interface AttemptRow {
  exercise_id: string;
  points_awarded: number;
  points_max: number;
  attempted_at: string;
  geo_exercises: { type: GeoExerciseType } | null;
}

export async function getGeoTypeStats(
  supabase: SupabaseClient,
  userId: string,
  topicId: string
): Promise<GeoTypeStats[]> {
  const [{ data: attemptRows }, { data: exerciseRows }] = await Promise.all([
    supabase
      .from("geo_exercise_attempts")
      .select("exercise_id, points_awarded, points_max, attempted_at, geo_exercises!inner(type, topic_id)")
      .eq("user_id", userId)
      .eq("geo_exercises.topic_id", topicId)
      .order("attempted_at", { ascending: false }),
    supabase.from("geo_exercises").select("id, type").eq("topic_id", topicId),
  ]);

  const attempts = (attemptRows ?? []) as unknown as AttemptRow[];
  const exercises = (exerciseRows ?? []) as Array<{ id: string; type: GeoExerciseType }>;
  const attemptedIds = new Set(attempts.map((a) => a.exercise_id));

  return GEO_EXERCISE_TYPES.map((typeDef) => {
    const own = attempts.filter((a) => a.geo_exercises?.type === typeDef.type);
    const totalAwarded = own.reduce((sum, a) => sum + Number(a.points_awarded), 0);
    const totalMax = own.reduce((sum, a) => sum + Number(a.points_max), 0);

    return {
      typeDef,
      completedCount: own.length,
      lastPoints: own.length > 0 ? Number(own[0].points_awarded) : null,
      lastMaxPoints: own.length > 0 ? Number(own[0].points_max) : null,
      averagePercent: totalMax > 0 ? Math.round((totalAwarded / totalMax) * 100) : null,
      freshAvailable: exercises.filter((e) => e.type === typeDef.type && !attemptedIds.has(e.id)).length,
    };
  });
}

async function splitByFreshness(
  supabase: SupabaseClient,
  userId: string,
  topicId: string,
  type: GeoExerciseType
): Promise<{ fresh: string[]; seen: Array<{ id: string; attemptedAt: string }> }> {
  const { data: exerciseRows } = await supabase
    .from("geo_exercises")
    .select("id")
    .eq("topic_id", topicId)
    .eq("type", type);

  const ids = (exerciseRows ?? []).map((e) => (e as { id: string }).id);
  if (ids.length === 0) return { fresh: [], seen: [] };

  const { data: attemptRows } = await supabase
    .from("geo_exercise_attempts")
    .select("exercise_id, attempted_at")
    .eq("user_id", userId)
    .in("exercise_id", ids)
    .order("attempted_at", { ascending: false });

  const latest = new Map<string, string>();
  for (const row of (attemptRows ?? []) as Array<{ exercise_id: string; attempted_at: string }>) {
    if (!latest.has(row.exercise_id)) latest.set(row.exercise_id, row.attempted_at);
  }

  return {
    fresh: ids.filter((id) => !latest.has(id)),
    seen: ids
      .filter((id) => latest.has(id))
      .map((id) => ({ id, attemptedAt: latest.get(id)! }))
      .sort((a, b) => a.attemptedAt.localeCompare(b.attemptedAt)),
  };
}

function pickRandom<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

export async function topUpGeoStock(params: {
  supabase: SupabaseClient;
  userId: string;
  topic: GeoTopic;
  typeDef: GeoTypeDef;
}): Promise<void> {
  const { supabase, userId, topic, typeDef } = params;
  if (!typeDef.aiGeneratable) return;

  const { fresh } = await splitByFreshness(supabase, userId, topic.id, typeDef.type);
  const missing = Math.min(TOP_UP_BATCH, STOCK_TARGET - fresh.length);
  if (missing <= 0) return;

  // created_by is the student: geo_exercises_insert_own admits a row whose
  // created_by matches the caller (0015_geografia.sql), so the top-up runs on
  // the student's own session rather than needing service-role. The row still
  // lands in the SHARED library — geo_exercises_select is open to every
  // authenticated user — and still carries needs_review = true.
  await generateExercisesForTopic(supabase, topic, userId, missing, typeDef.type as "mc" | "open");
}

export async function pickExerciseForType(params: {
  supabase: SupabaseClient;
  userId: string;
  topic: GeoTopic;
  typeDef: GeoTypeDef;
}): Promise<{ exerciseId: string; isRepeat: boolean } | null> {
  const { supabase, userId, topic, typeDef } = params;

  const { fresh, seen } = await splitByFreshness(supabase, userId, topic.id, typeDef.type);
  if (fresh.length > 0) return { exerciseId: pickRandom(fresh), isRepeat: false };

  if (typeDef.aiGeneratable) {
    const { inserted } = await generateExercisesForTopic(
      supabase,
      topic,
      userId,
      1,
      typeDef.type as "mc" | "open"
    );
    if (inserted > 0) {
      // generateExercisesForTopic reports counts, not ids — re-read the queue
      // rather than widening its signature for this one caller.
      const { fresh: refreshed } = await splitByFreshness(supabase, userId, topic.id, typeDef.type);
      if (refreshed.length > 0) return { exerciseId: pickRandom(refreshed), isRepeat: false };
    }
  }

  if (seen.length > 0) return { exerciseId: seen[0].id, isRepeat: true };
  return null;
}
