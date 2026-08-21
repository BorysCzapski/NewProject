// ============================================================================
// lib/matura/generate-tasks.ts
// Generates ORIGINAL matura_tasks rows for one CKE task type, so a student
// practising a type never runs out of fresh content. Called from
// lib/matura/task-stock.ts, never directly from a page.
//
// ONE task per AI call, deliberately. Matma's generator batches five problems
// per completion and documents why bigger batches broke (the model runs past
// the completion-token budget mid-JSON and Groq rejects the whole tool call as
// invalid, zeroing out the batch — see lib/matma/generate-ai-problems.ts).
// Reading tasks here carry a 220–320-word passage on top of their items, so a
// batch of five would be squarely in that failure zone; one task per call keeps
// every response short and limits the blast radius of a malformed reply to a
// single task.
//
// Writes go through the SERVICE-ROLE client: matura_tasks is shared content
// with an admin-only write policy (0013_matura.sql), and the student topping up
// their own practice queue is not an admin.
// ============================================================================
import "server-only";
import { askAIForJSON } from "@/lib/ai";
import { MATURA_LANGUAGE_LABELS } from "@/lib/matura/constants";
import type { MaturaTaskTypeDef } from "@/lib/matura/task-types";
import type {
  MaturaLanguage,
  MaturaLevel,
  MaturaTaskContent,
  MaturaTaskItem,
} from "@/lib/types/database";

/** Task types whose items are unanswerable without a shared text. */
function needsPassage(typeDef: MaturaTaskTypeDef): boolean {
  return typeDef.section === "czytanie";
}

interface RawItem {
  prompt?: unknown;
  transformWord?: unknown;
  options?: unknown;
  correctAnswers?: unknown;
  explanation?: unknown;
}

interface RawTask {
  instructions?: unknown;
  passage?: unknown;
  items?: unknown;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(text).filter((entry) => entry.length > 0);
}

/**
 * Turns a raw model reply into task content, dropping only the sub-items that
 * are unusable rather than rejecting the whole task. A generator that insists
 * on a perfect reply throws away four good items because the fifth lost its
 * options array — the same tolerance the textbook extractor settled on.
 * Returns null when too little survives to be worth showing.
 */
export function normalizeGeneratedTask(
  raw: RawTask,
  typeDef: MaturaTaskTypeDef
): MaturaTaskContent | null {
  const instructions = text(raw.instructions) || typeDef.description;
  const passage = text(raw.passage);
  if (needsPassage(typeDef) && passage.length < 120) return null;

  const rawItems = Array.isArray(raw.items) ? (raw.items as RawItem[]) : [];
  const items: MaturaTaskItem[] = [];

  for (const rawItem of rawItems) {
    const prompt = text(rawItem.prompt);
    const correctAnswers = stringList(rawItem.correctAnswers);
    if (!prompt || correctAnswers.length === 0) continue;

    if (typeDef.itemType === "multiple_choice") {
      const options = stringList(rawItem.options);
      if (options.length < 2) continue;
      // The grader compares the student's pick to correctAnswers verbatim
      // (lib/matura/grading.ts), so an answer that is not one of the options
      // makes the item impossible to score — recover it by case-insensitive
      // match before giving up on it.
      const matched = options.find(
        (option) => option.toLowerCase() === correctAnswers[0].toLowerCase()
      );
      if (!matched) continue;
      items.push({
        id: String(items.length + 1),
        type: "multiple_choice",
        prompt,
        options,
        correctAnswers: [matched],
        explanation: text(rawItem.explanation) || undefined,
      });
      continue;
    }

    const transformWord = text(rawItem.transformWord);
    items.push({
      id: String(items.length + 1),
      type: "gap_fill",
      prompt,
      transformWord: transformWord || undefined,
      correctAnswers,
      explanation: text(rawItem.explanation) || undefined,
    });
  }

  // Two graded items is the floor worth a student's time; below that the task
  // reads as broken rather than short.
  if (items.length < 2) return null;

  const content: MaturaTaskContent = { instructions, items };
  if (passage) content.passage = passage;
  return content;
}

function systemPrompt(typeDef: MaturaTaskTypeDef, language: MaturaLanguage, level: MaturaLevel): string {
  const languageLabel = MATURA_LANGUAGE_LABELS[language];
  const levelLabel = level === "podstawowa" ? "poziomu podstawowego" : "poziomu rozszerzonego";

  return (
    `Jesteś doświadczonym egzaminatorem CKE układającym ORYGINALNE zadania do matury ${levelLabel} ` +
    `z języka ${languageLabel.toLowerCase()}ego. Układasz zadanie typu „${typeDef.label}” ` +
    `z części „${typeDef.section}”. ` +
    "WAŻNE: wymyśl WŁASNĄ, oryginalną treść — nie kopiuj zadań z arkuszy CKE, podręczników ani stron " +
    "internetowych. Zasady wspólne: " +
    `1) Treść zadania (zdania, tekst, opcje) piszesz w języku ${languageLabel.toLowerCase()}m; ` +
    "polecenie (instructions) i wyjaśnienia (explanation) piszesz PO POLSKU. " +
    `2) Poziom trudności i długość dobierz do ${levelLabel}. ` +
    `3) Wygeneruj DOKŁADNIE ${typeDef.itemCount} podpunktów w polu items. ` +
    "4) Każdy podpunkt musi mieć dokładnie jedną jednoznacznie poprawną odpowiedź; jeśli poprawnych " +
    "wariantów zapisu jest kilka, wypisz je wszystkie w correctAnswers. " +
    "5) Tematyka ma być bliska maturzyście i zróżnicowana — nie powielaj tego samego kontekstu " +
    "w kolejnych podpunktach. " +
    `WYMAGANIA TEGO TYPU ZADANIA: ${typeDef.aiBrief}`
  );
}

