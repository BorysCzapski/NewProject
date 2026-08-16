import "server-only";

// ============================================================================
// lib/textbook/extract.ts
// Turns one chunk of raw textbook-PDF text into structured units (vocabulary
// + grammar), and merges the per-chunk results of a whole book into a single
// ordered unit list. Mirrors lib/schola/pdf-chunking.ts's "AI call per
// chunk, code merges" shape, generalized from a flat list (songs) to a
// grouped-by-unit-title list, since a unit can span multiple chunks.
// ============================================================================
import { askAIForJSON } from "@/lib/ai";
import type { GrammarBlock } from "@/lib/grammar/lesson-blocks";

export interface ExtractedWord {
  word_en: string;
  translation_pl: string;
  example_sentence: string;
}

export interface ExtractedGrammarExercise {
  type: "gap_fill" | "multiple_choice";
  prompt: string;
  options: string[] | null;
  correct_answer: string;
}

export interface ExtractedGrammarTopic {
  title: string;
  explanation: string;
  examples: Array<{ en: string; pl: string }>;
  tips: string[];
  table: { headers: string[]; rows: string[][] } | null;
  exercises: ExtractedGrammarExercise[];
}

export interface ExtractedUnit {
  unit_title: string;
  words: ExtractedWord[];
  grammar_topics: ExtractedGrammarTopic[];
}

interface ChunkExtraction {
  units: ExtractedUnit[];
}

/** Extracts one chunk's units, retrying once (a past cause of truncated-JSON
 * failures elsewhere in this app — see lib/matma/generate-ai-problems.ts)
 * before giving up on this chunk alone; one bad chunk shouldn't abort the
 * whole import. */
export async function extractUnitsFromChunk(chunk: string): Promise<ExtractedUnit[]> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await askAIForJSON<ChunkExtraction>({
        system:
          "Jesteś nauczycielem angielskiego digitalizującym FRAGMENT podręcznika do angielskiego dla " +
          "Polaków. Otrzymujesz fragment tekstu wyodrębniony z PDF (mogą występować artefakty łamania " +
          "stron i braki formatowania). Zadanie:\n" +
          "1. Zidentyfikuj DZIAŁY/ROZDZIAŁY/LEKCJE widoczne w tym fragmencie (np. \"Unit 3: Travel\"). " +
          "Jeśli fragment nie ma wyraźnego nagłówka i jest kontynuacją poprzedniego działu, użyj tego " +
          "samego tytułu; jeśli nie da się określić, użyj \"Ogólne\".\n" +
          "2. Dla każdego działu wypisz słówka (angielskie słowo + polskie tłumaczenie + zdanie PO " +
          "ANGIELSKU zawierające DOKŁADNIE to słowo) — TYLKO słówka faktycznie widoczne/uczone w tym " +
          "fragmencie (słowniczek, pogrubione słowa, listy vocabulary). NIE wymyślaj słówek spoza tekstu.\n" +
          "3. Jeśli fragment zawiera WYRAŹNIE wytłumaczoną regułę gramatyczną (sekcja \"Grammar\", " +
          "tabela odmiany, wyjaśnienie czasu) — opisz ją: krótkie wyjaśnienie po polsku, 2-4 przykładowe " +
          "zdania (en+pl), opcjonalne 0-2 krótkie wskazówki/pułapki po polsku, opcjonalna tabelka (np. " +
          "odmiana czasownika — pomiń pole \"table\" całkowicie, jeśli niepotrzebne), i 3-5 ćwiczeń typu " +
          "gap_fill (zdanie z luką \"___\", correct_answer = brakujące słowo) lub multiple_choice (zdanie " +
          "z luką + 3-4 opcje w \"options\", jedna zgodna z correct_answer). Jeśli fragment NIE zawiera " +
          "jawnie wytłumaczonej gramatyki, zostaw grammar_topics jako pustą listę — NIE wymyślaj reguł, " +
          "których nie ma w tekście.",
        prompt: `Oto fragment podręcznika do przetworzenia:\n\n${chunk}`,
        schema: {
          units: {
            type: "array",
            items: {
              type: "object",
              properties: {
                unit_title: { type: "string" },
                words: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      word_en: { type: "string" },
                      translation_pl: { type: "string" },
                      example_sentence: { type: "string" },
                    },
                    required: ["word_en", "translation_pl", "example_sentence"],
                  },
                },
                grammar_topics: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      explanation: { type: "string" },
                      examples: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: { en: { type: "string" }, pl: { type: "string" } },
                          required: ["en", "pl"],
                        },
                      },
                      tips: { type: "array", items: { type: "string" } },
                      table: {
                        type: "object",
                        properties: {
                          headers: { type: "array", items: { type: "string" } },
                          rows: { type: "array", items: { type: "array", items: { type: "string" } } },
                        },
                      },
                      exercises: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            type: { type: "string", enum: ["gap_fill", "multiple_choice"] },
                            prompt: { type: "string" },
                            options: { type: "array", items: { type: "string" } },
                            correct_answer: { type: "string" },
                          },
                          required: ["type", "prompt", "correct_answer"],
                        },
                      },
                    },
                    required: ["title", "explanation", "examples", "exercises"],
                  },
                },
              },
              required: ["unit_title", "words", "grammar_topics"],
            },
          },
        },
        maxTokens: 6000,
      });
      return result.units ?? [];
    } catch (err) {
      if (attempt === 0) {
        console.error("[textbook] chunk extraction failed, retrying once:", err);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
      console.error("[textbook] chunk extraction failed twice, skipping chunk:", err);
      return [];
    }
  }
  return [];
}

