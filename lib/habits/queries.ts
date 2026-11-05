// ============================================================================
// lib/habits/queries.ts
// Odczyty Habit Tracking (RLS ogranicza do własnych wierszy).
// ============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Habit } from "@/lib/types/database";

export async function getHabitsWithChecks(
  supabase: SupabaseClient,
  userId: string,
  from: string,
  to: string
): Promise<{ habits: Habit[]; checks: Set<string> }> {
  const [{ data: habits }, { data: checks }] = await Promise.all([
    supabase.from("habits").select("*").eq("user_id", userId).order("position").order("created_at"),
    supabase
      .from("habit_checks")
      .select("habit_id, day")
      .eq("user_id", userId)
      .gte("day", from)
      .lte("day", to),
  ]);
  return {
    habits: (habits ?? []) as Habit[],
    checks: new Set((checks ?? []).map((c) => `${c.habit_id}|${c.day}`)),
  };
}
