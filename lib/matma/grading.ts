// ============================================================================
// lib/matma/grading.ts
// AI grading for open-ended / proof problems, and the "explain differently
// on repeated mistakes" hint generator. Numeric-only problems (student
// typed just a final result, no method) are checked programmatically first
// — see isNumericOnlyCorrect() — so a plain right/wrong answer never needs
// an AI round-trip; AI grading is reserved for anything with a method/proof
// to evaluate, exactly the "jednoznaczny wynik liczbowy" vs "zadanie
// otwarte" split called out in the product spec.
// ============================================================================
import "server-only";
import { askAI, askAIForJSON, askAIForJSONWithImage } from "@/lib/ai";
import { normalizeMathAnswer } from "@/lib/matma/lesson-blocks";
import type { MathAiFeedback, MathGradingCriterion, MathProblemContent } from "@/lib/types/database";

const GRADING_SYSTEM_PROMPT =
  "Jesteś egzaminatorem CKE oceniającym rozwiązanie zadania otwartego z matury rozszerzonej z matematyki. " +
  "Oceniaj WYŁĄCZNIE na podstawie podanego analitycznego schematu punktowania (kryteria) dla tego konkretnego " +
  "zadania — nie oceniaj wg własnej intuicji, jeśli jest sprzeczna z tym schematem. Zasady: " +
  "1) Przyznawaj punkty cząstkowe krok po kroku zgodnie ze schematem (np. punkt za poprawną metodę/założenie, " +
  "punkt za poprawne przekształcenie, punkt za wynik z odpowiednią dokładnością/jednostką) — NIGDY nie oceniaj " +
  "zero-jedynkowo całego zadania, jeśli schemat przewiduje więcej punktów cząstkowych. " +
  "2) Jeśli rozwiązanie jest oparte na błędnym założeniu merytorycznym na starcie, ale dalsze przekształcenia są " +
  "logicznie poprawne względem tego (błędnego) założenia — zastosuj zasadę z prawdziwych kryteriów CKE: taka " +
  "praca zwykle NIE otrzymuje punktów za etapy zależne od błędnego założenia, nawet jeśli rachunki po drodze są " +
  "bezbłędne. Wyjaśnij to uczniowi wprost w uzasadnieniu tego kroku. " +
  "3) Dla zadań dowodowych: oceń KOMPLETNOŚĆ I POPRAWNOŚĆ TOKU ROZUMOWANIA, nie istnienie jednej „poprawnej " +
  "liczby”. Wskaż KONKRETNY krok, w którym rozumowanie się załamuje lub ma lukę, jeśli występuje. " +
  "4) Zwróć rozbicie per krok schematu (spełniony/niespełniony + uzasadnienie) oraz jedną konkretną, praktyczną " +
  "wskazówkę do poprawy. " +
  "5) Odpowiadasz PO POLSKU, tonem nauczyciela matematyki — rzeczowo, bez zbędnej pochwały ani krytyki.";

const GRADING_SCHEMA = {
  points_awarded: { type: "number", description: "suma punktów cząstkowych przyznanych uczniowi" },
  step_breakdown: {
    type: "array",
    description: "rozbicie oceny na kroki zgodnie z podanym schematem punktowania",
    items: {
      type: "object",
      properties: {
        step: { type: "string", description: "nazwa/opis kroku ze schematu punktowania" },
        points_awarded: { type: "number" },
        points_possible: { type: "number" },
        satisfied: { type: "boolean" },
        justification: { type: "string", description: "krótkie uzasadnienie po polsku" },
      },
      required: ["step", "points_awarded", "points_possible", "satisfied", "justification"],
    },
  },
  improvement_tip: {
    type: "string",
    description: "jedna konkretna, praktyczna wskazówka do poprawy, po polsku",
  },
};

interface GradeProblemInput {
  content: MathProblemContent;
  gradingCriteria: MathGradingCriterion[];
  pointsMax: number;
  isProof: boolean;
}

function buildGradingPrompt(
  problem: GradeProblemInput,
  answerText: string | null,
  methodDescription: string | null,
  previousImprovementTips: string[]
) {
  const criteriaText = problem.gradingCriteria.length
    ? problem.gradingCriteria.map((c) => `- (${c.points} pkt) ${c.step}: ${c.description}`).join("\n")
    : "(brak szczegółowego schematu — oceń wg standardowych zasad CKE: metoda, przekształcenia, wynik z uzasadnieniem)";

  const historyText = previousImprovementTips.length
    ? `\n\nUczeń podchodził do tego zadania wcześniej i otrzymał już te wskazówki (jeśli znowu popełnia błąd, ` +
      `sformułuj "improvement_tip" INACZEJ niż poniższe — inny sposób tłumaczenia, prostszy język, więcej ` +
      `mini-kroków — nie powtarzaj tej samej treści):\n` +
      previousImprovementTips.map((t, i) => `${i + 1}. ${t}`).join("\n")
    : "";

  return (
    `Treść zadania:\n${problem.content.statement}\n\n` +
    `Maksymalna liczba punktów: ${problem.pointsMax}\n` +
    `Zadanie na dowodzenie: ${problem.isProof ? "tak" : "nie"}\n\n` +
    `Schemat punktowania:\n${criteriaText}\n\n` +
    `Odpowiedź/wynik podany przez ucznia: ${answerText?.trim() || "(brak)"}\n` +
    `Opis metody / toku rozwiązania podany przez ucznia: ${methodDescription?.trim() || "(brak — patrz ewentualny załączony obraz brudnopisu)"}` +
    historyText
  );
}

