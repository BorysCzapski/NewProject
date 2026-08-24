"use client";

// ============================================================================
// components/gitara/metronome-tool.tsx
// The metronome half of /gitara/cwicz: tempo control (buttons, slider, tap
// tempo), a 4-beat visual pulse in sync with the audio click, and a practice
// session logged (lib/gitara/actions.ts's logPracticeSession) on stop.
// ============================================================================
import { useEffect, useRef, useState } from "react";
import { Minus, Play, Plus, Square } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Metronome } from "@/lib/gitara/audio-engine";
import { logPracticeSession } from "@/lib/gitara/actions";
import { cn } from "@/lib/utils";

const MIN_BPM = 40;
const MAX_BPM = 220;
const BEATS_PER_MEASURE = 4;

export function MetronomeTool() {
  const [bpm, setBpm] = useState(90);
  const [running, setRunning] = useState(false);
  const [activeBeat, setActiveBeat] = useState(-1);
  const metronomeRef = useRef<Metronome | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const tapTimesRef = useRef<number[]>([]);

  useEffect(() => {
    metronomeRef.current = new Metronome(bpm, BEATS_PER_MEASURE);
    return () => metronomeRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    metronomeRef.current?.setTempo(bpm);
  }, [bpm]);

  function toggle() {
    const metronome = metronomeRef.current;
    if (!metronome) return;

    if (running) {
      metronome.stop();
      setRunning(false);
      setActiveBeat(-1);
      const startedAt = startedAtRef.current;
      startedAtRef.current = null;
      if (startedAt) {
        void logPracticeSession({ kind: "metronom", durationSeconds: (Date.now() - startedAt) / 1000, bpm });
      }
      return;
    }

    startedAtRef.current = Date.now();
    metronome.start((beat) => setActiveBeat(beat));
    setRunning(true);
  }

  function tapTempo() {
    const now = Date.now();
    const recent = [...tapTimesRef.current, now].filter((t) => now - t < 3000);
    tapTimesRef.current = recent;
    if (recent.length < 2) return;
    const intervals = recent.slice(1).map((t, i) => t - recent[i]);
    const averageMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    setBpm(Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(60000 / averageMs))));
  }

  return (
    <Card className="flex flex-col gap-4">
      <CardTitle>Metronom</CardTitle>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          aria-label="Wolniej"
          onClick={() => setBpm((b) => Math.max(MIN_BPM, b - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <span className="text-4xl font-bold tabular-nums text-foreground">{bpm}</span>
          <p className="text-xs text-foreground-muted">BPM</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Szybciej"
          onClick={() => setBpm((b) => Math.min(MAX_BPM, b + 1))}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <input
        type="range"
        min={MIN_BPM}
        max={MAX_BPM}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        className="w-full accent-primary"
        aria-label="Tempo (BPM)"
      />

      <div className="flex justify-center gap-2">
        {Array.from({ length: BEATS_PER_MEASURE }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-3 w-3 rounded-full transition-colors",
              activeBeat === i ? (i === 0 ? "bg-primary" : "bg-accent") : "bg-surface-muted"
            )}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" variant={running ? "outline" : "primary"} onClick={toggle}>
          {running ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Zatrzymaj" : "Start"}
        </Button>
        <Button variant="outline" onClick={tapTempo}>
          Tap
        </Button>
      </div>
    </Card>
  );
}
