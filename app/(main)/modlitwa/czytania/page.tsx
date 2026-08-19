// ============================================================================
// app/(main)/modlitwa/czytania/page.tsx
// Czytania liturgiczne na dany dzień. Domyślnie „dziś”, ale ?data=YYYY-MM-DD
// pozwala zajrzeć do innego dnia (linki z kalendarza).
//
// Dla dni innych niż dziś nie wychodzimy do sieci (allowFetch: false) — inaczej
// przeglądanie kalendarza wstecz odpalałoby pobranie za każdym kliknięciem.
// ============================================================================
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getReadings } from "@/lib/modlitwa/readings";
import {
  addDays,
  formatPolishDate,
  fromDateKey,
  getLiturgicalDay,
  toDateKey,
  todayKey,
} from "@/lib/modlitwa/liturgical-calendar";
import { PageHeader } from "@/components/layout/page-header";
import { ReadingsView } from "@/components/modlitwa/readings-view";
import { LiturgicalDayCard } from "@/components/modlitwa/liturgical-day-card";

export default async function CzytaniaPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  await requireProfile();
  const supabase = await createClient();

  const { data: requested } = await searchParams;
  const today = todayKey();
  const dateKey = requested && /^\d{4}-\d{2}-\d{2}$/.test(requested) ? requested : today;
  const isToday = dateKey === today;

  const day = getLiturgicalDay(dateKey);
  const { readings, isStale, error } = await getReadings(supabase, dateKey, { allowFetch: isToday });

  const previousDay = toDateKey(addDays(fromDateKey(dateKey), -1));
  const nextDay = toDateKey(addDays(fromDateKey(dateKey), 1));

  return (
    <div>
      <PageHeader title="Czytania" subtitle={isToday ? "Liturgia słowa na dziś" : formatPolishDate(dateKey)} />

      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <nav className="flex items-center justify-between gap-2">
          <Link
            href={`/modlitwa/czytania?data=${previousDay}`}
            className="inline-flex h-11 items-center gap-1 rounded-(--radius-control) border border-border bg-surface px-3 text-sm font-medium text-foreground active:opacity-80"
          >
            <ChevronLeft className="h-4 w-4" />
            Poprzedni
          </Link>
          {!isToday && (
            <Link href="/modlitwa/czytania" className="text-sm font-medium text-primary">
              Wróć do dziś
            </Link>
          )}
          <Link
            href={`/modlitwa/czytania?data=${nextDay}`}
            className="inline-flex h-11 items-center gap-1 rounded-(--radius-control) border border-border bg-surface px-3 text-sm font-medium text-foreground active:opacity-80"
          >
            Następny
            <ChevronRight className="h-4 w-4" />
          </Link>
        </nav>

        <LiturgicalDayCard day={day} />

        <ReadingsView readings={readings} dateKey={dateKey} isStale={isStale} error={error} />
      </div>
    </div>
  );
}
