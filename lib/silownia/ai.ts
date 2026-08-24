// ============================================================================
// lib/silownia/ai.ts
// Szacowanie kalorii i makroskładników posiłku z opisu tekstowego. Zdjęcie
// posiłku (spec: "opis lub zdjęcie, jeśli planowane") NIE jest tu wspierane —
// świadomie pominięte na start; askAIForJSONWithImage w lib/ai.ts jest
// gotowe, gdyby to dokładać później, ale MVP celuje w opis tekstowy, który
// pokrywa większość realnych wpisów przy dużo prostszym UI (bez uploadu).
// ============================================================================
import "server-only";
import { askAIForJSON } from "@/lib/ai";

export interface MealEstimate {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  note: string;
}

const SYSTEM_PROMPT =
  "Jesteś dietetykiem szacującym wartość odżywczą posiłku na podstawie jego opisu w języku polskim. " +
  "Odpowiadasz WYŁĄCZNIE wywołaniem narzędzia 'respond' z realistycznym oszacowaniem dla typowej porcji " +
  "opisanej przez użytkownika. Gdy opis jest niejednoznaczny (brak ilości, niejasny składnik), przyjmij " +
  "przeciętną porcję i NAPISZ o tym założeniu w polu 'note'. Liczby mają być w granicach rozsądku dla " +
  "jednego posiłku (nie całodniowego jadłospisu).";

const MEAL_SCHEMA = {
  calories: { type: "integer", description: "Szacowana liczba kalorii (kcal) dla całej porcji." },
  proteinG: { type: "number", description: "Białko w gramach." },
  carbsG: { type: "number", description: "Węglowodany w gramach." },
  fatG: { type: "number", description: "Tłuszcz w gramach." },
  note: {
    type: "string",
    description: "Krótkie (1 zdanie) wyjaśnienie założeń przyjętych przy szacowaniu, po polsku.",
  },
} as const;

/** Rozsądny górny limit dla JEDNEGO posiłku — chroni przed absurdalnym
 * wynikiem AI (np. 9000 kcal), zamiast pokazać go użytkownikowi bez filtra. */
const MAX_MEAL_CALORIES = 4000;

export async function estimateMealNutrition(description: string): Promise<MealEstimate> {
  const raw = await askAIForJSON<{
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    note: string;
  }>({
    system: SYSTEM_PROMPT,
    prompt: `Opis posiłku: "${description.trim()}"`,
    schema: MEAL_SCHEMA,
    maxTokens: 400,
  });

  return {
    calories: Math.min(MAX_MEAL_CALORIES, Math.max(0, Math.round(raw.calories) || 0)),
    proteinG: Math.max(0, Math.round((raw.proteinG || 0) * 10) / 10),
    carbsG: Math.max(0, Math.round((raw.carbsG || 0) * 10) / 10),
    fatG: Math.max(0, Math.round((raw.fatG || 0) * 10) / 10),
    note: (raw.note || "").trim().slice(0, 300),
  };
}
