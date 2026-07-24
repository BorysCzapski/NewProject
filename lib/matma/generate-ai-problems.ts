// ============================================================================
// lib/matma/generate-ai-problems.ts
// ADMIN-RUN generation of ORIGINAL matura-rozszerzona problems (math_problems
// .source = 'ai_generated'), one lekcja at a time (see lib/matma/ai-
// generation-lekcje.ts for the 44-lekcja list and why it exists — mapped
// from a matemaks.pl course-syllabus outline the admin pasted for reference,
// topic titles/CKE zagadnienia only, no problem content). NOT a Server
// Action — see lib/matma/import-actions.ts's requireAdmin()-gated
// runAiProblemGeneration for the entry point. Chunked per lekcja for the
// same reason importArkusz is chunked per year: one LLM call generating 20
// problems already takes a while, and looping 44 of them in a single request
// would risk a serverless timeout with no partial progress.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { askAIForJSON } from "@/lib/ai";
import { getTopics } from "@/lib/matma/content";
import { AI_GENERATION_LEKCJE, AI_GENERATION_PROBLEMS_PER_LEKCJA, type AiGenerationLekcja } from "@/lib/matma/ai-generation-lekcje";
import type { MathGeneratedMetadata, MathGradingCriterion } from "@/lib/types/database";

export interface AiGenerationSummary {
  lekcjaTitle: string;
  topicSlug: string;
  problemsGenerated: number;
  problemsInserted: number;
  errors: string[];
  /** True when this lekcja already had ai_generated rows and generation was
   * skipped without spending any AI budget — see generateAiProblemsForLekcja's
   * header comment, same idempotency convention as importArkusz. */
  alreadyGenerated?: boolean;
}

interface StructuredGeneratedProblem {
  statement: string;
  difficulty: number;
  is_proof: boolean;
  points_max: number;
  grading_criteria: MathGradingCriterion[];
}

// Generating all AI_GENERATION_PROBLEMS_PER_LEKCJA (20) problems in one
// completion risked running past the completion-token budget before the
// model closed every brace — Groq then reports the whole tool call as
// invalid JSON (400 tool_use_failed) instead of returning a partial result,
// so a single too-big response zeroed out an entire lekcja. Splitting into
// smaller batches keeps each individual response comfortably short (and
// shrinks the blast radius of any other JSON-validity slip to one batch
// instead of all 20 problems).
const BATCH_SIZE = 5;
const TOKENS_PER_PROBLEM = 1_800;
const TOKENS_OVERHEAD = 1_500;

function systemPrompt(lekcja: AiGenerationLekcja, count: number): string {
  return (
    "Jesteś doświadczonym nauczycielem matematyki układającym ORYGINALNE zadania treningowe do matury " +
    "rozszerzonej z matematyki (CKE, formuła 2023), w stylu i na poziomie trudności prawdziwych zadań " +
    `maturalnych. Zadania mają dotyczyć wyłącznie tematu: „${lekcja.title}”. ` +
    `Zagadnienia CKE, które to zadania mają sprawdzać: ${lekcja.cke} ` +
    "WAŻNE: wymyśl WŁASNE, oryginalne treści zadań (liczby, kontekst, dane) — nie kopiuj żadnych konkretnych " +
    "zadań z podręczników, arkuszy czy stron internetowych. Zasady: " +
    `1) Wygeneruj DOKŁADNIE ${count} różnorodnych zadań (różne liczby, różny ` +
    "kontekst, różne podejścia — unikaj powtarzania tego samego schematu). " +
    "2) statement: pełna treść zadania PO POLSKU, wzory matematyczne w LaTeX ($...$ inline, $$...$$ blokowo), " +
    "ułamki ZAWSZE jako \\frac{licznik}{mianownik} (nigdy znakiem \"/\"). Zwięźle — bez zbędnych dygresji. " +
    "3) difficulty: 1 (łatwe), 2 (średnie/typowe maturalne) lub 3 (trudne/nietypowe) — rozłóż różnorodnie w tej " +
    "puli. " +
    "4) is_proof: true dla zadań z poleceniem „Udowodnij”/„Wykaż, że” lub równoważnym" +
    (lekcja.proofHeavy
      ? " — dla TEGO tematu WIĘKSZOŚĆ zadań powinna być dowodowa, bo temat jest z natury dowodowy."
      : " — dla tego tematu 1-2 zadania mogą być dowodowe, reszta obliczeniowa.") +
    " 5) points_max: liczba punktów zgodna z konwencją CKE (zwykle 2-6 dla zadań rozszerzonych, więcej dla " +
    "złożonych zadań wielostopniowych lub dowodowych). " +
    "6) grading_criteria: zwięzły, analityczny schemat punktowania w stylu CKE (krok + krótki opis + liczba " +
    "punktów), NAJWYŻEJ 4 kroki na zadanie; SUMA points we wszystkich krokach MUSI być równa points_max — to " +
    "twardy wymóg. " +
    "7) KRYTYCZNE dla poprawności JSON: pola statement/step/description trafiają do pól typu string w JSON, więc " +
    "KAŻDY pojedynczy znak backslash użyty w komendzie LaTeX MUSI być zapisany jako PODWÓJNY backslash — np. " +
    "zamiast \\frac napisz \\\\frac, zamiast \\left( napisz \\\\left(, zamiast \\sqrt napisz \\\\sqrt, zamiast " +
    "\\log napisz \\\\log, zamiast \\neq napisz \\\\neq, zamiast \\in napisz \\\\in. Jeśli zostawisz pojedynczy " +
    "backslash, wygenerowany JSON będzie niepoprawny i cała odpowiedź zostanie odrzucona — to najważniejsza zasada. " +
    `8) Zwróć DOKŁADNIE ${count} zadań, ani jednego więcej — pełna, poprawnie zamknięta odpowiedź jest ważniejsza ` +
    "niż większa liczba zadań."
  );
}

