"use server";

// ============================================================================
// lib/homework/actions.ts
// Server Actions backing the admin homework creator: an AI "suggest a task"
// helper and the form submit handler that creates the backing resource
// (song/writing task/listening exercise) when needed, then inserts the
// homework row itself.
// ============================================================================
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/get-profile";
import { askAIForJSON } from "@/lib/ai";
import { createSong } from "@/lib/songs/create-song";
import { createWritingTask } from "@/lib/writing/create-task";
import { createListeningExercise } from "@/lib/listening/create-exercise";
import { langInfo } from "@/lib/languages";
import { LANGUAGES } from "@/lib/constants";
import type {
  HomeworkType,
  Profile,
  TargetLanguage,
  TrainingModule,
  UserLevel,
  WritingTaskType,
} from "@/lib/types/database";

export interface ActionState {
  error?: string;
}

// Types the AI is allowed to suggest — excludes ones needing an admin-provided
// resource (song lyrics / youtube link) which the AI can't invent.
const SUGGESTABLE_TYPES: HomeworkType[] = [
  "vocabulary_mastery",
  "training_count",
  "reading_count",
  "flashcards_count",
  "grammar_topic",
  "writing_task",
  "matching_game",
];

const HOMEWORK_TYPES: HomeworkType[] = [
  "song_translation",
  "vocabulary_mastery",
  "training_count",
  "reading_count",
  "flashcards_count",
  "grammar_topic",
  "writing_task",
  "listening_task",
  "matching_game",
];

function isLanguage(v: string): v is TargetLanguage {
  return (LANGUAGES as string[]).includes(v);
}

export interface HomeworkSuggestion {
  title: string;
  description: string;
  type: HomeworkType;
  reasoning: string;
}

/** AI-generated homework idea for a language+level, used to prefill the creator form. */
export async function suggestHomework(
  language: TargetLanguage,
  level: UserLevel
): Promise<HomeworkSuggestion> {
  await requireAdmin();
  const info = langInfo(language);

  return askAIForJSON<HomeworkSuggestion>({
    system:
      `Jesteś nauczycielem języka ${info.pl}ego proponującym KONKRETNE, przejrzyste zadanie domowe. ` +
      "Odpowiadasz PO POLSKU. Zadanie musi być jasne — uczeń po przeczytaniu opisu ma dokładnie " +
      "wiedzieć co zrobić.",
    prompt:
      `Zaproponuj jedno zadanie domowe dla uczniów uczących się języka ${info.pl}ego na poziomie ` +
      `${level} (CEFR). Wybierz jeden typ z listy (dokładnie jedna wartość w polu "type"): ` +
      `${SUGGESTABLE_TYPES.join(", ")}. ` +
      "Tytuł: krótki i konkretny. Opis: 1-2 zdania mówiące uczniowi wprost co ma zrobić i po co " +
      "(bez ogólników typu 'ćwicz więcej'). Uzasadnienie: dlaczego akurat to zadanie.",
    schema: {
      title: { type: "string", description: "Krótki, konkretny tytuł, po polsku." },
      description: { type: "string", description: "Jasny opis zadania dla ucznia, po polsku." },
      type: { type: "string", enum: SUGGESTABLE_TYPES, description: "Jeden z dozwolonych typów." },
      reasoning: { type: "string", description: "Krótkie uzasadnienie, po polsku." },
    },
  });
}

function parseLevels(formData: FormData): UserLevel[] {
  return formData.getAll("levels").map(String) as UserLevel[];
}

/**
 * Creates the homework row, first creating a backing resource (song, writing
 * task, listening exercise) when the chosen type needs one. Validates
 * required fields per-type and returns a Polish error via useActionState
 * instead of throwing, so the form can display it inline.
 */
