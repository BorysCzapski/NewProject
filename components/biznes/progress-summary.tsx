"use client";

// ============================================================================
// components/biznes/progress-summary.tsx
// Home-screen stats built from localStorage: questions answered and accuracy,
// flashcards mastered, crosswords solved, best recent test.
// ============================================================================
import { Card } from "@/components/ui/card";
import { CROSSWORDS } from "@/lib/biznes/crosswords";
import { FLASHCARDS } from "@/lib/biznes/flashcards";
import { QUESTIONS } from "@/lib/biznes/questions";
import {
  CARDS_KEY,
  CROSSWORDS_KEY,
  STATS_KEY,
  TESTS_KEY,
  useLocalState,
  type CardLevels,
  type QuestionStats,
  type SolvedCrosswords,
  type TestResult,
} from "@/lib/biznes/use-local-state";

export function ProgressSummary() {
  const [stats] = useLocalState<QuestionStats>(STATS_KEY, {});
  const [cards] = useLocalState<CardLevels>(CARDS_KEY, {});
  const [solved] = useLocalState<SolvedCrosswords>(CROSSWORDS_KEY, {});
  const [tests] = useLocalState<TestResult[]>(TESTS_KEY, []);

  const seen = Object.keys(stats).length;
  const ok = Object.values(stats).reduce((n, s) => n + s.ok, 0);
  const wrong = Object.values(stats).reduce((n, s) => n + s.wrong, 0);
  const accuracy = ok + wrong ? Math.round((ok / (ok + wrong)) * 100) : null;
  const mastered = FLASHCARDS.filter((f) => (cards[f.id] ?? 0) >= 3).length;
  const solvedCount = CROSSWORDS.filter((c) => solved[c.id]).length;
  const best = tests.reduce((m, t) => (t.total ? Math.max(m, Math.round((t.correct / t.total) * 100)) : m), 0);

  const items = [
    { label: "Zadania", value: `${seen}/${QUESTIONS.length}`, hint: accuracy === null ? "zacznij trening" : `${accuracy}% poprawnych` },
    { label: "Fiszki", value: `${mastered}/${FLASHCARDS.length}`, hint: "opanowane" },
    { label: "Krzyżówki", value: `${solvedCount}/${CROSSWORDS.length}`, hint: "rozwiązane" },
    { label: "Najlepszy test", value: tests.length ? `${best}%` : "–", hint: tests.length ? `${tests.length} podejść` : "brak podejść" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((it) => (
        <Card key={it.label} className="p-3.5">
          <p className="text-xs text-foreground-muted">{it.label}</p>
          <p className="mt-0.5 text-xl font-bold text-foreground">{it.value}</p>
          <p className="text-xs text-foreground-muted">{it.hint}</p>
        </Card>
      ))}
    </div>
  );
}
