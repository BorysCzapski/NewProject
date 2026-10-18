// ============================================================================
// app/(main)/matura/slowka-zwroty/page.tsx
// "Słówka i zwroty" — the two curated must-know lists for the exam: the 100
// most important words and the phrasal verbs that keep turning up. Same bank,
// trainer and Leitner schedule as /matura/slownictwo; this page is only the
// focused entry point.
// ============================================================================
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { getVocabTopicsWithProgress } from "@/lib/matura/vocab";
import { MATURA_FEATURED_VOCAB_SLUGS } from "@/lib/matura/constants";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export default async function MaturaSlowkaZwrotyPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const topics = (await getVocabTopicsWithProgress(supabase, profile.id, settings.language, settings.level))
    .filter((item) => (MATURA_FEATURED_VOCAB_SLUGS as readonly string[]).includes(item.topic.slug))
    .sort((a, b) => a.topic.order_index - b.topic.order_index);

  return (
    <div>
      <PageHeader title="Słówka i zwroty" subtitle="Lista must-have przed egzaminem" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {topics.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Te listy są dostępne tylko dla angielskiego i nie są jeszcze wgrane do bazy.
          </Card>
        )}
        {topics.map(({ topic, totalEntries, masteredEntries, dueEntries }) => (
          <Link key={topic.id} href={`/matura/slownictwo/dzial/${topic.slug}`}>
            <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
              <div className="min-w-0 flex-1">
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription className="mt-0.5">{topic.description}</CardDescription>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${totalEntries > 0 ? (masteredEntries / totalEntries) * 100 : 0}%` }}
                  />
                </div>
                <p className="mt-1 text-xs tabular-nums text-foreground-muted">
                  {masteredEntries}/{totalEntries} opanowanych
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
