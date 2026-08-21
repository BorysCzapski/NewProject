"use server";
// ============================================================================
// lib/godziny/actions.ts
// Server Actions dziennika nauki: dodanie, edycja i skasowanie wpisu.
//
// Walidacja jest dublowana świadomie: formularz blokuje bzdury od razu (żeby
// nie płacić rundy do serwera za literówkę), ale Server Action to publiczny
// endpoint POST — sprawdza więc wszystko jeszcze raz i nigdy nie ufa temu, co
// przyszło z klienta. Żadna funkcja nie przyjmuje user_id z zewnątrz;
// właścicielem wiersza jest zawsze zalogowany profil, a RLS
// („study_sessions_own") dokłada drugą warstwę.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { getEntry, type StudyEntry } from "@/lib/godziny/queries";
import { isValidDateKey, todayKey } from "@/lib/godziny/format";

/** Doba. Dłuższej pojedynczej sesji nauki po prostu nie ma. */
const MAX_MINUTES = 1440;
const MAX_NOTE = 500;
/** Dolna granica daty — chroni przed literówką w roku ("0202-08-12"). */
const MIN_DATE = "2000-01-01";

export interface EntryInput {
  topicId: string;
  date: string;
  durationMinutes: number;
  note?: string;
}

interface ValidEntry {
  topicId: string;
  date: string;
  durationMinutes: number;
  note: string | null;
}

function validate(input: EntryInput): { error: string } | { value: ValidEntry } {
  const topicId = input.topicId?.trim() ?? "";
  if (!topicId) return { error: "Wybierz temat, którego się uczysz." };

  const date = input.date?.trim() ?? "";
  if (!isValidDateKey(date)) return { error: "Podaj poprawną datę nauki." };
  if (date > todayKey()) return { error: "Nie można zapisać nauki z przyszłości." };
  if (date < MIN_DATE) return { error: "Ta data jest zbyt odległa — sprawdź rok." };

  const minutes = Number(input.durationMinutes);
  if (!Number.isFinite(minutes)) return { error: "Podaj czas nauki." };
  const rounded = Math.round(minutes);
  if (rounded <= 0) return { error: "Czas nauki musi być większy od zera." };
  if (rounded > MAX_MINUTES) return { error: "Jeden wpis może obejmować najwyżej 24 godziny." };

  const note = (input.note ?? "").trim().slice(0, MAX_NOTE);

  return { value: { topicId, date, durationMinutes: rounded, note: note || null } };
}

/**
 * Sprawdza, że temat naprawdę należy do tej osoby. RLS pilnuje wierszy
 * study_sessions, ale nie tego, na co wskazuje topic_id — bez tej kontroli
 * dałoby się podpiąć swój wpis pod cudzy temat.
 */
async function assertOwnTopic(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  topicId: string
): Promise<{ error: string } | { ok: true }> {
  const { data, error } = await supabase
    .from("study_topics")
    .select("id")
    .eq("id", topicId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("[godziny] topic lookup failed:", error);
    return { error: "Nie udało się sprawdzić tematu. Spróbuj ponownie." };
  }
  if (!data) return { error: "Nie znaleziono takiego tematu na Twojej liście." };
  return { ok: true };
}

/** Ekrany, które pokazują wpisy — po każdej zmianie muszą przeliczyć sumy. */
function revalidateGodziny() {
  revalidatePath("/godziny");
  revalidatePath("/godziny/historia");
  revalidatePath("/godziny/tematy");
}

export async function addEntry(input: EntryInput): Promise<ActionResult<StudyEntry>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const validated = validate(input);
  if ("error" in validated) return actionFailure(validated.error);
  const { topicId, date, durationMinutes, note } = validated.value;

  const owns = await assertOwnTopic(supabase, profile.id, topicId);
  if ("error" in owns) return actionFailure(owns.error);

  const { data, error } = await supabase
    .from("study_sessions")
    .insert({
      user_id: profile.id,
      topic_id: topicId,
      study_date: date,
      duration_minutes: durationMinutes,
      note,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[godziny] entry insert failed:", error);
    return actionFailure("Nie udało się zapisać wpisu. Spróbuj ponownie.");
  }

  const entry = await getEntry(supabase, profile.id, data.id as string);
  if (!entry) return actionFailure("Wpis zapisany, ale nie udało się go odczytać. Odśwież stronę.");

  revalidateGodziny();
  return { ok: true, data: entry };
}

export async function updateEntry(
  id: string,
  input: EntryInput
): Promise<ActionResult<StudyEntry>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const validated = validate(input);
  if ("error" in validated) return actionFailure(validated.error);
  const { topicId, date, durationMinutes, note } = validated.value;

  const owns = await assertOwnTopic(supabase, profile.id, topicId);
  if ("error" in owns) return actionFailure(owns.error);

  const { data, error } = await supabase
    .from("study_sessions")
    .update({
      topic_id: topicId,
      study_date: date,
      duration_minutes: durationMinutes,
      note,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", profile.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[godziny] entry update failed:", error);
    return actionFailure("Nie udało się zapisać zmian. Spróbuj ponownie.");
  }
  if (!data) return actionFailure("Nie znaleziono tego wpisu.");

  const entry = await getEntry(supabase, profile.id, data.id as string);
  if (!entry) return actionFailure("Zmiany zapisane, ale nie udało się ich odczytać. Odśwież stronę.");

  revalidateGodziny();
  return { ok: true, data: entry };
}

export async function deleteEntry(id: string): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("study_sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", profile.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[godziny] entry delete failed:", error);
    return actionFailure("Nie udało się usunąć wpisu. Spróbuj ponownie.");
  }
  if (!data) return actionFailure("Nie znaleziono tego wpisu.");

  revalidateGodziny();
  return { ok: true, data: null };
}
