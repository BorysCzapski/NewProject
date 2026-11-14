// ============================================================================
// lib/reading/translate-client.ts
// Warstwa sieciowa tłumaczenia słów w przeglądarce: fetch do trasy API z
//  - przerywaniem: nowe dotknięcie przerywa poprzednie żądanie (nic nie stoi w
//    kolejce, w przeciwieństwie do akcji serwerowych);
//  - limitem czasu jednej próby i ponowieniami błędów przejściowych (serwer też
//    ponawia, ale to chroni przed zerwanym połączeniem i zawieszoną odpowiedzią);
//  - rozpoznawaniem odpowiedzi, która nie jest JSON-em: wygasła sesja kończy się na
//    stronie logowania (HTML), a bramka potrafi odesłać stronę błędu.
// Bez zależności od serwera, więc działa w przeglądarce i w testach.
// ============================================================================
import type { PartResult, WordApi, WordPart, WordRequest } from "@/lib/reading/translate-types";

const ENDPOINT = "/api/reading/translate";
const ATTEMPT_TIMEOUT_MS = 20_000;
/** Przerwy przed 2. i 3. próbą. */
const RETRY_DELAYS_MS = [350, 900];

function abortError(): Error {
  return new DOMException("Aborted", "AbortError");
}

/** Czeka `ms`, ale natychmiast przerywa, gdy wywołujący zrezygnował. */
function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(abortError());
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

async function attempt<T>(part: WordPart, request: WordRequest, signal: AbortSignal): Promise<PartResult<T>> {
  // Osobny kontroler: limit czasu przerywa TĘ próbę, a nie całe dotknięcie.
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ part, ...request }),
      signal: controller.signal,
    });

    const isJson = (response.headers.get("content-type") ?? "").includes("application/json");
    if (!isJson) {
      // Niezalogowany użytkownik jest przekierowywany na stronę logowania (HTML).
      if (response.redirected || response.status === 401 || response.status === 403) {
        return { ok: false, error: "Sesja wygasła — zaloguj się ponownie.", retryable: false };
      }
      // Strona błędu bramki (np. 504 po przekroczeniu czasu funkcji) — warto spróbować jeszcze raz.
      return { ok: false, error: "Serwer chwilowo nie odpowiada.", retryable: response.status >= 500 };
    }

    try {
      return (await response.json()) as PartResult<T>;
    } catch {
      return { ok: false, error: "Serwer zwrócił nieprawidłową odpowiedź.", retryable: true };
    }
  } catch (error) {
    if (signal.aborted) throw error; // wywołujący poszedł dalej — to nie jest błąd do pokazania
    return {
      ok: false,
      error: controller.signal.aborted ? "Serwer zbyt długo odpowiada." : "Brak połączenia z serwerem.",
      retryable: true,
    };
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", onAbort);
  }
}

/** Jedna "część" (tłumaczenie albo przykłady) z automatycznymi ponowieniami. */
export async function requestPart<T>(
  part: WordPart,
  request: WordRequest,
  signal: AbortSignal
): Promise<PartResult<T>> {
  let result = await attempt<T>(part, request, signal);
  for (const delay of RETRY_DELAYS_MS) {
    if (result.ok || !result.retryable) return result;
    await sleep(delay, signal);
    result = await attempt<T>(part, request, signal);
  }
  return result;
}

export const defaultWordApi: WordApi = {
  translate: (request, signal) => requestPart("translation", request, signal),
  examples: (request, signal) => requestPart("examples", request, signal),
};
