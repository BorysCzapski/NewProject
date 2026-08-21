"use server";
// ============================================================================
// lib/modlitwa/breviary-actions.ts
// Ręczne ponowienie pobrania pełnych tekstów godziny z ILG — przycisk
// „Pobierz ponownie” po nieudanej próbie. Sam odczyt idzie przez
// lib/modlitwa/breviary.ts i nie potrzebuje akcji.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { refreshBreviaryHour } from "@/lib/modlitwa/breviary";
import { HOUR_LABELS, type HourId } from "@/lib/modlitwa/hours";

const HOUR_IDS = Object.keys(HOUR_LABELS) as HourId[];

export async function refreshBreviaryAction(
  dateKey: string,
  hourId: string,
  variant?: string
): Promise<ActionResult<null>> {
  await requireProfile();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return actionFailure("Nieprawidłowa data.");
  if (!HOUR_IDS.includes(hourId as HourId)) return actionFailure("Nieznana godzina liturgiczna.");
  if (variant !== undefined && !/^(p|w[1-9])?$/.test(variant)) {
    return actionFailure("Nieprawidłowy wariant obchodu.");
  }

  const content = await refreshBreviaryHour(dateKey, hourId as HourId, variant);
  if (!content) {
    return actionFailure(
      "Nadal nie udało się pobrać tekstów. Serwis brewiarz.pl udostępnia je tylko dla bieżącego okresu."
    );
  }

  revalidatePath(`/modlitwa/liturgia/${hourId}`);
  return { ok: true, data: null };
}
