"use server";

// ============================================================================
// lib/reading/translate-actions.ts
// "Dotknij słowa w czytance, zobacz polskie tłumaczenie". Tłumaczy JEDNO słowo
// w kontekście zdania, w którym je dotknięto — samo słowo bywa niejednoznaczne
// ("light", "bank", "руда"), a odmieniona forma ("went", "estás") nie jest
// hasłem słownikowym, więc oprócz tłumaczenia zwracamy też formę podstawową.
//
// Każde dotknięcie to jedno małe wywołanie AI, więc akcja wymaga zalogowania,
// ogranicza wielkość wejścia, a klient trzyma wynik w pamięci i nie pyta o to
// samo słowo w tym samym zdaniu drugi raz (components/reading/word-translation.tsx).
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { askAIForJSON } from "@/lib/ai";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { langInfo } from "@/lib/languages";
import type { TargetLanguage } from "@/lib/types/database";

export interface WordTranslation {
  /** Forma słownikowa ("went" → "go"). */
  lemma: string;
  /** Najlepsze polskie odpowiedniki w tym kontekście, krótko. */
  translation: string;
  /** Część mowy po polsku ("czasownik"). */
  partOfSpeech: string;
  /** Krótka uwaga (forma gramatyczna, idiom); pusta, gdy nie ma nic do dodania. */
  note: string;
}

const LANGUAGES: TargetLanguage[] = ["en", "es", "ru"];
const MAX_WORD = 40;
const MAX_SENTENCE = 400;

export async function translateWord(input: {
  word: string;
  sentence: string;
  language: TargetLanguage;
}): Promise<ActionResult<WordTranslation>> {
  await requireProfile();

  const word = String(input.word ?? "").trim();
  const sentence = String(input.sentence ?? "").trim().slice(0, MAX_SENTENCE);
  if (!word || word.length > MAX_WORD || /\s/.test(word)) return actionFailure("Nie rozpoznano słowa.");
  if (!LANGUAGES.includes(input.language)) return actionFailure("Nieznany język tekstu.");

  const info = langInfo(input.language);

  try {
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
      maxTokens: 220,
    });

    const translation = String(result?.translation ?? "").trim();
    if (!translation) return actionFailure("Nie udało się znaleźć tłumaczenia tego słowa.");
    return {
      ok: true,
      data: {
        lemma: String(result.lemma ?? "").trim() || word,
        translation,
        partOfSpeech: String(result.partOfSpeech ?? "").trim(),
        note: String(result.note ?? "").trim(),
      },
    };
  } catch (error) {
    console.error("[reading] translateWord failed:", error);
    return actionFailure("Nie udało się pobrać tłumaczenia. Spróbuj ponownie.");
  }
}
