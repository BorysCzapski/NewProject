// ============================================================================
// lib/lexicon/enrich.ts
// Fills in Polish translations and example sentences for lexicon entries.
//
// The source lists (EF top 3000, UMN phrasal verbs) are bare English headwords,
// so a card has nothing to show until the AI has written it. Enrichment runs on
// demand for the handful of entries a session is about to teach and is cached in
// lexicon_entries, so each word is paid for once for all students.
//
// Writes go through the service-role client: lexicon_entries is shared content,
// admin-write under RLS, and a student's session must be able to complete it.
// ============================================================================
import "server-only";
import { askAIForJSON } from "@/lib/ai";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LexiconDeck, LexiconEntry } from "@/lib/types/database";

interface EnrichedCard {
  term: string;
  part_of_speech: string;
  translation_pl: string;
  example: string;
  example_pl: string;
  note: string;
}

const SYSTEM = `Jesteś lektorem angielskiego dla polskich uczniów. Dla każdego podanego hasła przygotuj fiszkę:
- translation_pl: najczęstsze znaczenie po polsku, krótko (1-3 odpowiedniki, rozdzielone przecinkami). Gdy hasło ma kilka różnych znaczeń, podaj dwa najważniejsze.
- part_of_speech: po polsku (rzeczownik, czasownik, przymiotnik, przysłówek, przyimek, spójnik, zaimek, zwrot, czasownik frazowy...).
- example: naturalne, krótkie zdanie po angielsku (maks. 12 słów), poziom A2-B1, użyte w codziennej sytuacji.
- example_pl: tłumaczenie tego zdania na polski.
- note: jedna krótka wskazówka po polsku (kolokacja, nieregularna forma, fałszywy przyjaciel, nieoczywiste użycie) albo pusty tekst, gdy nie ma nic wartego uwagi.
Zwróć DOKŁADNIE tyle fiszek, ile haseł, i skopiuj pole term bez zmian.`;

const SCHEMA = {
  cards: {
    type: "array",
    items: {
      type: "object",
      properties: {
        term: { type: "string" },
        part_of_speech: { type: "string" },
        translation_pl: { type: "string" },
        example: { type: "string" },
        example_pl: { type: "string" },
        note: { type: "string" },
      },
      required: ["term", "part_of_speech", "translation_pl", "example", "example_pl", "note"],
    },
  },
};

/** Entries the AI has not filled in yet — empty translation is the marker. */
export function needsEnrichment(entry: LexiconEntry): boolean {
  return !entry.enriched_at || !entry.translation_pl.trim();
}

/**
 * Enriches the given entries in ONE model call and persists the result.
 * Returns the entries with the new fields applied. On an AI failure it returns
 * the entries unchanged: the caller drops un-enriched cards from the session
 * rather than showing a card with no translation.
 */
export async function enrichEntries(deck: LexiconDeck, entries: LexiconEntry[]): Promise<LexiconEntry[]> {
  const pending = entries.filter(needsEnrichment);
  if (pending.length === 0) return entries;

  const kindHint =
    deck.kind === "phrase"
      ? "To są angielskie czasowniki frazowe/zwroty — przykład musi użyć dokładnie tego zwrotu."
      : "To są pojedyncze angielskie słowa z listy najczęstszych.";

  let cards: EnrichedCard[];
  try {
    const result = await askAIForJSON<{ cards: EnrichedCard[] }>({
      system: SYSTEM,
      prompt: `${kindHint}\nHasła:\n${pending.map((e) => `- ${e.term}`).join("\n")}`,
      schema: SCHEMA,
      maxTokens: 400 + pending.length * 220,
    });
    cards = result.cards ?? [];
  } catch (error) {
    console.error("[lexicon] enrichment failed:", error);
    return entries;
  }

  const byTerm = new Map(cards.map((card) => [card.term.trim().toLowerCase(), card]));
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const updated = new Map<string, LexiconEntry>();

  await Promise.all(
    pending.map(async (entry) => {
      const card = byTerm.get(entry.term.trim().toLowerCase());
      // A card without a translation or example is worthless in the drill —
      // leave the entry pending so a later session retries it.
      if (!card || !card.translation_pl?.trim() || !card.example?.trim()) return;

      const patch = {
        part_of_speech: card.part_of_speech.trim(),
        translation_pl: card.translation_pl.trim(),
        example: card.example.trim(),
        example_pl: card.example_pl.trim(),
        note: card.note.trim(),
        enriched_at: now,
      };
      const { error } = await admin.from("lexicon_entries").update(patch).eq("id", entry.id);
      if (error) {
        console.error("[lexicon] saving enrichment failed:", error);
        return;
      }
      updated.set(entry.id, { ...entry, ...patch });
    })
  );

  return entries.map((entry) => updated.get(entry.id) ?? entry);
}