export async function createHomeworkAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await requireAdmin();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const type = String(formData.get("type") ?? "") as HomeworkType;
  const deadlineRaw = String(formData.get("deadline") ?? "").trim();
  const targetUserId = String(formData.get("target_user_id") ?? "").trim();
  let language = String(formData.get("language") ?? "en");
  let levels = parseLevels(formData);

  if (!title) return { error: "Podaj tytuł pracy domowej." };
  if (!HOMEWORK_TYPES.includes(type)) return { error: "Wybierz typ pracy domowej." };
  if (!isLanguage(language)) return { error: "Wybierz język zadania." };

  // If assigned to one specific student, derive language + level from that
  // student so progress computation matches exactly what they study.
  let resolvedTargetUserId: string | null = null;
  if (targetUserId) {
    const { data: student } = await supabase
      .from("profiles")
      .select("id, level, target_language, role")
      .eq("id", targetUserId)
      .maybeSingle();
    if (!student || (student as Profile).role !== "user") {
      return { error: "Wybrany uczeń nie istnieje." };
    }
    resolvedTargetUserId = (student as Profile).id;
    language = (student as Profile).target_language;
    levels = [(student as Profile).level];
  }

  if (levels.length === 0) return { error: "Wybierz co najmniej jeden poziom (lub konkretnego ucznia)." };

  const languageTyped = language as TargetLanguage;

  // deadlineRaw is already a UTC ISO string computed client-side (from the
  // admin's local timezone) by homework-create-form.tsx — do NOT re-parse a
  // datetime-local value here, `new Date("2024-03-15T14:00")` would be
  // interpreted in the SERVER's timezone instead of the admin's.
  const deadline = deadlineRaw || null;
  const primaryLevel = levels[0]; // resource (song/task/exercise) is created for the first selected level

  let config: Record<string, unknown>;

  switch (type) {
    case "song_translation": {
      const songTitle = String(formData.get("song_title") ?? "").trim();
      const artist = String(formData.get("song_artist") ?? "").trim();
      const lyrics = String(formData.get("song_lyrics") ?? "").trim();
      if (!songTitle || !lyrics) return { error: "Podaj tytuł i tekst piosenki." };
      try {
        const song = await createSong({
          language: languageTyped,
          title: songTitle,
          artist: artist || undefined,
          lyrics,
          createdBy: profile.id,
        });
        config = { song_id: song.id };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Nie udało się utworzyć piosenki." };
      }
      break;
    }

    case "vocabulary_mastery": {
      const category = String(formData.get("vm_category") ?? "").trim();
      const thresholdPctRaw = String(formData.get("vm_threshold") ?? "").trim();
      const thresholdPct = thresholdPctRaw ? Number(thresholdPctRaw) : 80;
      if (!Number.isFinite(thresholdPct) || thresholdPct <= 0 || thresholdPct > 100) {
        return { error: "Próg opanowania musi być liczbą od 1 do 100 (%)." };
      }
      config = {
        ...(category ? { category } : {}),
        threshold: thresholdPct / 100,
      };
      break;
    }

    case "training_count": {
      const trainingModule = String(formData.get("tc_module") ?? "") as TrainingModule;
      const count = Number(formData.get("tc_count") ?? 0);
      if (!["vocabulary", "grammar", "writing"].includes(trainingModule)) {
        return { error: "Wybierz moduł treningu." };
      }
      if (!Number.isFinite(count) || count < 1) return { error: "Podaj liczbę treningów większą od zera." };
      config = { module: trainingModule, count };
      break;
    }

    case "reading_count": {
      const count = Number(formData.get("rc_count") ?? 0);
      if (!Number.isFinite(count) || count < 1) return { error: "Podaj liczbę tekstów większą od zera." };
      config = { count };
      break;
    }

    case "flashcards_count": {
      const count = Number(formData.get("fc_count") ?? 0);
      if (!Number.isFinite(count) || count < 1) return { error: "Podaj liczbę fiszek większą od zera." };
      config = { count };
      break;
    }

    case "grammar_topic": {
      const topicId = String(formData.get("gt_topic_id") ?? "").trim();
      if (!topicId) return { error: "Wybierz temat gramatyczny." };
      config = { topic_id: topicId };
      break;
    }

    case "writing_task": {
      const mode = String(formData.get("wt_mode") ?? "any");
      if (mode === "specific") {
        const scenario = String(formData.get("wt_scenario") ?? "").trim();
        const taskType = String(formData.get("wt_task_type") ?? "") as WritingTaskType;
        if (!taskType) return { error: "Wybierz rodzaj zadania pisemnego." };
        try {
          const task = await createWritingTask({
            language: languageTyped,
            level: primaryLevel,
            taskType,
            scenario: scenario || undefined,
            createdBy: profile.id,
          });
          config = { task_id: task.id };
        } catch (err) {
          return { error: err instanceof Error ? err.message : "Nie udało się utworzyć zadania pisemnego." };
        }
      } else {
        // No specific task: any writing submission after this homework's
        // created_at counts (see lib/homework/progress.ts).
        config = {};
      }
      break;
    }

    case "listening_task": {
      const youtubeUrl = String(formData.get("lt_youtube_url") ?? "").trim();
      if (!youtubeUrl) return { error: "Podaj link do filmiku YouTube." };
      try {
        const exercise = await createListeningExercise({
          youtubeUrl,
          language: languageTyped,
          level: primaryLevel,
          createdBy: profile.id,
        });
        config = { exercise_id: exercise.id };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Nie udało się utworzyć ćwiczenia ze słuchania." };
      }
      break;
    }

    case "matching_game": {
      const count = Number(formData.get("mg_count") ?? 0);
      const category = String(formData.get("mg_category") ?? "").trim();
      if (!Number.isFinite(count) || count < 1) return { error: "Podaj liczbę gier większą od zera." };
      config = { count, ...(category ? { category } : {}) };
      break;
    }

    default:
      return { error: "Nieznany typ pracy domowej." };
  }

  const { data: homework, error } = await supabase
    .from("homework")
    .insert({
      title,
      description: description || null,
      type,
      config,
      levels,
      language: languageTyped,
      target_user_id: resolvedTargetUserId,
      deadline,
      created_by: profile.id,
    })
    .select()
    .single();

  if (error || !homework) {
    return { error: "Nie udało się zapisać pracy domowej." };
  }

  redirect(`/jezyki/admin/prace-domowe/${homework.id}`);
}

/**
 * Edits an existing homework's wording (title/description/deadline). Type and
 * config are intentionally NOT editable — they own backing resources (a song,
 * a task, a listening exercise) and student progress, so changing them mid-
 * flight would corrupt tracking. Admins fix unclear homework by rewording it.
 */
export async function updateHomeworkAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const deadlineRaw = String(formData.get("deadline") ?? "").trim();

  if (!id) return { error: "Brak identyfikatora pracy domowej." };
  if (!title) return { error: "Podaj tytuł pracy domowej." };

  const { error } = await supabase
    .from("homework")
    .update({
      title,
      description: description || null,
      deadline: deadlineRaw || null,
    })
    .eq("id", id);

  if (error) return { error: "Nie udało się zapisać zmian." };

  redirect(`/jezyki/admin/prace-domowe/${id}`);
}

/** Deletes a homework (and its progress rows cascade). */
export async function deleteHomeworkAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("homework").delete().eq("id", id);
  redirect("/jezyki/admin");
}
