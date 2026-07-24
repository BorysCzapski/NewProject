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

const MAX_COMPLETION_TOKENS = 8_000;

function systemPrompt(lekcja: AiGenerationLekcja): string {
  return (
    "Jesteś doświadczonym nauczycielem matematyki układającym ORYGINALNE zadania treningowe do matury " +
    "rozszerzonej z matematyki (CKE, formuła 2023), w stylu i na poziomie trudności prawdziwych zadań " +
    `maturalnych. Zadania mają dotyczyć wyłącznie tematu: „${lekcja.title}”. ` +
    `Zagadnienia CKE, które to zadania mają sprawdzać: ${lekcja.cke} ` +
    "WAŻNE: wymyśl WŁASNE, oryginalne treści zadań (liczby, kontekst, dane) — nie kopiuj żadnych konkretnych " +
    "zadań z podręczników, arkuszy czy stron internetowych. Zasady: " +
    `1) Wygeneruj DOKŁADNIE ${AI_GENERATION_PROBLEMS_PER_LEKCJA} różnorodnych zadań (różne liczby, różny ` +
    "kontekst, różne podejścia — unikaj powtarzania tego samego schematu). " +
    "2) statement: pełna treść zadania PO POLSKU, wzory matematyczne w LaTeX ($...$ inline, $$...$$ blokowo), " +
    "ułamki ZAWSZE jako \\frac{licznik}{mianownik} (nigdy znakiem \"/\"). " +
    "3) difficulty: 1 (łatwe), 2 (średnie/typowe maturalne) lub 3 (trudne/nietypowe) — rozłóż różnorodnie w tej " +
    "puli (mniej więcej po jednej trzeciej na każdy poziom). " +
    "4) is_proof: true dla zadań z poleceniem „Udowodnij”/„Wykaż, że” lub równoważnym" +
    (lekcja.proofHeavy
      ? " — dla TEGO tematu WIĘKSZOŚĆ zadań (co najmniej 12 z 20) powinna być dowodowa, bo temat jest z natury dowodowy."
      : " — dla tego tematu 2-4 zadania mogą być dowodowe, reszta obliczeniowa.") +
    " 5) points_max: liczba punktów zgodna z konwencją CKE (zwykle 2-6 dla zadań rozszerzonych, więcej dla " +
    "złożonych zadań wielostopniowych lub dowodowych). " +
    "6) grading_criteria: analityczny schemat punktowania w stylu CKE (krok + opis + liczba punktów); SUMA " +
    "points we wszystkich krokach MUSI być równa points_max — to twardy wymóg."
  );
}

const SCHEMA = {
  problems: {
    type: "array",
    description: "Dokładnie 20 oryginalnych zadań maturalnych na dany temat.",
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

async function generateStructuredProblems(lekcja: AiGenerationLekcja): Promise<StructuredGeneratedProblem[]> {
  const result = await askAIForJSON<{ problems: StructuredGeneratedProblem[] }>({
    system: systemPrompt(lekcja),
    prompt: `Wygeneruj ${AI_GENERATION_PROBLEMS_PER_LEKCJA} zadań na temat: „${lekcja.title}”.`,
    schema: SCHEMA,
    maxTokens: MAX_COMPLETION_TOKENS,
  });
  return result.problems ?? [];
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

  let structured: StructuredGeneratedProblem[];
  try {
    structured = await generateStructuredProblems(lekcja);
  } catch (err) {
    summary.errors.push(`AI nie wygenerowało zadań: ${errMessage(err)}`);
    return summary;
  }

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