/** Merges every chunk's units by normalized title (a unit can span several
 * chunks), preserving first-seen order — which is document reading order,
 * since chunks are processed sequentially. De-dupes exact-match words within
 * a unit (a glossary + running text can repeat the same word). */
export function mergeUnits(chunkUnits: ExtractedUnit[][]): ExtractedUnit[] {
  const order: string[] = [];
  const byKey = new Map<string, ExtractedUnit>();

  for (const units of chunkUnits) {
    for (const unit of units) {
      const title = unit.unit_title.trim() || "Ogólne";
      const key = title.toLowerCase();
      let merged = byKey.get(key);
      if (!merged) {
        merged = { unit_title: title, words: [], grammar_topics: [] };
        byKey.set(key, merged);
        order.push(key);
      }
      merged.words.push(...unit.words);
      merged.grammar_topics.push(...unit.grammar_topics);
    }
  }

  const result = order.map((key) => byKey.get(key)!);
  for (const unit of result) {
    const seen = new Set<string>();
    unit.words = unit.words.filter((word) => {
      const wordKey = word.word_en.trim().toLowerCase();
      if (seen.has(wordKey)) return false;
      seen.add(wordKey);
      return true;
    });
  }
  return result;
}

/** A multiple_choice exercise the tool-call schema can't validate
 * conditionally (options present + containing correct_answer) is downgraded
 * to gap_fill instead of trusting it blindly — same defensive pattern as
 * lib/reading/actions.ts's multiple_choice question validation. */
export function sanitizeExercise(exercise: ExtractedGrammarExercise): {
  type: "gap_fill" | "multiple_choice";
  prompt: string;
  options: string[] | null;
  correct_answer: string;
} {
  const isValidMultipleChoice =
    exercise.type === "multiple_choice" &&
    Array.isArray(exercise.options) &&
    exercise.options.length >= 2 &&
    exercise.options.includes(exercise.correct_answer);

  return {
    type: isValidMultipleChoice ? "multiple_choice" : "gap_fill",
    prompt: exercise.prompt,
    options: isValidMultipleChoice ? exercise.options! : null,
    correct_answer: exercise.correct_answer,
  };
}

/** Maps the AI's simplified per-topic shape onto the existing GrammarBlock
 * union (lib/grammar/lesson-blocks.ts), restricted to the subset an LLM can
 * reliably produce from arbitrary textbook content — "formula"/"timeline"
 * need precise structural metadata (word-role tags, 0-100 tense-axis
 * coordinates) that only makes sense for hand-authored tense comparisons. */
export function toGrammarBlocks(topic: ExtractedGrammarTopic): GrammarBlock[] {
  const blocks: GrammarBlock[] = [{ type: "intro", text: topic.explanation }];

  if (topic.examples.length > 0) {
    blocks.push({ type: "examples", items: topic.examples });
  }
  if (topic.table && topic.table.headers.length > 0 && topic.table.rows.length > 0) {
    blocks.push({ type: "table", headers: topic.table.headers, rows: topic.table.rows });
  }
  for (const tip of topic.tips) {
    blocks.push({ type: "tip", variant: "tip", text: tip });
  }

  return blocks;
}
