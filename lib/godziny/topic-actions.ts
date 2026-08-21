"use server";
// ============================================================================
// lib/godziny/topic-actions.ts
// Server Actions listy tematów: zestaw startowy, dodawanie, edycja,
// archiwizacja i kasowanie.
//
// Dwie reguły, które trzymają historię w całości:
//
//  1. Temat, do którego przypisany jest choć jeden wpis, NIE daje się
//     skasować — zamiast tego archiwizuje się (znika z listy wyboru, zostaje
//     w statystykach). Baza tego nie pilnuje (patrz komentarz przy
//     `on delete cascade` w 0020_godziny.sql), więc pilnuje deleteTopic().
//
//  2. Nazwy są unikalne per użytkownik, bez wielkości liter (indeks
//     study_topics_user_name_idx). Próba dodania nazwy, która już istnieje w
//     archiwum, PRZYWRACA tamten temat razem z jego historią, zamiast
//     zgłaszać błąd — z perspektywy użytkownika „Angielski" to ten sam
//     przedmiot, którego uczył się pół roku temu.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { colorIndexFor, defaultTopics } from "@/lib/godziny/defaults";
import { countEntriesForTopic, listTopics } from "@/lib/godziny/queries";
import type { StudyTopic } from "@/lib/types/database";

const MAX_NAME = 80;
const MAX_CATEGORY = 40;
/** Postgres: naruszenie unikalności (tu: dwa tematy o tej samej nazwie). */
const UNIQUE_VIOLATION = "23505";

function revalidateGodziny() {
  revalidatePath("/godziny");
  revalidatePath("/godziny/historia");
  revalidatePath("/godziny/tematy");
}

export interface TopicInput {
  name: string;
  category?: string;
  colorIndex?: number;
}

interface ValidTopic {
  name: string;
  category: string | null;
  colorIndex: number;
}

function validate(input: TopicInput): { error: string } | { value: ValidTopic } {
  const name = input.name?.trim() ?? "";
  if (!name) return { error: "Podaj nazwę tematu." };
  if (name.length > MAX_NAME) return { error: `Nazwa może mieć najwyżej ${MAX_NAME} znaków.` };

  const category = (input.category ?? "").trim().slice(0, MAX_CATEGORY);

  const rawColor = Number(input.colorIndex ?? 0);
  const colorIndex = Number.isFinite(rawColor) ? Math.min(7, Math.max(0, Math.round(rawColor))) : 0;

  return { value: { name, category: category || null, colorIndex } };
}

/**
 * Wstrzykuje listę startową — tylko wtedy, gdy użytkownik nie ma JESZCZE
 * żadnego tematu (także zarchiwizowanego). Kto raz wyczyścił listę do zera,
 * ten zrobił to celowo; ponowne wejście na ekran nie ma mu jej przywracać.
 */
export async function seedDefaultTopics(): Promise<ActionResult<StudyTopic[]>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const existing = await listTopics(supabase, profile.id, { includeArchived: true });
  if (existing.length > 0) {
    return actionFailure("Masz już swoją listę tematów — dodaj brakujące ręcznie.");
  }

  const rows = defaultTopics().map((topic, index) => ({
    user_id: profile.id,
    name: topic.name,
    category: topic.category,
    color_index: colorIndexFor(index),
  }));

  const { data, error } = await supabase.from("study_topics").insert(rows).select();
  if (error || !data) {
    console.error("[godziny] seedDefaultTopics failed:", error);
    return actionFailure("Nie udało się dodać listy startowej. Spróbuj ponownie.");
  }

  revalidateGodziny();
  return { ok: true, data: data as StudyTopic[] };
}

