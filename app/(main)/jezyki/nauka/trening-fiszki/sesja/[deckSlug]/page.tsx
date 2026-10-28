// ============================================================================
// app/(main)/jezyki/nauka/trening-fiszki/sesja/[deckSlug]/page.tsx
// Sesja treningu dla jednej talii: powtórki z minionym terminem + kolejne słowa
// talii. Bez wołania AI — ćwiczy tylko słowa, które mają już tłumaczenie.
// ============================================================================
import { notFound, redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { buildSkillSession } from "@/lib/lexicon/skill-queries";
import { describeNextDue } from "@/lib/lexicon/next-due";
import { recordRecallAnswer, recordRecallExtraAnswer, finishRecallSession } from "@/lib/lexicon/recall-actions";
import type { LexiconDeck } from "@/lib/types/database";
import { PageHeader } from "@/components/layout/page-header";
import { RecallDrill } from "@/components/lexicon/recall-drill";
import { SessionEmpty } from "@/components/lexicon/session-empty";

export default async function TreningFiszekSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ deckSlug: string }>;
  searchParams: Promise<{ tryb?: string }>;
}) {
  const { deckSlug } = await params;
  const { tryb } = await searchParams;
  const extra = tryb === "dodatkowo";
  const profile = await requireProfile();
  if (profile.target_language !== "en") redirect("/jezyki/nauka");

  const supabase = await createClient();
  const { data: deck } = await supabase
    .from("lexicon_decks")
    .select("*")
    .eq("slug", deckSlug)
    .maybeSingle<LexiconDeck>();
  if (!deck) notFound();

  const session = await buildSkillSession(supabase, profile.id, deck, "lexicon_recall_progress", { extra });

  return (
    <div>
      <PageHeader
        title={deck.title}
        subtitle={
          extra
            ? "Ćwiczenie dodatkowe • terminy bez zmian"
            : `${session.newCount} nowych • ${session.reviewCount} powtórek`
        }
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        {session.entries.length === 0 ? (
          <SessionEmpty
            nextDueText={describeNextDue(session.nextDueAt)}
            canPracticeExtra={session.startedCount > 0}
            extraHref={`/jezyki/nauka/trening-fiszki/sesja/${deck.slug}?tryb=dodatkowo`}
            backHref="/jezyki/nauka/trening-fiszki"
          />
        ) : (
          <RecallDrill
            entries={session.entries}
            backHref="/jezyki/nauka/trening-fiszki"
            recordAnswer={extra ? recordRecallExtraAnswer : recordRecallAnswer}
            finishSession={finishRecallSession}
          />
        )}
      </div>
    </div>
  );
}
