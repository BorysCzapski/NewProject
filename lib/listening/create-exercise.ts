// ============================================================================
// lib/listening/create-exercise.ts
// Fetches a YouTube transcript and turns it into a gap-fill listening
// exercise: every ~8-12 words, one content word (not a short stopword) is
// hidden. Shared by the listening practice module and the homework admin
// creator (type = 'listening_task'). Language-aware: tries to fetch captions
// in the target language first, and cleans words with a Unicode-safe regex so
// Spanish accents and Russian Cyrillic survive (the old ASCII-only cleaner
// wiped Cyrillic entirely, producing zero gaps for Russian).
// ============================================================================
import "server-only";
import { YoutubeTranscript } from "youtube-transcript";
import { createClient } from "@/lib/supabase/server";
import { extractYoutubeVideoId } from "@/lib/utils";
import type {
  UserLevel,
  ListeningExercise,
  TargetLanguage,
  TranscriptSegment,
  ListeningGap,
} from "@/lib/types/database";

// Common function words to avoid hiding, per language. Hiding "the"/"и"/"la"
// makes a poor listening gap, so we skip them as gap candidates.
const STOPWORDS: Record<TargetLanguage, Set<string>> = {
  en: new Set([
    "the", "a", "an", "is", "are", "was", "were", "am", "be", "been", "being",
    "to", "of", "in", "on", "at", "for", "and", "or", "but", "so", "it", "its",
    "this", "that", "these", "those", "you", "he", "she", "we", "they",
    "my", "your", "his", "her", "our", "their", "do", "does", "did", "have",
    "has", "had", "will", "would", "can", "could", "not", "with", "as", "from",
    "by", "up", "out", "if", "then", "than", "there", "here", "just", "also",
    "very", "really", "get", "got",
  ]),
  es: new Set([
    "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "en",
    "con", "por", "para", "que", "qué", "y", "o", "pero", "si", "no", "es",
    "son", "soy", "eres", "está", "están", "ser", "estar", "su", "sus", "mi",
    "tu", "se", "lo", "le", "me", "te", "nos", "yo", "él", "ella", "como",
    "más", "muy", "ya", "también", "porque", "cuando", "donde",
  ]),
  ru: new Set([
    "и", "в", "во", "не", "он", "на", "я", "что", "тот", "быть", "с", "со",
    "как", "а", "то", "все", "она", "так", "его", "но", "да", "ты", "к", "у",
    "же", "вы", "за", "бы", "по", "только", "её", "мне", "было", "вот", "от",
    "меня", "ещё", "нет", "о", "из", "ему", "или", "мы", "им", "эта", "они",
  ]),
};

function selectGaps(transcript: TranscriptSegment[], language: TargetLanguage): ListeningGap[] {
  const stop = STOPWORDS[language] ?? STOPWORDS.en;
  const gaps: ListeningGap[] = [];
  let sinceLastGap = 0;
  let threshold = 8 + Math.floor(Math.random() * 5); // 8-12 words

  transcript.forEach((segment, segmentIndex) => {
    const words = segment.text.split(/\s+/).filter(Boolean);
    words.forEach((rawWord, wordIndex) => {
      sinceLastGap++;
      // Unicode-safe: keep any letter (Latin accents, Cyrillic), apostrophes, hyphens.
      const clean = rawWord.replace(/[^\p{L}'-]/gu, "");
      const isCandidate = clean.length > 3 && !stop.has(clean.toLowerCase());

      if (sinceLastGap >= threshold && isCandidate) {
        gaps.push({ segmentIndex, wordIndex, answer: clean, timestamp: segment.start });
        sinceLastGap = 0;
        threshold = 8 + Math.floor(Math.random() * 5);
      }
    });
  });

  return gaps;
}

export async function createListeningExercise(params: {
  youtubeUrl: string;
  language: TargetLanguage;
  level: UserLevel;
  title?: string;
  createdBy?: string | null;
}): Promise<ListeningExercise> {
  const videoId = extractYoutubeVideoId(params.youtubeUrl);
  if (!videoId) {
    throw new Error("Nieprawidłowy link do filmiku YouTube.");
  }

  let raw;
  try {
    // Prefer captions in the target language; fall back to whatever's available.
    try {
      raw = await YoutubeTranscript.fetchTranscript(videoId, { lang: params.language });
    } catch {
      raw = await YoutubeTranscript.fetchTranscript(videoId);
    }
  } catch {
    throw new Error(
      "Nie udało się pobrać transkrypcji tego filmiku (może nie mieć napisów)."
    );
  }
  if (!raw.length) {
    throw new Error("Ten filmik nie ma dostępnej transkrypcji.");
  }

  const transcript: TranscriptSegment[] = raw.map((seg) => ({
    text: seg.text,
    start: seg.offset / 1000,
    duration: seg.duration / 1000,
  }));

  const gaps = selectGaps(transcript, params.language);
  if (gaps.length === 0) {
    throw new Error("Nie udało się wygenerować luk dla tego filmiku — spróbuj inny.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listening_exercises")
    .insert({
      language: params.language,
      youtube_url: params.youtubeUrl,
      video_id: videoId,
      title: params.title?.trim() || `Ćwiczenie ze słuchania (${videoId})`,
      level: params.level,
      transcript,
      gaps,
      created_by: params.createdBy ?? null,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error("Nie udało się zapisać ćwiczenia ze słuchania.");
  }
  return data as ListeningExercise;
}
