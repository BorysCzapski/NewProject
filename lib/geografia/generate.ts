import "server-only";

// ============================================================================
// lib/geografia/generate.ts
// Admin-triggered AI generation of MC/open exercises for one topic — how the
// library grows past its small hand-checked seed set toward the product
// spec's "co najmniej 25 ćwiczeń na temat" target (see components/geografia/
// admin/generate-trigger-form.tsx). Every generated row is inserted with
// needs_review = true (mirrors math_problems.source_metadata.needsReview,
// lib/matma/import-past-exams.ts) so an admin confirms factual accuracy
// before it's fully trusted — geography facts are exactly the kind of thing
// an LLM can get subtly wrong (a river's exact length, a disputed border).
// Map exercises are NOT generated here — plausible coordinates need a human
// to verify, so map content stays hand-authored (supabase/seed/geografia/
// 02_exercises.sql) or admin-entered.
// ============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import { askAIForJSON } from "@/lib/ai";
import type { GeoTopic } from "@/lib/types/database";

interface GeneratedExercise {
  type: "mc" | "open";
  difficulty: 1 | 2 | 3;
  pointsMax: number;
  statement: string;
  options?: Array<{ text: string; correct: boolean }>;
  modelAnswer?: string;
  rubric?: string[];
  hints: string[];
}

interface GenerationResult {
  exercises: GeneratedExercise[];
}

async function generateBatch(
  topic: GeoTopic,
  count: number,
  avoidStatements: string[],
  onlyType?: "mc" | "open"
): Promise<GeneratedExercise[]> {
  const result = await askAIForJSON<GenerationResult>({
    system:
      "Jesteś doświadczonym nauczycielem geografii, autorem zadań na maturę rozszerzoną zgodną z polską " +
      "podstawą programową (CKE). Tworzysz WYŁĄCZNIE zadania oparte na solidnej, ogólnie znanej wiedzy " +
      "geograficznej (definicje, mechanizmy przyrodnicze, klasyfikacje, dobrze udokumentowane fakty) — " +
      "UNIKAJ pytań o precyzyjne, zmienne w czasie statystyki (dokładne wartości PKB, aktualna liczba " +
      "ludności, bieżące rankingi), bo szybko się dezaktualizują. Każde zadanie to albo 'mc' (jedna " +
      "poprawna odpowiedź spośród 4 opcji, dokładnie jedna z options.correct=true) albo 'open' (pytanie " +
      "otwarte z przykładową odpowiedzią modelową i rubric — listą 2-4 konkretnych punktów, za które " +
      "uczeń powinien otrzymać punkty cząstkowe, sformułowanych jak w kluczu odpowiedzi CKE). Dodaj 1-2 " +
      "krótkie wskazówki (hints) narastająco naprowadzające, nigdy nie zdradzające wprost odpowiedzi w " +
      "pierwszej wskazówce. pointsMax: 1 dla mc, 1-3 dla open (więcej dla złożonych pytań wieloelementowych).",
    prompt:
      `Wygeneruj ${count} zadań maturalnych z geografii dla działu CKE "${topic.title}" ` +
      `(${topic.description}).` +
      // Student-facing top-up asks for one type at a time (the student is
      // practising "zadania otwarte", not "zadania"), so the batch has to be
      // steered — the admin flow passes no type and gets the usual mix.
      (onlyType
        ? ` WSZYSTKIE zadania w tej partii mają być typu "${onlyType}" — nie generuj żadnego innego typu.`
        : "") +
      (avoidStatements.length > 0
        ? `\n\nNIE powtarzaj tematycznie tych już istniejących pytań:\n${avoidStatements.map((s) => `- ${s}`).join("\n")}`
        : ""),
    schema: {
      exercises: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["mc", "open"] },
            difficulty: { type: "integer", enum: [1, 2, 3] },
            pointsMax: { type: "integer" },
            statement: { type: "string" },
            options: {
              type: "array",
              items: {
                type: "object",
                properties: { text: { type: "string" }, correct: { type: "boolean" } },
                required: ["text", "correct"],
              },
            },
            modelAnswer: { type: "string" },
            rubric: { type: "array", items: { type: "string" } },
            hints: { type: "array", items: { type: "string" } },
          },
          // Only "statement" required — see lib/textbook/extract.ts's identical
          // reasoning: one missing nested field fails Groq's whole-response
          // validation, so everything else recoverable gets a code-side
          // default in normalizeGenerated below instead.
          required: ["statement"],
        },
      },
    },
    maxTokens: 4000,
  });

  return (result.exercises ?? []).map(normalizeGenerated).filter((e): e is GeneratedExercise => e !== null);
}