/**
 * Grades one attempt. If `canvasImageDataUrl` is given, tries the vision
 * fallback (Warstwa 2) first so the AI can read the student's handwritten
 * working, not just the typed summary — and silently falls back to
 * text-only grading if no vision model is currently available on Groq.
 * `previousImprovementTips` (this student's past tips for the SAME problem)
 * lets the grader vary its wording instead of repeating itself on retries.
 */
export async function gradeProblemAttempt(params: {
  problem: GradeProblemInput;
  answerText: string | null;
  methodDescription: string | null;
  canvasImageDataUrl?: string | null;
  previousImprovementTips?: string[];
}): Promise<MathAiFeedback> {
  const prompt = buildGradingPrompt(
    params.problem,
    params.answerText,
    params.methodDescription,
    params.previousImprovementTips ?? []
  );

  if (params.canvasImageDataUrl) {
    try {
      const graded = await askAIForJSONWithImage<Omit<MathAiFeedback, "max_points">>({
        system: GRADING_SYSTEM_PROMPT,
        prompt:
          prompt +
          "\n\nZałączono zdjęcie/skan odręcznego rozwiązania ucznia (brudnopis) — oceń widoczny na nim tok " +
          "rozwiązania jakościowo, tak jak nauczyciel patrzący na kartkę pracy.",
        imageUrl: params.canvasImageDataUrl,
        schema: GRADING_SCHEMA,
      });
      return { ...graded, max_points: params.problem.pointsMax };
    } catch (err) {
      console.error("[matma] vision grading unavailable, falling back to text-only:", err);
    }
  }

  const graded = await askAIForJSON<Omit<MathAiFeedback, "max_points">>({
    system: GRADING_SYSTEM_PROMPT,
    prompt,
    schema: GRADING_SCHEMA,
  });
  return { ...graded, max_points: params.problem.pointsMax };
}

/** True when the problem has no method/proof to evaluate and the student's
 * typed answer can be compared programmatically against accepted answers
 * extracted from the grading criteria's final step — used to skip the AI
 * round-trip entirely for plain "type the number" checks. */
export function isNumericOnlyCorrect(answerText: string, acceptedAnswers: string[]): boolean {
  if (acceptedAnswers.length === 0) return false;
  return acceptedAnswers.some((a) => normalizeMathAnswer(a) === normalizeMathAnswer(answerText));
}

const HINT_SYSTEM_PROMPT =
  "Jesteś nauczycielem matematyki przygotowującym ucznia do matury rozszerzonej. Twoim zadaniem jest podać " +
  "wskazówkę, JAK podejść do zadania — bez podawania gotowego wyniku ani pełnego rozwiązania. Jeśli w wiadomości " +
  "podano wcześniejsze wyjaśnienia tego samego zadania, Twoje nowe wyjaśnienie MUSI użyć INNEGO podejścia (inna " +
  "analogia, prostszy język, więcej mniejszych kroków pośrednich) — nie powtarzaj tej samej treści innymi słowami, " +
  "uczeń już jej nie zrozumiał. Odpowiadasz PO POLSKU, zwięźle (3-5 zdań).";

/** Generates a hint, forced to differ from any prior hints for this problem
 * (see product spec: repeated mistakes get a DIFFERENTLY worded explanation,
 * not a repeat of the same one). */
export async function explainProblemDifferently(params: {
  problemStatement: string;
  previousHints: string[];
}): Promise<string> {
  const prompt =
    `Treść zadania:\n${params.problemStatement}\n\n` +
    (params.previousHints.length
      ? `Wcześniejsze wyjaśnienia tego zadania (NIE powtarzaj ich sformułowań ani sposobu tłumaczenia):\n` +
        params.previousHints.map((h, i) => `${i + 1}. ${h}`).join("\n") +
        "\n\n"
      : "") +
    "Podaj wskazówkę, jak podejść do tego zadania krok po kroku.";

  return askAI({ system: HINT_SYSTEM_PROMPT, prompt, maxTokens: 400 });
}
