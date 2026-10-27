// ============================================================================
// lib/lexicon/skill-queries.ts
// Odczyty wspólne dla ćwiczeń leksykonu, które mają WŁASNĄ tabelę postępu
// (Pisownia, Trening fiszek): talie z liczbami (ile słów da się ćwiczyć, ile
// już ćwiczonych, ile do powtórki) oraz sesja dnia. Różni je tylko tabela
// postępu — kształt i harmonogram są te same, więc zapytania są jedne.
//
// Ćwiczyć da się tylko słowa, które mają polskie tłumaczenie — a w taliach
// pisanych przez AI (EF, czasowniki frazowe) tłumaczenie powstaje dopiero, gdy
// słowo trafi do sesji w "Codzienne". Te ćwiczenia NIE wołają AI: mają być
// szybkie i tanie, więc biorą to, co już jest w bazie.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NEW_PER_SESSION, REVIEWS_PER_SESSION } from "@/lib/lexicon/queries";
import type { LexiconDeck, LexiconEntry, LexiconProgress } from "@/lib/types/database";

/** Tabela postępu danej umiejętności (obie mają kształt lexicon_progress). */
export type SkillTable = "lexicon_spelling_progress" | "lexicon_recall_progress";

export interface SkillDeck {
  deck: LexiconDeck;
  /** Hasła z tłumaczeniem — tyle da się naprawdę ćwiczyć. */
  available: number;
  started: number;
  mastered: number;
  due: number;
}

export async function getSkillDecks(
  supabase: SupabaseClient,
  userId: string,
  table: SkillTable
): Promise<SkillDeck[]> {
  const { data: deckRows } = await supabase.from("lexicon_decks").select("*").order("order_index");
  const decks = (deckRows ?? []) as LexiconDeck[];
  if (decks.length === 0) return [];

  const [counts, progressRows] = await Promise.all([
    Promise.all(
      decks.map(async (deck) => {
        const { count } = await supabase
          .from("lexicon_entries")
          .select("id", { count: "exact", head: true })
          .eq("deck_id", deck.id)
          .neq("translation_pl", "");
        return [deck.id, count ?? 0] as const;
      })
    ),
    supabase
      .from(table)
      .select("status, next_review_at, lexicon_entries!inner(deck_id)")
      .eq("user_id", userId),
  ]);
  const availableByDeck = new Map(counts);
  const rows = (progressRows.data ?? []) as unknown as Array<{
    status: LexiconProgress["status"];
    next_review_at: string | null;
    lexicon_entries: { deck_id: string };
  }>;

  const now = Date.now();
  return decks.map((deck) => {
    const own = rows.filter((row) => row.lexicon_entries.deck_id === deck.id);
    return {
      deck,
      available: availableByDeck.get(deck.id) ?? 0,
      started: own.length,
      mastered: own.filter((row) => row.status === "mastered").length,
      due: own.filter((row) => row.next_review_at && new Date(row.next_review_at).getTime() <= now).length,
    };
  });
}

export interface SkillSession {
  entries: LexiconEntry[];
  boxes: Record<string, number>;
  reviewCount: number;
  newCount: number;
}

/** Powtórki, których termin minął (najbardziej zaległe pierwsze), potem kolejne
 * słowa talii, których uczeń jeszcze nie ćwiczył w tej umiejętności. */
export async function buildSkillSession(
  supabase: SupabaseClient,
  userId: string,
  deck: LexiconDeck,
  table: SkillTable
): Promise<SkillSession> {
  const { data: dueRows } = await supabase
    .from(table)
    .select("entry_id, box, next_review_at, lexicon_entries!inner(*)")
    .eq("user_id", userId)
    .eq("lexicon_entries.deck_id", deck.id)
    .lte("next_review_at", new Date().toISOString())
    .order("next_review_at")
    .limit(REVIEWS_PER_SESSION);
  const due = (dueRows ?? []) as unknown as Array<{
    entry_id: string;
    box: number;
    lexicon_entries: LexiconEntry;
  }>;

  const { data: seenRows } = await supabase
    .from(table)
    .select("entry_id, lexicon_entries!inner(deck_id)")
    .eq("user_id", userId)
    .eq("lexicon_entries.deck_id", deck.id);
  const seen = new Set(((seenRows ?? []) as Array<{ entry_id: string }>).map((row) => row.entry_id));

  // Z nadmiarem o liczbę już ćwiczonych, żeby filtr poniżej zawsze znalazł dość.
  const { data: candidateRows } = await supabase
    .from("lexicon_entries")
    .select("*")
    .eq("deck_id", deck.id)
    .neq("translation_pl", "")
    .order("rank")
    .limit(seen.size + NEW_PER_SESSION);
  const fresh = ((candidateRows ?? []) as LexiconEntry[])
    .filter((entry) => !seen.has(entry.id))
    .slice(0, NEW_PER_SESSION);

  const reviewEntries = due.map((row) => row.lexicon_entries);
  const boxes: Record<string, number> = {};
  for (const row of due) boxes[row.entry_id] = row.box;

  return {
    entries: [...reviewEntries, ...fresh],
    boxes,
    reviewCount: reviewEntries.length,
    newCount: fresh.length,
  };
}
