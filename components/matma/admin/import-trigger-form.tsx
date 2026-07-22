"use client";

// ============================================================================
// components/matma/admin/import-trigger-form.tsx
// Trigger UI for the CKE past-exam import pipeline (lib/matma/import-actions
// .ts runPastExamImport). CHUNKED PER YEAR on purpose: discovering + parsing
// + AI-structuring a single year's arkusz can already take tens of seconds
// (multiple candidate-URL probes, PDF downloads, one LLM call), and the
// server default for an unbounded range is the full 2007-today history —
// running that as ONE Server Action call is exactly what made the very
// first version of this form appear to hang forever (a single request that
// either runs for many minutes or gets killed by the platform's serverless
// function timeout, with no partial progress and — in the very first
// version — no error surfaced to the UI at all). Looping one year per
// request instead keeps each individual call short, shows results
// streaming in as they complete, and lets one bad/slow year fail without
// taking the rest of the range down with it.
// ============================================================================
import { useRef, useState } from "react";
import { Download, AlertTriangle, Square } from "lucide-react";
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

const CURRENT_YEAR = new Date().getFullYear();

export function ImportTriggerForm() {
  const [yearFrom, setYearFrom] = useState(String(CURRENT_YEAR));
  const [yearTo, setYearTo] = useState(String(CURRENT_YEAR));
  const [force, setForce] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<ArkuszImportSummary[]>([]);
  const stopRequested = useRef(false);

  function stop() {
    stopRequested.current = true;
  }

  async function run() {
    const from = Number(yearFrom);
    const to = Number(yearTo);
    if (!Number.isInteger(from) || !Number.isInteger(to)) {
      setError("Rok początkowy i końcowy muszą być liczbami całkowitymi.");
      return;
    }
    if (from > to) {
      setError("Rok początkowy nie może być późniejszy niż rok końcowy.");
      return;
    }
    if (to - from > 30) {
      setError("Zakres maksymalnie 30 lat na raz — zaimportuj resztę w kolejnym uruchomieniu.");
      return;
    }

    setError(null);
    setSummaries([]);
    setIsRunning(true);
    stopRequested.current = false;

    // Sequential ON PURPOSE, one year per Server Action call — see file
    // header comment. Each call is independently try/caught so a single
    // year timing out or erroring doesn't abort the rest of the range.
    for (let year = from; year <= to; year++) {
      if (stopRequested.current) break;
      setCurrentYear(year);
      try {
        const result = await runPastExamImport(year, year, force);
        if (result.ok) {
          setSummaries((prev) => [...prev, ...result.data]);
        } else {
          setSummaries((prev) => [
            ...prev,
            { year, session: "-", formula: "-", problemsFound: 0, problemsInserted: 0, errors: [result.error] },
          ]);
        }
      } catch (err) {
        // A real network/timeout failure (not an ActionResult error) —
        // surface it as a per-year row instead of silently hanging/dying.
        setSummaries((prev) => [
          ...prev,
          {
            year,
            session: "-",
            formula: "-",
            problemsFound: 0,
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

    setCurrentYear(null);
    setIsRunning(false);
  }

  const totalFound = summaries.reduce((s, x) => s + x.problemsFound, 0);
  const totalInserted = summaries.reduce((s, x) => s + x.problemsInserted, 0);

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-3">
        <div>
          <CardTitle>Uruchom import</CardTitle>
          <CardDescription>
            Przeszukuje archiwum CKE (arkusze maturalne, matematyka rozszerzona) rok po roku i importuje znalezione
            zadania. Każdy rok to osobne zapytanie — wyniki pojawiają się na bieżąco. Jeden rok to zwykle kilkanaście
            do kilkudziesięciu sekund; szerszy zakres proporcjonalnie dłużej.
          </CardDescription>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="year-from">Rok od</Label>
            <Input
              id="year-from"
              type="number"
              value={yearFrom}
              disabled={isRunning}
              onChange={(e) => setYearFrom(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="year-to">Rok do</Label>
            <Input
              id="year-to"
              type="number"
              value={yearTo}
              disabled={isRunning}
              onChange={(e) => setYearTo(e.target.value)}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground-muted">
          <input
            type="checkbox"
            checked={force}
            disabled={isRunning}
            onChange={(e) => setForce(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Wymuś ponowny import (nadpisuje już zaimportowane lata — użyj, żeby naprawić lata zaimportowane niepełne
          przed poprawką)
        </label>
        <div className="flex gap-2">
          <Button isLoading={isRunning} onClick={run} className="self-start" disabled={isRunning}>
            <Download className="h-4 w-4" /> Uruchom import
          </Button>
          {isRunning && (
            <Button variant="outline" onClick={stop} className="self-start">
              <Square className="h-4 w-4" /> Zatrzymaj po bieżącym roku
            </Button>
          )}
        </div>
        {isRunning && (
          <p className="text-sm text-foreground-muted">
            Import w toku — sprawdzam rok {currentYear}…
          </p>
        )}
        {error && (
          <p className="flex items-center gap-1.5 text-sm text-danger">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          </p>
        )}
      </Card>

      {summaries.length > 0 && (
        <Card className="flex flex-col gap-3">
          <div>
            <CardTitle>Wynik importu{isRunning ? " (w toku)" : ""}</CardTitle>
            <CardDescription>
              Sprawdzono {summaries.length} {summaries.length === 1 ? "rok/arkusz" : "lata/arkusze"} · {totalFound}{" "}
              zadań rozpoznanych przez AI · {totalInserted} zapisanych do bazy.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            {summaries.map((s, i) => (
              <div key={`${s.year}-${s.session}-${s.formula}-${i}`} className="rounded-(--radius-control) border border-border p-3">
                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>
                    {s.year} · {s.session} · {FORMULA_LABELS[s.formula] ?? s.formula}
                  </span>
                  <span
                    className={cn(
                      "font-normal",
                      s.alreadyImported ? "text-foreground-muted" : s.errors.length > 0 ? "text-danger" : "text-accent"
                    )}
                  >
                    {s.alreadyImported ? `już w bazie (${s.problemsFound})` : `${s.problemsInserted}/${s.problemsFound} zapisano`}
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
