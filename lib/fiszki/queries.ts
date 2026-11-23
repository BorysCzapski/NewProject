// ============================================================================
// lib/fiszki/queries.ts
// Odczyty dla menu "Fiszki": przegląd talii (postęp w "Znaczeniach", w Pisowni i
// w Treningu fiszek naraz) oraz hasła z tłumaczeniem do trybów swobodnych.
// Składa istniejące zapytania leksykonu — niczego nie liczy po swojemu, więc
// liczby w menu zgadzają się z tym, co pokażą same tryby.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getDecksWithProgress, type DeckWithProgress } from "@/lib/lexicon/queries";
import { getSkillDecks, type SkillDeck } from "@/lib/lexicon/skill-queries";
import type { LexiconDeck, LexiconEntry } from "@/lib/types/database";

export interface FiszkiDeckOverview {
  deck: LexiconDeck;
  /** Postęp w "Znaczeniach" (Codzienne): pudełka Leitnera na całej talii. */
  meanings: DeckWithProgress;
  /** Pisownia i Trening fiszek mają własny postęp i własną liczbę gotowych słów. */
  spelling: SkillDeck | null;
  recall: SkillDeck | null;
}

export async function getFiszkiDecks(supabase: SupabaseClient, userId: string): Promise<FiszkiDeckOverview[]> {
  const [meanings, spelling, recall] = await Promise.all([
    getDecksWithProgress(supabase, userId),
    getSkillDecks(supabase, userId, "lexicon_spelling_progress"),
    getSkillDecks(supabase, userId, "lexicon_recall_progress"),
  ]);
  const spellingById = new Map(spelling.map((s) => [s.deck.id, s]));
  const recallById = new Map(recall.map((r) => [r.deck.id, r]));
  return meanings.map((m) => ({
    deck: m.deck,
    meanings: m,
    spelling: spellingById.get(m.deck.id) ?? null,
    recall: recallById.get(m.deck.id) ?? null,
  }));
}

export async function getDeckBySlug(supabase: SupabaseClient, slug: string): Promise<LexiconDeck | null> {
  const { data } = await supabase.from("lexicon_decks").select("*").eq("slug", slug).maybeSingle();
  return (data as LexiconDeck | null) ?? null;
}

/** Hasła talii, które mają polskie tłumaczenie — tylko takie nadają się do trybów swobodnych. */
export async function getPracticeEntries(supabase: SupabaseClient, deckId: string): Promise<LexiconEntry[]> {
  const { data } = await supabase
    .from("lexicon_entries")
    .select("*")
    .eq("deck_id", deckId)
    .neq("translation_pl", "")
    .order("rank");
  return (data ?? []) as LexiconEntry[];
}
