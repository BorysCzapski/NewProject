// ============================================================================
// lib/matma/import-pdf.ts
// ADMIN-RUN import of a PDF the admin uploads directly (math_problems.source
// = 'curated') — for problem sets that don't come from CKE (see
// import-past-exams.ts) or matemaks.pl (see import-curated-matemaks.ts), e.g.
// a worksheet, a textbook chapter scan, or a problem set from another site
// the admin saved as a PDF. Same overall shape as those two pipelines
// (extract text -> AI-structure -> insert, resilient — never silently drops
// a problem, see the "insert anyway" comment on structurePdfProblems' caller
// below) but the input is an arbitrary uploaded file instead of a
// discovered/crawled URL.
// ============================================================================
import "server-only";
// Imported from the internal subpath, not the package root — see
// lib/types/pdf-parse.d.ts for why (root index.js has bundler-breaking
// debug code that runs at import time).
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { askAIForJSON } from "@/lib/ai";
import { getTopics } from "@/lib/matma/content";
import { MATH_TOPIC_SLUGS } from "@/lib/matma/topics";
import type { MathCuratedMetadata, MathGradingCriterion } from "@/lib/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface PdfImportSummary {
  filename: string;
  problemsFound: number;
  problemsInserted: number;
  errors: string[];
}

interface StructuredPdfProblem {
  statement: string;
  difficulty: number;
  is_proof: boolean;
  points_max: number;
  topic_slug: string;
  grading_criteria: MathGradingCriterion[];
}

// Same rationale/sizing as import-past-exams.ts's MAX_PROMPT_CHARS — see
// that file's header comment for why these are generous (paid Groq tier,
// 128k-token context) rather than tuned to the old free-tier ceiling.
const MAX_PROMPT_CHARS = 40_000;
const DEFAULT_MAX_COMPLETION_TOKENS = 12_000;
const RETRY_MAX_COMPLETION_TOKENS = 6_000;

const IMPORT_SYSTEM_PROMPT =
  "Jesteś redaktorem treści porządkującym tekst wyodrębniony z PDF-a wgranego przez administratora (arkusz zadań, " +
  "rozdział podręcznika, zbiór zadań itp.) w ustrukturyzowane dane do bazy zadań maturalnych z matematyki (poziom " +
  "rozszerzony). Tekst pochodzi z automatycznej ekstrakcji z PDF-a i MOŻE być zniekształcony: złamane linie, " +
  "brakujące polskie znaki diakrytyczne, a przede wszystkim ZNIEKSZTAŁCONE ZAPISY MATEMATYCZNE — w szczególności " +
  "UŁAMKI. PDF renderuje ułamek jako licznik i mianownik ułożone jeden nad drugim (bez znaku dzielenia \"/\" ani " +
  "żadnego separatora w oryginale), więc ekstrakcja tekstu z takiego PDF-a często zostawia licznik i mianownik " +
  "obok siebie lub w kolejnych liniach, BEZ znaku \"/\". NIE traktuj takiego zestawienia dwóch liczb/wyrażeń jako " +
  "dzielenia zapisanego znakiem \"/\" — rozpoznaj z kontekstu matematycznego, że to ułamek, i zapisz go poprawnie " +
  "w LaTeX jako \\frac{licznik}{mianownik}. Użyj znaku \"/\" TYLKO jeśli w oryginalnym tekście faktycznie widać " +
  "\"/\" (np. w zapisie inline typu \"1/2\" w zdaniu, gdzie to naprawdę dzielenie tekstowe, a nie ułamek pionowy). " +
  "To samo ostrożne podejście do kontekstu zastosuj do potęg, pierwiastków, indeksów górnych/dolnych i innych " +
  "symboli, które ekstrakcja PDF mogła rozsypać. Zasady: " +
  "1) Wyodrębnij KAŻDE osobne zadanie jako osobny obiekt — pomiń stronę tytułową, spis treści, instrukcje. " +
  "2) statement: pełna treść zadania PO POLSKU, wzory matematyczne w LaTeX ($...$ inline, $$...$$ blokowo). " +
  "3) difficulty: 1 (łatwe/podstawowe), 2 (średnie/typowe maturalne) albo 3 (trudne/nietypowe). " +
  "4) is_proof: true TYLKO gdy polecenie brzmi „Udowodnij”, „Wykaż, że” lub równoważnie. " +
  "5) points_max: jeśli PDF podaje punktację — użyj jej; jeśli nie, oszacuj rozsądnie na podstawie złożoności " +
  "zadania (zwykle 2-6 pkt dla zadań rozszerzonych). " +
  `6) topic_slug: DOKŁADNIE jeden z: ${MATH_TOPIC_SLUGS.join(", ")}. ` +
  "7) grading_criteria: analityczny schemat punktowania w stylu CKE (krok + opis + liczba punktów); SUMA points " +
  "we wszystkich krokach MUSI być równa points_max — to twardy wymóg. " +
  "8) Jeśli fragment jest zbyt zniekształcony by wiernie go odtworzyć, i tak zwróć najlepszą możliwą próbę — " +
  "administrator przejrzy i poprawi wynik ręcznie, nie musisz być idealny.";

