// ============================================================================
// app/(main)/modlitwa/page.tsx
// Ekran „Dziś” — korzeń aplikacji Modlitwa. Zbiera wszystko, co ma być
// widoczne bez klikania: dzień liturgiczny, werset dnia, przycisk odhaczenia
// modlitwy ze streakiem, pasek ostatnich dni, skrót do godziny brewiarza
// pasującej do pory dnia i najbliższe intencje.
//
// Ekran celowo NIE pobiera czytań z sieci — te są o jedno kliknięcie dalej,
// w /modlitwa/czytania, żeby wejście na stronę główną nigdy nie czekało na
// zewnętrzny serwis.
// ============================================================================
import Link from "next/link";
import { BookOpenText, ChevronRight, Church, HeartHandshake, Settings } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import {
  currentWarsawHour,
  addDays,
  fromDateKey,
  getLiturgicalDay,
  todayKey,
  toDateKey,
} from "@/lib/modlitwa/liturgical-calendar";
import { getVerseOfTheDay } from "@/lib/modlitwa/verses";
import { getPrayerLog, getPrayerRequests, getPrayerStreak, getTodayLogEntry } from "@/lib/modlitwa/queries";
import { buildStreakStrip, effectiveStreak, isStreakBroken } from "@/lib/modlitwa/streak";
import { getHour, suggestedHour } from "@/lib/modlitwa/hours";
import { VerseCard } from "@/components/modlitwa/verse-card";
import { PrayButton } from "@/components/modlitwa/pray-button";
import { StreakStrip } from "@/components/modlitwa/streak-strip";
import { LiturgicalDayCard } from "@/components/modlitwa/liturgical-day-card";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function ModlitwaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const today = todayKey();
  const day = getLiturgicalDay(today);
  const weekAgo = toDateKey(addDays(fromDateKey(today), -6));

  const [verse, streak, log, todayEntry, requests] = await Promise.all([
    getVerseOfTheDay(supabase, profile.id, today, day.season),
    getPrayerStreak(supabase, profile.id),
    getPrayerLog(supabase, profile.id, weekAgo, today),
    getTodayLogEntry(supabase, profile.id, today),
    getPrayerRequests(supabase, profile.id),
  ]);

  const strip = buildStreakStrip(
    log.map((entry) => entry.prayer_date),
    today
  );
  const nextHour = getHour(suggestedHour(currentWarsawHour()))!;
  const upcomingIntentions = requests.active.slice(0, 3);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 pb-6 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-foreground-muted">Szczęść Boże,</p>
          <h1 className="text-2xl font-bold text-foreground">{profile.username}</h1>
        </div>
        <Link
          href="/modlitwa/ustawienia"
          aria-label="Ustawienia modlitwy"
          className="flex h-11 w-11 items-center justify-center rounded-(--radius-control) border border-border bg-surface text-foreground-muted active:opacity-80"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>

      <LiturgicalDayCard day={day} />

      {verse ? (
        <VerseCard verse={verse} color={day.color} dayName={day.name} />
      ) : (
        <Card>
          <CardTitle>Brak wersetów w bazie</CardTitle>
          <CardDescription>
            Wgraj plik <code>supabase/seed/modlitwa/01_bible_verses.sql</code>, aby zobaczyć werset dnia.
          </CardDescription>
        </Card>
      )}

      <PrayButton
        dateKey={today}
        initialPrayed={todayEntry !== null}
        initialStreak={effectiveStreak(streak, today)}
        initialNote={todayEntry?.note ?? null}
        broken={isStreakBroken(streak, today)}
      />

      <StreakStrip days={strip} longestStreak={streak.longestStreak} totalDays={streak.totalDays} />

      <Link
        href="/modlitwa/czytania"
        className="flex items-center justify-between gap-3 rounded-(--radius-card) border border-border bg-surface px-4 py-4 active:opacity-80"
      >
        <span className="flex items-center gap-3">
          <BookOpenText className="h-5 w-5 text-primary" />
          <span>
            <span className="block text-base font-medium text-foreground">Czytania na dziś</span>
            <span className="block text-sm text-foreground-muted">Ewangelia, psalm i czytania</span>
          </span>
        </span>
        <ChevronRight className="h-5 w-5 text-foreground-muted" />
      </Link>

      <Link
        href={`/modlitwa/liturgia/${nextHour.id}`}
        className="flex items-center justify-between gap-3 rounded-(--radius-card) border border-border bg-surface px-4 py-4 active:opacity-80"
      >
        <span className="flex items-center gap-3">
          <Church className="h-5 w-5 text-primary" />
          <span>
            <span className="block text-base font-medium text-foreground">{nextHour.name}</span>
            <span className="block text-sm text-foreground-muted">Liturgia godzin — {nextHour.timeHint}</span>
          </span>
        </span>
        <ChevronRight className="h-5 w-5 text-foreground-muted" />
      </Link>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" />
            Modlę się za
          </CardTitle>
          <Link href="/modlitwa/intencje" className="text-sm font-medium text-primary">
            Wszystkie ({requests.active.length})
          </Link>
        </div>

        {upcomingIntentions.length === 0 ? (
          <CardDescription>
            Nie masz jeszcze żadnych intencji. Dodaj osobę, za którą obiecałeś się modlić.
          </CardDescription>
        ) : (
          <ul className="flex flex-col gap-2">
            {upcomingIntentions.map((request) => (
              <li key={request.id} className="rounded-(--radius-control) bg-surface-muted px-3 py-2.5">
                <p className="text-base font-medium text-foreground">{request.person_name}</p>
                {request.reason && <p className="text-sm text-foreground-muted">{request.reason}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
