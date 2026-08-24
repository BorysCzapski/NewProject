"use server";
// ============================================================================
// lib/silownia/actions.ts
// Server Actions "Siłowni": profil, treningi, nawodnienie, posiłki (AI),
// suplementy. Walidacja jest dublowana świadomie (formularz blokuje bzdury od
// razu, Server Action sprawdza wszystko jeszcze raz — publiczny endpoint POST
// nie może ufać klientowi), ten sam wzorzec co lib/godziny/actions.ts. Żadna
// funkcja nie przyjmuje user_id z zewnątrz; RLS ("*_own") dokłada drugą
// warstwę.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { isValidDateKey, todayKey } from "@/lib/silownia/format";
import { estimateMealNutrition, type MealEstimate } from "@/lib/silownia/ai";
import { getWorkout } from "@/lib/silownia/queries";
import { GOALS } from "@/lib/silownia/constants";
import type {
  GymGoal,
  GymMealEntry,
  GymProfile,
  GymSupplementEntry,
  GymWorkout,
  WorkoutExercise,
} from "@/lib/types/database";

const MIN_DATE = "2000-01-01";

function revalidateSilownia() {
  revalidatePath("/silownia");
  revalidatePath("/silownia/treningi");
  revalidatePath("/silownia/odzywianie");
  revalidatePath("/silownia/suplementy");
  revalidatePath("/silownia/ustawienia");
}

function validateDate(date: string): { error: string } | { value: string } {
  const trimmed = date?.trim() ?? "";
  if (!isValidDateKey(trimmed)) return { error: "Podaj poprawną datę." };
  if (trimmed > todayKey()) return { error: "Nie można zapisać wpisu z przyszłości." };
  if (trimmed < MIN_DATE) return { error: "Ta data jest zbyt odległa — sprawdź rok." };
  return { value: trimmed };
}

// ---------------------------------------------------------------------------
// Profil (waga/wzrost/cel)
// ---------------------------------------------------------------------------

export interface GymProfileInput {
  weightKg: number | null;
  heightCm: number | null;
  goal: GymGoal | null;
}

export async function saveGymProfile(input: GymProfileInput): Promise<ActionResult<GymProfile>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const weightKg = input.weightKg;
  if (weightKg !== null && (!Number.isFinite(weightKg) || weightKg <= 0 || weightKg > 400)) {
    return actionFailure("Podaj realistyczną wagę (do 400 kg).");
  }
  const heightCm = input.heightCm;
  if (heightCm !== null && (!Number.isFinite(heightCm) || heightCm <= 0 || heightCm > 260)) {
    return actionFailure("Podaj realistyczny wzrost (do 260 cm).");
  }
  if (input.goal !== null && !GOALS.includes(input.goal)) {
    return actionFailure("Nieznany cel treningowy.");
  }

  const { data, error } = await supabase
    .from("gym_profiles")
    .upsert({
      user_id: profile.id,
      weight_kg: weightKg,
      height_cm: heightCm,
      goal: input.goal,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[silownia] saveGymProfile failed:", error);
    return actionFailure("Nie udało się zapisać profilu. Spróbuj ponownie.");
  }

  revalidateSilownia();
  return { ok: true, data: data as GymProfile };
}

// ---------------------------------------------------------------------------
// Treningi
// ---------------------------------------------------------------------------

const MAX_EXERCISES = 20;
const MAX_SETS_PER_EXERCISE = 15;

export interface WorkoutInput {
  date: string;
  splitLabel: string;
  durationMinutes: number | null;
  exercises: WorkoutExercise[];
  note?: string;
}

