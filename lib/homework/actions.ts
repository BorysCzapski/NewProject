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
import { askClaudeForJSON } from "@/lib/anthropic";
import { createSong } from "@/lib/songs/create-song";
import { createWritingTask } from "@/lib/writing/create-task";
import { createListeningExercise } from "@/lib/listening/create-exercise";
import type { HomeworkType, TrainingModule, UserLevel, WritingTaskType } from "@/lib/types/database";

export interface ActionState {
  error?: string;
}

const HOMEWORK_TYPES: HomeworkType[] = [
  "song_translation",
  "vocabulary_mastery",
  "training_count",
  "reading_count",
  "flashcards_count",
  "grammar_topic",
  "writing_task",
  "listening_task",
];

export interface HomeworkSuggestion {
  title: string;
  description: string;
  type: HomeworkType;
  reasoning: string;
}

/** AI-generated homework idea for a level, used to prefill the creator form's title/description/type. */
export async function suggestHomework(level: UserLevel): Promise<HomeworkSuggestion> {
  await requireAdmin();

  return askClaudeForJSON<HomeworkSuggestion>({
    system:
      "Jesteś nauczycielem angielskiego proponującym ciekawe zadanie domowe dla uczniów. " +
      "Odpowiadasz PO POLSKU.",
    prompt:
      `Zaproponuj jedno zadanie domowe dla uczniów na poziomie ${level} (CEFR). ` +
      `Wybierz jeden typ zadania z tej listy (podaj dokładnie jedną z tych wartości w polu "type"): ` +
      `${HOMEWORK_TYPES.join(", ")}. ` +
      "Podaj krótki, konkretny tytuł (po polsku), opis 2-3 zdania wyjaśniający uczniowi po polsku " +
      "co ma zrobić, oraz krótkie uzasadnienie wyboru tego typu zadania.",
    schema: {
      title: { type: "string", description: "Krótki tytuł zadania, po polsku." },
      description: { type: "string", description: "Opis zadania dla ucznia, po polsku." },
      type: { type: "string", enum: HOMEWORK_TYPES, description: "Jeden z dozwolonych typów zadania." },
      reasoning: { type: "string", description: "Krótkie uzasadnienie wyboru typu, po polsku." },
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
  const levels = parseLevels(formData);

  if (!title) return { error: "Podaj tytuł pracy domowej." };
  if (levels.length === 0) return { error: "Wybierz co najmniej jeden poziom." };
  if (!HOMEWORK_TYPES.includes(type)) return { error: "Wybierz typ pracy domowej." };

  const deadline = deadlineRaw ? new Date(deadlineRaw).toISOString() : null;
  const primaryLevel = levels[0]; // resource (song/task/exercise) is created for the first selected level

  let config: Record<string, unknown>;

  switch (type) {
    case "song_translation": {
      const songTitle = String(formData.get("song_title") ?? "").trim();
      const artist = String(formData.get("song_artist") ?? "").trim();
      const lyrics = String(formData.get("song_lyrics") ?? "").trim();
      if (!songTitle || !lyrics) return { error: "Podaj tytuł i tekst piosenki." };
      try {
        const song = await createSong({ title: songTitle, artist: artist || undefined, lyrics, createdBy: profile.id });
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
        const exercise = await createListeningExercise({ youtubeUrl, level: primaryLevel, createdBy: profile.id });
        config = { exercise_id: exercise.id };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Nie udało się utworzyć ćwiczenia ze słuchania." };
      }
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
      deadline,
      created_by: profile.id,
    })
    .select()
    .single();

  if (error || !homework) {
    return { error: "Nie udało się zapisać pracy domowej." };
  }

  redirect(`/admin/prace-domowe/${homework.id}`);
}
