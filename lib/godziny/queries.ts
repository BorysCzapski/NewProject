// ============================================================================
// lib/godziny/queries.ts
// Strona odczytu mini-aplikacji "Godziny": lista tematów, stream ostatnich
// wpisów, podsumowanie „dziś / tydzień / miesiąc" i historia pogrupowana po
// dniach, tygodniach albo miesiącach.
//
// Sumowanie robimy w TypeScripcie, a nie w SQL-u (żadnych widoków ani RPC).
// To jest dziennik jednej osoby — nawet przy kilku wpisach dziennie przez
// kilka lat mówimy o tysiącach wierszy z dwiema kolumnami, więc jedno proste
// zapytanie plus pętla są szybsze w utrzymaniu niż funkcja w bazie, którą
// trzeba wersjonować osobną migracją.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  addDays,
  bucketStart,
  monthStart,
  todayKey,
  weekStart,
  type Grouping,
} from "@/lib/godziny/format";
import type { StudySession, StudyTopic } from "@/lib/types/database";

/** Wpis z rozwiniętym tematem — lista nigdy nie pokazuje samego topic_id. */
export interface StudyEntry extends StudySession {
  topic_name: string;
  topic_category: string | null;
  topic_color_index: number;
  topic_is_archived: boolean;
}

const ENTRY_SELECT = "*, study_topics(name, category, color_index, is_archived)";

interface JoinedTopic {
  name: string;
  category: string | null;
  color_index: number;
  is_archived: boolean;
}

function toEntry(row: Record<string, unknown>): StudyEntry {
  const topic = row.study_topics as JoinedTopic | null;
  return {
    ...(row as unknown as StudySession),
    topic_name: topic?.name ?? "Temat usunięty",
    topic_category: topic?.category ?? null,
    topic_color_index: topic?.color_index ?? 0,
    topic_is_archived: topic?.is_archived ?? false,
  };
}

// ---------------------------------------------------------------------------
// Tematy
// ---------------------------------------------------------------------------

export async function listTopics(
  supabase: SupabaseClient,
  userId: string,
  { includeArchived = false }: { includeArchived?: boolean } = {}
): Promise<StudyTopic[]> {
  let query = supabase
    .from("study_topics")
    .select("*")
    .eq("user_id", userId)
    .order("category", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });
  if (!includeArchived) query = query.eq("is_archived", false);

  const { data, error } = await query;
  if (error) {
    console.error("[godziny] listTopics failed:", error);
    return [];
  }
  return (data ?? []) as StudyTopic[];
}

