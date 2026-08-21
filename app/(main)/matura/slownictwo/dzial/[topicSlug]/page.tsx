// ============================================================================
// app/(main)/matura/slownictwo/dzial/[topicSlug]/page.tsx
// One thematic block: the whole word list, browsable and filterable, with the
// drill one tap away.
//
// The route sits under dzial/ rather than directly under slownictwo/ so that
// powtorka/ is not a static sibling of a dynamic segment — the same reason the
// nauka routes gained teoria/ and zadanie/.
// ============================================================================
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { getVocabTopic, getVocabEntries, getVocabProgressForEntries } from "@/lib/matura/vocab";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VocabEntryList } from "@/components/matura/vocab-entry-list";
import type { MasteryStatus } from "@/lib/types/database";

export default async function MaturaVocabTopicPage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;

  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const topic = await getVocabTopic(supabase, settings.language, topicSlug);
  if (!topic) notFound();

  const entries = await getVocabEntries(supabase, topic.id, settings.level);
  const progress = await getVocabProgressForEntries(
    supabase,
    profile.id,
    entries.map((entry) => entry.id)
  );
  const statuses = Object.fromEntries(
    [...progress.entries()].map(([id, row]) => [id, row.status])
  ) as Record<string, MasteryStatus>;
  const mastered = entries.filter((entry) => statuses[entry.id] === "mastered").length;

  return (
    <div>
      <PageHeader title={topic.title} subtitle={topic.title_target} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Link
          href="/matura/slownictwo"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie działy
        </Link>

        {topic.description && (
          <p className="text-sm leading-relaxed text-foreground-muted">{topic.description}</p>
        )}

        {entries.length === 0 ? (
          <Card className="text-center text-sm text-foreground-muted">
            Ten dział nie ma jeszcze wgranych słów.
          </Card>
        ) : (
          <>
            <Link href={`/matura/slownictwo/dzial/${topic.slug}/fiszki`}>
              <Button size="lg" className="w-full">
                <Play className="h-4 w-4" />
                Ćwicz ({mastered}/{entries.length} opanowanych)
              </Button>
            </Link>

            <VocabEntryList
              entries={entries}
              statuses={statuses}
              showLevelBadge={settings.level === "rozszerzona"}
            />
          </>
        )}
      </div>
    </div>
  );
}
