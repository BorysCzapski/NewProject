// ============================================================================
// lib/writing/hints.ts
// "Przydatne słówka" do zadania pisemnego: kilka słów i zwrotów, które mogą się
// przydać w odpowiedzi na dane polecenie. Wołane z trasy API
// (app/api/writing/hints/route.ts) — z tego samego powodu co tłumaczenie w czytankach:
// równoległe, przerywalne żądanie zamiast kolejkowanej akcji serwerowej.
//
// Podpowiedzi mają pomóc, a nie napisać odpowiedź za ucznia: słownictwo "wokół"
// tematu, nie gotowe zdania, i bez powtarzania słów z samego polecenia.
// ============================================================================
import "server-only";
import { askAIForJSON } from "@/lib/ai";
import { langInfo } from "@/lib/languages";
import { hasHints, normalizeHints, type WritingHints } from "@/lib/writing/hints-core";
import { withRetries } from "@/lib/reading/translate-core";
import type { WritingTask } from "@/lib/types/database";

/** Ten komunikat rozpoznaje isTransientError, więc brak treści = ponowienie. */
const EMPTY = "The AI did not return a structured response.";

export async function generateWritingHints(
  task: Pick<WritingTask, "language" | "level" | "scenario" | "min_words" | "max_words">
): Promise<WritingHints> {
  const info = langInfo(task.language);

  // Domyślne trzy próby po 9 s mieszczą się w maxDuration trasy (30 s).
  return withRetries(
    async () => {
      const result = await askAIForJSON<{ words: unknown; phrases: unknown }>({
        system:
          `Jesteś nauczycielem języka ${info.pl}ego, który pomaga Polakowi napisać krótką pracę. ` +
          `Dostajesz polecenie zadania. Podaj słownictwo, które może się przydać w odpowiedzi — ` +
          `NIE pisz odpowiedzi ani gotowych zdań. words: 6-8 pojedynczych słów (rzeczowniki, ` +
          `czasowniki, przymiotniki ściśle związane z sytuacją z polecenia, w formie słownikowej); ` +
          `phrases: 3-4 krótkie, przydatne zwroty (2-5 wyrazów, np. na otwarcie, prośbę, ` +
          `podziękowanie, zależnie od typu pracy). Wszystko w języku ${info.pl}m (${info.en}), ` +
          `do każdej pozycji krótkie polskie znaczenie w polu translation. Dopasuj trudność do ` +
          `poziomu ucznia (nie podawaj słów wyraźnie trudniejszych). Nie powtarzaj słów, które ` +
          `już są w treści polecenia.`,
        prompt:
          `Poziom ucznia: ${task.level}. Długość odpowiedzi: ${task.min_words}-${task.max_words} słów.\n` +
          `Polecenie zadania: "${task.scenario}"`,
        schema: {
          words: {
            type: "array",
            items: {
              type: "object",
              properties: { term: { type: "string" }, translation: { type: "string" } },
              required: ["term", "translation"],
            },
          },
          phrases: {
            type: "array",
            items: {
              type: "object",
              properties: { term: { type: "string" }, translation: { type: "string" } },
              required: ["term", "translation"],
            },
          },
        },
        // Model rozumujący: tokeny rozumowania liczą się do limitu (patrz lib/reading/translate.ts).
        maxTokens: 1200,
      });

      const hints = normalizeHints(result);
      if (!hasHints(hints)) throw new Error(EMPTY);
      return hints;
    }
  );
}
