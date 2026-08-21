// ============================================================================
// lib/matura/import-pdf.ts
// ADMIN-RUN import of an arkusz PDF the admin uploads directly — mirrors
// lib/matma/import-pdf.ts's shape exactly (extract text -> AI-structure ->
// insert, never silently drops a task). Two differences from Matma's
// version: (1) tasks land in THREE different tables/shapes depending on
// which exam part the AI recognizes them as (matura_tasks for środki
// językowe/czytanie, matura_writing_tasks for pisanie) instead of one; (2)
// "rozumienie ze słuchu" is explicitly EXCLUDED — a text PDF has no audio,
// and CKE listening arkusze don't even print the transcript (students only
// get the recording), so there is nothing real to extract for that part.
//
// Like Matma's pdf-import, this always inserts source='curated' (never
// 'past_exam') — even when the admin says the PDF is a real CKE arkusz, we
// cannot verify that algorithmically, so the more conservative label is
// the honest one. needsReview is ALWAYS true here (stricter than Matma's
// conditional flagging) because, unlike a real arkusz+klucz pair fed
// verbatim, correctness depends on how well AI extracted possibly-garbled
// PDF text AND, when no klucz odpowiedzi (answer key) is supplied, on the
// AI inferring correct answers itself rather than reading them from CKE.
// ============================================================================
import "server-only";
// Imported from the internal subpath, not the package root — see
// lib/types/pdf-parse.d.ts for why (root index.js has bundler-breaking
// debug code that runs at import time).
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { askAIForJSON } from "@/lib/ai";
import { langGenitive, langInfo } from "@/lib/languages";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  MaturaCuratedMetadata,
  MaturaLanguage,
  MaturaLevel,
  MaturaSection,
  MaturaTaskItem,
  MaturaWritingFormType,
} from "@/lib/types/database";

export interface MaturaPdfImportSummary {
  filename: string;
  language: MaturaLanguage;
  level: MaturaLevel;
  srodkiJezykoweFound: number;
  srodkiJezykoweInserted: number;
  czytanieFound: number;
  czytanieInserted: number;
  pisanieFound: number;
  pisanieInserted: number;
  errors: string[];
}

interface StructuredExactMatchTask {
  instructions: string;
  passage?: string;
  items: MaturaTaskItem[];
}

interface StructuredWritingTask {
  formType: MaturaWritingFormType;
  instructions: string;
  contentPoints: string[];
  minWords: number;
  maxWords: number;
  modelAnswer: string;
  modelAnswerNotes: string;
}

interface StructuredExtraction {
  srodkiJezykowe: StructuredExactMatchTask[];
  czytanie: StructuredExactMatchTask[];
  pisanie: StructuredWritingTask[];
}

// Same rationale/sizing as lib/matma/import-pdf.ts's MAX_PROMPT_CHARS.
const MAX_PROMPT_CHARS = 40_000;
const DEFAULT_MAX_COMPLETION_TOKENS = 8_000;
const RETRY_MAX_COMPLETION_TOKENS = 4_000;

const TASK_ITEM_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string", description: "krótki identyfikator w obrębie zadania, np. '1'" },
    type: { type: "string", enum: ["gap_fill", "multiple_choice"] },
    prompt: { type: "string", description: "treść pytania/zdania z luką" },
    transformWord: { type: "string", description: "słowo bazowe do przekształcenia (słowotwórstwo) — pomiń, jeśli nie dotyczy" },
    options: { type: "array", items: { type: "string" }, description: "opcje wielokrotnego wyboru — pomiń dla gap_fill" },
    correctAnswers: {
      type: "array",
      items: { type: "string" },
      description: "poprawna odpowiedź (lub kilka akceptowanych wariantów); dla multiple_choice dokładny tekst poprawnej opcji",
    },
    explanation: { type: "string", description: "krótkie wyjaśnienie po polsku" },
  },
  required: ["id", "type", "prompt", "correctAnswers"],
};

const EXACT_MATCH_TASK_SCHEMA = {
  type: "object",
  properties: {
    instructions: { type: "string", description: "polecenie do zadania, po polsku" },
    passage: { type: "string", description: "tekst/fragment do czytania, jeśli dotyczy — pomiń, jeśli zadanie go nie ma" },
    items: { type: "array", items: TASK_ITEM_SCHEMA },
  },
  required: ["instructions", "items"],
};

