"use client";

// ============================================================================
// components/grammar/lesson/conjugation-block.tsx
// A verb paradigm the student tests themselves against: every form starts
// hidden, tapping a cell reveals it, and one button reveals the lot.
//
// A plain `table` block would show the same data, but a conjugation table read
// passively is the classic thing a student is sure they know right up until
// the exam. Hiding the forms turns the same content into retrieval practice at
// no authoring cost. Forms listed in `highlight` are marked once revealed, so
// irregular stems stand out from the ones that follow the pattern.
// ============================================================================
import { useState } from "react";
import { Eye } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ConjugationColumn } from "@/lib/grammar/lesson-blocks";

export function ConjugationBlock({
  title,
  caption,
  persons,
  columns,
  highlight = [],
}: {
  title?: string;
  caption?: string;
  persons: string[];
  columns: ConjugationColumn[];
  highlight?: string[];
}) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const irregular = new Set(highlight);
  const total = persons.length * columns.length;
  const allRevealed = revealed.size >= total;

  function reveal(key: string) {
    setRevealed((prev) => new Set(prev).add(key));
  }

  function revealAll() {
    const every = new Set<string>();
    for (let c = 0; c < columns.length; c++) {
      for (let p = 0; p < persons.length; p++) every.add(`${c}-${p}`);
    }
    setRevealed(every);
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <CardTitle>{title ?? "Odmiana"}</CardTitle>
          <p className="mt-0.5 text-xs text-foreground-muted">
            Formy są ukryte — dotknij pola, żeby sprawdzić, czy pamiętasz.
          </p>
        </div>
        {!allRevealed && (
          <Button variant="ghost" size="sm" onClick={revealAll} className="shrink-0">
            <Eye className="h-3.5 w-3.5" />
            Pokaż wszystko
          </Button>
        )}
      </div>

      <div className="-mx-4 mt-3 overflow-x-auto px-4">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b-2 border-border px-2.5 py-2 text-left font-semibold text-foreground" />
              {columns.map((column, c) => (
                <th
                  key={c}
                  className="border-b-2 border-border px-2.5 py-2 text-left font-semibold text-foreground"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {persons.map((person, p) => (
              <tr key={p} className={cn(p % 2 === 1 && "bg-surface-muted/60")}>
                <td className="border-b border-border px-2.5 py-2 font-medium text-foreground">{person}</td>
                {columns.map((column, c) => {
                  const key = `${c}-${p}`;
                  const form = column.forms[p] ?? "";
                  const isRevealed = revealed.has(key);
                  return (
                    <td key={c} className="border-b border-border px-1 py-1">
                      <button
                        type="button"
                        onClick={() => reveal(key)}
                        disabled={isRevealed}
                        aria-label={isRevealed ? form : `Pokaż formę: ${person}, ${column.label}`}
                        className={cn(
                          "min-h-9 w-full rounded-(--radius-control) px-2 py-1.5 text-left transition-colors",
                          !isRevealed && "bg-surface-muted text-transparent active:bg-border/60",
                          isRevealed && irregular.has(form) && "font-semibold text-warning",
                          isRevealed && !irregular.has(form) && "text-foreground-muted"
                        )}
                      >
                        {isRevealed ? form : "•••••"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {caption && <p className="mt-2 text-sm text-foreground-muted">{caption}</p>}
      {highlight.length > 0 && allRevealed && (
        <p className="mt-1 text-xs text-warning">Na pomarańczowo formy nieregularne — te trzeba znać na pamięć.</p>
      )}
    </Card>
  );
}
