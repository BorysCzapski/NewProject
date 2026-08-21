// ============================================================================
// app/(main)/modlitwa/liturgia/[godzina]/page.tsx
// Jedna godzina brewiarza z PEŁNYM tekstem z ILG (brewiarz.pl): hymn,
// psalmodia z antyfonami, czytanie, responsorium, kantyk, prośby i modlitwa.
//
// Nad tekstem stoi przełącznik pory dnia (wszystkie osiem godzin), więc
// przejście „Jutrznia -> Nieszpory” to jedno kliknięcie. `?data=` pozwala
// otworzyć inny dzień, `?obchod=` — inny formularz (wspomnienie dowolne,
// święto własne), jeśli ILG podaje ich kilka.
//
// Gdy pełnych tekstów nie ma (ILG udostępnia tylko bieżący okres) strona
// pokazuje komunikat i schodzi do przewodnika po strukturze godziny z
// tekstami stałymi — nigdy do pustego ekranu.
// ============================================================================
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import {
  currentWarsawHour,
  formatPolishDate,
  getLiturgicalDay,
  todayKey,
} from "@/lib/modlitwa/liturgical-calendar";
import { assembleHour, getHour, suggestedHour, type HourId } from "@/lib/modlitwa/hours";
import { getBreviaryHour } from "@/lib/modlitwa/breviary";
import { getReadings } from "@/lib/modlitwa/readings";
import { getTodayLogEntry } from "@/lib/modlitwa/queries";
import { PageHeader } from "@/components/layout/page-header";
import { HourView } from "@/components/modlitwa/hour-view";
import { HourPicker } from "@/components/modlitwa/hour-picker";
import { BreviaryView } from "@/components/modlitwa/breviary-view";
import { BreviaryFallbackNotice } from "@/components/modlitwa/breviary-fallback-notice";
import { HourDoneButton } from "@/components/modlitwa/hour-done-button";
import { VariantPicker } from "@/components/modlitwa/variant-picker";

export default async function GodzinaPage({
  params,
  searchParams,
}: {
  params: Promise<{ godzina: string }>;
  searchParams: Promise<{ data?: string; obchod?: string }>;
}) {
  const { godzina } = await params;
  const definition = getHour(godzina);
  if (!definition) notFound();

  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: requestedDate, obchod } = await searchParams;
  const today = todayKey();
  const dateKey =
    requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ? requestedDate : today;
  const isToday = dateKey === today;
  const variant = obchod && /^(p|w[1-9])$/.test(obchod) ? obchod : undefined;

  const day = getLiturgicalDay(dateKey);
  const hourId = definition.id;

  const [breviary, entry] = await Promise.all([
    getBreviaryHour(supabase, dateKey, hourId, variant),
    getTodayLogEntry(supabase, profile.id, dateKey),
  ]);

  return (
    <div>
      <PageHeader
        title={definition.name}
        subtitle={isToday ? `${definition.latin} · ${day.name}` : formatPolishDate(dateKey)}
      />

      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <HourPicker
          currentHourId={hourId}
          doneHours={entry?.hours ?? []}
          suggestedHourId={suggestedHour(currentWarsawHour())}
          dateKey={dateKey}
          isToday={isToday}
        />

        {breviary.variants.length > 1 && (
          <VariantPicker
            variants={breviary.variants}
            currentVariant={breviary.content?.variant ?? variant ?? ""}
            hourId={hourId}
            dateKey={dateKey}
            isToday={isToday}
          />
        )}

        {breviary.content ? (
          <BreviaryView content={breviary.content} />
        ) : (
          <FallbackHour dateKey={dateKey} hourId={hourId} message={breviary.error} variant={variant} />
        )}

        <HourDoneButton
          hourId={hourId}
          hourName={definition.name}
          dateKey={dateKey}
          initiallyDone={(entry?.hours ?? []).includes(hourId)}
        />
      </div>
    </div>
  );
}

/**
 * Ścieżka awaryjna: układ godziny z tekstami stałymi + czytanie z liturgii
 * słowa, jeśli akurat mamy je w cache (bez wychodzenia do sieci — do sieci
 * poszliśmy już po teksty brewiarza i się nie udało).
 */
async function FallbackHour({
  dateKey,
  hourId,
  message,
  variant,
}: {
  dateKey: string;
  hourId: HourId;
  message: string | null;
  variant?: string;
}) {
  const supabase = await createClient();
  const day = getLiturgicalDay(dateKey);
  const { readings } = await getReadings(supabase, dateKey, { allowFetch: false });

  const shortReading =
    hourId === "godzina-czytan"
      ? { citation: readings?.first_reading_citation ?? null, text: readings?.first_reading_text ?? null }
      : { citation: readings?.gospel_citation ?? null, text: readings?.gospel_text ?? null };

  const hour = assembleHour(hourId, day, shortReading);

  return (
    <>
      <BreviaryFallbackNotice
        message={message ?? "Nie udało się pobrać pełnych tekstów."}
        dateKey={dateKey}
        hourId={hourId}
        variant={variant}
      />
      <HourView hour={hour} />
    </>
  );
}