function buildSystemPrompt(language: MaturaLanguage, level: MaturaLevel, hasAnswerKey: boolean): string {
  const langLocative = langInfo(language).plLocative;
  return (
    "Jesteś redaktorem treści porządkującym tekst wyodrębniony z PDF-a arkusza maturalnego z języka " +
    `${langGenitive(language)} (poziom ${level}) w ustrukturyzowane dane do bazy zadań. Tekst pochodzi z automatycznej ` +
    "ekstrakcji z PDF-a i może być zniekształcony: złamane linie, brakujące znaki, wymieszana kolejność. " +
    "Rozpoznaj i wyodrębnij TRZY typy zadań, każde do osobnej listy:\n" +
    "1) srodkiJezykowe — zadania „Znajomość środków językowych”: słowotwórstwo, parafrazy zdań, wybór " +
    "wielokrotny testujący gramatykę/słownictwo w kontekście. Każdy pod-punkt zadania to osobny item.\n" +
    "2) czytanie — zadania „Rozumienie tekstów pisanych”: dołącz PEŁNY tekst źródłowy jako `passage`, a " +
    "pytania/dopasowania jako items. Dopasowanie nagłówków/zdań do luk modeluj jako multiple_choice: jeden " +
    "item na akapit/lukę, options = lista kandydatów, correctAnswers = poprawny kandydat.\n" +
    "3) pisanie — zadanie „Wypowiedź pisemna”: instructions (treść polecenia), contentPoints (lista " +
    "wymaganych podpunktów po polsku), minWords/maxWords (jeśli PDF nie podaje wprost, użyj 100-150 dla " +
    "podstawowej albo 200-250 dla rozszerzonej), formType (email/blog_post/forum_post dla podstawowej, " +
    "rozprawka_za_i_przeciw dla rozszerzonej). KRYTYCZNE: modelAnswer MUSISZ napisać sam/a od zera, " +
    `W JĘZYKU ${langLocative.toUpperCase()} — NIGDY nie kopiuj żadnego przykładowego/wzorcowego tekstu, który mógłby się znajdować w ` +
    "źródłowym PDF-ie (prawa autorskie) — napisz WŁASNY, oryginalny tekst spełniający polecenie na pełną " +
    "liczbę punktów, w wymaganym zakresie słów. modelAnswerNotes: krótkie uzasadnienie po polsku, dlaczego " +
    "ten tekst zasługuje na pełną punktację.\n\n" +
    "POMIŃ CAŁKOWICIE zadania „Rozumienie ze słuchu” (transkrypcje/pytania do nagrań) — nie ma dla nich " +
    "audio w tym imporcie, więc nie da się ich sensownie dodać. Pomiń też stronę tytułową, instrukcje " +
    "ogólne, karty odpowiedzi (siatki do zaznaczania) i wszelkie elementy graficzne opisane jako " +
    "nieczytelne.\n\n" +
    (hasAnswerKey
      ? "Dołączono również tekst z KLUCZA ODPOWIEDZI (osobny plik) — ZAWSZE preferuj poprawne odpowiedzi " +
        "z klucza nad własnym oszacowaniem, jeśli klucz jednoznacznie wskazuje odpowiedź do danego zadania.\n\n"
      : "Nie dołączono klucza odpowiedzi — dla zadań zamkniętych (środki językowe, czytanie) musisz " +
        `samodzielnie wywnioskować poprawną odpowiedź na podstawie własnej znajomości języka ${langGenitive(language)} ` +
        "i kontekstu zadania. Rób to najlepiej jak potrafisz — administrator zweryfikuje wynik ręcznie.\n\n") +
    "Jeśli fragment jest zbyt zniekształcony by wiernie go odtworzyć, i tak zwróć najlepszą możliwą próbę " +
    "— administrator przejrzy i poprawi wynik ręcznie, nie musisz być idealny. Jeśli któryś z trzech typów " +
    "zadań nie występuje w tekście, zwróć dla niego pustą listę."
  );
}

const IMPORT_SCHEMA = {
  srodkiJezykowe: { type: "array", description: "Zadania 'Znajomość środków językowych'.", items: EXACT_MATCH_TASK_SCHEMA },
  czytanie: { type: "array", description: "Zadania 'Rozumienie tekstów pisanych'.", items: EXACT_MATCH_TASK_SCHEMA },
  pisanie: {
    type: "array",
    description: "Zadania 'Wypowiedź pisemna'.",
    items: {
      type: "object",
      properties: {
        formType: { type: "string", enum: ["email", "blog_post", "forum_post", "rozprawka_za_i_przeciw"] },
        instructions: { type: "string" },
        contentPoints: { type: "array", items: { type: "string" } },
        minWords: { type: "number" },
        maxWords: { type: "number" },
        modelAnswer: {
          type: "string",
          // Which language, exactly, is pinned by buildSystemPrompt — this
          // schema object is shared across languages, so it must not name one.
          description: "ORYGINALNY tekst napisany od zera przez Ciebie, w języku obcym tego arkusza.",
        },
        modelAnswerNotes: { type: "string" },
      },
      required: ["formType", "instructions", "contentPoints", "minWords", "maxWords", "modelAnswer", "modelAnswerNotes"],
    },
  },
};

