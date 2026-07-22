"use client";

// ============================================================================
// components/matma/admin/import-trigger-form.tsx
// Trigger UI for the CKE past-exam import pipeline (lib/matma/import-actions
// .ts runPastExamImport). This can be SLOW — many PDFs downloaded, parsed,
// and sent to the AI one arkusz at a time — so it shows an explicit loading
// state and never assumes a fast response, then renders the per-arkusz
// summary list (found/inserted counts + errors) once it resolves.
// ============================================================================
import { useState, useTransition } from "react";
import { Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { runPastExamImport } from "@/lib/matma/import-actions";
import type { ArkuszImportSummary } from "@/lib/matma/import-past-exams";

const FORMULA_LABELS: Record<string, string> = {
  "2023": "formuła 2023",
  "2015": "formuła 2015",
  stara: "stara formuła",
};

export function ImportTriggerForm() {
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<ArkuszImportSummary[] | null>(null);

  function run() {
    setError(null);
    setSummaries(null);
    const from = yearFrom.trim() ? Number(yearFrom) : undefined;
    const to = yearTo.trim() ? Number(yearTo) : undefined;
    if (from !== undefined && !Number.isInteger(from)) {
      setError("Rok początkowy musi być liczbą całkowitą.");
      return;
    }
    if (to !== undefined && !Number.isInteger(to)) {
      setError("Rok końcowy musi być liczbą całkowitą.");
      return;
    }
    startTransition(async () => {
      const result = await runPastExamImport(from, to);
      if (result.ok) {
        setSummaries(result.data);
      } else {
        setError(result.error);
      }
    });
  }

  const totalFound = summaries?.reduce((s, x) => s + x.problemsFound, 0) ?? 0;
  const totalInserted = summaries?.reduce((s, x) => s + x.problemsInserted, 0) ?? 0;

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-3">
        <div>
          <CardTitle>Uruchom import</CardTitle>
          <CardDescription>
            Przeszukuje archiwum CKE (arkusze maturalne, matematyka rozszerzona) i importuje znalezione zadania.
            Może to potrwać kilka minut — pobiera i analizuje wiele plików PDF.
          </CardDescription>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="year-from">Rok od (opcjonalnie)</Label>
            <Input
              id="year-from"
              type="number"
              placeholder="np. 2023"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="year-to">Rok do (opcjonalnie)</Label>
            <Input
              id="year-to"
              type="number"
              placeholder="np. 2026"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
            />
          </div>
        </div>
        <Button isLoading={isPending} onClick={run} className="self-start">
          <Download className="h-4 w-4" /> Uruchom import
        </Button>
        {isPending && (
          <p className="text-sm text-foreground-muted">
            Import w toku — pobieranie i analiza arkuszy CKE, to może chwilę potrwać…
          </p>
        )}
        {error && (
          <p className="flex items-center gap-1.5 text-sm text-danger">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          </p>
        )}
      </Card>

      {summaries && (
        <Card className="flex flex-col gap-3">
          <div>
            <CardTitle>Wynik importu</CardTitle>
            <CardDescription>
              Znaleziono {summaries.length} {summaries.length === 1 ? "arkusz" : "arkuszy"} · {totalFound} zadań
              rozpoznanych przez AI · {totalInserted} zapisanych do bazy.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            {summaries.map((s, i) => (
              <div key={`${s.year}-${s.session}-${s.formula}-${i}`} className="rounded-(--radius-control) border border-border p-3">
                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>
                    {s.year} · {s.session} · {FORMULA_LABELS[s.formula] ?? s.formula}
                  </span>
                  <span className={cn("font-normal", s.errors.length > 0 ? "text-danger" : "text-accent")}>
                    {s.problemsInserted}/{s.problemsFound} zapisano
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
