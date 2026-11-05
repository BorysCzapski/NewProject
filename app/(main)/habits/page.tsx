// ============================================================================
// app/(main)/habits/page.tsx
// Habit Tracking: okno 7 dni zaczynające się od dziś (domyślnie), ze
// strzałkami do przeglądania poprzednich tygodni (?od=YYYY-MM-DD).
// ============================================================================
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getHabitsWithChecks } from "@/lib/habits/queries";
import { WINDOW_DAYS, addDays, isValidDateKey, rangeLabel, todayKey, windowDays } from "@/lib/habits/dates";
import { PageHeader } from "@/components/layout/page-header";
import { HabitBoard } from "@/components/habits/habit-board";

export default async function HabitsPage({
  searchParams,
}: {
  searchParams: Promise<{ od?: string }>;
}) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const today = todayKey();
  const { od } = await searchParams;

  // Okno nie wybiega w przyszłość poza "dziś jako pierwszy dzień".
  const start = od && isValidDateKey(od) && od <= today ? od : today;
  const days = windowDays(start);
  const { habits, checks } = await getHabitsWithChecks(supabase, profile.id, days[0], days[WINDOW_DAYS - 1]);

  const prev = addDays(start, -WINDOW_DAYS);
  const next = addDays(start, WINDOW_DAYS);
  const nextHref = next >= today ? "/habits" : `/habits?od=${next}`;

  return (
    <div>
      <PageHeader title="Habit Tracking" subtitle="Zamień nawyki w tożsamość, tydzień po tygodniu" />
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 py-5">
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`/habits?od=${prev}`}
            aria-label="Poprzednie 7 dni"
            className="rounded-full border border-border p-2 hover:bg-surface-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <span className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium">
            <CalendarDays className="h-4 w-4 text-foreground-muted" />
            {rangeLabel(start)}
          </span>
          <Link
            href={nextHref}
            aria-label="Następne 7 dni"
            aria-disabled={start >= today}
            className={`rounded-full border border-border p-2 hover:bg-surface-muted ${start >= today ? "pointer-events-none opacity-30" : ""}`}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
          {start !== today && (
            <Link href="/habits" className="text-sm font-medium text-primary hover:underline">
              Dziś
            </Link>
          )}
        </div>
        <HabitBoard habits={habits} days={days} initialChecks={[...checks]} today={today} />
      </div>
    </div>
  );
}
