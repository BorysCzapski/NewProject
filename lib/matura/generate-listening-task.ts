// ============================================================================
// lib/matura/generate-listening-task.ts
// Turns one curated, REAL YouTube recording (lib/matura/listening-pool.ts)
// into a matura_tasks row for "Rozumienie ze słuchu" — the one exam part
// where the model cannot invent content wholesale (see the aiGeneratable
// comment in lib/matura/task-types.ts): a made-up transcript the student
// reads instead of hears is not a listening task. Instead this fetches the
// video's REAL captions and asks the model to write comprehension items
// GROUNDED in that transcript — the same process a human curator followed by
// hand for the first four tasks (supabase/seed/matura/10_tasks_sluchanie.sql),
// just automated so "rozumienie ze słuchu" never sits empty waiting on an
// administrator to paste in a new link.
//
// Called from lib/matura/task-stock.ts exactly where generateMaturaTask is
// called for every other type — same "one task per AI call" and
// "never throws" contract, see the comment there.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { askAIForJSON } from "@/lib/ai";
import { fetchYoutubeTranscript, TranscriptError } from "@/lib/listening/fetch-transcript";
import { MATURA_LANGUAGE_LABELS } from "@/lib/matura/constants";
import { normalizeGeneratedTask } from "@/lib/matura/generate-tasks";
import { LISTENING_POOL, type ListeningPoolEntry } from "@/lib/matura/listening-pool";
import type { MaturaTaskTypeDef } from "@/lib/matura/task-types";
import type { MaturaLanguage, MaturaLevel, MaturaTaskContent } from "@/lib/types/database";

// A 10-12 minute recording's captions comfortably fit under this — plenty for
// grounding without pushing the prompt past what's worth spending on a single
// background top-up call.
const MAX_TRANSCRIPT_CHARS = 12000;

function transcriptToText(segments: Array<{ text: string }>): string {
  const joined = segments
    .map((s) => s.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return joined.length > MAX_TRANSCRIPT_CHARS ? joined.slice(0, MAX_TRANSCRIPT_CHARS) : joined;
}

/** Video ids this section already has a task for, so a top-up prefers an
 * unused recording over immediately repeating one — same recording, new
 * questions is a fallback, not the first choice. */
async function usedVideoIds(supabase: SupabaseClient, sectionId: string): Promise<Set<string>> {
  const { data } = await supabase.from("matura_tasks").select("content").eq("section_id", sectionId);
  const ids = new Set<string>();
  for (const row of (data ?? []) as Array<{ content: MaturaTaskContent | null }>) {
    const videoId = row.content?.youtubeVideoId;
    if (videoId) ids.add(videoId);
  }
  return ids;
}

function pickPoolEntry(pool: ListeningPoolEntry[], used: Set<string>): ListeningPoolEntry | null {
  if (pool.length === 0) return null;
  const fresh = pool.filter((entry) => !used.has(entry.videoId));
  const from = fresh.length > 0 ? fresh : pool;
  return from[Math.floor(Math.random() * from.length)];
}

function systemPrompt(
  typeDef: MaturaTaskTypeDef,
  language: MaturaLanguage,
  level: MaturaLevel,
  transcript: string
): string {
  const languageLabel = MATURA_LANGUAGE_LABELS[language];
  const levelLabel = level === "podstawowa" ? "poziomu podstawowego" : "poziomu rozszerzonego";

  return (
    `Jesteś doświadczonym egzaminatorem CKE układającym zadanie na rozumienie ze słuchu do matury ` +
    `${levelLabel} z języka ${languageLabel.toLowerCase()}ego, typu „${typeDef.label}”. Poniżej masz ` +
    "PRAWDZIWĄ transkrypcję nagrania (napisy pobrane z YouTube) — student będzie tego nagrania słuchał, " +
    "NIE czytał transkrypcji, więc Twoje pytania i odpowiedzi MUSZĄ opierać się WYŁĄCZNIE na faktach z tej " +
    "transkrypcji — nie wolno dopisywać informacji, których w niej nie ma, ani zmieniać ich sensu. Zasady: " +
    `1) Polecenie (instructions) i wyjaśnienia (explanation) piszesz PO POLSKU; treść pytań i opcji — w ` +
    `języku ${languageLabel.toLowerCase()}m. ` +
    `2) Wygeneruj DOKŁADNIE ${typeDef.itemCount} podpunktów w polu items, typu multiple_choice. ` +
    "3) Każdy podpunkt ma dokładnie jedną jednoznacznie poprawną odpowiedź, uzasadnioną konkretnym " +
    "fragmentem nagrania — correctAnswers zawiera tę opcję przepisaną DOSŁOWNIE razem z literą i kropką. " +
    "4) W explanation krótko wskaż PO POLSKU, co w nagraniu potwierdza tę odpowiedź; możesz zacytować " +
    "pojedynczy krótki zwrot (kilka słów), nigdy całe zdania. " +
    "5) Pytania i opcje pisz WŁASNYMI słowami — nie przepisuj długich fragmentów transkrypcji. " +
    `WYMAGANIA TEGO TYPU ZADANIA: ${typeDef.aiBrief}\n\n` +
    `TRANSKRYPCJA NAGRANIA:\n"""\n${transcript}\n"""`
  );
}

function schema(): Record<string, unknown> {
  return {
    instructions: {
      type: "string",
      description:
        "Polecenie do całego zadania, PO POLSKU — wspomnij, że nagranie można odtworzyć maksymalnie dwa razy, tak jak na egzaminie.",
    },
    items: {
      type: "array",
      description: "Podpunkty zadania.",
      items: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "Treść pytania lub zdania do dopasowania." },
          options: {
            type: "array",
            items: { type: "string" },
            description: 'Opcje w formacie "A. tekst", "B. tekst", …',
          },
          correctAnswers: {
            type: "array",
            items: { type: "string" },
            description: "Jeden element: poprawna opcja przepisana DOSŁOWNIE tak jak w options.",
          },
          explanation: { type: "string", description: "Krótkie uzasadnienie PO POLSKU odwołujące się do nagrania." },
        },
        required: ["prompt", "options", "correctAnswers"],
      },
    },
  };
}

