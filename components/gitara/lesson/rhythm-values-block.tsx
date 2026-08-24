"use client";

// ============================================================================
// components/gitara/lesson/rhythm-values-block.tsx
// Rhythm values as a beat grid rather than staff notation — this app never
// needs a music-notation renderer anywhere else, so pulling one in just for
// this block would be a heavy dependency for one lesson. A bar divided into
// equal cells, tapped out at a real tempo through the same click
// lib/gitara/audio-engine.ts's Metronome uses, teaches duration exactly as
// well and reads clearly on a phone.
// ============================================================================
import { useState } from "react";
import { Play } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/gitara/lesson/rich-text";
import { playClick } from "@/lib/gitara/audio-engine";
import { cn } from "@/lib/utils";

const ROWS = [
  { key: "cala", label: "Cała nuta", hits: 1 },
  { key: "pol", label: "Półnuta", hits: 2 },
  { key: "cwierc", label: "Ćwierćnuta", hits: 4 },
  { key: "osemka", label: "Ósemka", hits: 8 },
  { key: "szesnastka", label: "Szesnastka", hits: 16 },
] as const;

export function RhythmValuesBlock({
  title,
  bpm = 70,
  caption,
}: {
  title: string;
  bpm?: number;
  caption?: string;
}) {
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const barSeconds = (60 / bpm) * 4;

  function playRow(key: string, hits: number) {
    setPlayingKey(key);
    const interval = barSeconds / hits;
    for (let i = 0; i < hits; i++) playClick(i * interval, i === 0);
    setTimeout(() => setPlayingKey((k) => (k === key ? null : k)), barSeconds * 1000);
  }

  return (
    <Card className="flex flex-col gap-3">
      <CardTitle>{title}</CardTitle>
      <div className="flex flex-col gap-2.5">
        {ROWS.map(({ key, label, hits }) => (
          <div key={key} className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => playRow(key, hits)}
              aria-label={`Odtwórz ${label}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary active:opacity-70"
            >
              <Play className="h-3.5 w-3.5" />
            </button>
            <span className="w-24 shrink-0 text-xs font-medium text-foreground">{label}</span>
            <div className="flex h-6 flex-1 gap-0.5">
              {Array.from({ length: hits }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-sm transition-opacity",
                    hits <= 2 || i % (hits / 4) === 0 ? "bg-primary" : "bg-primary/45",
                    playingKey === key && "animate-pulse"
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-foreground-muted">
        Jeden pasek = jeden takt 4/4. Im więcej pól, tym krótsza wartość rytmiczna — a przy tym samym
        tempie takt zawsze trwa tyle samo.
      </p>
      {caption && <RichText text={caption} className="text-xs text-foreground-muted" />}
    </Card>
  );
}
