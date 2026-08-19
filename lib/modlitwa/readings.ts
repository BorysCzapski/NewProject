// ============================================================================
// lib/modlitwa/readings.ts
// Warstwa cache nad lib/modlitwa/readings-source.ts.
//
// Ścieżka czytania na dziś:
//   1. jest w daily_readings  -> zwróć od razu (zero ruchu sieciowego),
//   2. nie ma                 -> pobierz ze źródła i zapisz przez klienta
//                                service-role (tabela jest globalna i
//                                celowo bez polityki INSERT dla „authenticated”,
//                                dokładnie jak etf_price_history w 0008),
//   3. pobranie się nie udało -> ostatnie dostępne czytania z cache, opatrzone
//                                flagą `isStale`, żeby UI mógł uczciwie
//                                napisać, że to nie są czytania na dziś.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchReadings, type ParsedReadings } from "@/lib/modlitwa/readings-source";
import type { DailyReading } from "@/lib/types/database";

export interface ReadingsResult {
  readings: DailyReading | null;
  /** true = pokazujemy starsze czytania, bo dzisiejszych nie udało się pobrać. */
  isStale: boolean;
  /** Powód, dla którego nie ma dzisiejszych czytań (do komunikatu w UI). */
  error: string | null;
}

function toRow(dateKey: string, parsed: ParsedReadings) {
  return {
    reading_date: dateKey,
    day_name: parsed.dayName,
    first_reading_citation: parsed.firstReadingCitation,
    first_reading_text: parsed.firstReadingText,
    psalm_citation: parsed.psalmCitation,
    psalm_refrain: parsed.psalmRefrain,
    psalm_text: parsed.psalmText,
    second_reading_citation: parsed.secondReadingCitation,
    second_reading_text: parsed.secondReadingText,
    acclamation_citation: parsed.acclamationCitation,
    acclamation_text: parsed.acclamationText,
    gospel_citation: parsed.gospelCitation,
    gospel_text: parsed.gospelText,
    source_url: parsed.sourceUrl,
    fetched_at: new Date().toISOString(),
  };
}

async function readCached(supabase: SupabaseClient, dateKey: string): Promise<DailyReading | null> {
  const { data, error } = await supabase
    .from("daily_readings")
    .select("*")
    .eq("reading_date", dateKey)
    .maybeSingle();
  if (error) {
    console.error("[modlitwa] readings cache read failed:", error);
    return null;
  }
  return (data as DailyReading | null) ?? null;
}

async function readLatestCached(supabase: SupabaseClient): Promise<DailyReading | null> {
  const { data } = await supabase
    .from("daily_readings")
    .select("*")
    .order("reading_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as DailyReading | null) ?? null;
}

/**
 * Czytania na dany dzień — z cache albo ze źródła. `allowFetch: false` pozwala
 * wyrenderować stronę bez wychodzenia do sieci (np. przy przeglądaniu archiwum).
 */
export async function getReadings(
  supabase: SupabaseClient,
  dateKey: string,
  { allowFetch = true }: { allowFetch?: boolean } = {}
): Promise<ReadingsResult> {
  const cached = await readCached(supabase, dateKey);
  if (cached) return { readings: cached, isStale: false, error: null };
  if (!allowFetch) return { readings: null, isStale: false, error: "Brak czytań w pamięci podręcznej." };

  const parsed = await fetchReadings(dateKey);

  if (parsed) {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("daily_readings")
      .upsert(toRow(dateKey, parsed), { onConflict: "reading_date" })
      .select()
      .single();

    if (error) {
      // Zapis do cache to optymalizacja, nie warunek działania — nawet gdy
      // service-role key jest źle skonfigurowany, użytkownik zobaczy czytania.
      console.error("[modlitwa] readings cache write failed:", error);
      return {
        readings: { ...toRow(dateKey, parsed) } as DailyReading,
        isStale: false,
        error: null,
      };
    }

    return { readings: data as DailyReading, isStale: false, error: null };
  }

  const fallback = await readLatestCached(supabase);
  return {
    readings: fallback,
    isStale: fallback !== null,
    error: fallback
      ? "Nie udało się pobrać dzisiejszych czytań. Pokazujemy ostatnie zapisane."
      : "Nie udało się pobrać czytań i nie ma ich w pamięci podręcznej. Sprawdź połączenie z internetem.",
  };
}

/** Wymusza ponowne pobranie (przycisk „Odśwież” po nieudanej synchronizacji). */
export async function refreshReadings(dateKey: string): Promise<DailyReading | null> {
  const parsed = await fetchReadings(dateKey);
  if (!parsed) return null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("daily_readings")
    .upsert(toRow(dateKey, parsed), { onConflict: "reading_date" })
    .select()
    .single();

  if (error) {
    console.error("[modlitwa] readings refresh write failed:", error);
    return toRow(dateKey, parsed) as DailyReading;
  }
  return data as DailyReading;
}
