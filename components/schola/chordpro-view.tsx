// ============================================================================
// components/schola/chordpro-view.tsx
// Renders lyrics_chordpro as lyrics with chord labels floating above the
// syllable they apply to — the standard guitar-songbook rendering for
// ChordPro-style inline tags. See lib/schola/chordpro.ts for parsing.
// ============================================================================
import { parseChordProLine } from "@/lib/schola/chordpro";

export function ChordProView({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="whitespace-pre-wrap font-mono text-sm leading-8 text-foreground">
      {lines.map((line, i) => {
        if (line.trim() === "") return <div key={i} className="h-4" />;
        const tokens = parseChordProLine(line);
        return (
          <div key={i} className="flex flex-wrap items-end">
            {tokens.map((token, j) => (
              <span key={j} className="relative inline-block">
                {token.chord && (
                  <span className="absolute -top-4 left-0 text-xs font-bold text-primary">
                    {token.chord}
                  </span>
                )}
                <span>{token.text || " "}</span>
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
