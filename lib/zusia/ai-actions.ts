"use server";

// ============================================================================
// lib/zusia/ai-actions.ts
// AI-generated olympiad tasks. The model is grounded in the lesson theory
// from lib/zusia/theory.ts (so it cannot invent rules) and returns questions
// in the same shape as the static bank. Open answers are graded by the model
// against the theory and returned as a short Polish verdict.
// Failures are RETURNED (ActionResult), never thrown: Next.js redacts
// thrown Server Action messages in production.
// ============================================================================
import { z } from "zod";
import { askAIForJSON } from "@/lib/ai";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { getLesson, getTheoryForLesson } from "./theory";
import type { Block, LessonId, Question } from "./types";

const LESSON_IDS = ["l1", "l2", "l3", "l4", "d1", "d2"] as const;

const generateInput = z.object({
  lessons: z.array(z.enum(LESSON_IDS)).min(1).max(6),
  count: z.number().int().min(3).max(12),
  kind: z.enum(["quiz", "case"]),
  difficulty: z.enum(["latwy", "sredni", "trudny"]),
});

const aiQuestions = z.object({
  questions: z
    .array(
      z.object({
        prompt: z.string().min(5),
        options: z.array(z.string().min(1)).min(3).max(5),
        correct: z.array(z.number().int().min(0)).min(1),
        explanation: z.string().min(3),
      })
    )
    .min(1),
});

const aiCases = z.object({
  tasks: z
    .array(
      z.object({
        prompt: z.string().min(10),
        model_answer: z.string().min(5),
      })
    )
    .min(1),
});

function blockToText(b: Block): string {
  switch (b.type) {
    case "p":
      return b.text;
    case "list":
      return b.items.map((i) => `- ${i}`).join("\n");
    case "important":
    case "example":
      return `${b.title ? b.title + ": " : ""}${b.text}`;
    case "table":
      return [b.head.join(" | "), ...b.rows.map((r) => r.join(" | "))].join("\n");
  }
}

/** Theory of the chosen lessons flattened to plain text, capped so the prompt stays small. */
function theoryContext(lessons: LessonId[]): string {
  const text = lessons
    .map((id) => {
      const lesson = getLesson(id);
      const sections = getTheoryForLesson(id)
        .map((s) => `### ${s.title}\n${s.blocks.map(blockToText).join("\n")}`)
        .join("\n\n");
      return `## ${lesson?.title ?? id}\n${sections}`;
    })
    .join("\n\n")
    .replace(/\*\*/g, "");
  return text.length > 24000 ? text.slice(0, 24000) : text;
}

const DIFFICULTY_HINT = {
  latwy: "łatwy poziom: pojedyncze fakty, definicje, liczby wprost z materiału",
  sredni: "średni poziom: powiązanie dwóch faktów, rozróżnianie podobnych pojęć",
  trudny: "trudny poziom olimpijski: wyjątki od reguł, porównania, drobne liczby i terminy, pułapki w dystraktorach",
} as const;

const SYSTEM = [
  "Jesteś trenerem do Olimpiady „Warto wiedzieć więcej o ubezpieczeniach społecznych” (ZUS), piszesz po polsku.",
  "Korzystaj WYŁĄCZNIE z dostarczonego materiału. Nie zmyślaj liczb, terminów ani przepisów, których w materiale nie ma.",
  "Każda poprawna odpowiedź musi wynikać wprost z materiału. Wyjaśnienie odwołuje się do konkretnej reguły.",
].join(" ");

