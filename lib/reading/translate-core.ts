// ============================================================================
// lib/reading/translate-core.ts
// Czysta logika odporności tłumaczenia słów: które błędy są przejściowe, ponowienia
// z limitem czasu na próbę, walidacja przykładowych zdań i podświetlanie słowa w
// zdaniu. Bez I/O i bez importów z serwera — używana przez trasę API i testy.
// ============================================================================
import type { WordExample } from "@/lib/reading/translate-types";

/** Próba, która nie zmieściła się w limicie czasu. Traktowana jak błąd przejściowy. */
export class AttemptTimeoutError extends Error {
  constructor(ms: number) {
    super(`timeout after ${ms} ms`);
    this.name = "AttemptTimeoutError";
  }
}

const TRANSIENT_MESSAGE =
  /did not return a structured response|malformed json|time(?:d)? ?out|timeout|econnreset|etimedout|enotfound|eai_again|fetch failed|connection error|network|socket|overloaded|rate.?limit|temporarily|try again/i;

/**
 * Czy warto ponowić. Przejściowe: limit zapytań (429), 408, błędy 5xx, zerwane
 * połączenie, przekroczony czas oraz odpowiedź modelu bez wywołania narzędzia albo z
 * uszkodzonym JSON-em (zdarza się, gdy model zostanie ucięty w trakcie). Błędy
 * klienta (400/401/403/404) nie przejdą przy kolejnej próbie, więc ich nie ponawiamy.
 */
export function isTransientError(error: unknown): boolean {
  if (error instanceof AttemptTimeoutError) return true;
  const status = (error as { status?: unknown } | null)?.status;
  if (typeof status === "number") return status === 429 || status === 408 || status >= 500;
  const message = error instanceof Error ? error.message : String(error ?? "");
  return TRANSIENT_MESSAGE.test(message);
}

export interface RetryOptions {
  /** Łącznie prób (pierwsza + ponowienia). */
  attempts?: number;
  /** Przerwa przed kolejną próbą, w ms; ostatnia wartość powtarza się, gdy prób jest więcej. */
  delaysMs?: number[];
  /** Limit czasu jednej próby. */
  timeoutMs?: number;
  sleep?: (ms: number) => Promise<void>;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Wykonuje `run`, ponawiając błędy przejściowe. Każda próba ma własny limit czasu,
 * bo wisząca odpowiedź jest gorsza od błędu: błąd można ponowić, a zawieszone
 * żądanie tylko zjada czas, który funkcja ma na całość.
 */
export async function withRetries<T>(run: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { attempts = 3, delaysMs = [250, 700], timeoutMs = 9000, sleep = wait } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        run(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new AttemptTimeoutError(timeoutMs)), timeoutMs);
        }),
      ]);
    } catch (error) {
      lastError = error;
      if (attempt === attempts - 1 || !isTransientError(error)) throw error;
      await sleep(delaysMs[Math.min(attempt, delaysMs.length - 1)] ?? 0);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
  throw lastError;
}

/**
 * Przykłady od modelu bywają niepełne (brak tłumaczenia, puste pola, duplikaty).
 * Zostawiamy tylko kompletne pary, bez powtórzeń, nie więcej niż `max`.
 */
export function normalizeExamples(raw: unknown, max = 2): WordExample[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const examples: WordExample[] = [];
  for (const item of raw) {
    const sentence = String((item as { sentence?: unknown } | null)?.sentence ?? "").trim();
    const translation = String((item as { translation?: unknown } | null)?.translation ?? "").trim();
    if (!sentence || !translation || sentence.length > 220 || translation.length > 220) continue;
    const key = sentence.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    examples.push({ sentence, translation });
    if (examples.length >= max) break;
  }
  return examples;
}

export interface HighlightPart {
  text: string;
  match: boolean;
}

/**
 * Dzieli zdanie na fragmenty, żeby podświetlić w nim szukane słowo (w każdej z
 * podanych form, bez względu na wielkość liter). Granice słów są liczone po
 * literach Unicode, więc "go" nie zaznaczy się w "ago" ani w "goal".
 */
export function splitForHighlight(sentence: string, forms: string[]): HighlightPart[] {
  const unique = [...new Set(forms.map((f) => f.trim()).filter(Boolean))].sort((a, b) => b.length - a.length);
  if (unique.length === 0) return [{ text: sentence, match: false }];

  const escaped = unique.map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(?<![\\p{L}\\p{M}])(?:${escaped.join("|")})(?![\\p{L}\\p{M}])`, "giu");

  const parts: HighlightPart[] = [];
  let cursor = 0;
  for (const match of sentence.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > cursor) parts.push({ text: sentence.slice(cursor, start), match: false });
    parts.push({ text: match[0], match: true });
    cursor = start + match[0].length;
  }
  if (cursor < sentence.length) parts.push({ text: sentence.slice(cursor), match: false });
  return parts.length > 0 ? parts : [{ text: sentence, match: false }];
}
