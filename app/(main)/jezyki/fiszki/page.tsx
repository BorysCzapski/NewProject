// ============================================================================
// app/(main)/jezyki/fiszki/page.tsx
// Menu "Fiszki", krok 1 z 3: wybór MATERIAŁU. Dalej: tryb nauki
// (/jezyki/fiszki/[material]), a potem sama sesja (/jezyki/fiszki/[material]/[tryb]).
// Materiały to talie leksykonu (tylko angielski) i słownictwo wg poziomu.
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getFiszkiDecks } from "@/lib/fiszki/queries";
import { LEVEL_MATERIAL } from "@/lib/fiszki/modes";
import { langInfo } from "@/lib/languages";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { stagger } from "@/lib/motion";

export default async function FiszkiMenuPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  // Talie leksykonu są angielskie — hiszpański i rosyjski mają tylko słownictwo wg poziomu.
  const decks = profile.target_language === "en" ? await getFiszkiDecks(supabase, profile.id) : [];
  const info = langInfo(profile.target_language);

  return (
    <div>
      <PageHeader title="Fiszki" subtitle="Wybierz materiał do nauki" action={<LevelBadge level={profile.level} />} />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {decks.map(({ deck, meanings }, index) => {
          const { totalEntries, startedEntries, masteredEntries, dueEntries } = meanings;
          return (
            <Link
              key={deck.id}
              href={`/jezyki/fiszki/${deck.slug}`}
              className="animate-fade-up motion-stagger"
              style={stagger(index)}
            >
              <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
                <div className="min-w-0 flex-1">
                  <CardTitle>{deck.title}</CardTitle>
                  <CardDescription className="mt-0.5">{deck.description}</CardDescription>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${totalEntries > 0 ? (masteredEntries / totalEntries) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs tabular-nums text-foreground-muted">
                    {masteredEntries} opanowanych • {startedEntries}/{totalEntries} poznanych
                    {dueEntries > 0 && <span className="ml-1.5 text-primary">• {dueEntries} do powtórki</span>}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
              </Card>
            </Link>
          );
        })}

        <Link
          href={`/jezyki/fiszki/${LEVEL_MATERIAL}`}
          className="animate-fade-up motion-stagger"
          style={stagger(decks.length)}
        >
          <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
            <div className="min-w-0 flex-1">
              <CardTitle>Słownictwo wg poziomu</CardTitle>
              <CardDescription className="mt-0.5">
                Słówka {info.pl}e na Twoim poziomie ({profile.level}) — te same, co w Ścieżce nauki
              </CardDescription>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