function truncate(text: string, maxChars: number): string {
  return text.length > maxChars ? `${text.slice(0, maxChars)}\n[...treść obcięta...]` : text;
}

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const parsed = await pdfParse(buffer);
  return parsed.text;
}

async function structureArkusz(
  arkuszText: string,
  answerKeyText: string | null,
  language: MaturaLanguage,
  level: MaturaLevel
): Promise<StructuredExtraction> {
  const prompt =
    `--- TEKST ARKUSZA ---\n${truncate(arkuszText, MAX_PROMPT_CHARS)}` +
    (answerKeyText ? `\n\n--- TEKST KLUCZA ODPOWIEDZI ---\n${truncate(answerKeyText, MAX_PROMPT_CHARS / 2)}` : "");

  try {
    return await askAIForJSON<StructuredExtraction>({
      system: buildSystemPrompt(language, level, !!answerKeyText),
      prompt,
      schema: IMPORT_SCHEMA,
      maxTokens: DEFAULT_MAX_COMPLETION_TOKENS,
    });
  } catch (err) {
    console.error("[matura] structureArkusz failed, retrying smaller:", err);
    return await askAIForJSON<StructuredExtraction>({
      system: buildSystemPrompt(language, level, !!answerKeyText),
      prompt: `--- TEKST ARKUSZA ---\n${truncate(arkuszText, Math.floor(MAX_PROMPT_CHARS / 2))}`,
      schema: IMPORT_SCHEMA,
      maxTokens: RETRY_MAX_COMPLETION_TOKENS,
    });
  }
}

function normalizeItems(items: MaturaTaskItem[]): MaturaTaskItem[] {
  return items.map((item) => ({
    ...item,
    type: item.options && item.options.length > 0 ? "multiple_choice" : "gap_fill",
    correctAnswers: item.correctAnswers ?? [],
  }));
}

async function getSectionId(
  supabase: SupabaseClient,
  language: MaturaLanguage,
  level: MaturaLevel,
  slug: string
): Promise<string | null> {
  const { data } = await supabase
    .from("matura_sections")
    .select("id")
    .eq("language", language)
    .eq("level", level)
    .eq("slug", slug)
    .maybeSingle();
  return (data as Pick<MaturaSection, "id"> | null)?.id ?? null;
}

/** Extracts text from an admin-uploaded arkusz PDF (+ optional answer-key
 * PDF), asks the AI to structure it into the three importable task types,
 * and inserts each. Never throws — every failure is caught into
 * summary.errors, same resilience rule as lib/matma/import-pdf.ts. */