const SCHEMA = {
  problems: {
    type: "array",
    description: "Zadania maturalne na dany temat.",
    items: {
      type: "object",
      properties: {
        statement: { type: "string" },
        difficulty: { type: "number", description: "1, 2 lub 3." },
        is_proof: { type: "boolean" },
        points_max: { type: "number" },
        grading_criteria: {
          type: "array",
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
      required: ["statement", "difficulty", "is_proof", "points_max", "grading_criteria"],
    },
  },
};

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function reconcileCriteria(criteria: MathGradingCriterion[], pointsMax: number): MathGradingCriterion[] {
  if (!criteria || criteria.length === 0) {
    return [{ step: "Całe zadanie", points: pointsMax, description: "Brak schematu punktowania od AI — wymaga przeglądu." }];
  }
  const sum = criteria.reduce((s, c) => s + (c.points || 0), 0);
  const diff = pointsMax - sum;
  if (diff === 0) return criteria;
  const adjusted = [...criteria];
  const lastIndex = adjusted.length - 1;
  adjusted[lastIndex] = { ...adjusted[lastIndex], points: Math.max(0, (adjusted[lastIndex].points || 0) + diff) };
  return adjusted;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Generates one batch of `count` problems. Groq occasionally rejects the
 * model's own tool call with a 400 "tool_use_failed" — either the response
 * ran past its token budget before every brace closed, or the model slipped
 * on the backslash-escaping rule in systemPrompt() — a transient generation
 * glitch, not a systematic problem with the request; a 429 rate-limit is
 * also possible once several batches per lekcja are in flight. Retries with
 * backoff (1s/2s/4s — gives a rate limit time to clear), HALVING the
 * requested count on each retry (a smaller ask is less likely to hit a
 * token-budget truncation) before giving up on this batch. Returns the last
 * error message alongside whatever problems it managed, instead of failing
 * silently, so the admin UI can show WHY a batch came back short. */
async function generateBatch(
  lekcja: AiGenerationLekcja,
  count: number
): Promise<{ problems: StructuredGeneratedProblem[]; error: string | null }> {
  let attemptCount = count;
  let lastError: unknown;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const result = await askAIForJSON<{ problems: StructuredGeneratedProblem[] }>({
        system: systemPrompt(lekcja, attemptCount),
        prompt: `Wygeneruj ${attemptCount} zadań na temat: „${lekcja.title}”.`,
        schema: SCHEMA,
        maxTokens: Math.min(16_000, TOKENS_PER_PROBLEM * attemptCount + TOKENS_OVERHEAD),
      });
      return { problems: result.problems ?? [], error: null };
    } catch (err) {
      lastError = err;
      console.error(
        `[matma] generateBatch failed for "${lekcja.title}" (attempt ${attempt}/4, count=${attemptCount}):`,
        err
      );
      attemptCount = Math.max(2, Math.floor(attemptCount / 2));
      if (attempt < 4) await sleep(2 ** attempt * 500);
    }
  }
  console.error(`[matma] generateBatch gave up for "${lekcja.title}" after 4 attempts`);
  return { problems: [], error: errMessage(lastError) };
}

/** Generates all AI_GENERATION_PROBLEMS_PER_LEKCJA problems for a lekcja as
 * several smaller batches (see BATCH_SIZE) instead of one big request — a
 * failed batch just returns fewer problems for this lekcja, it no longer
 * zeroes out the whole thing. */
async function generateStructuredProblems(
  lekcja: AiGenerationLekcja
): Promise<{ problems: StructuredGeneratedProblem[]; errors: string[] }> {
  const problems: StructuredGeneratedProblem[] = [];
  const errors: string[] = [];
  let remaining = AI_GENERATION_PROBLEMS_PER_LEKCJA;
  while (remaining > 0) {
    const batchCount = Math.min(BATCH_SIZE, remaining);
    const batch = await generateBatch(lekcja, batchCount);
    problems.push(...batch.problems);
    if (batch.error) errors.push(`Partia zadań nie powiodła się: ${batch.error}`);
    remaining -= batchCount;
  }
  return { problems, errors };
}

/** Generates + inserts ~20 original problems for lekcja #index (see
 * AI_GENERATION_LEKCJE). Never throws — every failure is caught into
 * summary.errors so one bad lekcja can't fail the whole batch.
 *
 * IDEMPOTENT BY DEFAULT: bails out (before any AI call) if this exact
 * lekcja already has ai_generated rows (matched via
 * source_metadata->>lekcja) — safe/cheap to re-run the full 44-lekcja loop
 * after a partial run. Pass `force: true` to delete and regenerate. Same
 * "insert anyway, flag for review" resilience as the CKE/matemaks/PDF
 * pipelines: a criteria-sum mismatch gets auto-reconciled and flagged
 * rather than dropping the problem. */
export async function generateAiProblemsForLekcja(
  supabase: SupabaseClient,
  index: number,
  opts?: { createdBy?: string | null; force?: boolean }
): Promise<AiGenerationSummary> {
  const lekcja = AI_GENERATION_LEKCJE[index];
  if (!lekcja) {
    return {
      lekcjaTitle: "(nieznana)",
      topicSlug: "",
      problemsGenerated: 0,
      problemsInserted: 0,
      errors: [`Nieprawidłowy indeks lekcji: ${index}.`],
    };
  }

  const summary: AiGenerationSummary = {
    lekcjaTitle: lekcja.title,
    topicSlug: lekcja.slug,
    problemsGenerated: 0,
    problemsInserted: 0,
    errors: [],
  };

  if (opts?.force) {
    await supabase
      .from("math_problems")
      .delete()
      .eq("source", "ai_generated")
      .eq("source_metadata->>lekcja", lekcja.title);
  } else {
    const { count } = await supabase
      .from("math_problems")
      .select("id", { count: "exact", head: true })
      .eq("source", "ai_generated")
      .eq("source_metadata->>lekcja", lekcja.title);
    if (count && count > 0) {
      summary.problemsGenerated = count;
      summary.alreadyGenerated = true;
      return summary;
    }
  }

  const { problems: structured, errors: batchErrors } = await generateStructuredProblems(lekcja);
  summary.errors.push(...batchErrors);

  summary.problemsGenerated = structured.length;
  if (structured.length === 0) {
    summary.errors.push("AI nie zwróciło żadnych zadań dla tej lekcji.");
    return summary;
  }

  const topics = await getTopics(supabase);
  const topicId = topics.find((t) => t.slug === lekcja.slug)?.id;
  if (!topicId) {
    summary.errors.push(`Dział „${lekcja.slug}” nie istnieje w bazie — uruchom najpierw seed 01_topics.sql.`);
    return summary;
  }

  for (let i = 0; i < structured.length; i++) {
    const p = structured[i];
    const label = `Zadanie ${i + 1}`;

    if (!p.statement?.trim() || !p.points_max || p.points_max <= 0) {
      summary.errors.push(`${label}: brak treści lub nieprawidłowa punktacja — pominięto.`);
      continue;
    }

    let needsReview = false;
    let gradingCriteria = p.grading_criteria ?? [];
    const criteriaSum = gradingCriteria.reduce((sum, c) => sum + (c.points || 0), 0);
    if (criteriaSum !== p.points_max) {
      needsReview = true;
      gradingCriteria = reconcileCriteria(gradingCriteria, p.points_max);
      summary.errors.push(
        `${label}: kryteria oceniania sumowały się do ${criteriaSum} pkt zamiast ${p.points_max} — skorygowano ` +
          `automatycznie, wymaga przeglądu.`
      );
    }

    const sourceMetadata: MathGeneratedMetadata = needsReview
      ? { lekcja: lekcja.title, needsReview: true }
      : { lekcja: lekcja.title };

    const { error } = await supabase.from("math_problems").insert({
      topic_id: topicId,
      content: { statement: p.statement },
      difficulty: p.difficulty >= 3 ? 3 : p.difficulty <= 1 ? 1 : 2,
      is_proof: !!p.is_proof,
      points_max: p.points_max,
      source: "ai_generated",
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
