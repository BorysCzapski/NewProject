// ============================================================================
// app/(main)/jezyki/nauka/trening-fiszki/sesja/[deckSlug]/page.tsx
// Sesja treningu dla jednej talii: powtórki z minionym terminem + kolejne słowa
// talii. Bez wołania AI — ćwiczy tylko słowa, które mają już tłumaczenie.
// ============================================================================
import { notFound, redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { buildSkillSession } from "@/lib/lexicon/skill-queries";
import { recordRecallAnswer, finishRecallSession } from "@/lib/lexicon/recall-actions";
import type { LexiconDeck } from "@/lib/types/database";
import { PageHeader } from "@/components/layout/page-header";
import { RecallDrill } from "@/components/lexicon/recall-drill";

export default async function TreningFiszekSessionPage({
  params,
}: {
  params: Promise<{ deckSlug: string }>;
}) {
  const { deckSlug } = await params;
  const profile = await requireProfile();
  if (profile.target_language !== "en") redirect("/jezyki/nauka");

  const supabase = await createClient();
  const { data: deck } = await supabase
    .from("lexicon_decks")
    .select("*")
    .eq("slug", deckSlug)
    .maybeSingle<LexiconDeck>();
  if (!deck) notFound();

  const session = await buildSkillSession(supabase, profile.id, deck, "lexicon_recall_progress");

  return (
    <div>
      <PageHeader title={deck.title} subtitle={`${session.newCount} nowych • ${session.reviewCount} powtórek`} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <RecallDrill
          entries={session.entries}
          backHref="/jezyki/nauka/trening-fiszki"
          recordAnswer={recordRecallAnswer}
          finishSession={finishRecallSession}
        />
      </div>
    </div>
  );
}