function validateWorkout(
  input: WorkoutInput
): { error: string } | { value: Omit<WorkoutInput, "date"> & { date: string } } {
  const dateResult = validateDate(input.date);
  if ("error" in dateResult) return dateResult;

  const splitLabel = input.splitLabel?.trim() ?? "";
  if (!splitLabel) return { error: "Podaj rodzaj treningu (np. Nogi)." };
  if (splitLabel.length > 80) return { error: "Nazwa treningu jest za długa." };

  const durationMinutes = input.durationMinutes;
  if (durationMinutes !== null) {
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes > 600) {
      return { error: "Czas treningu musi być między 1 a 600 minut." };
    }
  }

  const exercises = (input.exercises ?? []).filter((ex) => ex.name?.trim());
  if (exercises.length > MAX_EXERCISES) {
    return { error: `Najwyżej ${MAX_EXERCISES} ćwiczeń w jednej sesji.` };
  }
  for (const ex of exercises) {
    if (ex.name.trim().length > 80) return { error: "Nazwa ćwiczenia jest za długa." };
    if (ex.sets.length > MAX_SETS_PER_EXERCISE) {
      return { error: `Najwyżej ${MAX_SETS_PER_EXERCISE} serii na ćwiczenie.` };
    }
    for (const set of ex.sets) {
      if (!Number.isFinite(set.reps) || set.reps <= 0 || set.reps > 200) {
        return { error: "Liczba powtórzeń musi być między 1 a 200." };
      }
      if (set.weightKg !== null && (!Number.isFinite(set.weightKg) || set.weightKg < 0 || set.weightKg > 500)) {
        return { error: "Podaj realistyczny ciężar (do 500 kg)." };
      }
    }
  }

  const note = (input.note ?? "").trim().slice(0, 500);

  return {
    value: {
      date: dateResult.value,
      splitLabel,
      durationMinutes,
      exercises: exercises.map((ex) => ({
        name: ex.name.trim(),
        sets: ex.sets.map((s) => ({ reps: Math.round(s.reps), weightKg: s.weightKg })),
      })),
      note: note || undefined,
    },
  };
}

export async function addWorkout(input: WorkoutInput): Promise<ActionResult<GymWorkout>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const validated = validateWorkout(input);
  if ("error" in validated) return actionFailure(validated.error);
  const v = validated.value;

  const { data, error } = await supabase
    .from("gym_workouts")
    .insert({
      user_id: profile.id,
      workout_date: v.date,
      split_label: v.splitLabel,
      duration_minutes: v.durationMinutes,
      exercises: v.exercises,
      note: v.note ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[silownia] addWorkout failed:", error);
    return actionFailure("Nie udało się zapisać treningu. Spróbuj ponownie.");
  }

  revalidateSilownia();
  return { ok: true, data: data as GymWorkout };
}

export async function updateWorkout(id: string, input: WorkoutInput): Promise<ActionResult<GymWorkout>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const validated = validateWorkout(input);
  if ("error" in validated) return actionFailure(validated.error);
  const v = validated.value;

  const { data, error } = await supabase
    .from("gym_workouts")
    .update({
      workout_date: v.date,
      split_label: v.splitLabel,
      duration_minutes: v.durationMinutes,
      exercises: v.exercises,
      note: v.note ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", profile.id)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("[silownia] updateWorkout failed:", error);
    return actionFailure("Nie udało się zapisać zmian. Spróbuj ponownie.");
  }
  if (!data) return actionFailure("Nie znaleziono tego treningu.");

  revalidateSilownia();
  return { ok: true, data: data as GymWorkout };
}

export async function deleteWorkout(id: string): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gym_workouts")
    .delete()
    .eq("id", id)
    .eq("user_id", profile.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[silownia] deleteWorkout failed:", error);
    return actionFailure("Nie udało się usunąć treningu. Spróbuj ponownie.");
  }
  if (!data) return actionFailure("Nie znaleziono tego treningu.");

  revalidateSilownia();
  return { ok: true, data: null };
}

// Re-exported so client components can read a single workout without a
// separate "silownia/queries" client bundle (queries.ts is server-only).
export async function fetchWorkout(id: string): Promise<GymWorkout | null> {
  const profile = await requireProfile();
  const supabase = await createClient();
  return getWorkout(supabase, profile.id, id);
}

// ---------------------------------------------------------------------------
// Nawodnienie — upsert wartości bezwzględnej za dany dzień (jak
// lib/butelki/actions.ts: klient trzyma bieżącą sumę i wysyła nowy total).
// ---------------------------------------------------------------------------

export async function setHydration(ml: number, date: string = todayKey()): Promise<ActionResult<{ ml: number }>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const dateResult = validateDate(date);
  if ("error" in dateResult) return actionFailure(dateResult.error);

  const clamped = Math.max(0, Math.min(15000, Math.round(ml) || 0));

  const { data, error } = await supabase
    .from("gym_hydration_logs")
    .upsert({
      user_id: profile.id,
      log_date: dateResult.value,
      consumed_ml: clamped,
      updated_at: new Date().toISOString(),
    })
    .select("consumed_ml")
    .single();

  if (error || !data) {
    console.error("[silownia] setHydration failed:", error);
    return actionFailure("Nie udało się zapisać nawodnienia.");
  }

  revalidatePath("/silownia");
  return { ok: true, data: { ml: data.consumed_ml as number } };
}