export async function addTopic(input: TopicInput): Promise<ActionResult<StudyTopic>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const validated = validate(input);
  if ("error" in validated) return actionFailure(validated.error);
  const { name, category, colorIndex } = validated.value;

  const { data, error } = await supabase
    .from("study_topics")
    .insert({ user_id: profile.id, name, category, color_index: colorIndex })
    .select()
    .single();

  if (error?.code === UNIQUE_VIOLATION) return restoreByName(supabase, profile.id, name);
  if (error || !data) {
    console.error("[godziny] addTopic failed:", error);
    return actionFailure("Nie udało się dodać tematu. Spróbuj ponownie.");
  }

  revalidateGodziny();
  return { ok: true, data: data as StudyTopic };
}

/**
 * Obsługa kolizji nazw: temat archiwalny wraca na listę, aktywny daje
 * czytelny komunikat zamiast surowego błędu bazy.
 */
async function restoreByName(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  name: string
): Promise<ActionResult<StudyTopic>> {
  // Znaki wieloznaczne LIKE trzeba wyescapować — bez tego temat nazwany
  // "100% frekwencji" pasowałby do wielu wierszy i maybeSingle() by wybuchło.
  const pattern = name.replace(/[\\%_]/g, (char) => `\\${char}`);
  const { data: existing } = await supabase
    .from("study_topics")
    .select("*")
    .eq("user_id", userId)
    .ilike("name", pattern)
    .maybeSingle();

  if (!existing) return actionFailure("Temat o tej nazwie już istnieje.");
  if (!(existing as StudyTopic).is_archived) {
    return actionFailure(`„${(existing as StudyTopic).name}" jest już na Twojej liście.`);
  }

  const { data, error } = await supabase
    .from("study_topics")
    .update({ is_archived: false, updated_at: new Date().toISOString() })
    .eq("id", (existing as StudyTopic).id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error || !data) {
    console.error("[godziny] restoreByName failed:", error);
    return actionFailure("Temat o tej nazwie jest w archiwum, ale nie udało się go przywrócić.");
  }

  revalidateGodziny();
  return { ok: true, data: data as StudyTopic };
}

export async function updateTopic(
  id: string,
  input: TopicInput
): Promise<ActionResult<StudyTopic>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const validated = validate(input);
  if ("error" in validated) return actionFailure(validated.error);
  const { name, category, colorIndex } = validated.value;

  const { data, error } = await supabase
    .from("study_topics")
    .update({ name, category, color_index: colorIndex, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", profile.id)
    .select()
    .maybeSingle();

  if (error?.code === UNIQUE_VIOLATION) {
    return actionFailure("Masz już inny temat o tej nazwie.");
  }
  if (error) {
    console.error("[godziny] updateTopic failed:", error);
    return actionFailure("Nie udało się zapisać zmian. Spróbuj ponownie.");
  }
  if (!data) return actionFailure("Nie znaleziono tego tematu.");

  revalidateGodziny();
  return { ok: true, data: data as StudyTopic };
}

export async function setTopicArchived(
  id: string,
  archived: boolean
): Promise<ActionResult<StudyTopic>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("study_topics")
    .update({ is_archived: archived, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", profile.id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("[godziny] setTopicArchived failed:", error);
    return actionFailure("Nie udało się zmienić statusu tematu.");
  }
  if (!data) return actionFailure("Nie znaleziono tego tematu.");

  revalidateGodziny();
  return { ok: true, data: data as StudyTopic };
}

/** Kasuje temat — ale tylko taki, który nie ma ani jednego wpisu. */
export async function deleteTopic(id: string): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const entries = await countEntriesForTopic(supabase, profile.id, id);
  if (entries > 0) {
    return actionFailure(
      "Ten temat ma już zapisane godziny nauki — zarchiwizuj go zamiast kasować, żeby nie stracić historii."
    );
  }

  const { data, error } = await supabase
    .from("study_topics")
    .delete()
    .eq("id", id)
    .eq("user_id", profile.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[godziny] deleteTopic failed:", error);
    return actionFailure("Nie udało się usunąć tematu. Spróbuj ponownie.");
  }
  if (!data) return actionFailure("Nie znaleziono tego tematu.");

  revalidateGodziny();
  return { ok: true, data: null };
}
