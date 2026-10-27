// ============================================================================
// lib/lexicon/spelling-queries.ts
// Odczyty dla ćwiczenia "Pisownia" — cienka nakładka na wspólne zapytania w
// lib/lexicon/skill-queries.ts z tabelą lexicon_spelling_progress.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildSkillSession,
  getSkillDecks,
  type SkillDeck,
  type SkillSession,
} from "@/lib/lexicon/skill-queries";
import type { LexiconDeck } from "@/lib/types/database";

const TABLE = "lexicon_spelling_progress";

export type SpellingDeck = SkillDeck;
export type SpellingSession = SkillSession;

export function getSpellingDecks(supabase: SupabaseClient, userId: string): Promise<SpellingDeck[]> {
  return getSkillDecks(supabase, userId, TABLE);
}

export function buildSpellingSession(
  supabase: SupabaseClient,
  userId: string,
  deck: LexiconDeck
): Promise<SpellingSession> {
  return buildSkillSession(supabase, userId, deck, TABLE);
}
