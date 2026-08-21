// ============================================================================
// lib/modlitwa/verses.ts
// „Werset dnia”: wybór jednego wersetu z kuratorowanej puli (bible_verses).
//
// Wybór jest DETERMINISTYCZNY (hash user_id + data), nie losowy przy każdym
// renderze — inaczej werset zmieniałby się przy każdym odświeżeniu strony,
// a dwa Server Components tej samej strony pokazałyby dwa różne wersety.
// Raz wybrany werset jest dodatkowo zapisywany w daily_verse_picks, żeby
// dodanie nowych wersetów w środku dnia nie podmieniło użytkownikowi tekstu.
//
// Dopasowanie do okresu liturgicznego (spec: „daty specjalne wpływają na
// wyświetlany werset”): jeśli w puli są wersety oznaczone bieżącym okresem
// (adwent/wielki post/wielkanoc/Boże Narodzenie), losujemy spośród nich;
// poza tymi okresami — spośród wersetów „na każdy czas”.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BibleVerse } from "@/lib/types/database";
import type { LiturgicalSeason } from "@/lib/modlitwa/liturgical-calendar";

/** FNV-1a — stabilny, krótki hash stringa (ten sam wynik na serwerze i w bazie). */
function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/** Okresy, dla których trzymamy osobną pulę wersetów w seedzie. */
const SEASONAL_POOLS: Partial<Record<LiturgicalSeason, string>> = {
  adwent: "adwent",
  boze_narodzenie: "boze_narodzenie",
  wielki_post: "wielki_post",
  triduum: "wielki_post",
  wielkanoc: "wielkanoc",
};

async function fetchPool(supabase: SupabaseClient, season: LiturgicalSeason): Promise<BibleVerse[]> {
  const seasonKey = SEASONAL_POOLS[season];

  if (seasonKey) {
    const { data } = await supabase
      .from("bible_verses")
      .select("*")
      .eq("is_active", true)
      .eq("season", seasonKey)
      .order("reference");
    if (data && data.length > 0) return data as BibleVerse[];
  }

  const { data, error } = await supabase
    .from("bible_verses")
    .select("*")
    .eq("is_active", true)
    .is("season", null)
    .order("reference");

  if (error) {
    console.error("[modlitwa] verse pool fetch failed:", error);
    return [];
  }
  return (data ?? []) as BibleVerse[];
}

/**
 * Werset na dany dzień dla danego użytkownika. Zwraca null tylko wtedy, gdy
 * pula wersetów jest pusta (baza bez seedu) — strona pokazuje wtedy komunikat
 * zamiast pustej karty.
 */
export async function getVerseOfTheDay(
  supabase: SupabaseClient,
  userId: string,
  dateKey: string,
  season: LiturgicalSeason
): Promise<BibleVerse | null> {
  const { data: existing } = await supabase
    .from("daily_verse_picks")
    .select("verse:bible_verses (*)")
    .eq("user_id", userId)
    .eq("verse_date", dateKey)
    .maybeSingle();

  const picked = (existing as { verse?: BibleVerse } | null)?.verse;
  if (picked) return picked;

  const pool = await fetchPool(supabase, season);
  if (pool.length === 0) return null;

  const verse = pool[hashString(`${userId}:${dateKey}`) % pool.length];

  // Zapis „na później” — wyścig dwóch równoległych renderów rozstrzyga
  // ignoreDuplicates, a nie błąd 409 wywalający stronę.
  const { error } = await supabase
    .from("daily_verse_picks")
    .upsert(
      { user_id: userId, verse_date: dateKey, verse_id: verse.id },
      { onConflict: "user_id,verse_date", ignoreDuplicates: true }
    );
  if (error) console.error("[modlitwa] verse pick save failed:", error);

  return verse;
}

export interface VerseHistoryEntry {
  date: string;
  verse: BibleVerse;
}

/** Ostatnio pokazane wersety (bez dzisiejszego), do sekcji „Wcześniej”. */
export async function getRecentVerses(
  supabase: SupabaseClient,
  userId: string,
  todayKey: string,
  limit = 7
): Promise<VerseHistoryEntry[]> {
  const { data, error } = await supabase
    .from("daily_verse_picks")
    .select("verse_date, verse:bible_verses (*)")
    .eq("user_id", userId)
    .lt("verse_date", todayKey)
    .order("verse_date", { ascending: false })
    .limit(limit);

  if (error || !data) {
    if (error) console.error("[modlitwa] verse history fetch failed:", error);
    return [];
  }

  // Klient jest nietypowany, więc PostgREST-owe zagnieżdżenie wychodzi z
  // sygnaturą tablicową; relacja verse_id -> bible_verses jest „do jednego”,
  // więc w praktyce jest to obiekt albo null.
  return (data as unknown as Array<{ verse_date: string; verse: BibleVerse | null }>)
    .filter((row): row is { verse_date: string; verse: BibleVerse } => row.verse !== null)
    .map((row) => ({ date: row.verse_date, verse: row.verse }));
}
