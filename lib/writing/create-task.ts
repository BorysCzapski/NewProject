// ============================================================================
// lib/writing/create-task.ts
// Creates one writing_tasks row, either from an admin-supplied scenario or
// (when none is given) an AI-generated one. Shared by the writing practice
// module (app/(main)/nauka/pisanie) and the homework admin creator so a
// homework's writing task and a normal practice task are created identically.
// Language-aware: the generated scenario targets the given foreign language,
// and a random theme hint is injected so "losowe zadanie" actually varies
// instead of the model returning the same few scenarios every time.
// ============================================================================
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { askAIForJSON } from "@/lib/ai";
import { WRITING_WORD_LIMITS, WRITING_TASK_TYPE_LABELS } from "@/lib/constants";
import { langInfo } from "@/lib/languages";
import type { TargetLanguage, UserLevel, WritingTask, WritingTaskType } from "@/lib/types/database";

// A pool of concrete themes; one is picked at random and fed to the model so
// generated scenarios spread across many situations rather than clustering.
const THEME_POOL = [
  "wakacje i podróże",
  "jedzenie i restauracja",
  "praca i kariera",
  "zakupy online",
  "hobby i czas wolny",
  "zdrowie i sport",
  "technologia i media społecznościowe",
  "rodzina i przyjaciele",
  "mieszkanie i przeprowadzka",
  "reklamacja i obsługa klienta",
  "planowanie spotkania lub wydarzenia",
  "szkoła i nauka",
  "pogoda i pory roku",
  "zwierzęta domowe",
  "kultura, film i muzyka",
  "transport publiczny i podróżowanie po mieście",
];

export async function createWritingTask(params: {
  language: TargetLanguage;
  level: UserLevel;
  taskType: WritingTaskType;
  scenario?: string;
  createdBy?: string | null;
}): Promise<WritingTask> {
  const limits = WRITING_WORD_LIMITS[params.level];
  const info = langInfo(params.language);
  let scenario = params.scenario?.trim();

  if (!scenario) {
    const theme = THEME_POOL[Math.floor(Math.random() * THEME_POOL.length)];
    const result = await askAIForJSON<{ scenario: string }>({
      system:
        `Jesteś nauczycielem języka ${info.pl}ego, który tworzy krótkie zadania pisemne dla Polaków. ` +
        `Polecenie zawsze piszesz PO POLSKU, zwięźle (1-3 zdania), z jasnym kontekstem i wskazaniem ` +
        `do kogo/w jakiej sytuacji pisze uczeń. Nie pisz odpowiedzi za ucznia, tylko samo polecenie.`,
      prompt:
        `Wymyśl jedno zadanie pisemne typu "${WRITING_TASK_TYPE_LABELS[params.taskType]}" ` +
        `dla poziomu ${params.level} (CEFR). Uczeń napisze odpowiedź w języku ${info.pl}m ` +
        `(${info.en}), długość ${limits.min}-${limits.max} słów. ` +
        `Osadź polecenie w temacie: "${theme}". Zaproponuj konkretny, ciekawy, świeży kontekst ` +
        `(nie ogólnikowy, nie powtarzalny).`,
      schema: {
        scenario: { type: "string", description: "Polecenie zadania pisemnego, po polsku." },
      },
    });
    scenario = result.scenario;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_tasks")
    .insert({
      language: params.language,
      level: params.level,
      task_type: params.taskType,
      scenario,
      min_words: limits.min,
      max_words: limits.max,
      created_by: params.createdBy ?? null,
    })
    .select()
    .single();

  if (error || !data) {
    // Real cause (RLS denial, constraint, connectivity) goes to server logs;
    // the user gets the safe Polish message.
    console.error("[writing] writing_tasks insert failed:", error);
    throw new Error("Nie udało się utworzyć zadania pisemnego.");
  }
  return data as WritingTask;
}
