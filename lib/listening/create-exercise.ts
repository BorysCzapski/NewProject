// ============================================================================
// lib/listening/create-exercise.ts
// Fetches a YouTube transcript and turns it into a gap-fill listening
// exercise: every ~8-12 words, one content word (not a short stopword) is
// hidden. Shared by the listening practice module and the homework admin
// creator (type = 'listening_task') so both create exercises identically.
// ============================================================================
import "server-only";
import { fetchYoutubeTranscript } from "@/lib/listening/fetch-transcript";
import { parseManualTranscript } from "@/lib/listening/parse-manual-transcript";
import { createClient } from "@/lib/supabase/server";
import { extractYoutubeVideoId } from "@/lib/utils";
import type { UserLevel, ListeningExercise, TranscriptSegment, ListeningGap } from "@/lib/types/database";

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "am", "be", "been", "being",
  "to", "of", "in", "on", "at", "for", "and", "or", "but", "so", "it", "its",
  "this", "that", "these", "those", "i", "you", "he", "she", "we", "they",
  "my", "your", "his", "her", "our", "their", "do", "does", "did", "have",
  "has", "had", "will", "would", "can", "could", "not", "with", "as", "from",
  "by", "up", "out", "if", "then", "than", "there", "here", "just", "also",
  "very", "really", "get", "got", "im", "youre", "dont", "didnt",
]);

function selectGaps(transcript: TranscriptSegment[]): ListeningGap[] {
  const gaps: ListeningGap[] = [];
  let sinceLastGap = 0;
  let threshold = 8 + Math.floor(Math.random() * 5); // 8-12 words

  transcript.forEach((segment, segmentIndex) => {
    const words = segment.text.split(/\s+/).filter(Boolean);
    words.forEach((rawWord, wordIndex) => {
      sinceLastGap++;
      const clean = rawWord.replace(/[^a-zA-Z'-]/g, "");
      const isCandidate = clean.length > 3 && !STOPWORDS.has(clean.toLowerCase());

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
  level: UserLevel;
  title?: string;
  createdBy?: string | null;
  /** Pasted-by-hand transcript — the always-works fallback when YouTube blocks server fetching. */
  manualTranscript?: string;
}): Promise<ListeningExercise> {
  const videoId = extractYoutubeVideoId(params.youtubeUrl);
  if (!videoId) {
    throw new Error("Nieprawidłowy link do filmiku YouTube.");
  }

  let transcript: TranscriptSegment[];
  if (params.manualTranscript?.trim()) {
    transcript = parseManualTranscript(params.manualTranscript);
    if (transcript.length === 0) {
      throw new Error("Nie udało się odczytać wklejonej transkrypcji — sprawdź jej format.");
    }
  } else {
    // Tries automatic strategies and throws TranscriptError with a
    // user-friendly, honest message; the real causes are logged server-side.
    transcript = await fetchYoutubeTranscript(videoId);
  }

  const gaps = selectGaps(transcript);
  if (gaps.length === 0) {
    throw new Error("Nie udało się wygenerować luk dla tego filmiku — spróbuj inny.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listening_exercises")
    .insert({
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
