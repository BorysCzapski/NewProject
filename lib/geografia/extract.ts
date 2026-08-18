import "server-only";

// ============================================================================
// lib/geografia/extract.ts
// Turns one chunk of raw worksheet-PDF text into structured exercises,
// tagged with the CKE topic they belong to. Same "AI call per chunk, code
// merges" shape as lib/textbook/extract.ts, adapted to a flat exercise list
// (a worksheet isn't organized into units the way a textbook is) plus topic
// ROUTING: since geo_exercises.topic_id is NOT NULL, any extracted exercise
// the AI couldn't confidently map to one of the 23 known topics is dropped
// rather than inserted with a guessed/empty topic.
// ============================================================================
import { askAIForJSON } from "@/lib/ai";
import type { GeoTopic } from "@/lib/types/database";

export interface ExtractedExercise {
  topicSlug: string;
  type: "mc" | "open";
  difficulty: 1 | 2 | 3;
  pointsMax: number;
  statement: string;
  options: Array<{ text: string; correct: boolean }> | null;
  modelAnswer: string | null;
  rubric: string[] | null;
  hints: string[];
}

interface RawExtracted {
  topicSlug?: string;
  type?: string;
  difficulty?: number;
  pointsMax?: number;
  statement: string;
  options?: Array<{ text: string; correct: boolean }>;
  modelAnswer?: string;
  rubric?: string[];
  hints?: string[];
}

interface ChunkExtraction {
  exercises: RawExtracted[];
}

function normalize(raw: RawExtracted, validSlugs: Set<string>): ExtractedExercise | null {
  if (!raw.statement?.trim()) return null;
  if (!raw.topicSlug || !validSlugs.has(raw.topicSlug)) return null;

  const type = raw.type === "open" ? "open" : "mc";
  const difficulty: 1 | 2 | 3 = raw.difficulty === 1 || raw.difficulty === 3 ? raw.difficulty : 2;

  if (type === "mc") {
    const options = (raw.options ?? []).filter((o) => o?.text?.trim());
    if (options.length < 2 || options.filter((o) => o.correct).length !== 1) return null;
    return {
      topicSlug: raw.topicSlug,
      type,
      difficulty,
      pointsMax: 1,
      statement: raw.statement,
      options,
      modelAnswer: null,
      rubric: null,
      hints: raw.hints ?? [],
    };
  }

  if (!raw.modelAnswer?.trim() || !raw.rubric?.length) return null;
  return {
    topicSlug: raw.topicSlug,
    type,
    difficulty,
    pointsMax: raw.pointsMax && raw.pointsMax > 0 && raw.pointsMax <= 5 ? raw.pointsMax : Math.max(1, Math.min(3, raw.rubric.length)),
    statement: raw.statement,
    options: null,
    modelAnswer: raw.modelAnswer,
    rubric: raw.rubric,
    hints: raw.hints ?? [],
  };
}

/** Extracts one chunk's exercises, retrying once before giving up on that
 * chunk alone (a transient AI/JSON failure shouldn't abort the whole
 * import) — same pattern as lib/textbook/extract.ts. */
export async function extractExercisesFromChunk(chunk: string, topics: GeoTopic[]): Promise<ExtractedExercise[]> {
  const validSlugs = new Set(topics.map((t) => t.slug));
  const topicList = topics.map((t) => `${t.slug}: ${t.title}`).join("\n");

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await askAIForJSON<ChunkExtraction>({
        system:
          "Cyfryzujesz FRAGMENT arkusza ćwiczeń z geografii (matura rozszerzona), wyodrębniony z PDF " +
          "(mogą występować artefakty łamania stron). Zidentyfikuj TYLKO faktycznie obecne w tekście " +
          "pytania/zadania — NIE wymyślaj nowych. Dla każdego: dopasuj JEDEN najbliższy dział z tej listy " +
          "CKE (użyj DOKŁADNIE jednego z podanych slugów w polu topicSlug, bez zgadywania spoza listy):\n" +
          topicList +
          "\n\nTyp 'mc' = pytanie zamknięte z jedną poprawną opcją (options, dokładnie jedna correct=true). " +
          "Typ 'open' = pytanie otwarte — jeśli w arkuszu jest klucz odpowiedzi, wpisz go jako modelAnswer " +
          "i rozbij na punkty oceny (rubric); jeśli arkusz nie ma klucza, pomiń to pytanie całkowicie (nie " +
          "zgaduj poprawnej odpowiedzi). Pomiń pytania bez rozpoznawalnego działu.",
        prompt: `Oto fragment arkusza do przetworzenia:\n\n${chunk}`,
        schema: {
          exercises: {
            type: "array",
            items: {
              type: "object",
              properties: {
                topicSlug: { type: "string" },
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
              // Only "statement" required, same Groq strict-validation reasoning
              // as lib/textbook/extract.ts — everything else recoverable gets a
              // code-side default/drop in normalize() above.
              required: ["statement"],
            },
          },
        },
        maxTokens: 4000,
      });
      return (result.exercises ?? [])
        .map((raw) => normalize(raw, validSlugs))
        .filter((e): e is ExtractedExercise => e !== null);
    } catch (err) {
      if (attempt === 0) {
        console.error("[geografia] chunk extraction failed, retrying once:", err);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
      console.error("[geografia] chunk extraction failed twice, skipping chunk:", err);
      return [];
    }
  }
  return [];
}
