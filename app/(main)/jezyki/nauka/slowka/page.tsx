// ============================================================================
// app/(main)/nauka/slowka/page.tsx
// Meaning trainer entry point: fetches a level-appropriate word batch (plus
// the full-level pool for quiz distractors) on the server, then hands off to
// the client-driven quiz/typing session.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMeaningTrainerBatch } from "@/lib/vocabulary/words";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { MeaningTrainer } from "@/components/vocabulary/meaning-trainer";

export default async function SlowkaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; stage?: string }>;
}) {
  const { category, stage } = await searchParams;
  const profile = await requireProfile();
  const supabase = await createClient();
  const { batch, pool } = await getMeaningTrainerBatch(
    supabase,
    profile.id,
    profile.target_language,
    profile.level,
    10,
    category
  );
  const backHref = stage ? `/jezyki/nauka/sciezka/${encodeURIComponent(stage)}` : undefined;

  return (
    <div>
      <PageHeader
        title="Trener znaczeń"
        subtitle={category ? `Kategoria: ${category}` : "Quiz EN↔PL i wpisywanie tłumaczeń"}
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        {batch.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 py-10 text-center">
            <CardTitle>Brak słówek dla Twojego poziomu</CardTitle>
            <CardDescription>
              Nie znaleziono jeszcze słówek dla poziomu {profile.level}. Wróć tu później.
            </CardDescription>
          </Card>
        ) : (
          <MeaningTrainer
            batch={batch}
            pool={pool}
            backHref={backHref}
            language={profile.target_language}
          />
        )}
      </div>
    </div>
  );
}