/**
 * Generates one listening task grounded in a real, curated recording. Returns
 * null whenever there is nothing usable to hand back — an empty pool, a
 * transcript that could not be fetched, or a model reply that didn't survive
 * normalization — exactly like generateMaturaTask, so the caller in
 * lib/matura/task-stock.ts treats it as "no new task this time".
 */
export async function generateMaturaListeningTask(params: {
  typeDef: MaturaTaskTypeDef;
  language: MaturaLanguage;
  level: MaturaLevel;
  supabase: SupabaseClient;
  sectionId: string;
}): Promise<MaturaTaskContent | null> {
  const { typeDef, language, level, supabase, sectionId } = params;

  const pool = LISTENING_POOL[language]?.[level] ?? [];
  const used = await usedVideoIds(supabase, sectionId);
  const entry = pickPoolEntry(pool, used);
  if (!entry) return null;

  let transcriptText: string;
  try {
    const segments = await fetchYoutubeTranscript(entry.videoId, language);
    transcriptText = transcriptToText(segments);
  } catch (err) {
    console.error(
      `[matura] transkrypcja niedostępna dla ${entry.videoId} (${entry.title}):`,
      err instanceof TranscriptError ? err.userMessage : err
    );
    return null;
  }
  // Too little to responsibly ground comprehension questions in.
  if (transcriptText.length < 200) return null;

  try {
    const raw = await askAIForJSON<{ instructions?: unknown; items?: unknown }>({
      system: systemPrompt(typeDef, language, level, transcriptText),
      prompt: `Ułóż zadanie typu „${typeDef.label}” na podstawie powyższej transkrypcji. Zadanie ma być kompletne i gotowe do rozwiązania przez maturzystę.`,
      schema: schema(),
      maxTokens: 2400,
    });
    const content = normalizeGeneratedTask(raw, typeDef);
    if (!content) return null;
    content.youtubeVideoId = entry.videoId;
    return content;
  } catch (err) {
    console.error(`[matura] generowanie zadania ze słuchu „${typeDef.slug}" nie powiodło się:`, err);
    return null;
  }
}