const IMPORT_SCHEMA = {
  problems: {
    type: "array",
    description: "Lista zadań wyodrębnionych z wgranego PDF-a (jeden obiekt na jedno zadanie).",
    items: {
      type: "object",
      properties: {
        statement: { type: "string", description: "Pełna treść zadania po polsku, wzory w LaTeX (\\frac dla ułamków)." },
        difficulty: { type: "number", description: "1, 2 lub 3." },
        is_proof: { type: "boolean" },
        points_max: { type: "number" },
        topic_slug: { type: "string", description: `Jeden z: ${MATH_TOPIC_SLUGS.join(", ")}` },
        grading_criteria: {
          type: "array",
          description: "Schemat punktowania — suma points musi równać się points_max.",
          items: {
            type: "object",
            properties: {
              step: { type: "string" },
              points: { type: "number" },
              description: { type: "string" },
            },
            required: ["step", "points", "description"],
          },
        },
      },
      required: ["statement", "difficulty", "is_proof", "points_max", "topic_slug", "grading_criteria"],
    },
  },
};

function truncate(text: string, maxChars: number): string {
  return text.length > maxChars ? `${text.slice(0, maxChars)}\n[...treść obcięta...]` : text;
}

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

async function structurePdfProblems(text: string): Promise<StructuredPdfProblem[]> {
  try {
    const result = await askAIForJSON<{ problems: StructuredPdfProblem[] }>({
      system: IMPORT_SYSTEM_PROMPT,
      prompt: `--- TEKST WYODRĘBNIONY Z WGRANEGO PDF ---\n${truncate(text, MAX_PROMPT_CHARS)}`,
      schema: IMPORT_SCHEMA,
      maxTokens: DEFAULT_MAX_COMPLETION_TOKENS,
    });
    return result.problems ?? [];
  } catch (err) {
    console.error("[matma] structurePdfProblems failed, retrying smaller:", err);
    const result = await askAIForJSON<{ problems: StructuredPdfProblem[] }>({
      system: IMPORT_SYSTEM_PROMPT,
      prompt: `--- TEKST WYODRĘBNIONY Z WGRANEGO PDF ---\n${truncate(text, Math.floor(MAX_PROMPT_CHARS / 2))}`,
      schema: IMPORT_SCHEMA,
      maxTokens: RETRY_MAX_COMPLETION_TOKENS,
    });
    return result.problems ?? [];
  }
}

async function getTopicIdBySlug(supabase: SupabaseClient): Promise<Map<string, string>> {
  const topics = await getTopics(supabase);
  return new Map(topics.map((t) => [t.slug, t.id]));
}

/** Extracts text from an admin-uploaded PDF, asks the AI to structure it
 * into problems, and inserts each as source='curated' (attribution: the
 * filename). Never throws — every failure is caught into summary.errors.
 * Same resilience rule as import-past-exams.ts/import-curated-matemaks.ts:
 * an unrecognized topic or a mismatched grading-criteria sum no longer
 * causes a skip — the problem is inserted anyway (default topic /
 * auto-reconciled criteria) and flagged via source_metadata.needsReview so
 * an admin can fix it up via adminUpsertProblem instead of losing it. Only
 * a genuinely ungradable problem (no statement or no points_max) still
 * skips, since there is nothing valid to save. */
