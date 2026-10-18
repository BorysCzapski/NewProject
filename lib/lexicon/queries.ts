// ============================================================================
// lib/lexicon/queries.ts
// Reads for the daily lexicon: decks with the student's progress, and the two
// things a session is made of — entries that are DUE for review and NEW entries
// to introduce (next in frequency order).
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { enrichEntries, needsEnrichment } from "@/lib/lexicon/enrich";
import type { LexiconDeck, LexiconEntry, LexiconProgress } from "@/lib/types/database";

/** New entries introduced per daily session. Small on purpose: ten new words a
 * day plus their reviews is a habit; fifty is a chore that gets abandoned. */
export const NEW_PER_SESSION = 10;
/** Reviews pulled into one session, most overdue first. */
export const REVIEWS_PER_SESSION = 20;

export interface DeckWithProgress {
  deck: LexiconDeck;
  totalEntries: number;
  /** Entries with a progress row (introduced at least once). */
  startedEntries: number;
  masteredEntries: number;
  dueEntries: number;
}

export async function getDecksWithProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<DeckWithProgress[]> {
  const { data: deckRows } = await supabase.from("lexicon_decks").select("*").order("order_index");
  const decks = (deckRows ?? []) as LexiconDeck[];
  if (decks.length === 0) return [];

  const [counts, progressRows] = await Promise.all([
    Promise.all(
      decks.map(async (deck) => {
        const { count } = await supabase
          .from("lexicon_entries")
          .select("id", { count: "exact", head: true })
          .eq("deck_id", deck.id);
        return [deck.id, count ?? 0] as const;
      })
    ),
    // Progress rows joined to their deck, so counts split per deck without
    // fetching the whole entry table.
    supabase
      .from("lexicon_progress")
      .select("status, next_review_at, lexicon_entries!inner(deck_id)")
      .eq("user_id", userId),
  ]);
  const totals = new Map(counts);
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
      totalEntries: totals.get(deck.id) ?? 0,
      startedEntries: own.length,
      masteredEntries: own.filter((row) => row.status === "mastered").length,
      dueEntries: own.filter((row) => row.next_review_at && new Date(row.next_review_at).getTime() <= now).length,
    };
  });
}

export interface LexiconSession {
  entries: LexiconEntry[];
  /** entry id -> current Leitner box; absent means never seen. */
  boxes: Record<string, number>;
  reviewCount: number;
  newCount: number;
}

/**
 * Builds today's session for one deck: due reviews first (they are the whole
 * point of spaced repetition), then the next unseen entries in rank order.
 *
 * Entries the AI could not fill in are dropped, so a model outage degrades to
 * "fewer new words today" instead of broken cards.
 */
export async function buildLexiconSession(
  supabase: SupabaseClient,
  userId: string,
  deck: LexiconDeck
): Promise<LexiconSession> {
  const { data: dueRows } = await supabase
    .from("lexicon_progress")
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

  // Next unseen entries: everything above the highest rank this student has
  // started would skip words they dropped; instead take the lowest-ranked
  // entries with no progress row.
  const { data: seenRows } = await supabase
    .from("lexicon_progress")
    .select("entry_id, lexicon_entries!inner(deck_id)")
    .eq("user_id", userId)
    .eq("lexicon_entries.deck_id", deck.id);
  const seen = new Set(((seenRows ?? []) as Array<{ entry_id: string }>).map((row) => row.entry_id));

  // Over-fetch by the number seen so the filter below always finds enough.
  const { data: candidateRows } = await supabase
    .from("lexicon_entries")
    .select("*")
    .eq("deck_id", deck.id)
    .order("rank")
    .limit(seen.size + NEW_PER_SESSION);
  const fresh = ((candidateRows ?? []) as LexiconEntry[])
    .filter((entry) => !seen.has(entry.id))
    .slice(0, NEW_PER_SESSION);

  const enrichedFresh = (await enrichEntries(deck, fresh)).filter((entry) => !needsEnrichment(entry));
  const reviewEntries = due.map((row) => row.lexicon_entries).filter((entry) => !needsEnrichment(entry));

  const boxes: Record<string, number> = {};
  for (const row of due) boxes[row.entry_id] = row.box;

  return {
    entries: [...reviewEntries, ...enrichedFresh],
    boxes,
    reviewCount: reviewEntries.length,
    newCount: enrichedFresh.length,
  };
}
