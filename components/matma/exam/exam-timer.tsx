"use client";

// ============================================================================
// components/matma/exam/exam-timer.tsx
// Countdown for the 180-minute mock exam. Remaining time is recomputed from
// wall-clock `startedAt` on every tick (never a locally decrementing
// counter), so it stays correct across tab backgrounding/throttled timers
// and even if the component mounts after time already ran out. Turns danger
// red (with a pulse) under 5 minutes remaining, and fires onExpire exactly
// once, guarded by a ref.
// ============================================================================
import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const WARNING_THRESHOLD_SECONDS = 5 * 60;

function computeRemainingSeconds(startedAt: string, timeLimitSeconds: number): number {
  const elapsedMs = Date.now() - new Date(startedAt).getTime();
  return timeLimitSeconds - Math.floor(elapsedMs / 1000);
}

function formatHms(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}

export function ExamTimer({
  startedAt,
  timeLimitSeconds,
  onExpire,
}: {
  startedAt: string;
  timeLimitSeconds: number;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(() => computeRemainingSeconds(startedAt, timeLimitSeconds));
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    function tick() {
      const next = computeRemainingSeconds(startedAt, timeLimitSeconds);
      setRemaining(next);
      if (next <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpire();
      }
    }
    tick(); // check immediately in case the deadline already passed before mount
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt, timeLimitSeconds, onExpire]);

  const isLow = remaining <= WARNING_THRESHOLD_SECONDS;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 font-mono text-sm font-semibold tabular-nums text-foreground",
        isLow && "animate-pulse bg-danger-soft text-danger"
      )}
    >
      <Clock className="h-4 w-4" />
      {formatHms(remaining)}
    </div>
  );
}
