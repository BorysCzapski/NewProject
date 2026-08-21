// ============================================================================
// lib/matura/vocab.ts
// Reads for the matura vocabulary bank: the thematic blocks with the student's
// progress, one block's entries, and the "due today" review queue.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { vocabLevelsFor } from "@/lib/matura/vocab-review";
import type {
  MaturaLanguage,
  MaturaLevel,
  MaturaVocabEntry,
  MaturaVocabProgress,
  MaturaVocabTopic,
} from "@/lib/types/database";

export interface VocabTopicWithProgress {
  topic: MaturaVocabTopic;
  totalEntries: number;
  masteredEntries: number;
  /** Entries with a progress row that is neither new nor mastered. */
  learningEntries: number;
  /** Entries whose next_review_at has passed — what the topic owes today. */
  dueEntries: number;
}

/** Every thematic block for a language, each with the student's counts. */
export async function getVocabTopicsWithProgress(
  supabase: SupabaseClient,
  userId: string,
  language: MaturaLanguage,
  level: MaturaLevel
): Promise<VocabTopicWithProgress[]> {
  const levels = vocabLevelsFor(level);

  const { data: topicRows } = await supabase
    .from("matura_vocab_topics")
    .select("*")
    .eq("language", language)
    .order("order_index");
  const topics = (topicRows ?? []) as MaturaVocabTopic[];
  if (topics.length === 0) return [];

  // One round-trip for entries and one for progress, then joined in memory:
  // the bank is a few thousand rows of short text, and per-topic queries would
  // mean fifteen round-trips to render one index page.
  const { data: entryRows } = await supabase
    .from("matura_vocab_entries")
    .select("id, topic_id")
    .in(
      "topic_id",
      topics.map((topic) => topic.id)
    )
    .in("level", levels);
  const entries = (entryRows ?? []) as Array<{ id: string; topic_id: string }>;

  const { data: progressRows } = await supabase
    .from("matura_vocab_progress")
    .select("entry_id, status, next_review_at")
    .eq("user_id", userId);
  const progressByEntry = new Map(
    ((progressRows ?? []) as Array<Pick<MaturaVocabProgress, "entry_id" | "status" | "next_review_at">>).map(
      (row) => [row.entry_id, row]
    )
  );

  const now = Date.now();
  return topics.map((topic) => {
    const topicEntries = entries.filter((entry) => entry.topic_id === topic.id);
    let mastered = 0;
    let learning = 0;
    let due = 0;
    for (const entry of topicEntries) {
      const progress = progressByEntry.get(entry.id);
      if (!progress) continue;
      if (progress.status === "mastered") mastered++;
      else if (progress.status === "learning") learning++;
      if (progress.next_review_at && new Date(progress.next_review_at).getTime() <= now) due++;
    }
    return {
      topic,
      totalEntries: topicEntries.length,
      masteredEntries: mastered,
      learningEntries: learning,
      dueEntries: due,
    };
  });
}

export async function getVocabTopic(
  supabase: SupabaseClient,
  language: MaturaLanguage,
  slug: string
): Promise<MaturaVocabTopic | null> {
  const { data } = await supabase
    .from("matura_vocab_topics")
    .select("*")
    .eq("language", language)
    .eq("slug", slug)
    .maybeSingle();
  return (data as MaturaVocabTopic | null) ?? null;
}

export async function getVocabEntries(
  supabase: SupabaseClient,
  topicId: string,
  level: MaturaLevel
): Promise<MaturaVocabEntry[]> {
  const { data } = await supabase
    .from("matura_vocab_entries")
    .select("*")
    .eq("topic_id", topicId)
    .in("level", vocabLevelsFor(level))
    .order("level")
    .order("order_index");
  return (data as MaturaVocabEntry[]) ?? [];
}

export async function getVocabProgressForEntries(
  supabase: SupabaseClient,
  userId: string,
  entryIds: string[]
): Promise<Map<string, MaturaVocabProgress>> {
  if (entryIds.length === 0) return new Map();
  const { data } = await supabase
    .from("matura_vocab_progress")
    .select("*")
    .eq("user_id", userId)
    .in("entry_id", entryIds);
  return new Map(((data ?? []) as MaturaVocabProgress[]).map((row) => [row.entry_id, row]));
}

/**
 * A drill batch for one topic: entries the student has never seen or is still
 * learning come first, and already-mastered ones only fill the remainder. An
 * empty result means the topic is genuinely finished for now, which the caller
 * shows as a done state rather than an error.
 */
export async function getTopicDrillBatch(
  supabase: SupabaseClient,
  userId: string,
  topicId: string,
  level: MaturaLevel,
  batchSize = 12
): Promise<MaturaVocabEntry[]> {
  const entries = await getVocabEntries(supabase, topicId, level);
  if (entries.length === 0) return [];
  const progress = await getVocabProgressForEntries(
    supabase,
    userId,
    entries.map((entry) => entry.id)
  );

  const unseen = entries.filter((entry) => !progress.has(entry.id));
  const learning = entries.filter((entry) => progress.get(entry.id)?.status === "learning");
  const mastered = entries.filter((entry) => progress.get(entry.id)?.status === "mastered");

  return [...learning, ...unseen, ...mastered].slice(0, batchSize);
}

export interface DueVocabEntry {
  entry: MaturaVocabEntry;
  topicTitle: string;
}

/**
 * The cross-topic review queue: entries whose interval has elapsed, most
 * overdue first. This is the point of the Leitner boxes — without it the bank
 * can only be revised by walking topics in order.
 */
export async function getDueVocabEntries(
  supabase: SupabaseClient,
  userId: string,
  language: MaturaLanguage,
  level: MaturaLevel,
  limit = 20
): Promise<DueVocabEntry[]> {
  const { data: dueRows } = await supabase
    .from("matura_vocab_progress")
    .select("entry_id, next_review_at")
    .eq("user_id", userId)
    .lte("next_review_at", new Date().toISOString())
    .order("next_review_at")
    // Over-fetch: rows are filtered below by language and level, which the
    // progress table cannot express on its own.
    .limit(limit * 4);
  const due = (dueRows ?? []) as Array<{ entry_id: string; next_review_at: string }>;
  if (due.length === 0) return [];

  const { data: entryRows } = await supabase
    .from("matura_vocab_entries")
    .select("*, matura_vocab_topics!inner(title, language)")
    .in(
      "id",
      due.map((row) => row.entry_id)
    )
    .in("level", vocabLevelsFor(level))
    .eq("matura_vocab_topics.language", language);

  const entries = (entryRows ?? []) as unknown as Array<
    MaturaVocabEntry & { matura_vocab_topics: { title: string; language: MaturaLanguage } }
  >;
  const byId = new Map(entries.map((entry) => [entry.id, entry]));

  // Preserve the most-overdue-first order from the progress query.
  const ordered: DueVocabEntry[] = [];
  for (const row of due) {
    const entry = byId.get(row.entry_id);
    if (!entry) continue;
    const { matura_vocab_topics, ...rest } = entry;
    ordered.push({ entry: rest as MaturaVocabEntry, topicTitle: matura_vocab_topics.title });
    if (ordered.length >= limit) break;
  }
  return ordered;
}
