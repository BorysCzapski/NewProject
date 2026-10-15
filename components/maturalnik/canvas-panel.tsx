"use client";

// ============================================================================
// components/maturalnik/canvas-panel.tsx
// Wires InkCanvas's onAutosave callback to the autosaveCanvas Server Action.
// Fire-and-forget by design (the canvas itself is the source of truth for
// what the student sees — a dropped autosave just means it tries again on
// the next stroke) with a tiny status label so a persistent failure is still
// visible rather than silently swallowed forever.
// ============================================================================
import { useCallback, useRef, useState } from "react";
import { InkCanvas } from "@/components/maturalnik/ink-canvas";
import { autosaveCanvas } from "@/lib/maturalnik/actions";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function CanvasPanel({ problemId, initialImageUrl }: { problemId: string; initialImageUrl: string | null }) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const savingCountRef = useRef(0);

  const handleAutosave = useCallback(
    (dataUrl: string) => {
      savingCountRef.current += 1;
      setStatus("saving");
      autosaveCanvas(problemId, dataUrl)
        .then((result) => {
          savingCountRef.current -= 1;
          if (savingCountRef.current > 0) return; // a newer save is still in flight
          setStatus(result.ok ? "saved" : "error");
        })
        .catch(() => {
          savingCountRef.current -= 1;
          if (savingCountRef.current <= 0) setStatus("error");
        });
    },
    [problemId]
  );

  return (
    <div className="flex flex-col gap-1.5">
      <InkCanvas initialImageUrl={initialImageUrl} onAutosave={handleAutosave} />
      <p className="text-right text-xs text-foreground-muted">
        {status === "saving" && "Zapisuję…"}
        {status === "saved" && "Zapisano"}
        {status === "error" && <span className="text-danger">Nie udało się zapisać — spróbuj ponownie</span>}
      </p>
    </div>
  );
}
