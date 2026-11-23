// ============================================================================
// app/(main)/jezyki/fiszki/[material]/page.tsx
// Menu "Fiszki", krok 2 z 3: wybór TRYBU dla wybranego materiału. Pokazuje
// wszystkie tryby, a niedostępne wygasza z powodem — zamiast ukrywać je i
// zostawiać pytanie "gdzie jest pisownia?".
// ============================================================================
import { notFound, redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getFiszkiDecks } from "@/lib/fiszki/queries";
import { LEVEL_MATERIAL, type MaterialKind } from "@/lib/fiszki/modes";
import { modeStates, type DeckStats } from "@/lib/fiszki/mode-state";
import { PageHeader } from "@/components/layout/page-header";
import { ModeList } from "@/components/fiszki/mode-list";

export default async function FiszkiMaterialPage({ params }: { params: Promise<{ material: string }> }) {
  const { material } = await params;
  const profile = await requireProfile();

  let kind: MaterialKind;
  let title: string;
  let stats: DeckStats | null = null;

  if (material === LEVEL_MATERIAL) {
    kind = "level";
    title = "Słownictwo wg poziomu";
  } else {
    // Talie leksykonu są angielskie.
    if (profile.target_language !== "en") redirect("/jezyki/fiszki");
    const supabase = await createClient();
    const decks = await getFiszkiDecks(supabase, profile.id);
    const overview = decks.find((d) => d.deck.slug === material);
    if (!overview) notFound();
    kind = "deck";
    title = overview.deck.title;
    const skill = (s: typeof overview.spelling) => (s ? { available: s.available, started: s.started, due: s.due } : null);
    stats = {
      meanings: {
        started: overview.meanings.startedEntries,
        total: overview.meanings.totalEntries,
        due: overview.meanings.dueEntries,
      },
      spelling: skill(overview.spelling),
      recall: skill(overview.recall),
    };
  }

  return (
    <div>
      <PageHeader title={title} subtitle="Wybierz tryb nauki" />
      <ModeList material={material} kind={kind} states={modeStates(kind, stats)} />
    </div>
  );
}
