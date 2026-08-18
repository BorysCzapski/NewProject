"use client";

// ============================================================================
// components/geografia/exercise/hint-list.tsx
// Progressive hint reveal: static hints authored on the exercise itself
// (geo_exercises.hints), one button click per hint — cheaper and instant
// compared to an AI call, and hints are meant to be reusable/consistent.
// ============================================================================
import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HintList({ hints }: { hints: string[] }) {
  const [revealed, setRevealed] = useState(0);
  if (hints.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {hints.slice(0, revealed).map((hint, i) => (
        <p key={i} className="rounded-(--radius-control) bg-surface-muted px-3 py-2 text-sm text-foreground">
          <span className="font-medium text-foreground-muted">Wskazówka {i + 1}: </span>
          {hint}
        </p>
      ))}
      {revealed < hints.length && (
        <Button variant="outline" size="sm" className="self-start" onClick={() => setRevealed((n) => n + 1)}>
          <Lightbulb className="h-4 w-4" />
          {revealed === 0 ? "Pokaż wskazówkę" : "Pokaż kolejną wskazówkę"}
        </Button>
      )}
    </div>
  );
}
