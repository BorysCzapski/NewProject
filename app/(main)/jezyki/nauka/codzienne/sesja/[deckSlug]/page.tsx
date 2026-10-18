// ============================================================================
// app/(main)/jezyki/nauka/codzienne/sesja/[deckSlug]/page.tsx
// Today's session for one deck. Building it may call the AI to write the cards
// for the new entries (cached afterwards), so this page is the slow one.
// ============================================================================
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { buildLexiconSession } from "@/lib/lexicon/queries";
import { recordLexiconAnswer, finishLexiconSession } from "@/lib/lexicon/actions";
import type { LexiconDeck } from "@/lib/types/database";
import { PageHeader } from "@/components/layout/page-header";
import { VocabDrill } from "@/components/matura/vocab-drill";

export default async function CodzienneSessionPage({
  params,
}: {
  params: Promise<{ deckSlug: string }>;
}) {
  const { deckSlug } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: deck } = await supabase
    .from("lexicon_decks")
    .select("*")
    .eq("slug", deckSlug)
    .maybeSingle<LexiconDeck>();
  if (!deck) notFound();

  const session = await buildLexiconSession(supabase, profile.id, deck);

  return (
    <div>
      <PageHeader
        title={deck.title}
        subtitle={`${session.newCount} nowych • ${session.reviewCount} powtórek`}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <VocabDrill
          entries={session.entries}
          boxes={session.boxes}
          backHref="/jezyki/nauka/codzienne"
          accentChars={[]}
          recordAnswer={recordLexiconAnswer}
          finishSession={finishLexiconSession}
        />
      </div>
    </div>
  );
}
