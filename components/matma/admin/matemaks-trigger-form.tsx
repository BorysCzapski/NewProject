"use client";

// ============================================================================
// components/matma/admin/matemaks-trigger-form.tsx
// Trigger UI for the curated-content import from matemaks.pl (see
// lib/matma/import-curated-matemaks.ts). Same "one request per unit of
// work" shape as import-trigger-form.tsx (there: one year; here: one
// dział), for the same reason — keep each Server Action call short and
// show live progress instead of one long opaque request.
// ============================================================================
import { useRef, useState } from "react";
import { Download, AlertTriangle, Square, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { runMatemaksDzialImport } from "@/lib/matma/import-actions";
import { MATEMAKS_DZIAL_SEEDS } from "@/lib/matma/matemaks-seeds";
import type { MatemaksImportSummary } from "@/lib/matma/import-curated-matemaks";

export function MatemaksTriggerForm() {
  const [seeds, setSeeds] = useState(MATEMAKS_DZIAL_SEEDS);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentDzial, setCurrentDzial] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<MatemaksImportSummary[]>([]);
  const stopRequested = useRef(false);

  function stop() {
    stopRequested.current = true;
  }

  function startEdit(index: number) {
    setEditingIndex(index);
    setEditValue(seeds[index].startSlug);
  }

  function saveEdit(index: number) {
    setSeeds((prev) => prev.map((s, i) => (i === index ? { ...s, startSlug: editValue.trim() || s.startSlug } : s)));
    setEditingIndex(null);
  }

  async function run() {
    setSummaries([]);
    setIsRunning(true);
    stopRequested.current = false;

    // Sequential ON PURPOSE, one dział per Server Action call.
    for (const { dzialSlug, startSlug } of seeds) {
      if (stopRequested.current) break;
      setCurrentDzial(dzialSlug);
      try {
        const result = await runMatemaksDzialImport(dzialSlug, startSlug);
        if (result.ok) {
          setSummaries((prev) => [...prev, result.data]);
        } else {
          setSummaries((prev) => [
            ...prev,
            { dzialSlug, tematyVisited: 0, problemsFound: 0, problemsInserted: 0, errors: [result.error] },
          ]);
        }
      } catch (err) {
        setSummaries((prev) => [
          ...prev,
          {
            dzialSlug,
            tematyVisited: 0,
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

    setCurrentDzial(null);
    setIsRunning(false);
  }

  const totalFound = summaries.reduce((s, x) => s + x.problemsFound, 0);
  const totalInserted = summaries.reduce((s, x) => s + x.problemsInserted, 0);

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-3">
        <div>
          <CardTitle>Import zadań z Matemaks.pl</CardTitle>
          <CardDescription>
            Przechodzi po działach matury rozszerzonej, śledząc linki „następny temat” na stronie, i importuje
            zadania oznaczone jako poziom rozszerzony (źródło: curated). Tylko pierwszy dział (Elementy analizy
            matematycznej) ma potwierdzony realny adres startowy — pozostałe to najlepsze przybliżenia; jeśli któryś
            zwróci 0 tematów, popraw jego adres startowy poniżej (ikona ołówka) i uruchom ponownie.
          </CardDescription>
        </div>
        <div className="flex flex-col gap-1.5">
          {seeds.map((s, i) => (
            <div key={s.dzialSlug} className="flex items-center gap-2 text-sm">
              <span className="w-56 shrink-0 truncate text-foreground-muted">{s.dzialSlug}</span>
              {editingIndex === i ? (
                <>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 flex-1 text-sm"
                    placeholder="adres-startowy-slug"
                  />
                  <Button size="sm" variant="outline" onClick={() => saveEdit(i)}>
                    Zapisz
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 truncate font-mono text-xs text-foreground">{s.startSlug}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={isRunning}
                    onClick={() => startEdit(i)}
                    aria-label={`Popraw adres startowy dla ${s.dzialSlug}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button isLoading={isRunning} onClick={run} className="self-start" disabled={isRunning}>
            <Download className="h-4 w-4" /> Uruchom import
          </Button>
          {isRunning && (
            <Button variant="outline" onClick={stop} className="self-start">
              <Square className="h-4 w-4" /> Zatrzymaj po bieżącym dziale
            </Button>
          )}
        </div>
        {isRunning && (
          <p className="text-sm text-foreground-muted">Import w toku — dział: {currentDzial}…</p>
        )}
      </Card>

      {summaries.length > 0 && (
        <Card className="flex flex-col gap-3">
          <div>
            <CardTitle>Wynik importu{isRunning ? " (w toku)" : ""}</CardTitle>
            <CardDescription>
              Sprawdzono {summaries.length} {summaries.length === 1 ? "dział" : "działów"} · {totalFound} zadań
              rozpoznanych przez AI · {totalInserted} zapisanych do bazy.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            {summaries.map((s, i) => (
              <div key={`${s.dzialSlug}-${i}`} className="rounded-(--radius-control) border border-border p-3">
                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>{s.dzialSlug}</span>
                  <span className={cn("font-normal", s.errors.length > 0 ? "text-danger" : "text-accent")}>
                    {s.problemsInserted}/{s.problemsFound} zapisano · {s.tematyVisited} tematów
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
