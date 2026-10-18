// ============================================================================
// app/(main)/matura/nauka/page.tsx
// "Nauka" hub: the 4 exam parts for the student's chosen język + poziom, plus
// the vocabulary bank. Redirects to the dashboard (which shows the picker) if
// nothing is set yet.
// ============================================================================
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookA, ChevronRight, Star } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { getSectionsWithProgress } from "@/lib/matura/progress";
import { getVocabTopicsWithProgress } from "@/lib/matura/vocab";
import { MATURA_FEATURED_VOCAB_SLUGS } from "@/lib/matura/constants";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { SectionList } from "@/components/matura/section-list";

export default async function MaturaNaukaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const [sections, vocabTopics] = await Promise.all([
    getSectionsWithProgress(supabase, profile.id, settings.language, settings.level),
    getVocabTopicsWithProgress(supabase, profile.id, settings.language, settings.level),
  ]);

  const isFeatured = (slug: string) => (MATURA_FEATURED_VOCAB_SLUGS as readonly string[]).includes(slug);
  const featured = vocabTopics.filter((item) => isFeatured(item.topic.slug));
  const thematic = vocabTopics.filter((item) => !isFeatured(item.topic.slug));

  const sum = (items: typeof vocabTopics, key: "totalEntries" | "masteredEntries" | "dueEntries") =>
    items.reduce((total, item) => total + item[key], 0);
  const vocabTotal = sum(thematic, "totalEntries");
  const vocabMastered = sum(thematic, "masteredEntries");
  const vocabDue = sum(thematic, "dueEntries");
  const featuredTotal = sum(featured, "totalEntries");
  const featuredMastered = sum(featured, "masteredEntries");
  const featuredDue = sum(featured, "dueEntries");

  return (
    <div>
      <PageHeader title="Nauka" subtitle="Zacznij od teorii, potem ćwicz zadania z egzaminu" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <h2 className="text-sm font-semibold text-foreground-muted">Części egzaminu</h2>
        <SectionList sections={sections} />

        {/* Vocabulary is not one of the four exam parts — it feeds all of them
            — so it gets its own entry point rather than a fifth section row.
            The theory itself lives inside each section, not here: it is scoped
            to a part of the exam, and a student revising czytanie should not
            have to hunt for reading strategy in a separate tree. */}
        {featuredTotal > 0 && (
          <Link href="/matura/slowka-zwroty">
            <Card className="flex items-center justify-between gap-3 border-primary/40 bg-primary-soft/40 transition-transform active:scale-[0.99]">
              <div className="min-w-0 flex-1">
                <CardTitle className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 shrink-0 text-primary" />
                  Słówka i zwroty
                </CardTitle>
                <CardDescription className="mt-0.5">
                  100 najważniejszych słówek i phrasal verbs • {featuredMastered}/{featuredTotal} opanowanych
                  {featuredDue > 0 && ` • ${featuredDue} do powtórki`}
                </CardDescription>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
            </Card>
          </Link>
        )}

        {vocabTotal > 0 && (
          <Link href="/matura/slownictwo">
            <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
              <div className="min-w-0 flex-1">
                <CardTitle className="flex items-center gap-1.5">
                  <BookA className="h-4 w-4 shrink-0 text-primary" />
                  Słownictwo
                </CardTitle>
                <CardDescription className="mt-0.5">
                  {vocabMastered}/{vocabTotal} słów z zakresu tematycznego CKE
                  {vocabDue > 0 && ` • ${vocabDue} do powtórki`}
                </CardDescription>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
