// ============================================================================
// app/(main)/tracker/page.tsx
// Tracker: wykres dni "jak na giełdzie" na górze, pod nim formularz zapisu
// dnia i lista ostatnich wpisów. Jedno pytanie na ekran — "jak mi idzie".
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { listDays } from "@/lib/tracker/queries";
import { todayKey, formatHours, plural } from "@/lib/tracker/format";
import { averageLastDays, currentStreak } from "@/lib/tracker/stats";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ProgressChart } from "@/components/tracker/progress-chart";
import { DayForm } from "@/components/tracker/day-form";

export default async function TrackerPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const today = todayKey();
  const days = await listDays(supabase, profile.id);

  const streak = currentStreak(days, today);
  const avgHours = averageLastDays(days, "hours", 7, today);
  const avgTasks = averageLastDays(days, "tasks", 7, today);

  return (
    <div>
      <PageHeader title="Tracker" subtitle="Godziny i zadania, dzień po dniu" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        {days.length > 0 && (
          <section className="grid grid-cols-3 gap-2">
            <Card className="p-3">
              <p className="text-xs text-foreground-muted">Seria</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground">
                {streak} {plural(streak, "dzień", "dni", "dni")}
              </p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-foreground-muted">Śr. godz./dzień (7 dni)</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground">{formatHours(avgHours)}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-foreground-muted">Śr. zadań/dzień (7 dni)</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground">
                {avgTasks.toLocaleString("pl-PL")}
              </p>
            </Card>
          </section>
        )}

        {days.length === 0 ? (
          <Card className="text-sm text-foreground-muted">
            Zapisz pierwszy dzień poniżej. Każdy dzień to jeden punkt na wykresie — od drugiego dnia zobaczysz,
            czy idziesz w górę, i jak dany dzień wypada na tle pozostałych.
          </Card>
        ) : (
          <ProgressChart points={days} today={today} />
        )}

        <DayForm days={days} today={today} />
      </div>
    </div>
  );
}
