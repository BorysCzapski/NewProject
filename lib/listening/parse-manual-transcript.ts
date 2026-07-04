// ============================================================================
// lib/listening/parse-manual-transcript.ts
// Parses a transcript pasted by the user — the always-works fallback for
// when YouTube blocks server-side transcript fetching (datacenter IPs).
// Accepted formats:
//   1. YouTube's transcript panel copy: alternating "0:15" / "text" lines
//      (also handles "0:15 text" on one line and [0:15] / (0:15) variants)
//   2. Plain text without timestamps — split into sentence-ish segments with
//      synthetic timing so gap timestamps stay roughly monotonic.
// ============================================================================
import type { TranscriptSegment } from "@/lib/types/database";

const TIMESTAMP = /^\s*[[(]?(\d{1,2}):(\d{2})(?::(\d{2}))?[\])]?\s*(.*)$/;

function toSeconds(h: string, m: string, s?: string): number {
  // "MM:SS" → h holds minutes; "HH:MM:SS" → all three groups present.
  if (s !== undefined) return Number(h) * 3600 + Number(m) * 60 + Number(s);
  return Number(h) * 60 + Number(m);
}

export function parseManualTranscript(raw: string): TranscriptSegment[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const timed: Array<{ start: number; text: string }> = [];
  let pendingStart: number | null = null;

  for (const line of lines) {
    const match = line.match(TIMESTAMP);
    if (match) {
      const start = toSeconds(match[1], match[2], match[3]);
      const rest = match[4]?.trim();
      if (rest) {
        // "0:15 some text" on a single line
        timed.push({ start, text: rest });
        pendingStart = null;
      } else {
        // bare timestamp line — text follows on the next line(s)
        pendingStart = start;
      }
      continue;
    }
    if (pendingStart !== null) {
      timed.push({ start: pendingStart, text: line });
      pendingStart = null;
    } else if (timed.length > 0) {
      // continuation line of the previous cue
      timed[timed.length - 1].text += ` ${line}`;
    } else {
      timed.push({ start: -1, text: line }); // no timestamps at all so far
    }
  }

  const hasTimestamps = timed.some((t) => t.start >= 0);

  if (!hasTimestamps) {
    // Plain text: split into sentences and synthesize ~4s per segment.
    const sentences = timed
      .map((t) => t.text)
      .join(" ")
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return sentences.map((text, i) => ({ text, start: i * 4, duration: 4 }));
  }

  const withStarts = timed.filter((t) => t.start >= 0 && t.text.trim().length > 0);
  return withStarts.map((t, i) => {
    const next = withStarts[i + 1];
    const duration = next ? Math.max(next.start - t.start, 1) : 4;
    return { text: t.text.trim(), start: t.start, duration };
  });
}
