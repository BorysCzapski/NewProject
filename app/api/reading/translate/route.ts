// ============================================================================
// app/api/reading/translate/route.ts
// POST: tłumaczenie słowa z czytanki w kontekście zdania ("translation") albo
// przykładowe zdania z tym słowem ("examples").
//
// Dlaczego trasa API, a nie akcja serwerowa. Klient wysyła akcje serwerowe PO
// JEDNEJ i czeka na każdą (dokumentacja Next: "dispatches and awaits them one at a
// time"). Dotknięcie drugiego słowa przed wczytaniem pierwszego ustawiało go więc w
// kolejce za pierwszym — przy trzecim dotknięciu czekało się na dwa poprzednie, a
// ich wyniki i tak były ignorowane. Trasa dostaje żądania równolegle i pozwala je
// przerwać (AbortController po stronie klienta), więc nowe dotknięcie nic nie czeka.
//
// Kontrakt odpowiedzi: zawsze JSON `{ ok, data }` albo `{ ok: false, error, retryable }`.
// Brak sesji kończy się 401, a nie przekierowaniem na stronę logowania (proxy.ts
// odsyła na /login tylko niezalogowanych — klient rozpoznaje to po typie odpowiedzi).
// ============================================================================
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isTransientError } from "@/lib/reading/translate-core";
import { exampleSentencesFor, translateWordInContext } from "@/lib/reading/translate";
import type { WordPart, WordRequest } from "@/lib/reading/translate-types";
import type { TargetLanguage } from "@/lib/types/database";

export const dynamic = "force-dynamic";
/** Trzy próby po maks. 9 s + przerwy mieszczą się w 30 s. */
export const maxDuration = 30;

const LANGUAGES: TargetLanguage[] = ["en", "es", "ru"];
const PARTS: WordPart[] = ["translation", "examples"];
const MAX_WORD = 40;
const MAX_SENTENCE = 400;

function fail(error: string, status: number, retryable = false) {
  return NextResponse.json({ ok: false, error, retryable }, { status });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  let user = null;
  try {
    ({
      data: { user },
    } = await supabase.auth.getUser());
  } catch {
    // Brak odpowiedzi od Supabase to nie to samo co brak sesji — można spróbować ponownie.
    return fail("Nie udało się sprawdzić sesji. Spróbuj ponownie.", 503, true);
  }
  if (!user) return fail("Sesja wygasła — zaloguj się ponownie.", 401);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail("Nieprawidłowe żądanie.", 400);
  }

  const part = body.part as WordPart;
  const word = String(body.word ?? "").trim();
  const sentence = String(body.sentence ?? "").trim().slice(0, MAX_SENTENCE);
  const language = body.language as TargetLanguage;

  if (!PARTS.includes(part)) return fail("Nieznany rodzaj żądania.", 400);
  if (!word || word.length > MAX_WORD || /\s/.test(word)) return fail("Nie rozpoznano słowa.", 400);
  if (!LANGUAGES.includes(language)) return fail("Nieznany język tekstu.", 400);

  const wordRequest: WordRequest = { word, sentence, language };

  try {
    const data =
      part === "translation" ? await translateWordInContext(wordRequest) : await exampleSentencesFor(wordRequest);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error(`[reading] ${part} failed:`, error);
    const retryable = isTransientError(error);
    return fail(
      part === "translation"
        ? "Nie udało się pobrać tłumaczenia. Spróbuj ponownie."
        : "Nie udało się pobrać przykładów. Spróbuj ponownie.",
      retryable ? 503 : 500,
      retryable
    );
  }
}
