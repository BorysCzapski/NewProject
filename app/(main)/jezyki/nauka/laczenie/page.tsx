// ============================================================================
// app/(main)/nauka/laczenie/page.tsx
// "Łączenie tłumaczeń" entry point: fetches a level- + language-appropriate
// set of word/translation pairs on the server, then hands off to the game.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMatchingPairs } from "@/lib/vocabulary/words";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { MatchingGame } from "@/components/matching/matching-game";

export default async function LaczeniePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const profile = await requireProfile();
  const supabase = await createClient();
  const pairs = await getMatchingPairs(supabase, profile.target_language, profile.level, 6, category);

  return (
    <div>
      <PageHeader
        title="Łączenie tłumaczeń"
        subtitle={category ? `Kategoria: ${category}` : "Połącz słowa z ich tłumaczeniami"}
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        {pairs.length < 2 ? (
          <Card className="flex flex-col items-center gap-2 py-10 text-center">
            <CardTitle>Za mało słówek do gry</CardTitle>
            <CardDescription>
              Nie znaleziono jeszcze wystarczającej liczby słówek dla poziomu {profile.level}. Wróć tu później.
            </CardDescription>
          </Card>
        ) : (
          <MatchingGame
            pairs={pairs}
            language={profile.target_language}
            level={profile.level}
            category={category ?? null}
          />
        )}
      </div>
    </div>
  );
}