function schemaFor(typeDef: MaturaTaskTypeDef): Record<string, unknown> {
  const itemProperties: Record<string, unknown> = {
    prompt: {
      type: "string",
      description:
        typeDef.itemType === "multiple_choice"
          ? "Treść pytania lub zdanie z luką ___."
          : "Zdanie z luką ___ (dokładnie trzy podkreślniki).",
    },
    correctAnswers: {
      type: "array",
      items: { type: "string" },
      description:
        typeDef.itemType === "multiple_choice"
          ? "Jeden element: poprawna opcja przepisana DOSŁOWNIE tak jak w options."
          : "Wszystkie akceptowane warianty odpowiedzi (sam brakujący fragment, nie całe zdanie).",
    },
    explanation: { type: "string", description: "Krótkie wyjaśnienie PO POLSKU, dlaczego ta odpowiedź jest poprawna." },
  };

  if (typeDef.itemType === "multiple_choice") {
    itemProperties.options = {
      type: "array",
      items: { type: "string" },
      description: 'Opcje w formacie "A. tekst", "B. tekst", …',
    };
  } else {
    itemProperties.transformWord = {
      type: "string",
      description: "Wyraz bazowy/kluczowy pokazywany osobno. Pomiń, jeśli ten typ zadania go nie używa.",
    };
  }

  const schema: Record<string, unknown> = {
    instructions: { type: "string", description: "Polecenie do całego zadania, PO POLSKU." },
    items: {
      type: "array",
      description: `Podpunkty zadania — dokładnie ${typeDef.itemCount}.`,
      items: { type: "object", properties: itemProperties, required: ["prompt", "correctAnswers"] },
    },
  };

  if (needsPassage(typeDef)) {
    schema.passage = {
      type: "string",
      description: "Oryginalny tekst do czytania, w języku egzaminu.",
    };
  }

  return schema;
}

/**
 * Generates one task of `typeDef`. Returns null when the model's reply could
 * not be salvaged — callers treat that as "no new task this time", never as a
 * hard failure, because a top-up runs while the student is mid-session.
 *
 * `variationHint` is threaded into the prompt so a burst of parallel calls
 * does not come back with four near-identical tasks: the model sees a
 * different thematic steer each time.
 */
export async function generateMaturaTask(params: {
  typeDef: MaturaTaskTypeDef;
  language: MaturaLanguage;
  level: MaturaLevel;
  variationHint: string;
}): Promise<MaturaTaskContent | null> {
  const { typeDef, language, level, variationHint } = params;
  if (!typeDef.aiGeneratable) return null;

  // Passage-bearing types need room for the text on top of the items.
  const maxTokens = needsPassage(typeDef) ? 3200 : 2000;

  try {
    const raw = await askAIForJSON<RawTask>({
      system: systemPrompt(typeDef, language, level),
      prompt:
        `Ułóż jedno nowe zadanie typu „${typeDef.label}”. ` +
        `Obszar tematyczny na tę próbę: ${variationHint}. ` +
        "Zadanie ma być kompletne i gotowe do rozwiązania przez maturzystę.",
      schema: schemaFor(typeDef),
      maxTokens,
    });
    return normalizeGeneratedTask(raw, typeDef);
  } catch (err) {
    console.error(`[matura] generowanie zadania „${typeDef.slug}" nie powiodło się:`, err);
    return null;
  }
}

/**
 * Thematic steers cycled through when generating a burst of tasks. These are
 * the CKE "zakresy tematyczne" from the Informator — the same list the exam
 * itself draws its contexts from, which is why they double as variation hints.
 */
export const MATURA_TOPIC_AREAS = [
  "człowiek i relacje międzyludzkie",
  "miejsce zamieszkania",
  "edukacja i szkoła",
  "praca i plany zawodowe",
  "życie prywatne i rodzina",
  "żywienie i zdrowy tryb życia",
  "zakupy i usługi",
  "podróżowanie i turystyka",
  "kultura i media",
  "sport i aktywność fizyczna",
  "zdrowie i samopoczucie",
  "nauka i technika",
  "świat przyrody i środowisko",
  "życie społeczne",
];
