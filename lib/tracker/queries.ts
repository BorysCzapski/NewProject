// ============================================================================
// lib/tracker/queries.ts
// Odczyt historii dni. Cała historia jednego użytkownika to co najwyżej
// kilkaset krótkich wierszy (jeden na dzień), więc pobieramy ją w całości,
// a porównania i zakresy liczy się w pamięci (lib/tracker/stats.ts).
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DayPoint } from "@/lib/tracker/stats";

/** Twardy limit bezpieczeństwa — 10 lat wpisów, daleko ponad realne użycie. */
const MAX_DAYS = 3650;

export async function listDays(supabase: SupabaseClient, userId: string): Promise<DayPoint[]> {
  const { data, error } = await supabase
    .from("tracker_days")
    .select("day, hours, tasks, note")
    .eq("user_id", userId)
    .order("day", { ascending: true })
    .limit(MAX_DAYS);
  if (error) {
    console.error("[tracker] listDays failed:", error);
    return [];
  }
  // numeric z Postgresa przychodzi jako liczba albo string zależnie od sterownika.
  return (data ?? []).map((row) => ({
    day: row.day as string,
    hours: Number(row.hours),
    tasks: Number(row.tasks),
    note: (row.note as string | null) ?? null,
  }));
}
