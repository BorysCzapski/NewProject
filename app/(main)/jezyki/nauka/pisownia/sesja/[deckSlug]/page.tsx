// ============================================================================
// app/(main)/jezyki/nauka/pisownia/sesja/[deckSlug]/page.tsx
// Sesja pisowni dla jednej talii: powtórki z minionym terminem + kolejne słowa
// talii. Bez wołania AI — ćwiczy tylko słowa, które mają już tłumaczenie.
// ============================================================================
import { notFound, redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { buildSpellingSession } from "@/lib/lexicon/spelling-queries";
import { recordSpellingAnswer, finishSpellingSession } from "@/lib/lexicon/spelling-actions";
import type { LexiconDeck } from "@/lib/types/database";
import { PageHeader } from "@/components/layout/page-header";
import { SpellingDrill } from "@/components/lexicon/spelling-drill";

export default async function PisowniaSessionPage({
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

  const session = await buildSpellingSession(supabase, profile.id, deck);

  return (
    <div>
      <PageHeader title={deck.title} subtitle={`${session.newCount} nowych • ${session.reviewCount} powtórek`} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <SpellingDrill
          entries={session.entries}
          boxes={session.boxes}
          backHref="/jezyki/nauka/pisownia"
          recordAnswer={recordSpellingAnswer}
          finishSession={finishSpellingSession}
        />
      </div>
    </div>
  );
}