export async function importPdfProblems(
  supabase: SupabaseClient,
  pdfBuffer: Buffer,
  filename: string,
  opts?: { createdBy?: string | null }
): Promise<PdfImportSummary> {
  const summary: PdfImportSummary = { filename, problemsFound: 0, problemsInserted: 0, errors: [] };

  let text: string;
  try {
    const parsed = await pdfParse(pdfBuffer);
    text = parsed.text;
  } catch (err) {
    summary.errors.push(`Nie udało się odczytać PDF-a: ${errMessage(err)}`);
    return summary;
  }
  if (!text.trim()) {
    summary.errors.push("PDF nie zawiera tekstu do odczytania (może to skan bez OCR) — wymaga ręcznego dodania.");
    return summary;
  }

  let structured: StructuredPdfProblem[];
  try {
    structured = await structurePdfProblems(text);
  } catch (err) {
    summary.errors.push(`AI nie ustrukturyzowało treści PDF-a: ${errMessage(err)}`);
    return summary;
  }

  summary.problemsFound = structured.length;
  if (structured.length === 0) {
    summary.errors.push("AI nie zwróciło żadnych zadań — PDF wymaga ręcznego dodania (adminUpsertProblem).");
    return summary;
  }

  const topicIdBySlug = await getTopicIdBySlug(supabase);
  const fallbackTopicId = topicIdBySlug.get(MATH_TOPIC_SLUGS[0]);

  for (let i = 0; i < structured.length; i++) {
    const p = structured[i];
    const label = `Zadanie ${i + 1}`;
    let needsReview = false;

    let topicId = topicIdBySlug.get(p.topic_slug);
    if (!topicId) {
      if (!fallbackTopicId) {
        summary.errors.push(`${label}: nierozpoznany dział „${p.topic_slug}” i brak działu domyślnego — pominięto.`);
        continue;
      }
      topicId = fallbackTopicId;
      needsReview = true;
      summary.errors.push(
        `${label}: nierozpoznany dział „${p.topic_slug}” — zapisano pod domyślnym działem, wymaga przeglądu.`
      );
    }

    if (!p.statement?.trim() || !p.points_max || p.points_max <= 0) {
      summary.errors.push(`${label}: brak treści lub nieprawidłowa punktacja — pominięto, wymaga ręcznego dodania.`);
      continue;
    }

    let gradingCriteria = p.grading_criteria ?? [];
    const criteriaSum = gradingCriteria.reduce((sum, c) => sum + (c.points || 0), 0);
    if (criteriaSum !== p.points_max) {
      needsReview = true;
      summary.errors.push(
        `${label}: kryteria oceniania sumowały się do ${criteriaSum} pkt zamiast ${p.points_max} — skorygowano ` +
          `automatycznie, wymaga przeglądu (adminUpsertProblem).`
      );
      gradingCriteria =
        gradingCriteria.length === 0
          ? [{ step: "Całe zadanie", points: p.points_max, description: "Brak schematu punktowania od AI — wymaga przeglądu." }]
          : (() => {
              const adjusted = [...gradingCriteria];
              const lastIndex = adjusted.length - 1;
              adjusted[lastIndex] = {
                ...adjusted[lastIndex],
                points: Math.max(0, (adjusted[lastIndex].points || 0) + (p.points_max - criteriaSum)),
              };
              return adjusted;
            })();
    }

    const sourceMetadata: MathCuratedMetadata = {
      attribution: `PDF: ${filename}`,
      ...(needsReview ? { needsReview: true } : {}),
    };

    const { error } = await supabase.from("math_problems").insert({
      topic_id: topicId,
      content: { statement: p.statement },
      difficulty: p.difficulty >= 3 ? 3 : p.difficulty <= 1 ? 1 : 2,
      is_proof: !!p.is_proof,
      points_max: p.points_max,
      source: "curated",
      grading_criteria: gradingCriteria,
      source_metadata: sourceMetadata,
      created_by: opts?.createdBy ?? null,
    });
    if (error) {
      summary.errors.push(`${label}: błąd zapisu do bazy — ${error.message}`);
      continue;
    }
    summary.problemsInserted += 1;
  }

  return summary;
}
