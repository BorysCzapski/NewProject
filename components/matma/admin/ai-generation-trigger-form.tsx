"use client";

// ============================================================================
// components/matma/admin/ai-generation-trigger-form.tsx
// Trigger UI for lib/matma/generate-ai-problems.ts — generates ~20 ORIGINAL
// AI-authored problems per lekcja, chunked one lekcja per Server Action call
// (same rationale as ImportTriggerForm's per-year chunking: one call already
// makes an LLM request, looping all 44 in a single request risks a
// serverless timeout with no partial progress).
// ============================================================================
import { useRef, useState } from "react";
import { Sparkles, AlertTriangle, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { runAiProblemGeneration } from "@/lib/matma/import-actions";
import { AI_GENERATION_LEKCJE, AI_GENERATION_PROBLEMS_PER_LEKCJA } from "@/lib/matma/ai-generation-lekcje";
import type { AiGenerationSummary } from "@/lib/matma/generate-ai-problems";

export function AiGenerationTriggerForm() {
  const [force, setForce] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [summaries, setSummaries] = useState<AiGenerationSummary[]>([]);
  const stopRequested = useRef(false);

  function stop() {
    stopRequested.current = true;
  }

  async function run() {
    setSummaries([]);
    setIsRunning(true);
    stopRequested.current = false;

    for (let i = 0; i < AI_GENERATION_LEKCJE.length; i++) {
      if (stopRequested.current) break;
      setCurrentIndex(i);
      try {
        const result = await runAiProblemGeneration(i, force);
        if (result.ok) {
          setSummaries((prev) => [...prev, result.data]);
        } else {
          setSummaries((prev) => [
            ...prev,
            {
              lekcjaTitle: AI_GENERATION_LEKCJE[i].title,
              topicSlug: AI_GENERATION_LEKCJE[i].slug,
              problemsGenerated: 0,
              problemsInserted: 0,
              errors: [result.error],
            },
          ]);
        }
      } catch (err) {
        setSummaries((prev) => [
          ...prev,
          {
            lekcjaTitle: AI_GENERATION_LEKCJE[i].title,
            topicSlug: AI_GENERATION_LEKCJE[i].slug,
            problemsGenerated: 0,
            problemsInserted: 0,
            errors: [
              err instanceof Error
                ? `Błąd sieci/timeout: ${err.message}`
                : "Nieoczekiwany błąd sieci lub przekroczony czas oczekiwania.",
            ],
          },
        ]);
      }
    }

    setCurrentIndex(null);
    setIsRunning(false);
  }

  const totalGenerated = summaries.reduce((s, x) => s + x.problemsGenerated, 0);
  const totalInserted = summaries.reduce((s, x) => s + x.problemsInserted, 0);

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-3">
        <div>
          <CardTitle>Wygeneruj zadania AI</CardTitle>
          <CardDescription>
            Generuje ~{AI_GENERATION_PROBLEMS_PER_LEKCJA} oryginalnych zadań (nie kopiowanych znikąd) dla każdej z{" "}
            {AI_GENERATION_LEKCJE.length} lekcji z pełnego programu matury rozszerzonej — łącznie ok.{" "}
            {AI_GENERATION_LEKCJE.length * AI_GENERATION_PROBLEMS_PER_LEKCJA} zadań. Każda lekcja to osobne
            zapytanie do AI; całość może potrwać kilka-kilkanaście minut.
          </CardDescription>
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground-muted">
          <input
            type="checkbox"
            checked={force}
            disabled={isRunning}
            onChange={(e) => setForce(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Wymuś ponowne generowanie (nadpisuje lekcje, dla których zadania już istnieją)
        </label>
        <div className="flex gap-2">
          <Button isLoading={isRunning} onClick={run} className="self-start" disabled={isRunning}>
            <Sparkles className="h-4 w-4" /> Uruchom generowanie
          </Button>
          {isRunning && (
            <Button variant="outline" onClick={stop} className="self-start">
              <Square className="h-4 w-4" /> Zatrzymaj po bieżącej lekcji
            </Button>
          )}
        </div>
        {isRunning && currentIndex != null && (
          <p className="text-sm text-foreground-muted">
            Generowanie w toku ({currentIndex + 1}/{AI_GENERATION_LEKCJE.length}) — {AI_GENERATION_LEKCJE[currentIndex].title}…
          </p>
        )}
      </Card>

      {summaries.length > 0 && (
        <Card className="flex flex-col gap-3">
          <div>
            <CardTitle>Wynik generowania{isRunning ? " (w toku)" : ""}</CardTitle>
            <CardDescription>
              Sprawdzono {summaries.length}/{AI_GENERATION_LEKCJE.length} lekcji · {totalGenerated} zadań
              wygenerowanych przez AI · {totalInserted} zapisanych do bazy.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            {summaries.map((s, i) => (
              <div key={`${s.lekcjaTitle}-${i}`} className="rounded-(--radius-control) border border-border p-3">
                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>{s.lekcjaTitle}</span>
                  <span
                    className={cn(
                      "font-normal",
                      s.alreadyGenerated
                        ? "text-foreground-muted"
                        : s.errors.length > 0
                          ? "text-danger"
                          : "text-accent"
                    )}
                  >
                    {s.alreadyGenerated
                      ? `już w bazie (${s.problemsGenerated})`
                      : `${s.problemsInserted}/${s.problemsGenerated} zapisano`}
                  </span>
                </div>
                {s.errors.length > 0 && (
                  <ul className="mt-1.5 flex flex-col gap-1 text-xs text-foreground-muted">
                    {s.errors.map((e, j) => (
                      <li key={j} className="flex items-start gap-1">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-danger" />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
