// ============================================================================
// app/(main)/habits/page.tsx
// Habit Tracking: przegląd wszystkich tygodni jako kwadraciki (jak wkład na
// GitHubie) i rozwinięty wybrany tydzień. Tygodnie to 7-dniowe okna liczone
// wstecz od dziś: ostatnie = dziś + 6 kolejnych dni. Wszystkie odhaczenia
// z zakresu trafiają do klienta, więc przełączanie tygodni jest natychmiastowe.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { WINDOW_DAYS, addDays, todayKey } from "@/lib/habits/dates";
import { PageHeader } from "@/components/layout/page-header";
import { HabitBoard } from "@/components/habits/habit-board";
import { ApiTokenCard } from "@/components/habits/api-token-card";
import type { Habit } from "@/lib/types/database";

const MIN_WEEKS = 12;
const MAX_WEEKS = 52;
const PAGE = 1000; // limit wierszy na zapytanie w PostgREST

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

export default async function HabitsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const today = todayKey();

  const [{ data: habits }, { data: first }, { data: tokenRow }] = await Promise.all([
    supabase.from("habits").select("*").eq("user_id", profile.id).order("position").order("created_at"),
    supabase.from("habit_checks").select("day").eq("user_id", profile.id).order("day").limit(1),
    supabase.from("habit_api_tokens").select("created_at, last_used_at").eq("user_id", profile.id).maybeSingle(),
  ]);

  const habitList = (habits ?? []) as Habit[];
  const firstDay = [first?.[0]?.day, ...habitList.map((h) => h.created_at.slice(0, 10))]
    .filter((d): d is string => !!d)
    .sort()[0];
  const spanWeeks = firstDay ? Math.ceil(daysBetween(firstDay, today) / WINDOW_DAYS) + 1 : 1;
  const weekCount = Math.min(MAX_WEEKS, Math.max(MIN_WEEKS, spanWeeks));
  const weekStarts = Array.from({ length: weekCount }, (_, i) => addDays(today, -WINDOW_DAYS * (weekCount - 1 - i)));

  // Wszystkie odhaczenia z zakresu, stronami (jedno zapytanie ucina się na 1000 wierszy).
  const from = weekStarts[0];
  const checks = new Set<string>();
  for (let offset = 0; ; offset += PAGE) {
    const { data } = await supabase
      .from("habit_checks")
      .select("habit_id, day")
      .eq("user_id", profile.id)
      .gte("day", from)
      .lte("day", today)
      .order("day")
      .order("habit_id")
      .range(offset, offset + PAGE - 1);
    for (const c of data ?? []) checks.add(`${c.habit_id}|${c.day}`);
    if (!data || data.length < PAGE) break;
  }

  return (
    <div>
      <PageHeader title="Habit Tracking" subtitle="Zamień nawyki w tożsamość, tydzień po tygodniu" />
      <div className="mx-auto max-w-5xl px-5 py-5">
        <HabitBoard habits={habitList} weekStarts={weekStarts} initialChecks={[...checks]} today={today} />
        <ApiTokenCard
          hasToken={!!tokenRow}
          createdAt={tokenRow?.created_at ?? null}
          lastUsedAt={tokenRow?.last_used_at ?? null}
        />
      </div>
    </div>
  );
}
