import "server-only";

// ============================================================================
// lib/geografia/grading.ts
// MC grading is purely programmatic (exact option-set match). Map grading
// lives in lib/geografia/map-grading.ts (also programmatic). Open-answer
// grading is DELIBERATELY NOT here as an authoritative scorer — per the
// product spec ("nie zastępować nauczyciela w ocenie otwartych odpowiedzi –
// aplikacja podaje jedynie wskazówki i sugestie"), the student self-assesses
// their own points against the model answer + rubric; requestOpenAnswerHint
// below only ever returns a HINT, never a score, mirroring the "Layer 2
// qualitative, never authoritative" caution already present in
// lib/matma/grading.ts's vision-fallback comment, just made a firm rule here
// instead of a fallback path.
// ============================================================================
import { askAIForJSON } from "@/lib/ai";
import type { GeoExerciseAiFeedback, GeoMcCorrectAnswer, GeoMcAnswer } from "@/lib/types/database";

export function gradeMcAttempt(
  correct: GeoMcCorrectAnswer,
  given: GeoMcAnswer,
  pointsMax: number
): { pointsAwarded: number } {
  const correctSet = new Set(correct.correctOptionIds);
  const givenSet = new Set(given.selectedOptionIds);
  const exactMatch =
    correctSet.size === givenSet.size && [...correctSet].every((id) => givenSet.has(id));
  return { pointsAwarded: exactMatch ? pointsMax : 0 };
}

/**
 * Asks the AI to compare the student's open answer against the model answer
 * + rubric and return a HINT — which rubric points were clearly addressed,
 * which are missing, and one short piece of encouraging Polish feedback.
 * Never returns/implies a point value; the student picks their own score
 * afterward (see components/geografia/exercise/open-self-assessment.tsx).
 */
export async function requestOpenAnswerHint(params: {
  statement: string;
  modelAnswer: string;
  rubric: string[];
  studentAnswer: string;
}): Promise<GeoExerciseAiFeedback> {
  try {
    return await askAIForJSON<GeoExerciseAiFeedback>({
      system:
        "Jesteś korepetytorem geografii przygotowującym ucznia do matury rozszerzonej. Otrzymujesz treść " +
        "pytania otwartego, przykładową (wzorcową) odpowiedź z punktami oceny (rubric) oraz odpowiedź " +
        "ucznia. NIE oceniasz punktowo — Twoim zadaniem jest WYŁĄCZNIE wskazać, które punkty z rubric " +
        "uczeń najwyraźniej poruszył (matchedRubricPoints, dosłowne kopie z listy rubric), które pominął " +
        "lub potraktował zbyt ogólnikowo (missingRubricPoints, też dosłowne kopie z rubric), oraz napisać " +
        "jedną krótką, konkretną i życzliwą wskazówkę po polsku (hint) — co dopisać lub doprecyzować. " +
        "Ostateczną liczbę punktów przyzna sobie sam uczeń, więc NIE sugeruj konkretnej punktacji.",
      prompt:
        `Pytanie: ${params.statement}\n\n` +
        `Przykładowa odpowiedź: ${params.modelAnswer}\n\n` +
        `Punkty oceny:\n${params.rubric.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\n` +
        `Odpowiedź ucznia: ${params.studentAnswer}`,
      schema: {
        hint: { type: "string" },
        matchedRubricPoints: { type: "array", items: { type: "string" } },
        missingRubricPoints: { type: "array", items: { type: "string" } },
      },
      maxTokens: 700,
    });
  } catch (err) {
    console.error("[geografia] requestOpenAnswerHint failed:", err);
    return {
      hint: "Nie udało się wygenerować wskazówki AI — porównaj swoją odpowiedź z przykładową ręcznie.",
      matchedRubricPoints: [],
      missingRubricPoints: [],
    };
  }
}
