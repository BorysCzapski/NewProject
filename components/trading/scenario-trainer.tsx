"use client";

// ============================================================================
// components/trading/scenario-trainer.tsx
// Trener decyzji: opis sytuacji na wykresie, trzy opcje i wyjaśnienie każdej
// z nich. Wyniki (poprawnie/błędnie za pierwszym razem) zapisują się lokalnie.
// ============================================================================
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { lessonBySlug, type Scenario } from "@/lib/trading/content";
import { useLocalState } from "@/lib/trading/use-local-state";

type Results = Record<string, boolean>;
const EMPTY: Results = {};

export function ScenarioTrainer({ scenarios }: { scenarios: Scenario[] }) {
  const [results, setResults] = useLocalState<Results>("trading:scenarios", EMPTY);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const s = scenarios[index];
  const answeredCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter(Boolean).length;

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    // Zapisujemy tylko pierwszą próbę danego scenariusza.
    if (results[s.id] === undefined) {
      setResults({ ...results, [s.id]: s.options[i].correct });
    }
  }

  function go(to: number) {
    setIndex((to + scenarios.length) % scenarios.length);
    setPicked(null);
  }

  const lesson = lessonBySlug(s.lesson);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-foreground-muted">
        <span>
          Scenariusz {index + 1} z {scenarios.length}
        </span>
        <span>
          Za 1. razem poprawnie: {correctCount}/{answeredCount || 0}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {scenarios.map((sc, i) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Scenariusz ${i + 1}`}
            className={cn(
              "h-8 w-8 rounded-full text-xs font-medium transition-colors",
              i === index ? "bg-primary text-primary-foreground" : "bg-surface-muted text-foreground-muted",
              results[sc.id] === true && i !== index && "bg-primary-soft text-primary",
              results[sc.id] === false && i !== index && "bg-danger-soft text-danger"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Card className="flex flex-col gap-3">
        <CardTitle className="text-lg">{s.title}</CardTitle>
        <p className="text-sm leading-relaxed text-foreground">{s.setup}</p>
        <p className="text-sm font-semibold text-foreground">{s.question}</p>
        <div className="flex flex-col gap-2">
          {s.options.map((opt, i) => {
            const revealed = picked !== null;
            const isPicked = picked === i;
            return (
              <div key={i} className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => pick(i)}
                  disabled={revealed}
                  className={cn(
                    "flex min-h-12 items-center gap-2 rounded-(--radius-control) border px-4 py-3 text-left text-base transition-colors",
                    !revealed && "border-border bg-surface hover:border-primary/40 hover:bg-surface-muted",
                    revealed && opt.correct && "border-primary bg-primary-soft",
                    revealed && isPicked && !opt.correct && "border-danger bg-danger-soft",
                    revealed && !opt.correct && !isPicked && "border-border bg-surface opacity-70"
                  )}
                >
                  {revealed && opt.correct && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />}
                  {revealed && isPicked && !opt.correct && <XCircle className="h-5 w-5 shrink-0 text-danger" />}
                  <span>{opt.text}</span>
                </button>
                {revealed && (isPicked || opt.correct) && (
                  <p className="px-1 text-sm text-foreground-muted">{opt.why}</p>
                )}
              </div>
            );
          })}
        </div>
        {picked !== null && lesson && (
          <Link href={`/trading/lekcje/${lesson.slug}`} className="text-sm font-medium text-primary underline">
            Powtórz: {lesson.title}
          </Link>
        )}
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => go(index - 1)}>
          Poprzedni
        </Button>
        <Button className="flex-1" onClick={() => go(index + 1)}>
          Następny
        </Button>
      </div>
    </div>
  );
}