// ---------------------------------------------------------------------------
// Posiłki — dwuetapowo: estimateMeal (podgląd, nic nie zapisuje) i saveMeal
// (zapis, z wartościami które użytkownik mógł poprawić po podglądzie AI).
// ---------------------------------------------------------------------------

const MAX_DESCRIPTION = 500;

export async function estimateMeal(description: string): Promise<ActionResult<MealEstimate>> {
  await requireProfile();

  const trimmed = description?.trim() ?? "";
  if (!trimmed) return actionFailure("Opisz, co zjadłeś.");
  if (trimmed.length > MAX_DESCRIPTION) return actionFailure("Opis jest za długi.");

  try {
    const estimate = await estimateMealNutrition(trimmed);
    return { ok: true, data: estimate };
  } catch (err) {
    console.error("[silownia] estimateMeal failed:", err);
    return actionFailure("Nie udało się oszacować kalorii. Spróbuj ponownie za chwilę.");
  }
}

export interface SaveMealInput {
  date: string;
  description: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  aiNote?: string;
}

export async function saveMeal(input: SaveMealInput): Promise<ActionResult<GymMealEntry>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const dateResult = validateDate(input.date);
  if ("error" in dateResult) return actionFailure(dateResult.error);

  const description = input.description?.trim() ?? "";
  if (!description) return actionFailure("Opisz, co zjadłeś.");
  if (description.length > MAX_DESCRIPTION) return actionFailure("Opis jest za długi.");

  const calories = Math.round(input.calories);
  if (!Number.isFinite(calories) || calories < 0 || calories > 10000) {
    return actionFailure("Podaj realistyczną liczbę kalorii.");
  }
  const macros = [input.proteinG, input.carbsG, input.fatG];
  if (macros.some((m) => !Number.isFinite(m) || m < 0)) {
    return actionFailure("Wartości makroskładników muszą być liczbami nieujemnymi.");
  }

  const { data, error } = await supabase
    .from("gym_meal_entries")
    .insert({
      user_id: profile.id,
      entry_date: dateResult.value,
      description,
      calories,
      protein_g: input.proteinG,
      carbs_g: input.carbsG,
      fat_g: input.fatG,
      ai_note: input.aiNote?.trim() || null,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[silownia] saveMeal failed:", error);
    return actionFailure("Nie udało się zapisać posiłku. Spróbuj ponownie.");
  }

  revalidateSilownia();
  return { ok: true, data: data as GymMealEntry };
}

export async function deleteMeal(id: string): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gym_meal_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", profile.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[silownia] deleteMeal failed:", error);
    return actionFailure("Nie udało się usunąć posiłku.");
  }
  if (!data) return actionFailure("Nie znaleziono tego posiłku.");

  revalidateSilownia();
  return { ok: true, data: null };
}

// ---------------------------------------------------------------------------
// Suplementy
// ---------------------------------------------------------------------------

export interface SupplementInput {
  date: string;
  name: string;
  dose?: string;
  timeLabel?: string;
  note?: string;
}

export async function addSupplement(input: SupplementInput): Promise<ActionResult<GymSupplementEntry>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const dateResult = validateDate(input.date);
  if ("error" in dateResult) return actionFailure(dateResult.error);

  const name = input.name?.trim() ?? "";
  if (!name) return actionFailure("Podaj nazwę suplementu.");
  if (name.length > 80) return actionFailure("Nazwa suplementu jest za długa.");

  const dose = (input.dose ?? "").trim().slice(0, 40);
  const timeLabel = (input.timeLabel ?? "").trim().slice(0, 40);
  const note = (input.note ?? "").trim().slice(0, 300);

  const { data, error } = await supabase
    .from("gym_supplement_entries")
    .insert({
      user_id: profile.id,
      entry_date: dateResult.value,
      name,
      dose: dose || null,
      time_label: timeLabel || null,
      note: note || null,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[silownia] addSupplement failed:", error);
    return actionFailure("Nie udało się zapisać suplementu. Spróbuj ponownie.");
  }

  revalidateSilownia();
  return { ok: true, data: data as GymSupplementEntry };
}

export async function deleteSupplement(id: string): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gym_supplement_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", profile.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[silownia] deleteSupplement failed:", error);
    return actionFailure("Nie udało się usunąć suplementu.");
  }
  if (!data) return actionFailure("Nie znaleziono tego suplementu.");

  revalidateSilownia();
  return { ok: true, data: null };
}
