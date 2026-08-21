// ============================================================================
// app/(main)/modlitwa/kalendarz/page.tsx
// Kalendarz: dni modlitwy + kalendarz liturgiczny, a pod spodem lista
// najbliższych uroczystości i świąt.
//
// Dni modlitwy pobieramy szeroko (rok wstecz i miesiąc naprzód), żeby
// przewijanie miesięcy w komponencie klienckim nie wymagało dopobierania.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getPrayerLog } from "@/lib/modlitwa/queries";
import {
  addDays,
  formatPolishDate,
  fromDateKey,
  observancesBetween,
  toDateKey,
  todayKey,
} from "@/lib/modlitwa/liturgical-calendar";
import { PageHeader } from "@/components/layout/page-header";
import { PrayerCalendar } from "@/components/modlitwa/prayer-calendar";
import { Card, CardTitle } from "@/components/ui/card";

const RANK_LABELS: Record<string, string> = {
  uroczystosc: "Uroczystość",
  swieto: "Święto",
  wspomnienie: "Wspomnienie",
  niedziela: "Niedziela",
};

export default async function KalendarzPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const today = todayKey();
  const from = toDateKey(addDays(fromDateKey(today), -365));
  const to = toDateKey(addDays(fromDateKey(today), 60));

  const log = await getPrayerLog(supabase, profile.id, from, to);

  const upcoming = observancesBetween(today, toDateKey(addDays(fromDateKey(today), 60)))
    .filter(({ observance }) => observance.rank === "uroczystosc" || observance.rank === "swieto")
    .slice(0, 8);

  return (
    <div>
      <PageHeader title="Kalendarz" subtitle="Dni modlitwy i kalendarz liturgiczny" />

      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <PrayerCalendar prayedDates={log.map((entry) => entry.prayer_date)} todayDateKey={today} />

        <Card className="flex flex-col gap-3">
          <CardTitle>Najbliższe uroczystości i święta</CardTitle>
          <ul className="flex flex-col gap-2">
            {upcoming.map(({ date, observance }) => (
              <li key={`${date}-${observance.name}`} className="flex flex-col">
                <span className="text-sm text-foreground-muted">
                  {formatPolishDate(date)} · {RANK_LABELS[observance.rank]}
                </span>
                <span className="text-base text-foreground">
                  {observance.name}
                  {observance.holyDayOfObligation && (
                    <span className="ml-2 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                      nakazana
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <p className="text-xs text-foreground-muted">
          Kalendarz liturgiczny (okresy, uroczystości, święta i kolor szat) jest wyliczany w aplikacji
          na podstawie daty Wielkanocy — działa też bez internetu. Możesz go zasubskrybować w Kalendarzu
          Google lub Apple: adres znajdziesz w ustawieniach.
        </p>
      </div>
    </div>
  );
}
