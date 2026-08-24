// ============================================================================
// lib/gitara/pdf-chunking.ts
// Splits raw text extracted from an uploaded songbook PDF into AI-call-sized
// chunks, packing blank-line-delimited blocks so a single song is never
// split across a chunk boundary. Own copy rather than an import of
// lib/schola/pdf-chunking.ts — see lib/gitara/chordpro.ts's module comment
// for why Gitara doesn't reach into Schola's private module even where the
// logic matches byte for byte. Framework/DB-free, server-side only (never
// runs in the browser).
// ============================================================================

const MAX_CHUNK_CHARS = 8_000; // ~5,000 tokens at ~1.6 chars/token, comfortable headroom
// Sequential processing (one Groq call at a time) inside a single request
// capped at maxDuration=60s in app/api/gitara/import-songbook/route.ts — 12
// chunks x ~8,000 chars covers a substantial songbook while leaving headroom.
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