export async function generateAiTasks(input: unknown): Promise<ActionResult<Question[]>> {
  const parsed = generateInput.safeParse(input);
  if (!parsed.success) return actionFailure("Nieprawidłowe parametry generowania.");
  const { lessons, count, kind, difficulty } = parsed.data;

  const context = theoryContext(lessons);
  const stamp = Date.now().toString(36);

  try {
    if (kind === "quiz") {
      const raw = await askAIForJSON<unknown>({
        system: SYSTEM,
        maxTokens: 4096,
        prompt: [
          `Na podstawie materiału ułóż ${count} NOWYCH pytań wielokrotnego wyboru w stylu olimpiady (${DIFFICULTY_HINT[difficulty]}).`,
          "Każde pytanie ma 4 opcje (A–D). Zwykle jedna poprawna; czasem 2–3 poprawne – wtedy w pytaniu zaznacz, że może być kilka odpowiedzi.",
          "`correct` to indeksy poprawnych opcji liczone od 0. Opcje nie mogą się wzajemnie wykluczać w sposób zdradzający odpowiedź i nie używaj „wszystkie powyższe”.",
          "",
          "MATERIAŁ:",
          context,
        ].join("\n"),
        schema: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                prompt: { type: "string" },
                options: { type: "array", items: { type: "string" } },
                correct: { type: "array", items: { type: "integer" } },
                explanation: { type: "string" },
              },
              required: ["prompt", "options", "correct", "explanation"],
            },
          },
        },
      });
      const result = aiQuestions.safeParse(raw);
      if (!result.success) return actionFailure("AI zwróciło zadania w złym formacie. Spróbuj ponownie.");

      const questions: Question[] = result.data.questions
        .filter((q) => q.correct.every((i) => i < q.options.length))
        .map((q, i) => ({
          id: `ai-${stamp}-${i}`,
          lesson: lessons[0],
          type: q.correct.length > 1 ? ("multi" as const) : ("single" as const),
          prompt: q.prompt,
          options: q.options,
          correct: [...new Set(q.correct)],
          explanation: q.explanation,
          source: "AI",
        }));
      if (questions.length === 0) return actionFailure("AI nie wygenerowało poprawnych pytań. Spróbuj ponownie.");
      return { ok: true, data: questions };
    }

    const raw = await askAIForJSON<unknown>({
      system: SYSTEM,
      maxTokens: 4096,
      prompt: [
        `Ułóż ${count} krótkich zadań-przypadków (jak „Zadanie 1–4” w podręczniku: opis sytuacji osoby + pytanie typu „Na jakie świadczenia może liczyć?”, „Jakie składki musi płacić?”) – ${DIFFICULTY_HINT[difficulty]}.`,
        "Do każdego podaj `model_answer` – wzorową, zwięzłą odpowiedź (2–5 zdań) uzasadnioną regułami z materiału.",
        "Używaj konkretnych imion i dat, kwoty tylko z materiału.",
        "",
        "MATERIAŁ:",
        context,
      ].join("\n"),
      schema: {
        tasks: {
          type: "array",
          items: {
            type: "object",
            properties: { prompt: { type: "string" }, model_answer: { type: "string" } },
            required: ["prompt", "model_answer"],
          },
        },
      },
    });
    const result = aiCases.safeParse(raw);
    if (!result.success) return actionFailure("AI zwróciło zadania w złym formacie. Spróbuj ponownie.");

    return {
      ok: true,
      data: result.data.tasks.map((t, i) => ({
        id: `ai-${stamp}-${i}`,
        lesson: lessons[0],
        type: "open" as const,
        prompt: t.prompt,
        explanation: t.model_answer,
        source: "AI",
      })),
    };
  } catch (err) {
    console.error("[zusia] generateAiTasks failed:", err);
    const msg = err instanceof Error && /GROQ_API_KEY/.test(err.message)
      ? "AI jest niedostępne: brak klucza GROQ_API_KEY w konfiguracji serwera."
      : "Nie udało się wygenerować zadań. Spróbuj ponownie za chwilę.";
    return actionFailure(msg);
  }
}

const gradeInput = z.object({
  lesson: z.enum(LESSON_IDS),
  task: z.string().min(5).max(2000),
  modelAnswer: z.string().min(1).max(4000),
  studentAnswer: z.string().min(1).max(4000),
});

const gradeResult = z.object({
  score: z.number().min(0).max(100),
  verdict: z.string(),
  missing: z.array(z.string()),
});

export interface OpenGrade {
  score: number;
  verdict: string;
  missing: string[];
}

export async function gradeOpenAnswer(input: unknown): Promise<ActionResult<OpenGrade>> {
  const parsed = gradeInput.safeParse(input);
  if (!parsed.success) return actionFailure("Wpisz odpowiedź (maks. 4000 znaków).");
  const { lesson, task, modelAnswer, studentAnswer } = parsed.data;

  try {
    const raw = await askAIForJSON<unknown>({
      system:
        "Oceniasz odpowiedź ucznia na zadanie z olimpiady o ubezpieczeniach społecznych (ZUS). Pisz po polsku, życzliwie i konkretnie. Opieraj się na wzorcowej odpowiedzi i materiale; nie wymagaj informacji spoza nich.",
      maxTokens: 800,
      prompt: [
        `ZADANIE:\n${task}`,
        `WZORCOWA ODPOWIEDŹ:\n${modelAnswer}`,
        `ODPOWIEDŹ UCZNIA:\n${studentAnswer}`,
        `Materiał pomocniczy (lekcja):\n${theoryContext([lesson]).slice(0, 6000)}`,
        "Oceń 0–100 (100 = zawiera wszystkie kluczowe elementy wzoru). W `verdict` 1–3 zdania, w `missing` wypisz brakujące lub błędne elementy (może być pusta lista).",
      ].join("\n\n"),
      schema: {
        score: { type: "number" },
        verdict: { type: "string" },
        missing: { type: "array", items: { type: "string" } },
      },
    });
    const result = gradeResult.safeParse(raw);
    if (!result.success) return actionFailure("AI zwróciło ocenę w złym formacie. Spróbuj ponownie.");
    return { ok: true, data: { ...result.data, score: Math.round(result.data.score) } };
  } catch (err) {
    console.error("[zusia] gradeOpenAnswer failed:", err);
    return actionFailure("Nie udało się ocenić odpowiedzi. Porównaj ją samodzielnie ze wzorem.");
  }
}
