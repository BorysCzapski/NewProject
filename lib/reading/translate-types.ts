// ============================================================================
// lib/reading/translate-types.ts
// Typy wspólne dla serwera (trasa API), klienta (hook w czytance) i testów.
// Bez importów runtime, więc można je ładować wszędzie.
// ============================================================================
import type { TargetLanguage } from "@/lib/types/database";

export interface WordRequest {
  word: string;
  sentence: string;
  language: TargetLanguage;
}

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

export interface WordExample {
  /** Zdanie w języku tekstu, z tym słowem. */
  sentence: string;
  /** Jego polskie tłumaczenie. */
  translation: string;
}

/** Dwa osobne żądania: tłumaczenie jest małe i szybkie, przykłady dłuższe. */
export type WordPart = "translation" | "examples";

export type PartResult<T> =
  | { ok: true; data: T }
  /** `retryable`: błąd przejściowy (limit, 5xx, ucięta odpowiedź) — warto spróbować jeszcze raz. */
  | { ok: false; error: string; retryable: boolean };

/** Co hook potrzebuje od warstwy sieciowej; w testach podmienia się to atrapą. */
export interface WordApi {
  translate: (request: WordRequest, signal: AbortSignal) => Promise<PartResult<WordTranslation>>;
  examples: (request: WordRequest, signal: AbortSignal) => Promise<PartResult<WordExample[]>>;
}
