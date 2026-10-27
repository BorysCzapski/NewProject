// ============================================================================
// lib/silownia/queries.ts
// Strona odczytu "Siłowni": profil (waga/wzrost/cel), lista treningów,
// dzisiejsze nawodnienie, posiłki i suplementy, plus podsumowanie na
// dashboard. Sumowanie w TypeScripcie, nie w SQL-u — jak w lib/tracker/queries.ts,
// to dziennik jednej osoby, więc proste zapytanie plus pętla wystarczą.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { addDays, todayKey, weekStart } from "@/lib/silownia/format";
import { recommendedHydrationMl, type HydrationRecommendation } from "@/lib/silownia/hydration";
import type {
  GymHydrationLog,
  GymMealEntry,
  GymProfile,
  GymSupplementEntry,
  GymWorkout,
} from "@/lib/types/database";

// ---------------------------------------------------------------------------
// Profil (waga/wzrost/cel)
// ---------------------------------------------------------------------------

export async function getGymProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<GymProfile | null> {
  const { data, error } = await supabase
    .from("gym_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("[silownia] getGymProfile failed:", error);
    return null;
  }
  return (data as GymProfile | null) ?? null;
}

// ---------------------------------------------------------------------------
// Treningi
// ---------------------------------------------------------------------------

export interface WorkoutFilters {
  limit?: number;
  from?: string;
  to?: string;
}

export async function listWorkouts(
  supabase: SupabaseClient,
  userId: string,
  filters: WorkoutFilters = {}
): Promise<GymWorkout[]> {
  let query = supabase
    .from("gym_workouts")
    .select("*")
    .eq("user_id", userId)
    .order("workout_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.from) query = query.gte("workout_date", filters.from);
  if (filters.to) query = query.lte("workout_date", filters.to);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) {
    console.error("[silownia] listWorkouts failed:", error);
    return [];
  }
  return (data ?? []) as GymWorkout[];
}

export async function getWorkout(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<GymWorkout | null> {
  const { data, error } = await supabase
    .from("gym_workouts")
    .select("*")
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as GymWorkout;
}

/** Ostatni zalogowany split — do prostej sugestii "co dziś trenować"
 * (naprzemiennie A/B, patrz lib/silownia/suggestion.ts). */
export async function getLastWorkout(
  supabase: SupabaseClient,
  userId: string
): Promise<GymWorkout | null> {
  const { data, error } = await supabase
    .from("gym_workouts")
    .select("*")
    .eq("user_id", userId)
    .order("workout_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as GymWorkout;
}

// ---------------------------------------------------------------------------
// Nawodnienie
// ---------------------------------------------------------------------------

export async function getHydrationLog(
  supabase: SupabaseClient,
  userId: string,
  date: string
): Promise<GymHydrationLog | null> {
  const { data, error } = await supabase
    .from("gym_hydration_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", date)
    .maybeSingle();
  if (error) {
    console.error("[silownia] getHydrationLog failed:", error);
    return null;
  }
  return (data as GymHydrationLog | null) ?? null;
}

export interface HydrationHistoryPoint {
  date: string;
  consumedMl: number;
  recommendedMl: number;
}

/** Ostatnie `days` dni nawodnienia (rosnąco po dacie), do wykresu na historii. */
export async function getHydrationHistory(
  supabase: SupabaseClient,
  userId: string,
  weightKg: number | null,
  days = 14,
  today = todayKey()
): Promise<HydrationHistoryPoint[]> {
  const from = addDays(today, -(days - 1));
  const { data, error } = await supabase
    .from("gym_hydration_logs")
    .select("log_date, consumed_ml")
    .eq("user_id", userId)
    .gte("log_date", from)
    .lte("log_date", today);

  if (error) {
    console.error("[silownia] getHydrationHistory failed:", error);
    return [];
  }

  const byDate = new Map((data ?? []).map((row) => [row.log_date as string, row.consumed_ml as number]));
  const { recommendedMl } = recommendedHydrationMl(weightKg, 0);

  const points: HydrationHistoryPoint[] = [];
  let cursor = from;
  while (cursor <= today) {
    points.push({ date: cursor, consumedMl: byDate.get(cursor) ?? 0, recommendedMl });
    cursor = addDays(cursor, 1);
  }
  return points;
}

// ---------------------------------------------------------------------------
// Posiłki
// ---------------------------------------------------------------------------

export async function listMeals(
  supabase: SupabaseClient,
  userId: string,
  filters: { limit?: number; from?: string; to?: string } = {}
): Promise<GymMealEntry[]> {
  let query = supabase
    .from("gym_meal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.from) query = query.gte("entry_date", filters.from);
  if (filters.to) query = query.lte("entry_date", filters.to);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) {
    console.error("[silownia] listMeals failed:", error);
    return [];
  }
  return (data ?? []) as GymMealEntry[];
}

// ---------------------------------------------------------------------------
// Suplementy
// ---------------------------------------------------------------------------

export async function listSupplements(
  supabase: SupabaseClient,
  userId: string,
  filters: { limit?: number; from?: string; to?: string } = {}
): Promise<GymSupplementEntry[]> {
  let query = supabase
    .from("gym_supplement_entries")
    .select("*")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.from) query = query.gte("entry_date", filters.from);
  if (filters.to) query = query.lte("entry_date", filters.to);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) {
    console.error("[silownia] listSupplements failed:", error);
    return [];
  }
  return (data ?? []) as GymSupplementEntry[];
}

// ---------------------------------------------------------------------------
// Podsumowanie na dashboard
// ---------------------------------------------------------------------------

export interface GymOverview {
  todayWorkout: GymWorkout | null;
  hydration: HydrationRecommendation & { consumedMl: number };
  todayMealsCalories: number;
  todayMealsCount: number;
  todaySupplementsCount: number;
  weekWorkoutCount: number;
  weekWorkoutMinutes: number;
}

export async function getOverview(
  supabase: SupabaseClient,
  userId: string,
  today = todayKey()
): Promise<GymOverview> {
  const weekFrom = weekStart(today);

  const [profile, todayWorkoutRow, hydrationLog, weekWorkouts, todayMeals, todaySupplements] =
    await Promise.all([
      getGymProfile(supabase, userId),
      supabase
        .from("gym_workouts")
        .select("*")
        .eq("user_id", userId)
        .eq("workout_date", today)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      getHydrationLog(supabase, userId, today),
      supabase
        .from("gym_workouts")
        .select("duration_minutes")
        .eq("user_id", userId)
        .gte("workout_date", weekFrom)
        .lte("workout_date", today),
      listMeals(supabase, userId, { from: today, to: today }),
      listSupplements(supabase, userId, { from: today, to: today }),
    ]);

  const todayWorkout = (todayWorkoutRow.data as GymWorkout | null) ?? null;
  const weekRows = (weekWorkouts.data ?? []) as Array<{ duration_minutes: number | null }>;

  const hydrationRec = recommendedHydrationMl(
    profile?.weight_kg ?? null,
    todayWorkout?.duration_minutes ?? 0
  );

  return {
    todayWorkout,
    hydration: { ...hydrationRec, consumedMl: hydrationLog?.consumed_ml ?? 0 },
    todayMealsCalories: todayMeals.reduce((sum, m) => sum + m.calories, 0),
    todayMealsCount: todayMeals.length,
    todaySupplementsCount: todaySupplements.length,
    weekWorkoutCount: weekRows.length,
    weekWorkoutMinutes: weekRows.reduce((sum, w) => sum + (w.duration_minutes ?? 0), 0),
  };
}
