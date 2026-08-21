// ============================================================================
// app/(main)/modlitwa/liturgia/page.tsx
// Liturgia godzin — osiem godzin brewiarza na dziś, z zaznaczeniem tych już
// odmówionych i podpowiedzią, która wypada o tej porze. Pełne teksty są na
// ekranie pojedynczej godziny (pobierane z ILG).
// ============================================================================
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { currentWarsawHour, getLiturgicalDay, todayKey } from "@/lib/modlitwa/liturgical-calendar";
import { HOURS, suggestedHour } from "@/lib/modlitwa/hours";
import { getTodayLogEntry } from "@/lib/modlitwa/queries";
import { PageHeader } from "@/components/layout/page-header";
import { LiturgicalDayCard } from "@/components/modlitwa/liturgical-day-card";
import { HourIcon } from "@/components/modlitwa/hour-icon";
import { SuggestedHourHint } from "@/components/modlitwa/suggested-hour-hint";

export default async function LiturgiaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const today = todayKey();
  const day = getLiturgicalDay(today);
  const entry = await getTodayLogEntry(supabase, profile.id, today);
  const done = new Set(entry?.hours ?? []);
  const suggested = suggestedHour(currentWarsawHour());

  return (
    <div>
      <PageHeader title="Liturgia godzin" subtitle="Modlitwa Kościoła na dziś" />

      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <LiturgicalDayCard day={day} />

        <SuggestedHourHint hourId={suggested} />

        <ul className="flex flex-col gap-2">
          {HOURS.map((hour) => {
            const isDone = done.has(hour.id);
            const isSuggested = hour.id === suggested;
            return (
              <li key={hour.id}>
                <Link
                  href={`/modlitwa/liturgia/${hour.id}`}
                  className={[
                    "flex items-center justify-between gap-3 rounded-(--radius-card) border bg-surface px-4 py-4 active:opacity-80",
                    isSuggested && !isDone ? "border-primary" : "border-border",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${
                        isDone ? "bg-accent-soft text-accent" : "bg-primary-soft text-primary"
                      }`}
                    >
                      {isDone ? <Check className="h-5 w-5" /> : <HourIcon name={hour.icon} className="h-5 w-5" />}
                    </span>
                    <span>
                      <span className="block text-base font-medium text-foreground">{hour.name}</span>
                      <span className="block text-sm text-foreground-muted">{hour.timeHint}</span>
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-foreground-muted" />
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="text-xs text-foreground-muted">
          Pełne teksty (hymn, psalmy z antyfonami, czytanie, kantyk, prośby i modlitwa) pochodzą z serwisu{" "}
          <a href="https://brewiarz.pl/" target="_blank" rel="noreferrer" className="underline">
            brewiarz.pl
          </a>{" "}
          — Internetowej Liturgii Godzin. Teksty Liturgii Godzin © Konferencja Episkopatu Polski i
          Wydawnictwo Pallottinum.
        </p>
      </div>
    </div>
  );
}
