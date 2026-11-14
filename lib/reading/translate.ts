// ============================================================================
// lib/reading/translate.ts
// Dwie małe funkcje AI dla "dotknij słowa w czytance": tłumaczenie słowa w kontekście
// zdania oraz przykładowe zdania z tym słowem. Wołane z trasy API
// (app/api/reading/translate/route.ts), nie z akcji serwerowej — patrz komentarz tam.
//
// Skąd ta ostrożność. Domyślny model (gpt-oss) rozumuje, a tokeny rozumowania liczą
// się do `max_completion_tokens`. Przy ciasnym limicie odpowiedź bywa ucinana, zanim
// model wywoła narzędzie, i helper rzuca "did not return a structured response" —
// raz tak, raz nie. Dlatego limity są hojne (to nie zwiększa kosztu: model i tak
// pisze krótko), a błędy przejściowe są ponawiane (lib/reading/translate-core.ts).
// ============================================================================
import "server-only";
import { askAIForJSON } from "@/lib/ai";
import { langInfo } from "@/lib/languages";
import { normalizeExamples, withRetries } from "@/lib/reading/translate-core";
import type { WordExample, WordRequest, WordTranslation } from "@/lib/reading/translate-types";

/** Ten komunikat rozpoznaje isTransientError, więc brak treści = ponowienie. */
const EMPTY = "The AI did not return a structured response.";

export async function translateWordInContext({ word, sentence, language }: WordRequest): Promise<WordTranslation> {
  const info = langInfo(language);

  return withRetries(async () => {
    const result = await askAIForJSON<WordTranslation>({
      system:
        `Jesteś słownikiem ${info.pl}o-polskim dla uczniów. Dostajesz jedno słowo w języku ${info.pl}m ` +
        `(${info.en}) i zdanie, w którym wystąpiło. Podaj: lemma — formę podstawową (słownikową) tego ` +
        `słowa; translation — najlepsze POLSKIE odpowiedniki w TYM kontekście (1-3 krótkie, po ` +
        `przecinku, najtrafniejszy pierwszy); partOfSpeech — część mowy po polsku jednym słowem; ` +
        `note — maksymalnie jedno krótkie zdanie po polsku, tylko gdy coś pomaga (np. "forma przeszła ` +
        `od go", "wyrażenie potoczne"), w przeciwnym razie pusty tekst. Nie tłumacz całego zdania.`,
      prompt: `Słowo: "${word}"\nZdanie: "${sentence || word}"`,
      schema: {
        lemma: { type: "string" },
        translation: { type: "string" },
        partOfSpeech: { type: "string" },
        note: { type: "string" },
      },
      maxTokens: 800,
    });

    const translation = String(result?.translation ?? "").trim();
    if (!translation) throw new Error(EMPTY);
    return {
      lemma: String(result.lemma ?? "").trim() || word,
      translation,
      partOfSpeech: String(result.partOfSpeech ?? "").trim(),
      note: String(result.note ?? "").trim(),
    };
  });
}

export async function exampleSentencesFor({ word, sentence, language }: WordRequest): Promise<WordExample[]> {
  const info = langInfo(language);

  return withRetries(async () => {
    const result = await askAIForJSON<{ examples: unknown }>({
      system:
        `Jesteś nauczycielem języka ${info.pl}ego dla Polaków. Dostajesz słowo w języku ${info.pl}m ` +
        `(${info.en}) i zdanie, w którym wystąpiło. Napisz DWA NOWE, krótkie (do 12 słów), naturalne ` +
        `zdania w języku ${info.pl}m, w których pojawia się to słowo (może być odmienione) w TYM SAMYM ` +
        `znaczeniu co w podanym zdaniu. Użyj prostego słownictwa (poziom A2-B1). Do każdego dodaj ` +
        `polskie tłumaczenie w polu translation. Nie powtarzaj podanego zdania.`,
      prompt: `Słowo: "${word}"\nZdanie, w którym wystąpiło: "${sentence || word}"`,
      schema: {
        examples: {
          type: "array",
          items: {
            type: "object",
            properties: { sentence: { type: "string" }, translation: { type: "string" } },
            required: ["sentence", "translation"],
          },
        },
      },
      maxTokens: 1000,
    });

    const examples = normalizeExamples(result?.examples, 2);
    if (examples.length === 0) throw new Error(EMPTY);
    return examples;
  });
}
