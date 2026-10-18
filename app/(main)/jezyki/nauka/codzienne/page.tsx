// ============================================================================
// app/(main)/jezyki/nauka/codzienne/page.tsx
// "Codzienne" — daily words & phrases. One card per deck (EF top 3000 words,
// UMN phrasal verbs); each shows progress and starts today's session: due
// reviews plus the next few entries in frequency order.
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getDecksWithProgress, NEW_PER_SESSION } from "@/lib/lexicon/queries";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function CodziennePage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const decks = await getDecksWithProgress(supabase, profile.id);

  return (
    <div>
      <PageHeader
        title="Codzienne"
        subtitle={`Po ${NEW_PER_SESSION} nowych dziennie, reszta to powtórki`}
      />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {decks.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Talie nie są jeszcze wgrane do bazy.
          </Card>
        )}
        {decks.map(({ deck, totalEntries, startedEntries, masteredEntries, dueEntries }) => (
          <Link key={deck.id} href={`/jezyki/nauka/codzienne/sesja/${deck.slug}`}>
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
        ))}
      </div>
    </div>
  );
}