function normalizeGenerated(raw: Partial<GeneratedExercise>): GeneratedExercise | null {
  if (!raw.statement?.trim()) return null;
  const type = raw.type === "open" ? "open" : "mc";
  const difficulty: 1 | 2 | 3 = raw.difficulty === 1 || raw.difficulty === 3 ? raw.difficulty : 2;

  if (type === "mc") {
    const options = (raw.options ?? []).filter((o) => o?.text?.trim());
    const correctCount = options.filter((o) => o.correct).length;
    if (options.length < 2 || correctCount !== 1) return null; // can't safely grade — drop
    return { type, difficulty, pointsMax: 1, statement: raw.statement, options, hints: raw.hints ?? [] };
  }

  if (!raw.modelAnswer?.trim() || !raw.rubric || raw.rubric.length === 0) return null;
  const pointsMax = raw.pointsMax && raw.pointsMax > 0 && raw.pointsMax <= 5 ? raw.pointsMax : Math.max(1, Math.min(3, raw.rubric.length));
  return {
    type,
    difficulty,
    pointsMax,
    statement: raw.statement,
    modelAnswer: raw.modelAnswer,
    rubric: raw.rubric,
    hints: raw.hints ?? [],
  };
}

/** Generates and inserts up to `count` exercises for a topic, retrying failed
 * batches once (transient AI/JSON failures shouldn't lose an admin's whole
 * request — same "retry once, then give up on that piece" as
 * lib/textbook/extract.ts's chunk retry). Skips near-duplicate statements
 * already in the topic (case-insensitive prefix match) so re-running the
 * generator doesn't pad the library with restatements of the same question. */
export async function generateExercisesForTopic(
  supabase: SupabaseClient,
  topic: GeoTopic,
  adminId: string,
  count: number,
  /** Restrict the batch to one exercise type. Used by the student-facing
   * top-up in lib/geografia/exercise-stock.ts, which refills one type at a
   * time; the admin trigger omits it and gets a mix. */
  onlyType?: "mc" | "open"
): Promise<{ inserted: number; skipped: number }> {
  const { data: existingRows } = await supabase
    .from("geo_exercises")
    .select("prompt")
    .eq("topic_id", topic.id)
    .limit(60);
  const existingStatements = ((existingRows ?? []) as Array<{ prompt: { statement: string } }>)
    .map((r) => r.prompt.statement)
    .slice(0, 20);

  let generated: GeneratedExercise[] = [];
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      generated = await generateBatch(topic, count, existingStatements, onlyType);
      break;
    } catch (err) {
      console.error(`[geografia] generation attempt ${attempt + 1} failed:`, err);
      if (attempt === 1) return { inserted: 0, skipped: 0 };
    }
  }

  const existingKeys = new Set(existingStatements.map((s) => s.trim().toLowerCase().slice(0, 40)));
  const fresh = generated
    // The onlyType steer is a prompt instruction, not a schema constraint, so
    // enforce it here too — a stray 'open' in an 'mc' top-up would land in the
    // wrong queue and never be handed out.
    .filter((e) => !onlyType || e.type === onlyType)
    .filter((e) => !existingKeys.has(e.statement.trim().toLowerCase().slice(0, 40)));
  const skipped = generated.length - fresh.length;
  if (fresh.length === 0) return { inserted: 0, skipped };

  const rows = fresh.map((e) => ({
    topic_id: topic.id,
    type: e.type,
    difficulty: e.difficulty,
    points_max: e.pointsMax,
    prompt: { statement: e.statement },
    options:
      e.type === "mc"
        ? e.options!.map((o, i) => ({ id: `o${i}`, text: o.text }))
        : null,
    correct_answer:
      e.type === "mc"
        ? { correctOptionIds: e.options!.map((o, i) => ({ o, i })).filter((x) => x.o.correct).map((x) => `o${x.i}`) }
        : { modelAnswer: e.modelAnswer, rubric: e.rubric },
    hints: e.hints,
    source: "ai_generated" as const,
    needs_review: true,
    created_by: adminId,
  }));

  const { error } = await supabase.from("geo_exercises").insert(rows);
  if (error) {
    console.error("[geografia] generated exercises insert failed:", error);
    return { inserted: 0, skipped };
  }
  return { inserted: rows.length, skipped };
}