/** Ile wpisów korzysta z danego tematu — decyduje, czy wolno go skasować. */
export async function countEntriesForTopic(
  supabase: SupabaseClient,
  userId: string,
  topicId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("study_sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("topic_id", topicId);
  if (error) {
    console.error("[godziny] countEntriesForTopic failed:", error);
    // Zwracamy „coś tam jest", żeby w razie błędu kasowanie zostało
    // zablokowane, a nie przepuszczone po cichu.
    return 1;
  }
  return count ?? 0;
}

/** Ile minut łącznie przypada na każdy temat — do listy tematów i legendy. */
export async function minutesByTopic(
  supabase: SupabaseClient,
  userId: string
): Promise<Map<string, { minutes: number; entries: number }>> {
  const { data, error } = await supabase
    .from("study_sessions")
    .select("topic_id, duration_minutes")
    .eq("user_id", userId);

  const totals = new Map<string, { minutes: number; entries: number }>();
  if (error) {
    console.error("[godziny] minutesByTopic failed:", error);
    return totals;
  }
  for (const row of data ?? []) {
    const key = row.topic_id as string;
    const current = totals.get(key) ?? { minutes: 0, entries: 0 };
    current.minutes += row.duration_minutes as number;
    current.entries += 1;
    totals.set(key, current);
  }
  return totals;
}

// ---------------------------------------------------------------------------
// Wpisy
// ---------------------------------------------------------------------------

export interface EntryFilters {
  limit?: number;
  /** Zakres domknięty obustronnie, w kluczach "YYYY-MM-DD". */
  from?: string;
  to?: string;
  topicId?: string;
}

export async function listEntries(
  supabase: SupabaseClient,
  userId: string,
  filters: EntryFilters = {}
): Promise<StudyEntry[]> {
  let query = supabase
    .from("study_sessions")
    .select(ENTRY_SELECT)
    .eq("user_id", userId)
    .order("study_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.from) query = query.gte("study_date", filters.from);
  if (filters.to) query = query.lte("study_date", filters.to);
  if (filters.topicId) query = query.eq("topic_id", filters.topicId);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) {
    console.error("[godziny] listEntries failed:", error);
    return [];
  }
  return (data ?? []).map((row) => toEntry(row as Record<string, unknown>));
}

export async function getEntry(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<StudyEntry | null> {
  const { data, error } = await supabase
    .from("study_sessions")
    .select(ENTRY_SELECT)
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return toEntry(data as Record<string, unknown>);
}

// ---------------------------------------------------------------------------
// Podsumowanie na ekran główny
// ---------------------------------------------------------------------------

export interface StudyOverview {
  todayMinutes: number;
  weekMinutes: number;
  monthMinutes: number;
  totalMinutes: number;
  /** Dni z rzędu z jakąkolwiek nauką, licząc wstecz od dziś (albo od wczoraj). */
  streakDays: number;
  /** Ile różnych dni ma choć jeden wpis — mianownik dla „średnio dziennie". */
  activeDays: number;
}

export async function getOverview(
  supabase: SupabaseClient,
  userId: string,
  today = todayKey()
): Promise<StudyOverview> {
  const { data, error } = await supabase
    .from("study_sessions")
    .select("study_date, duration_minutes")
    .eq("user_id", userId);

  const empty: StudyOverview = {
    todayMinutes: 0,
    weekMinutes: 0,
    monthMinutes: 0,
    totalMinutes: 0,
    streakDays: 0,
    activeDays: 0,
  };
  if (error) {
    console.error("[godziny] getOverview failed:", error);
    return empty;
  }

  const rows = (data ?? []) as Array<{ study_date: string; duration_minutes: number }>;
  if (rows.length === 0) return empty;

  const firstOfWeek = weekStart(today);
  const firstOfMonth = monthStart(today);

  const perDay = new Map<string, number>();
  let totalMinutes = 0;
  let todayMinutes = 0;
  let weekMinutes = 0;
  let monthMinutes = 0;

  for (const row of rows) {
    const day = row.study_date;
    const minutes = row.duration_minutes;
    totalMinutes += minutes;
    perDay.set(day, (perDay.get(day) ?? 0) + minutes);
    if (day === today) todayMinutes += minutes;
    // Porównanie stringów wystarcza — klucze "YYYY-MM-DD" sortują się
    // leksykograficznie tak samo jak chronologicznie.
    if (day >= firstOfWeek && day <= today) weekMinutes += minutes;
    if (day >= firstOfMonth && day <= today) monthMinutes += minutes;
  }

  return {
    todayMinutes,
    weekMinutes,
    monthMinutes,
    totalMinutes,
    streakDays: computeStreak(perDay, today),
    activeDays: perDay.size,
  };
}

/**
 * Seria liczy się wstecz od dziś. Jeśli dziś jeszcze nic nie ma, startujemy od
 * wczoraj — inaczej seria „znikałaby" o północy i wracała po pierwszym wpisie,
 * co dla kogoś uczącego się wieczorami wygląda jak zerowanie postępu.
 */
function computeStreak(perDay: Map<string, number>, today: string): number {
  let cursor = perDay.has(today) ? today : addDays(today, -1);
  if (!perDay.has(cursor)) return 0;

  let streak = 0;
  while (perDay.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// ---------------------------------------------------------------------------
// Historia (dni / tygodnie / miesiące)
// ---------------------------------------------------------------------------

export interface TopicSlice {
  topicId: string;
  name: string;
  colorIndex: number;
  minutes: number;
  entries: number;
}

export interface HistoryBucket {
  /** Pierwszy dzień kubełka — jednocześnie klucz sortowania. */
  start: string;
  minutes: number;
  entries: number;
  byTopic: TopicSlice[];
}

export interface StudyHistory {
  grouping: Grouping;
  from: string;
  to: string;
  /** Rosnąco po dacie — tak rysuje je wykres; lista odwraca kolejność u siebie. */
  buckets: HistoryBucket[];
  topicTotals: TopicSlice[];
  totalMinutes: number;
  totalEntries: number;
  /** Ile kubełków w zakresie ma choć jeden wpis (do „średnio na dzień/tydzień"). */
  activeBuckets: number;
}

/** Ile wstecz sięga domyślny zakres historii dla danego grupowania. */
const RANGE_DAYS: Record<Grouping, number> = {
  day: 30,
  week: 7 * 12,
  month: 365,
};

export function historyRangeStart(grouping: Grouping, today = todayKey()): string {
  // Zakres domykamy do początku najstarszego kubełka, żeby skrajny słupek
  // wykresu nie pokazywał uciętego pół-tygodnia obok pełnych tygodni.
  return bucketStart(addDays(today, -RANGE_DAYS[grouping] + 1), grouping);
}

export async function getHistory(
  supabase: SupabaseClient,
  userId: string,
  {
    grouping,
    topicId,
    today = todayKey(),
  }: { grouping: Grouping; topicId?: string; today?: string }
): Promise<StudyHistory> {
  const from = historyRangeStart(grouping, today);
  const entries = await listEntries(supabase, userId, { from, to: today, topicId });

  const buckets = new Map<string, HistoryBucket>();
  const topicTotals = new Map<string, TopicSlice>();
  let totalMinutes = 0;

  for (const entry of entries) {
    const key = bucketStart(entry.study_date, grouping);
    const bucket = buckets.get(key) ?? { start: key, minutes: 0, entries: 0, byTopic: [] };
    bucket.minutes += entry.duration_minutes;
    bucket.entries += 1;

    const inBucket = bucket.byTopic.find((slice) => slice.topicId === entry.topic_id);
    if (inBucket) {
      inBucket.minutes += entry.duration_minutes;
      inBucket.entries += 1;
    } else {
      bucket.byTopic.push({
        topicId: entry.topic_id,
        name: entry.topic_name,
        colorIndex: entry.topic_color_index,
        minutes: entry.duration_minutes,
        entries: 1,
      });
    }
    buckets.set(key, bucket);

    const total = topicTotals.get(entry.topic_id) ?? {
      topicId: entry.topic_id,
      name: entry.topic_name,
      colorIndex: entry.topic_color_index,
      minutes: 0,
      entries: 0,
    };
    total.minutes += entry.duration_minutes;
    total.entries += 1;
    topicTotals.set(entry.topic_id, total);

    totalMinutes += entry.duration_minutes;
  }

  for (const bucket of buckets.values()) {
    bucket.byTopic.sort((a, b) => b.minutes - a.minutes);
  }

  return {
    grouping,
    from,
    to: today,
    buckets: fillGaps(buckets, from, today, grouping),
    topicTotals: [...topicTotals.values()].sort((a, b) => b.minutes - a.minutes),
    totalMinutes,
    totalEntries: entries.length,
    activeBuckets: buckets.size,
  };
}

/**
 * Dokłada puste kubełki między pierwszym a ostatnim dniem zakresu. Bez tego
 * wykres skleiłby ze sobą dni, w których nic się nie działo, i tydzień z
 * jedną sesją wyglądałby na równie gęsty jak tydzień z siedmioma.
 */
function fillGaps(
  buckets: Map<string, HistoryBucket>,
  from: string,
  to: string,
  grouping: Grouping
): HistoryBucket[] {
  const filled: HistoryBucket[] = [];
  const step = grouping === "day" ? 1 : grouping === "week" ? 7 : 0;

  let cursor = bucketStart(from, grouping);
  const last = bucketStart(to, grouping);
  // Zabezpieczenie przed pętlą bez końca, gdyby `from` wypadło po `to`.
  let guard = 0;
  while (cursor <= last && guard < 500) {
    filled.push(buckets.get(cursor) ?? { start: cursor, minutes: 0, entries: 0, byTopic: [] });
    cursor =
      step > 0
        ? addDays(cursor, step)
        : monthStart(addDays(`${cursor.slice(0, 7)}-28`, 7));
    guard += 1;
  }

  // Wpisy spoza wyliczonego zakresu (np. data z przeszłości dopisana ręcznie)
  // i tak muszą trafić na listę — inaczej suma nie zgadzałaby się z wykresem.
  for (const [key, bucket] of buckets) {
    if (!filled.some((b) => b.start === key)) filled.push(bucket);
  }

  return filled.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
}
