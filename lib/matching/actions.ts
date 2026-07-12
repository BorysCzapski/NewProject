"use server";

// ============================================================================
// lib/matching/actions.ts
// Server Action backing the "łączenie tłumaczeń" matching game: records a
// finished round (score/total) and logs one activity for streaks/homework.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { ACTIVITY_TYPES } from "@/lib/constants";
import type { TargetLanguage, UserLevel } from "@/lib/types/database";

/** Saves one completed matching round and marks it as an activity. */
export async function submitMatchingGame(
  language: TargetLanguage,
  level: UserLevel,
  category: string | null,
  score: number,
  total: number
): Promise<void> {
  const profile = await requireProfile();
  const supabase = await createClient();

  await supabase.from("matching_attempts").insert({
    user_id: profile.id,
    language,
    level,
    category,
    score,
    total,
  });

  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.MATCHING });
}
