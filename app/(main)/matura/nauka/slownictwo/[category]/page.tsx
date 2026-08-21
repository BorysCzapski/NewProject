// ============================================================================
// app/(main)/matura/nauka/slownictwo/[category]/page.tsx
// Flashcard session for one thematic circle — reuses FlashcardTrainer as-is
// via its onAnswer override prop, same pattern as Podręcznik's fiszki page
// (app/(main)/jezyki/nauka/podrecznik/[id]/dzial/[unitId]/fiszki/page.tsx).
// ============================================================================
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { visibleMaturaLevels } from "@/lib/matura/constants";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription } from "@/components/ui/card";
import { FlashcardTrainer } from "@/components/vocabulary/flashcard-trainer";
import { recordMaturaVocabularyAnswer } from "@/lib/matura/vocabulary-actions";
import type { MaturaVocabularyWord, VocabularyWord } from "@/lib/types/database";

// Note: FlashcardTrainer's session-completion activity log ("10 cards
// reviewed") is hardcoded to Linguo's ACTIVITY_TYPES.FLASHCARDS internally
// — it has no override prop for that, unlike per-card onAnswer. Harmless:
// record_activity's streak fields are global (profiles.current_streak), not
// per-app, so the streak still updates correctly; only the activity_type
// label differs from other Matura actions. Same precedent Podręcznik's own
// fiszki page already accepts (see its header comment) — not a new gap.

const BACK_HREF = "/matura/nauka/slownictwo";

export default async function MaturaSlownictwoCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const { data: words } = await supabase
    .from("matura_vocabulary_words")
    .select("*")
    .in("level", visibleMaturaLevels(settings.level))
    .eq("category", category)
    .order("order_index");
  const wordList = (words ?? []) as MaturaVocabularyWord[];
  if (wordList.length === 0) notFound();

  // FlashcardTrainer is typed against the shared VocabularyWord shape
  // (language/level are UserLevel/TargetLanguage there, unused by the
  // component itself — see its render body) — filled with placeholders here
  // purely to satisfy the type, same technique Podręcznik's fiszki page uses
  // for TextbookWord (which happens to already carry compatible types).
  const trainerWords: VocabularyWord[] = wordList.map((word) => ({
    id: word.id,
    language: "en",
    level: "B1",
    category: word.category,
    word_en: word.word_en,
    translation_pl: word.translation_pl,
    example_sentence: word.example_sentence,
    created_at: word.created_at,
  }));

  return (
    <div>
      <PageHeader title="Fiszki" subtitle={category} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link href={BACK_HREF} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted">
          <ArrowLeft className="h-4 w-4" />
          Kręgi tematyczne
        </Link>

        {wordList.length === 0 ? (
          <Card>
            <CardDescription>Ten krąg tematyczny nie ma jeszcze żadnych słówek.</CardDescription>
          </Card>
        ) : (
          <FlashcardTrainer
            words={trainerWords}
            backHref={BACK_HREF}
            onAnswer={recordMaturaVocabularyAnswer}
          />
        )}
      </div>
    </div>
  );
}
