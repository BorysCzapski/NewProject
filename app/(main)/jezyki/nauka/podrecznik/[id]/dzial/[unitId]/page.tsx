// ============================================================================
// app/(main)/jezyki/nauka/podrecznik/[id]/dzial/[unitId]/page.tsx
// Unit detail: the word list (reference table) plus links into the two
// study modes — flashcards and fill-blank sentence exercises.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Layers, PenLine } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { TextbookUnit, TextbookWord } from "@/lib/types/database";

export default async function TextbookUnitPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id, unitId } = await params;
  await requireProfile();
  const supabase = await createClient();

  const { data: unit } = await supabase
    .from("textbook_units")
    .select("*")
    .eq("id", unitId)
    .eq("textbook_id", id)
    .maybeSingle();
  if (!unit) notFound();

  const { data: words } = await supabase
    .from("textbook_words")
    .select("*")
    .eq("unit_id", unitId)
    .order("order_index");
  const wordList = (words ?? []) as TextbookWord[];

  return (
    <div>
      <PageHeader title={(unit as TextbookUnit).title} subtitle="Dział" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href={`/jezyki/nauka/podrecznik/${id}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Podręcznik
        </Link>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <Link href={`/jezyki/nauka/podrecznik/${id}/dzial/${unitId}/fiszki`}>
            <Card className="flex flex-col items-center gap-2 py-6 text-center active:scale-[0.98] transition-transform">
              <Layers className="h-6 w-6 text-primary" />
              <CardTitle>Fiszki</CardTitle>
            </Card>
          </Link>
          <Link href={`/jezyki/nauka/podrecznik/${id}/dzial/${unitId}/cwiczenia`}>
            <Card className="flex flex-col items-center gap-2 py-6 text-center active:scale-[0.98] transition-transform">
              <PenLine className="h-6 w-6 text-primary" />
              <CardTitle>Uzupełnij zdania</CardTitle>
            </Card>
          </Link>
        </div>

        <h2 className="mb-3 text-sm font-semibold text-foreground-muted">Słówka ({wordList.length})</h2>
        {wordList.length === 0 ? (
          <Card>
            <CardDescription>Ten dział nie ma jeszcze żadnych słówek.</CardDescription>
          </Card>
        ) : (
          <Card>
            <div className="flex flex-col divide-y divide-border">
              {wordList.map((word) => (
                <div key={word.id} className="flex items-baseline justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="font-medium text-foreground">{word.word_en}</span>
                  <span className="text-right text-sm text-foreground-muted">{word.translation_pl}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
