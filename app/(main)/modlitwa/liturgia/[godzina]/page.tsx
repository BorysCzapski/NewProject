// ============================================================================
// app/(main)/modlitwa/liturgia/[godzina]/page.tsx
// Pojedyncza godzina brewiarza na dziś: kolejne części z tekstami stałymi,
// siglami psalmów i czytaniem z dzisiejszej liturgii słowa.
//
// Czytanie krótkie bierzemy z cache'u czytań (bez wychodzenia do sieci) —
// jeśli go nie ma, godzina i tak się wyświetli, tylko z informacją, gdzie
// szukać tekstu.
// ============================================================================
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getLiturgicalDay, todayKey } from "@/lib/modlitwa/liturgical-calendar";
import { assembleHour, getHour, type HourId } from "@/lib/modlitwa/hours";
import { getReadings } from "@/lib/modlitwa/readings";
import { getTodayLogEntry } from "@/lib/modlitwa/queries";
import { PageHeader } from "@/components/layout/page-header";
import { HourView } from "@/components/modlitwa/hour-view";

export default async function GodzinaPage({ params }: { params: Promise<{ godzina: string }> }) {
  const { godzina } = await params;
  const definition = getHour(godzina);
  if (!definition) notFound();

  const profile = await requireProfile();
  const supabase = await createClient();

  const today = todayKey();
  const day = getLiturgicalDay(today);

  const [{ readings }, entry] = await Promise.all([
    getReadings(supabase, today, { allowFetch: false }),
    getTodayLogEntry(supabase, profile.id, today),
  ]);

  // W Godzinie czytań sensowniejsze jest czytanie ze Starego Testamentu,
  // w pozostałych godzinach — Ewangelia dnia.
  const shortReading =
    definition.id === "godzina-czytan"
      ? { citation: readings?.first_reading_citation ?? null, text: readings?.first_reading_text ?? null }
      : { citation: readings?.gospel_citation ?? null, text: readings?.gospel_text ?? null };

  const hour = assembleHour(definition.id as HourId, day, shortReading);

  return (
    <div>
      <PageHeader title={definition.name} subtitle={`${definition.latin} · ${day.name}`} />

      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <HourView
          hour={hour}
          dateKey={today}
          initiallyDone={(entry?.hours ?? []).includes(definition.id)}
        />
      </div>
    </div>
  );
}
