// ============================================================================
// app/(main)/jezyki/nauka/podrecznik/[id]/dzial/[unitId]/fiszki/page.tsx
// Flashcards for one unit's words — reuses the global FlashcardTrainer with
// onAnswer overridden to update textbook_words directly (these words aren't
// rows in vocabulary_words, so the default recordVocabularyAnswer's FK
// wouldn't resolve).
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription } from "@/components/ui/card";
import { FlashcardTrainer } from "@/components/vocabulary/flashcard-trainer";
import { recordTextbookWordAnswer } from "@/lib/textbook/actions";
import type { TextbookUnit, TextbookWord, VocabularyWord } from "@/lib/types/database";

export default async function TextbookUnitFlashcardsPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id, unitId } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: unit } = await supabase
    .from("textbook_units")
    .select("*")
    .eq("id", unitId)
    .eq("textbook_id", id)
    .eq("user_id", profile.id)
    .maybeSingle();
  if (!unit) notFound();

  const { data: words } = await supabase
    .from("textbook_words")
    .select("*")
    .eq("unit_id", unitId)
    .order("order_index");
  const wordList: VocabularyWord[] = ((words ?? []) as TextbookWord[]).map((word) => ({
    id: word.id,
    language: word.language,
    level: word.level,
    category: word.category,
    word_en: word.word_en,
    translation_pl: word.translation_pl,
    example_sentence: word.example_sentence,
    created_at: word.created_at,
  }));

  const unitHref = `/jezyki/nauka/podrecznik/${id}/dzial/${unitId}`;

  return (
    <div>
      <PageHeader title="Fiszki" subtitle={(unit as TextbookUnit).title} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href={unitHref}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Dział
        </Link>

        {wordList.length === 0 ? (
          <Card>
            <CardDescription>Ten dział nie ma jeszcze żadnych słówek.</CardDescription>
          </Card>
        ) : (
          <FlashcardTrainer words={wordList} backHref={unitHref} onAnswer={recordTextbookWordAnswer} />
        )}
      </div>
    </div>
  );
}
