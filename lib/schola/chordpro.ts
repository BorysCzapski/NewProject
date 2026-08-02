// ============================================================================
// lib/schola/chordpro.ts
// Minimal ChordPro-style parsing: inline "[Chord]" tags immediately before
// the lyric text they apply to, e.g. "Panie, [C]przyjdź [G]do nas". Scoped
// to inline chord tags only — no {directive} support, since title/tags
// already live in their own schola_songs columns. Framework/DB-free, so
// it's safe to import from both server and client code.
// ============================================================================

export function stripChords(text: string): string {
  return text.replace(/\[[^\]]*\]/g, "");
}

export interface ChordProToken {
  chord: string | null;
  text: string;
}

/** Splits one line into (chord, text-until-next-chord) segments, so a
 * chord can be rendered above the syllable it applies to. */
export function parseChordProLine(line: string): ChordProToken[] {
  const tokens: ChordProToken[] = [];
  const regex = /\[([^\]]*)\]/g;
  let lastIndex = 0;
  let pendingChord: string | null = null;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    const textBefore = line.slice(lastIndex, match.index);
    if (textBefore || pendingChord !== null) {
      tokens.push({ chord: pendingChord, text: textBefore });
    }
    pendingChord = match[1];
    lastIndex = regex.lastIndex;
  }

  const rest = line.slice(lastIndex);
  if (rest || pendingChord !== null) {
    tokens.push({ chord: pendingChord, text: rest });
  }

  return tokens;
}