export async function importMaturaArkuszPdf(
  supabase: SupabaseClient,
  language: MaturaLanguage,
  level: MaturaLevel,
  arkuszBuffer: Buffer,
  arkuszFilename: string,
  answerKeyBuffer: Buffer | null,
  note: string | null,
  opts?: { createdBy?: string | null }
): Promise<MaturaPdfImportSummary> {
  const summary: MaturaPdfImportSummary = {
    filename: arkuszFilename,
    language,
    level,
    srodkiJezykoweFound: 0,
    srodkiJezykoweInserted: 0,
    czytanieFound: 0,
    czytanieInserted: 0,
    pisanieFound: 0,
    pisanieInserted: 0,
    errors: [],
  };

  let arkuszText: string;
  try {
    arkuszText = await extractPdfText(arkuszBuffer);
  } catch (err) {
    summary.errors.push(`Nie udało się odczytać arkusza PDF: ${errMessage(err)}`);
    return summary;
  }
  if (!arkuszText.trim()) {
    summary.errors.push("Arkusz PDF nie zawiera tekstu do odczytania (może to skan bez OCR).");
    return summary;
  }

  let answerKeyText: string | null = null;
  if (answerKeyBuffer) {
    try {
      answerKeyText = await extractPdfText(answerKeyBuffer);
    } catch (err) {
      summary.errors.push(`Nie udało się odczytać klucza odpowiedzi (kontynuuję bez niego): ${errMessage(err)}`);
    }
  }

  let structured: StructuredExtraction;
  try {
    structured = await structureArkusz(arkuszText, answerKeyText, language, level);
  } catch (err) {
    summary.errors.push(`AI nie ustrukturyzowało treści PDF-a: ${errMessage(err)}`);
    return summary;
  }

  const attribution = `PDF: ${arkuszFilename}${note?.trim() ? ` — ${note.trim()}` : ""}`;
  const sourceMetadata: MaturaCuratedMetadata = { attribution, needsReview: true };

  summary.srodkiJezykoweFound = structured.srodkiJezykowe?.length ?? 0;
  summary.czytanieFound = structured.czytanie?.length ?? 0;
  summary.pisanieFound = structured.pisanie?.length ?? 0;

  const srodkiSectionId = await getSectionId(supabase, language, level, "srodki-jezykowe");
  const czytanieSectionId = await getSectionId(supabase, language, level, "czytanie");
  const pisanieSectionId = await getSectionId(supabase, language, level, "pisanie");

  // --- środki językowe ---
  if (srodkiSectionId) {
    for (const [i, task] of (structured.srodkiJezykowe ?? []).entries()) {
      const label = `Środki językowe — zadanie ${i + 1}`;
      if (!task.instructions?.trim() || !task.items?.length) {
        summary.errors.push(`${label}: brak treści lub pytań — pominięto.`);
        continue;
      }
      const items = normalizeItems(task.items);
      const { error } = await supabase.from("matura_tasks").insert({
        section_id: srodkiSectionId,
        content: { instructions: task.instructions, items },
        points_max: items.length,
        source: "curated",
        source_metadata: sourceMetadata,
        created_by: opts?.createdBy ?? null,
      });
      if (error) {
        summary.errors.push(`${label}: błąd zapisu do bazy — ${error.message}`);
        continue;
      }
      summary.srodkiJezykoweInserted += 1;
    }
  } else if (summary.srodkiJezykoweFound > 0) {
    summary.errors.push("Nie znaleziono sekcji „środki językowe” dla wybranego poziomu — uruchom najpierw seed sekcji.");
  }

  // --- czytanie ---
  if (czytanieSectionId) {
    for (const [i, task] of (structured.czytanie ?? []).entries()) {
      const label = `Czytanie — zadanie ${i + 1}`;
      if (!task.instructions?.trim() || !task.items?.length) {
        summary.errors.push(`${label}: brak treści lub pytań — pominięto.`);
        continue;
      }
      const items = normalizeItems(task.items);
      const { error } = await supabase.from("matura_tasks").insert({
        section_id: czytanieSectionId,
        content: { instructions: task.instructions, passage: task.passage || undefined, items },
        points_max: items.length,
        source: "curated",
        source_metadata: sourceMetadata,
        created_by: opts?.createdBy ?? null,
      });
      if (error) {
        summary.errors.push(`${label}: błąd zapisu do bazy — ${error.message}`);
        continue;
      }
      summary.czytanieInserted += 1;
    }
  } else if (summary.czytanieFound > 0) {
    summary.errors.push("Nie znaleziono sekcji „czytanie” dla wybranego poziomu — uruchom najpierw seed sekcji.");
  }

  // --- pisanie ---
  if (pisanieSectionId) {
    for (const [i, task] of (structured.pisanie ?? []).entries()) {
      const label = `Pisanie — zadanie ${i + 1}`;
      if (!task.instructions?.trim() || !task.modelAnswer?.trim() || !task.contentPoints?.length) {
        summary.errors.push(`${label}: brak treści, podpunktów lub wzorcowej odpowiedzi — pominięto.`);
        continue;
      }
      const pointsMax = level === "podstawowa" ? 12 : 13;
      const { error } = await supabase.from("matura_writing_tasks").insert({
        section_id: pisanieSectionId,
        form_type: task.formType,
        instructions: task.instructions,
        content_points: task.contentPoints,
        min_words: task.minWords || (level === "podstawowa" ? 100 : 200),
        max_words: task.maxWords || (level === "podstawowa" ? 150 : 250),
        points_max: pointsMax,
        source: "curated",
        source_metadata: sourceMetadata,
        model_answer: task.modelAnswer,
        model_answer_notes: `${task.modelAnswerNotes} (Wygenerowane automatycznie przez AI podczas importu — wymaga weryfikacji przed pokazaniem uczniom.)`,
        created_by: opts?.createdBy ?? null,
      });
      if (error) {
        summary.errors.push(`${label}: błąd zapisu do bazy — ${error.message}`);
        continue;
      }
      summary.pisanieInserted += 1;
    }
  } else if (summary.pisanieFound > 0) {
    summary.errors.push("Nie znaleziono sekcji „pisanie” dla wybranego poziomu — uruchom najpierw seed sekcji.");
  }

  if (
    summary.srodkiJezykoweFound === 0 &&
    summary.czytanieFound === 0 &&
    summary.pisanieFound === 0
  ) {
    summary.errors.push(
      "AI nie rozpoznało żadnych zadań środków językowych, czytania ani pisania w tym pliku — sprawdź, czy PDF zawiera właściwy arkusz."
    );
  }

  return summary;
}
