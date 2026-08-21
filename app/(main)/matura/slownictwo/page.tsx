// ============================================================================
// app/(main)/matura/slownictwo/page.tsx
// The vocabulary bank index: every thematic block from the podstawa
// programowa's zakres tematyczny, with what the student has mastered in each,
// plus the cross-block review queue.
//
// Vocabulary sits OUTSIDE /matura/nauka on purpose. The four nauka sections
// are the four parts of the arkusz; vocabulary is not one of them — it is the
// raw material all four draw on, and filing it under any single part would be
// wrong in three of them.
// ============================================================================
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Layers, Sparkles } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { getVocabTopicsWithProgress, getDueVocabEntries } from "@/lib/matura/vocab";
import { MATURA_LANGUAGE_LABELS } from "@/lib/matura/constants";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function MaturaVocabIndexPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const [topics, due] = await Promise.all([
    getVocabTopicsWithProgress(supabase, profile.id, settings.language, settings.level),
    getDueVocabEntries(supabase, profile.id, settings.language, settings.level, 20),
  ]);

  const totalEntries = topics.reduce((sum, item) => sum + item.totalEntries, 0);
  const totalMastered = topics.reduce((sum, item) => sum + item.masteredEntries, 0);

  return (
    <div>
      <PageHeader
        title="Słownictwo"
        subtitle={`${MATURA_LANGUAGE_LABELS[settings.language]} — zakres tematyczny CKE`}
      />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        {topics.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Bank słownictwa dla tego języka nie jest jeszcze wgrany.
          </Card>
        )}

        {topics.length > 0 && (
          <Card className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <CardTitle>Twój postęp</CardTitle>
                <CardDescription className="mt-0.5">
                  {totalMastered} z {totalEntries} słów opanowanych
                </CardDescription>
              </div>
              <Layers className="h-5 w-5 shrink-0 text-primary" />
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${totalEntries > 0 ? (totalMastered / totalEntries) * 100 : 0}%` }}
              />
            </div>
          </Card>
        )}

        {due.length > 0 && (
          <Link href="/matura/slownictwo/powtorka">
            <Card className="flex items-center justify-between gap-3 border-primary/40 bg-primary-soft/40 transition-transform active:scale-[0.99]">
              <div className="min-w-0 flex-1">
                <CardTitle className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                  Powtórka na dziś
                </CardTitle>
                <CardDescription className="mt-0.5">
                  {due.length} {due.length === 1 ? "słowo czeka" : "słów czeka"} na powtórzenie
                </CardDescription>
              </div>
              <Button size="sm">Powtarzaj</Button>
            </Card>
          </Link>
        )}

        {topics.map(({ topic, totalEntries: count, masteredEntries, dueEntries }) => (
          <Link key={topic.id} href={`/matura/slownictwo/dzial/${topic.slug}`}>
            <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
              <div className="min-w-0 flex-1">
                <CardTitle className="line-clamp-1">{topic.title}</CardTitle>
                <CardDescription className="mt-0.5 line-clamp-1 italic">{topic.title_target}</CardDescription>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${count > 0 ? (masteredEntries / count) * 100 : 0}%` }}
                  />
                </div>
                <p className="mt-1 text-xs tabular-nums text-foreground-muted">
                  {masteredEntries}/{count} słów
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
