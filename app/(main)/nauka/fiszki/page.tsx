// ============================================================================
// app/(main)/nauka/fiszki/page.tsx
// Flashcards trainer entry point: fetches a level-appropriate word batch on
// the server, then hands it off to the client-driven flip-card session.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getFlashcardBatch } from "@/lib/vocabulary/words";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { FlashcardTrainer } from "@/components/vocabulary/flashcard-trainer";

export default async function FiszkiPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const profile = await requireProfile();
  const supabase = await createClient();
  const words = await getFlashcardBatch(supabase, profile.id, profile.target_language, profile.level, 15, category);

  return (
    <div>
      <PageHeader
        title="Fiszki"
        subtitle={category ? `Kategoria: ${category}` : "Powtarzaj słówka aż do opanowania"}
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        {words.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 py-10 text-center">
            <CardTitle>Brak słówek dla Twojego poziomu</CardTitle>
            <CardDescription>
              Nie znaleziono jeszcze słówek dla poziomu {profile.level}. Wróć tu później.
            </CardDescription>
          </Card>
        ) : (
          <FlashcardTrainer words={words} />
        )}
      </div>
    </div>
  );
}
