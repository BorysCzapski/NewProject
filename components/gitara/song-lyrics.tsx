// ============================================================================
// components/gitara/song-lyrics.tsx
// Renders gtr_songs.content_chordpro: each [Chord] floats above the syllable
// it precedes, the way a real chord chart reads. Server Component — this is
// pure text layout, nothing here needs to run in the browser.
// ============================================================================
import { parseChordProLine } from "@/lib/gitara/chordpro";

export function SongLyrics({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="flex flex-col gap-0.5 font-mono text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line.trim() === "") return <div key={i} className="h-3" aria-hidden="true" />;
        const tokens = parseChordProLine(line);
        return (
          <div key={i} className="flex flex-wrap items-end">
            {tokens.map((token, j) => (
              <span key={j} className="inline-flex flex-col items-start">
                <span className="h-4 text-xs font-bold text-primary">{token.chord ?? " "}</span>
                <span className="whitespace-pre text-foreground">{token.text || " "}</span>
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
