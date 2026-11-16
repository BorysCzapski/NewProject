// ============================================================================
// lib/writing/hints-client.ts
// Pobieranie "Przydatnych słówek" w przeglądarce: fetch do trasy API z limitem czasu
// jednej próby, ponowieniami błędów przejściowych i przerywaniem (zamknięcie ekranu
// przerywa żądanie). Ta sama zasada co lib/reading/translate-client.ts: odpowiedź,
// która nie jest JSON-em, oznacza wygasłą sesję albo stronę błędu bramki.
// ============================================================================
import type { WritingHints } from "@/lib/writing/hints-core";

export type HintsResult = { ok: true; data: WritingHints } | { ok: false; error: string; retryable: boolean };

const ENDPOINT = "/api/writing/hints";
const ATTEMPT_TIMEOUT_MS = 28_000;
const RETRY_DELAYS_MS = [400, 1000];

function abortError(): Error {
  return new DOMException("Aborted", "AbortError");
}

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

async function attempt(taskId: string, signal: AbortSignal): Promise<HintsResult> {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
      signal: controller.signal,
    });

    const isJson = (response.headers.get("content-type") ?? "").includes("application/json");
    if (!isJson) {
      if (response.redirected || response.status === 401 || response.status === 403) {
        return { ok: false, error: "Sesja wygasła — zaloguj się ponownie.", retryable: false };
      }
      return { ok: false, error: "Serwer chwilowo nie odpowiada.", retryable: response.status >= 500 };
    }
    try {
      return (await response.json()) as HintsResult;
    } catch {
      return { ok: false, error: "Serwer zwrócił nieprawidłową odpowiedź.", retryable: true };
    }
  } catch (error) {
    if (signal.aborted) throw error;
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

export async function fetchWritingHints(taskId: string, signal: AbortSignal): Promise<HintsResult> {
  let result = await attempt(taskId, signal);
  for (const delay of RETRY_DELAYS_MS) {
    if (result.ok || !result.retryable) return result;
    await sleep(delay, signal);
    result = await attempt(taskId, signal);
  }
  return result;
}
