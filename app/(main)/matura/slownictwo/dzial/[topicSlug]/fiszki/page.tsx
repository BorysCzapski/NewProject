// ============================================================================
// app/(main)/matura/slownictwo/dzial/[topicSlug]/fiszki/page.tsx
// A drill session over one thematic block. The batch prefers words the student
// is still learning, then unseen ones, and only tops up with mastered entries
// — see getTopicDrillBatch.
// ============================================================================
import { redirect, notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { getVocabTopic, getTopicDrillBatch, getVocabProgressForEntries } from "@/lib/matura/vocab";
import { langInfo } from "@/lib/languages";
import { PageHeader } from "@/components/layout/page-header";
import { VocabDrill } from "@/components/matura/vocab-drill";

export default async function MaturaVocabDrillPage({
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

  const entries = await getTopicDrillBatch(supabase, profile.id, topic.id, settings.level);
  const progress = await getVocabProgressForEntries(
    supabase,
    profile.id,
    entries.map((entry) => entry.id)
  );
  const boxes = Object.fromEntries([...progress.entries()].map(([id, row]) => [id, row.box]));

  return (
    <div>
      <PageHeader title={topic.title} subtitle="Ćwiczenie słownictwa" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <VocabDrill
          entries={entries}
          boxes={boxes}
          backHref={`/matura/slownictwo/dzial/${topic.slug}`}
          accentChars={langInfo(settings.language).specialChars}
        />
      </div>
    </div>
  );
}
