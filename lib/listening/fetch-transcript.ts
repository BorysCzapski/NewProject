// ============================================================================
// lib/listening/fetch-transcript.ts
// Fetches a YouTube transcript with two independent strategies, because no
// single library survives YouTube's anti-bot changes for long:
//   1. youtube-transcript — lightweight page scrape; works from residential
//      IPs but is often blocked from datacenter IPs (e.g. Vercel).
//   2. youtubei.js (Innertube) — talks to YouTube's internal API; heavier
//      but far more resilient from servers.
// Every failure is logged with its real cause so Vercel logs show WHY a
// transcript could not be fetched instead of a swallowed generic message.
// ============================================================================
import "server-only";
import { YoutubeTranscript } from "youtube-transcript";
import type { TranscriptSegment } from "@/lib/types/database";

/** Thrown when every strategy failed; `userMessage` is safe to show in the UI. */
export class TranscriptError extends Error {
  constructor(public userMessage: string) {
    super(userMessage);
    this.name = "TranscriptError";
  }
}

async function viaTranscriptPlus(videoId: string): Promise<TranscriptSegment[]> {
  const { fetchTranscript } = await import("youtube-transcript-plus");
  // Prefer English captions; if the video has none tagged "en", retry with
  // whatever default track exists.
  const raw = await fetchTranscript(videoId, { lang: "en" }).catch(() => fetchTranscript(videoId));
  return raw.map((seg) => ({
    text: seg.text,
    start: seg.offset,
    duration: seg.duration,
  }));
}

async function viaYoutubeTranscript(videoId: string): Promise<TranscriptSegment[]> {
  const raw = await YoutubeTranscript.fetchTranscript(videoId);
  return raw.map((seg) => ({
    text: seg.text,
    start: seg.offset / 1000,
    duration: seg.duration / 1000,
  }));
}

async function viaInnertube(videoId: string): Promise<TranscriptSegment[]> {
  const { Innertube } = await import("youtubei.js");
  const yt = await Innertube.create({ retrieve_player: false });
  const info = await yt.getInfo(videoId);
  const transcriptInfo = await info.getTranscript();

  const segments =
    transcriptInfo?.transcript?.content?.body?.initial_segments ?? [];

  return segments
    .map((seg) => {
      const start = Number(seg.start_ms ?? 0) / 1000;
      const end = Number(seg.end_ms ?? 0) / 1000;
      return {
        text: seg.snippet?.text ?? "",
        start,
        duration: Math.max(end - start, 0),
      };
    })
    .filter((seg) => seg.text.trim().length > 0);
}

export async function fetchYoutubeTranscript(videoId: string): Promise<TranscriptSegment[]> {
  const failures: string[] = [];

  try {
    const segments = await viaTranscriptPlus(videoId);
    if (segments.length > 0) return segments;
    failures.push("youtube-transcript-plus: pusta transkrypcja");
  } catch (err) {
    failures.push(`youtube-transcript-plus: ${err instanceof Error ? err.message : String(err)}`);
  }

  try {
    const segments = await viaYoutubeTranscript(videoId);
    if (segments.length > 0) return segments;
    failures.push("youtube-transcript: pusta transkrypcja");
  } catch (err) {
    failures.push(`youtube-transcript: ${err instanceof Error ? err.message : String(err)}`);
  }

  try {
    const segments = await viaInnertube(videoId);
    if (segments.length > 0) return segments;
    failures.push("youtubei.js: pusta transkrypcja");
  } catch (err) {
    failures.push(`youtubei.js: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Both strategies failed — log the real causes for the server logs, then
  // give the user an honest, actionable message.
  console.error(`[listening] transcript fetch failed for video ${videoId}:`, failures);

  // Only claim "the video has no captions" when EVERY strategy points that
  // way — youtube-transcript reports "disabled" also when YouTube serves it
  // a bot-wall, which used to mislabel every video as caption-less.
  const looksLikeNoCaptions = failures.every(
    (f) => /disabled|unavailable|no transcript|not.*captions|transcript.*not|panel not found/i.test(f)
  );
  throw new TranscriptError(
    looksLikeNoCaptions
      ? "Ten filmik nie ma dostępnych napisów — wybierz inny film (najlepiej z napisami angielskimi)."
      : "Nie udało się pobrać transkrypcji (YouTube mógł zablokować zapytanie z serwera). Spróbuj ponownie za chwilę lub wybierz inny film."
  );
}
