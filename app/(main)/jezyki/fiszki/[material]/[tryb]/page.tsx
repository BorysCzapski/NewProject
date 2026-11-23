// ============================================================================
// app/(main)/jezyki/fiszki/[material]/[tryb]/page.tsx
// Menu "Fiszki", krok 3 z 3: uruchomienie wybranego trybu.
//  - Talia + Znaczenia / Pisownia / Trening: sesje z powtórkami już istnieją
//    (nauka/codzienne, nauka/pisownia, nauka/trening-fiszki) — przekierowujemy.
//  - Talia + Fiszki / Trener znaczeń / Łączenie: te trzy trenery znają tylko
//    VocabularyWord, więc hasła talii przechodzą przez lib/fiszki/adapt.ts. To
//    ćwiczenie swobodne: nie zapisuje postępu, więc nie psuje harmonogramu.
//  - Słownictwo wg poziomu: istniejące strony trenerów (te same, co w Ścieżce).
// ============================================================================
import { notFound, redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getDeckBySlug, getPracticeEntries } from "@/lib/fiszki/queries";
import { entryToWord, isPracticeReady } from "@/lib/fiszki/adapt";
import {
  isFiszkiMode,
  LEVEL_MATERIAL,
  MIN_PRACTICE_ENTRIES,
  PRACTICE_BATCH,
  type FiszkiModeId,
} from "@/lib/fiszki/modes";
import { shuffle } from "@/lib/vocabulary/word-utils";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeckFlashcards, DeckMeaning } from "@/components/fiszki/deck-trainers";
import { MatchingGame } from "@/components/matching/matching-game";
import Link from "next/link";

const LEVEL_ROUTES: Partial<Record<FiszkiModeId, string>> = {
  karty: "/jezyki/nauka/fiszki",
  quiz: "/jezyki/nauka/slowka",
  laczenie: "/jezyki/nauka/laczenie",
};

const TITLES: Partial<Record<FiszkiModeId, string>> = {
  karty: "Fiszki",
  quiz: "Trener znaczeń",
  laczenie: "Łączenie tłumaczeń",
};

export default async function FiszkiSessionPage({ params }: { params: Promise<{ material: string; tryb: string }> }) {
  const { material, tryb } = await params;
  if (!isFiszkiMode(tryb)) notFound();

  if (material === LEVEL_MATERIAL) {
    const route = LEVEL_ROUTES[tryb];
    if (!route) notFound();
    redirect(route);
  }

  const profile = await requireProfile();
  if (profile.target_language !== "en") redirect("/jezyki/fiszki");

  const supabase = await createClient();
  const deck = await getDeckBySlug(supabase, material);
  if (!deck) notFound();

  if (tryb === "znaczenia") redirect(`/jezyki/nauka/codzienne/sesja/${deck.slug}`);
  if (tryb === "pisownia") redirect(`/jezyki/nauka/pisownia/sesja/${deck.slug}`);
  if (tryb === "trening") redirect(`/jezyki/nauka/trening-fiszki/sesja/${deck.slug}`);

  const backHref = `/jezyki/fiszki/${deck.slug}`;
  const entries = (await getPracticeEntries(supabase, deck.id)).filter(isPracticeReady);
  const words = entries.map((entry) => entryToWord(entry, deck.title, profile.level));

  if (words.length < MIN_PRACTICE_ENTRIES) {
    return (
      <div>
        <PageHeader title={TITLES[tryb] ?? deck.title} subtitle={deck.title} />
        <div className="mx-auto max-w-lg px-5 py-5">
          <Card className="flex flex-col gap-3 text-center">
            <p className="text-lg font-semibold text-foreground">Za mało słów z tłumaczeniem</p>
            <p className="text-sm leading-relaxed text-foreground-muted">
              Ten tryb ćwiczy słowa, które już mają polskie tłumaczenie. Poznaj najpierw kilka w „Znaczeniach”.
            </p>
            <Link href={backHref} className="w-full">
              <Button className="w-full" variant="outline">
                Wróć do trybów
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const subtitle = deck.title;

  if (tryb === "karty") {
    return (
      <div>
        <PageHeader title="Fiszki" subtitle={subtitle} />
        <div className="mx-auto max-w-lg px-5 py-5">
          <DeckFlashcards words={shuffle(words).slice(0, PRACTICE_BATCH.karty)} backHref={backHref} />
        </div>
      </div>
    );
  }

  if (tryb === "quiz") {
    return (
      <div>
        <PageHeader title="Trener znaczeń" subtitle={subtitle} />
        <div className="mx-auto max-w-lg px-5 py-5">
          <DeckMeaning batch={shuffle(words).slice(0, PRACTICE_BATCH.quiz)} pool={words} backHref={backHref} />
        </div>
      </div>
    );
  }

  // laczenie
  return (
    <div>
      <PageHeader title="Łączenie tłumaczeń" subtitle={subtitle} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <MatchingGame
          pairs={shuffle(words).slice(0, PRACTICE_BATCH.laczenie)}
          language="en"
          level={profile.level}
          category={deck.title}
        />
      </div>
    </div>
  );
}
