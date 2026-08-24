"use client";

// ============================================================================
// components/gitara/lesson/progression-block.tsx
// Plays a chord progression at a fixed tempo (2 beats/chord), strumming each
// shape through lib/gitara/audio-engine.ts and highlighting it in sync — the
// "hear the changes, not just see them" counterpart to a static chord grid.
// ============================================================================
import { useEffect, useRef, useState } from "react";
import { Play, Square } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChordDiagram } from "@/components/gitara/chord-diagram";
import { RichText } from "@/components/gitara/lesson/rich-text";
import { chordFrequencies } from "@/lib/gitara/theory";
import { playChordStrum } from "@/lib/gitara/audio-engine";
import type { GtrLessonChord } from "@/lib/gitara/lesson-blocks";
import { cn } from "@/lib/utils";

export function ProgressionBlock({
  title,
  chords,
  bpm = 80,
  caption,
}: {
  title: string;
  chords: GtrLessonChord[];
  bpm?: number;
  caption?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef = useRef(false);

  useEffect(
    () => () => {
      playingRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  function stop() {
    playingRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveIndex(null);
    setIsPlaying(false);
  }

  function play() {
    if (chords.length === 0 || playingRef.current) return;
    playingRef.current = true;
    setIsPlaying(true);
    const stepMs = (60 / bpm) * 2 * 1000; // 2 beats per chord

    let i = 0;
    const step = () => {
      if (!playingRef.current) return;
      setActiveIndex(i);
      playChordStrum(chordFrequencies(chords[i].chord));
      i++;
      if (i >= chords.length) {
        timeoutRef.current = setTimeout(stop, stepMs);
        return;
      }
      timeoutRef.current = setTimeout(step, stepMs);
    };
    step();
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <CardTitle>{title}</CardTitle>
        <Button
          size="sm"
          variant={isPlaying ? "outline" : "primary"}
          onClick={isPlaying ? stop : play}
        >
          {isPlaying ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {isPlaying ? "Zatrzymaj" : "Odtwórz"}
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {chords.map((c, i) => (
          <div
            key={i}
            className={cn(
              "shrink-0 rounded-(--radius-control) p-1.5 transition-colors",
              activeIndex === i && "bg-primary-soft"
            )}
          >
            <ChordDiagram chord={c.chord} label={c.label} size="sm" showPlay={false} />
          </div>
        ))}
      </div>

      {caption && <RichText text={caption} className="text-xs text-foreground-muted" />}
    </Card>
  );
}
