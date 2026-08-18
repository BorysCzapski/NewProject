"use server";

// ============================================================================
// lib/geografia/admin-actions.ts
// Admin-only mutations: trigger AI generation for a topic, mark a
// needs_review exercise as checked, delete a bad exercise.
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/get-profile";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { generateExercisesForTopic } from "@/lib/geografia/generate";
import type { GeoTopic } from "@/lib/types/database";

export async function generateExercisesAction(
  topicId: string,
  count: number
): Promise<ActionResult<{ inserted: number; skipped: number }>> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data: topic } = await supabase.from("geo_topics").select("*").eq("id", topicId).maybeSingle();
  if (!topic) return actionFailure("Nie znaleziono działu.");

  const clampedCount = Math.max(1, Math.min(15, count));
  const result = await generateExercisesForTopic(supabase, topic as GeoTopic, admin.id, clampedCount);

  revalidatePath("/geografia/admin");
  revalidatePath(`/geografia/tematy/${(topic as GeoTopic).slug}`);
  return { ok: true, data: result };
}

export async function markExerciseReviewed(exerciseId: string): Promise<ActionResult<void>> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("geo_exercises").update({ needs_review: false }).eq("id", exerciseId);
  if (error) return actionFailure("Nie udało się oznaczyć zadania jako sprawdzone.");
  revalidatePath("/geografia/admin");
  return { ok: true, data: undefined };
}

export async function deleteExercise(exerciseId: string): Promise<ActionResult<void>> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("geo_exercises").delete().eq("id", exerciseId);
  if (error) return actionFailure("Nie udało się usunąć zadania.");
  revalidatePath("/geografia/admin");
  return { ok: true, data: undefined };
}
