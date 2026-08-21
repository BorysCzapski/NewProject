// ============================================================================
// lib/modlitwa/breviary.ts
// Warstwa cache nad lib/modlitwa/breviary-source.ts — dokładnie ten sam układ
// co lib/modlitwa/readings.ts:
//   1. jest w breviary_hours -> oddaj natychmiast, bez ruchu sieciowego,
//   2. nie ma -> pobierz z ILG i zapisz klientem service-role (tabela globalna,
//      celowo bez polityki INSERT dla „authenticated”),
//   3. nie udało się -> null, a strona pokazuje przewodnik po strukturze
//      godziny (lib/modlitwa/hours.ts) zamiast pustego ekranu.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  fetchBreviaryHour,
  fetchVariants,
  breviaryDayUrl,
  type BreviaryHourContent,
  type BreviarySection,
  type BreviaryVariant,
} from "@/lib/modlitwa/breviary-source";
import type { HourId } from "@/lib/modlitwa/hours";
import type { BreviaryDayRow, BreviaryHourRow } from "@/lib/types/database";

export interface BreviaryResult {
  content: BreviaryHourContent | null;
  /** Warianty obchodu do przełącznika (puste = dzień ma jeden formularz). */
  variants: BreviaryVariant[];
  /** Powód braku tekstu — do komunikatu w UI. */
  error: string | null;
}

const UNAVAILABLE =
  "Serwis brewiarz.pl udostępnia teksty tylko dla bieżącego okresu — dla tego dnia ich nie ma. Poniżej masz układ godziny i teksty stałe.";

function rowToContent(row: BreviaryHourRow): BreviaryHourContent {
  return {
    title: row.title,
    subtitle: row.subtitle,
    sections: row.sections as BreviarySection[],
    sourceUrl: row.source_url,
    variant: row.variant,
  };
}

async function readCachedHour(
  supabase: SupabaseClient,
  dateKey: string,
  hourId: HourId,
  variant?: string
): Promise<BreviaryHourRow | null> {
  let query = supabase
    .from("breviary_hours")
    .select("*")
    .eq("hour_date", dateKey)
    .eq("hour_id", hourId);

  // Bez wskazanego wariantu bierzemy ten, który już mamy — użytkownik i tak
  // dostanie przełącznik, jeśli dzień ma ich więcej.
  if (variant !== undefined) query = query.eq("variant", variant);

  const { data, error } = await query.limit(1).maybeSingle();
  if (error) {
    console.error("[modlitwa] breviary cache read failed:", error);
    return null;
  }
  return (data as BreviaryHourRow | null) ?? null;
}

async function readCachedVariants(
  supabase: SupabaseClient,
  dateKey: string
): Promise<BreviaryVariant[] | null> {
  const { data } = await supabase
    .from("breviary_days")
    .select("*")
    .eq("day_date", dateKey)
    .maybeSingle();

  const row = data as BreviaryDayRow | null;
  return row ? (row.variants as BreviaryVariant[]) : null;
}

/** Warianty obchodu na dany dzień — z cache albo z ILG (zapisywane na później). */
export async function getBreviaryVariants(
  supabase: SupabaseClient,
  dateKey: string,
  { allowFetch = true }: { allowFetch?: boolean } = {}
): Promise<BreviaryVariant[]> {
  const cached = await readCachedVariants(supabase, dateKey);
  if (cached) return cached;
  if (!allowFetch) return [];

  const variants = await fetchVariants(dateKey);

  const admin = createAdminClient();
  const { error } = await admin.from("breviary_days").upsert(
    {
      day_date: dateKey,
      variants,
      source_url: breviaryDayUrl(dateKey),
      fetched_at: new Date().toISOString(),
    },
    { onConflict: "day_date" }
  );
  if (error) console.error("[modlitwa] breviary variants cache write failed:", error);

  return variants;
}

/**
 * Pełny tekst godziny. `variant` podane = konkretny formularz wybrany przez
 * użytkownika; pominięte = pierwszy, który ILG zwróci.
 */
export async function getBreviaryHour(
  supabase: SupabaseClient,
  dateKey: string,
  hourId: HourId,
  variant?: string,
  { allowFetch = true }: { allowFetch?: boolean } = {}
): Promise<BreviaryResult> {
  const cachedHour = await readCachedHour(supabase, dateKey, hourId, variant);
  const variants = await getBreviaryVariants(supabase, dateKey, { allowFetch: allowFetch && !cachedHour });

  if (cachedHour) {
    return { content: rowToContent(cachedHour), variants, error: null };
  }
  if (!allowFetch) {
    return { content: null, variants, error: UNAVAILABLE };
  }

  const content = await fetchBreviaryHour(dateKey, hourId, variant);
  if (!content) {
    return { content: null, variants, error: UNAVAILABLE };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("breviary_hours").upsert(
    {
      hour_date: dateKey,
      hour_id: hourId,
      variant: content.variant,
      title: content.title,
      subtitle: content.subtitle,
      sections: content.sections,
      source_url: content.sourceUrl,
      fetched_at: new Date().toISOString(),
    },
    { onConflict: "hour_date,hour_id,variant" }
  );
  // Zapis do cache to optymalizacja, nie warunek działania — użytkownik
  // dostaje teksty nawet przy źle skonfigurowanym service-role key.
  if (error) console.error("[modlitwa] breviary cache write failed:", error);

  return { content, variants, error: null };
}

/** Wymusza ponowne pobranie (przycisk „Pobierz ponownie”). */
export async function refreshBreviaryHour(
  dateKey: string,
  hourId: HourId,
  variant?: string
): Promise<BreviaryHourContent | null> {
  const content = await fetchBreviaryHour(dateKey, hourId, variant);
  if (!content) return null;

  const admin = createAdminClient();
  const { error } = await admin.from("breviary_hours").upsert(
    {
      hour_date: dateKey,
      hour_id: hourId,
      variant: content.variant,
      title: content.title,
      subtitle: content.subtitle,
      sections: content.sections,
      source_url: content.sourceUrl,
      fetched_at: new Date().toISOString(),
    },
    { onConflict: "hour_date,hour_id,variant" }
  );
  if (error) console.error("[modlitwa] breviary refresh write failed:", error);

  return content;
}
