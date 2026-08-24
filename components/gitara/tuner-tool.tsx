"use client";

// ============================================================================
// components/gitara/tuner-tool.tsx
// The tuner half of /gitara/cwicz: chromatic pitch detection from the mic
// (lib/gitara/audio-engine.ts's Tuner) with a cents needle, and the spec's
// "no mic access" edge case handled explicitly — denial degrades to a
// message pointing back at the chord library and metronome instead of a
// broken screen.
// ============================================================================
import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tuner, type TunerReading } from "@/lib/gitara/audio-engine";
import { OPEN_STRING_LABELS } from "@/lib/gitara/theory";
import { logPracticeSession } from "@/lib/gitara/actions";
import { cn } from "@/lib/utils";

export function TunerTool() {
  const [listening, setListening] = useState(false);
  const [reading, setReading] = useState<TunerReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tunerRef = useRef<Tuner | null>(null);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    tunerRef.current = new Tuner();
    return () => tunerRef.current?.stop();
  }, []);

  async function start() {
    setError(null);
    startedAtRef.current = Date.now();
    try {
      await tunerRef.current!.start((next) => setReading(next));
      setListening(true);
    } catch {
      startedAtRef.current = null;
      setError(
        "Brak dostępu do mikrofonu — strojenie dźwiękowe jest niedostępne. Możesz nadal korzystać z " +
          "diagramów akordów, metronomu i biblioteki piosenek."
      );
    }
  }

  function stop() {
    tunerRef.current?.stop();
    setListening(false);
    setReading(null);
    const startedAt = startedAtRef.current;
    startedAtRef.current = null;
    if (startedAt) {
      void logPracticeSession({ kind: "strojenie", durationSeconds: (Date.now() - startedAt) / 1000 });
    }
  }

  const cents = reading?.cents ?? 0;
  const inTune = reading !== null && Math.abs(cents) <= 5;

  return (
    <Card className="flex flex-col gap-4">
      <CardTitle>Stroik</CardTitle>
      <p className="text-xs text-foreground-muted">
        Strojenie standardowe: {OPEN_STRING_LABELS.join(" · ")}
      </p>

      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : (
        <>
          <div className="flex flex-col items-center gap-1 py-2">
            <span className="flex items-baseline gap-1 text-5xl font-bold tabular-nums text-foreground">
              {reading ? reading.note : "—"}
              {reading && <span className="text-xl text-foreground-muted">{reading.octave}</span>}
            </span>
            <span className="text-xs text-foreground-muted">
              {reading
                ? `${reading.frequency.toFixed(1)} Hz`
                : listening
                  ? "Zagraj dźwięk…"
                  : "Uruchom, żeby zacząć"}
            </span>
          </div>

          <div className="relative h-2 overflow-hidden rounded-full bg-surface-muted">
            <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
            {reading && (
              <div
                className={cn(
                  "absolute top-0 h-full w-2 -translate-x-1/2 rounded-full transition-[left]",
                  inTune ? "bg-accent" : "bg-warning"
                )}
                style={{ left: `${50 + Math.max(-50, Math.min(50, cents))}%` }}
              />
            )}
          </div>

          <Button variant={listening ? "outline" : "primary"} onClick={listening ? stop : start}>
            {listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {listening ? "Zatrzymaj" : "Uruchom mikrofon"}
          </Button>
        </>
      )}
    </Card>
  );
}
