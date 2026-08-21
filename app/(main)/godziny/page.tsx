// ============================================================================
// app/(main)/godziny/page.tsx
// Ekran główny "Godzin": podsumowanie dziś / tydzień / miesiąc, formularz
// dodania nauki i stream ostatnich wpisów.
//
// Stream celowo urywa się na ostatnich wpisach (STREAM_LIMIT) — pełny
// przegląd z filtrami i wykresem jest na /godziny/historia. Ten ekran ma
// odpowiadać na jedno pytanie: „ile dziś zrobiłem i co ostatnio robiłem".
// ============================================================================
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getOverview, listEntries, listTopics } from "@/lib/godziny/queries";
import { formatMinutes, plural, todayKey } from "@/lib/godziny/format";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { StudyLog } from "@/components/godziny/study-log";
import { SeedTopicsButton } from "@/components/godziny/seed-topics-button";

const STREAM_LIMIT = 25;

export default async function GodzinyPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const today = todayKey();

  const [topics, entries, overview] = await Promise.all([
    listTopics(supabase, profile.id),
    listEntries(supabase, profile.id, { limit: STREAM_LIMIT }),
    getOverview(supabase, profile.id, today),
  ]);

  const hasAnyTopic = topics.length > 0;

  return (
    <div>
      <PageHeader title="Godziny" subtitle="Ile i czego się uczysz" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        <section className="grid grid-cols-3 gap-2">
          <SummaryTile label="Dziś" minutes={overview.todayMinutes} highlight />
          <SummaryTile label="Ten tydzień" minutes={overview.weekMinutes} />
          <SummaryTile label="Ten miesiąc" minutes={overview.monthMinutes} />
        </section>

        {overview.streakDays > 0 && (
          <p className="text-sm text-foreground-muted">
            🔥 {overview.streakDays} {plural(overview.streakDays, "dzień", "dni", "dni")} nauki z
            rzędu · łącznie {formatMinutes(overview.totalMinutes)}
          </p>
        )}

        {!hasAnyTopic && (
          <Card className="flex flex-col gap-3">
            <div>
              <CardTitle>Zacznij od tematów</CardTitle>
              <CardDescription className="mt-1">
                Każdy wpis o nauce przypisujesz do tematu — dzięki temu widzisz nie tylko ile, ale i
                czego się uczysz. Weź gotową listę (przedmioty szkolne i aplikacje z Phoenixa) albo
                ułóż własną.
              </CardDescription>
            </div>
            <SeedTopicsButton />
            <Link
              href="/godziny/tematy"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              Wolę dodać własne tematy
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        )}

        <StudyLog entries={entries} topics={topics} today={today} />

        {entries.length === STREAM_LIMIT && (
          <Link
            href="/godziny/historia"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary"
          >
            Zobacz pełną historię
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

function SummaryTile({
  label,
  minutes,
  highlight,
}: {
  label: string;
  minutes: number;
  highlight?: boolean;
}) {
  return (
    <Card className="flex flex-col gap-0.5 p-3">
      <span className="text-xs text-foreground-muted">{label}</span>
      <span
        className={
          highlight
            ? "text-lg font-bold text-primary"
            : "text-lg font-bold text-foreground"
        }
      >
        {formatMinutes(minutes)}
      </span>
    </Card>
  );
}
