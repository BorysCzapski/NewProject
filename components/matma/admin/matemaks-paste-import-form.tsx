"use client";

// ============================================================================
// components/matma/admin/matemaks-paste-import-form.tsx
// The SUPPORTED matemaks.pl import flow: matemaks.pl blocks automated
// server-side requests outright (403 on every attempt, confirmed in
// production — see lib/matma/import-curated-matemaks.ts's header comment),
// so this form instead takes JSON the admin extracts THEMSELVES by running
// lib/matma/matemaks-console-script.ts in their own browser DevTools
// console while normally viewing a matemaks.pl page. That never touches
// matemaks.pl outside the admin's own regular page views — no server-side
// request from this app to matemaks.pl is involved at all.
// ============================================================================
import { useState } from "react";
import { Check, ClipboardCopy, Upload, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { runMatemaksPastedImport } from "@/lib/matma/import-actions";
import { MATEMAKS_CONSOLE_SCRIPT } from "@/lib/matma/matemaks-console-script";
import type { MatemaksImportSummary } from "@/lib/matma/import-curated-matemaks";

export function MatemaksPasteImportForm() {
  const [copied, setCopied] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<MatemaksImportSummary | null>(null);

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(MATEMAKS_CONSOLE_SCRIPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Nie udało się skopiować do schowka — zaznacz i skopiuj skrypt ręcznie.");
    }
  }

  async function submit() {
    if (!jsonInput.trim()) {
      setError("Wklej najpierw JSON wyeksportowany ze skryptu konsoli.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await runMatemaksPastedImport(jsonInput);
      if (result.ok) {
        setSummary(result.data);
        setJsonInput("");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieoczekiwany błąd.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-3">
        <div>
          <CardTitle>Krok 1: wyodrębnij zadania w przeglądarce</CardTitle>
          <CardDescription>
            Otwórz stronę tematu na matemaks.pl (np. matemaks.pl/zadania-optymalizacyjne), otwórz konsolę
            deweloperską (F12 → Konsola), wklej poniższy skrypt i naciśnij Enter. Skrypt czyta wyłącznie stronę, którą
            już masz otwartą — nic nie łączy się z matemaks.pl automatycznie. Wynik (JSON) zostanie skopiowany do
            schowka.
          </CardDescription>
        </div>
        <pre className="max-h-40 overflow-auto rounded-(--radius-control) bg-surface-muted p-3 text-xs text-foreground-muted">
          {MATEMAKS_CONSOLE_SCRIPT}
        </pre>
        <Button variant="outline" size="sm" onClick={copyScript} className="self-start">
          {copied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
          {copied ? "Skopiowano" : "Kopiuj skrypt"}
        </Button>
      </Card>

      <Card className="flex flex-col gap-3">
        <div>
          <CardTitle>Krok 2: wklej wynik tutaj</CardTitle>
          <CardDescription>JSON skopiowany przez skrypt konsoli (Ctrl+V poniżej).</CardDescription>
        </div>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"title": "...", "url": "...", "problems": [...]}'
          rows={6}
          className={cn(
            "w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-sm text-foreground",
            "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
          )}
        />
        <Button isLoading={isSubmitting} onClick={submit} disabled={isSubmitting} className="self-start">
          <Upload className="h-4 w-4" /> Importuj wklejone zadania
        </Button>
        {error && (
          <p className="flex items-center gap-1.5 text-sm text-danger">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          </p>
        )}
      </Card>

      {summary && (
        <Card className="flex flex-col gap-2">
          <CardTitle>{summary.dzialSlug}</CardTitle>
          <p className={cn("text-sm font-medium", summary.errors.length > 0 ? "text-danger" : "text-accent")}>
            {summary.problemsInserted}/{summary.problemsFound} zadań zapisano do bazy.
          </p>
          {summary.errors.length > 0 && (
            <ul className="flex flex-col gap-1 text-xs text-foreground-muted">
              {summary.errors.map((e, i) => (
                <li key={i} className="flex items-start gap-1">
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-danger" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
