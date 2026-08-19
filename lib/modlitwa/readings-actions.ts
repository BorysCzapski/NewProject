"use server";
// ============================================================================
// lib/modlitwa/readings-actions.ts
// Ręczne ponowienie pobrania czytań — przycisk „Pobierz ponownie” po nieudanej
// synchronizacji. Sam odczyt strony idzie przez lib/modlitwa/readings.ts i nie
// potrzebuje akcji.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { refreshReadings } from "@/lib/modlitwa/readings";

export async function refreshReadingsAction(dateKey: string): Promise<ActionResult<null>> {
  await requireProfile();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return actionFailure("Nieprawidłowa data.");

  const readings = await refreshReadings(dateKey);
  if (!readings) {
    return actionFailure(
      "Nadal nie udało się pobrać czytań. Sprawdź połączenie z internetem i spróbuj za chwilę."
    );
  }

  revalidatePath("/modlitwa/czytania");
  revalidatePath("/modlitwa/liturgia");
  return { ok: true, data: null };
}
