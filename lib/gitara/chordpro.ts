// ============================================================================
// lib/gitara/chordpro.ts
// Minimal ChordPro-style parsing for gtr_songs.content_chordpro: inline
// "[Chord]" tags immediately before the lyric text they apply to, e.g.
// "Panie, [C]przyjdź [G]do nas". Scoped to inline chord tags only — no
// {directive} support, since title/artist/tempo already live in their own
// gtr_songs columns.
//
// Its own copy rather than an import of lib/schola/chordpro.ts: the two
// modules are byte-identical today, but Schola sits behind its own separate
// membership gate (app/schola/logowanie) that has nothing to do with this
// app's open-to-any-family-member access — coupling Gitara's song viewer to
// a private choir module's file is the wrong dependency even though the
// format happens to match. Framework/DB-free, safe on server and client.
// ============================================================================

export function stripChords(text: string): string {
  return text.replace(/\[[^\]]*\]/g, "");
}

export interface ChordProToken {
  chord: string | null;
  text: string;
}

/** Splits one line into (chord, text-until-next-chord) segments, so a chord
 * can be rendered above the syllable it applies to. */
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
