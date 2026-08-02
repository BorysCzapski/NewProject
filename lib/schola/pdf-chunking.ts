// ============================================================================
// lib/schola/pdf-chunking.ts
// Splits raw text extracted from a songbook PDF into AI-call-sized chunks,
// packing blank-line-delimited blocks so a single song is never split
// across a chunk boundary (real songbooks separate songs with whitespace).
// Deliberately real chunking, not the truncate-and-retry shortcut
// lib/matma/import-past-exams.ts uses for exam PDFs — a dropped trailing
// song here would be silent data loss, unlike a manually-fixed exam gap.
// Framework/DB-free, safe to import from the Route Handler only (server
// side — this never runs in the browser).
// ============================================================================

const MAX_CHUNK_CHARS = 8_000; // ~5,000 tokens at ~1.6 chars/token, comfortable headroom
// Chunks are processed SEQUENTIALLY (one Groq call at a time, to respect
// rate limits) inside a single request capped at maxDuration=60s in
// app/api/schola/import-pdf/route.ts — 12 chunks x ~8,000 chars covers a
// substantial songbook (dozens of songs) while leaving headroom per call.
export const MAX_IMPORT_CHUNKS = 12;

export function splitIntoImportChunks(rawText: string): string[] {
  const blocks = rawText
    .split(/\n\s*\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const block of blocks) {
    const candidate = current ? `${current}\n\n${block}` : block;
    if (candidate.length > MAX_CHUNK_CHARS && current) {
      chunks.push(current);
      current = block;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);

  return chunks;
}
