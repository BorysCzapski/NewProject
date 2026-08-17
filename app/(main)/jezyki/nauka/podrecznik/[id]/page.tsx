// ============================================================================
// app/(main)/jezyki/nauka/podrecznik/[id]/page.tsx
// Textbook detail: units ("działy") with word counts, and every grammar
// topic found anywhere in the book (tagged with its unit, so they don't need
// their own per-unit page to be reachable).
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Layers, GraduationCap } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteTextbookButton } from "@/components/textbook/delete-textbook-button";
import type { Textbook, TextbookUnit, TextbookGrammarTopic } from "@/lib/types/database";

export default async function TextbookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: textbook } = await supabase.from("textbooks").select("*").eq("id", id).maybeSingle();
  if (!textbook) notFound();
  const isOwner = (textbook as Textbook).user_id === profile.id;

  const [{ data: units }, { data: words }, { data: grammarTopics }] = await Promise.all([
    supabase.from("textbook_units").select("*").eq("textbook_id", id).order("order_index"),
    supabase.from("textbook_words").select("id, unit_id").eq("textbook_id", id),
    supabase
      .from("textbook_grammar_topics")
      .select("*")
      .eq("textbook_id", id)
      .order("order_index"),
  ]);

  const unitList = (units ?? []) as TextbookUnit[];
  const topicList = (grammarTopics ?? []) as TextbookGrammarTopic[];
  const unitTitleById = new Map(unitList.map((unit) => [unit.id, unit.title]));

  const wordCountByUnit = new Map<string, number>();
  for (const word of words ?? []) {
    wordCountByUnit.set(word.unit_id, (wordCountByUnit.get(word.unit_id) ?? 0) + 1);
  }

  return (
    <div>
      <PageHeader title={(textbook as Textbook).title} subtitle="Angielski szkoła" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href="/jezyki/nauka/podrecznik"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Podręczniki
        </Link>

        <h2 className="mb-3 text-sm font-semibold text-foreground-muted">Działy</h2>
        {unitList.length === 0 ? (
          <Card className="mb-6">
            <CardDescription>Ten podręcznik nie ma jeszcze żadnych działów ze słówkami.</CardDescription>
          </Card>
        ) : (
          <div className="mb-6 flex flex-col gap-3">
            {unitList.map((unit) => (
              <Link key={unit.id} href={`/jezyki/nauka/podrecznik/${id}/dzial/${unit.id}`}>
                <Card className="flex items-center gap-4 active:scale-[0.98] transition-transform">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Layers className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <CardTitle className="truncate">{unit.title}</CardTitle>
                    <CardDescription className="mt-0.5">
                      {wordCountByUnit.get(unit.id) ?? 0} słówek
                    </CardDescription>
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {topicList.length > 0 && (
          <>
            <h2 className="mb-3 text-sm font-semibold text-foreground-muted">Gramatyka</h2>
            <div className="mb-6 flex flex-col gap-3">
              {topicList.map((topic) => (
                <Link key={topic.id} href={`/jezyki/nauka/podrecznik/${id}/gramatyka/${topic.id}`}>
                  <Card className="flex items-center gap-4 active:scale-[0.98] transition-transform">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <GraduationCap className="h-6 w-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <CardTitle className="truncate">{topic.title}</CardTitle>
                      {topic.unit_id && unitTitleById.has(topic.unit_id) && (
                        <Badge className="mt-1">{unitTitleById.get(topic.unit_id)}</Badge>
                      )}
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}

        {isOwner && <DeleteTextbookButton textbookId={id} />}
      </div>
    </div>
  );
}
