"use client";

// ============================================================================
// components/matma/admin/pdf-import-form.tsx
// Upload-a-PDF import flow (see lib/matma/import-pdf.ts) — for problem sets
// the admin has as a PDF that isn't a CKE arkusz or a matemaks.pl page:
// worksheets, textbook scans, problem sets from other sites saved as PDF.
// ============================================================================
import { useRef, useState } from "react";
import { AlertTriangle, FileUp, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { runPdfImport } from "@/lib/matma/import-actions";
import type { PdfImportSummary } from "@/lib/matma/import-pdf";

export function PdfImportForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<PdfImportSummary | null>(null);

  async function submit() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Wybierz najpierw plik PDF.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await runPdfImport(formData);
      if (result.ok) {
        setSummary(result.data);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setFileName(null);
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
          <CardTitle>Wgraj PDF z zadaniami</CardTitle>
          <CardDescription>
            Arkusz, rozdział podręcznika albo zbiór zadań zapisany jako PDF — AI wyodrębni z niego poszczególne
            zadania i doda je do bazy (dział „kuratorowane”). Ułamki zapisane w PDF-ie graficznie (bez znaku „/”) AI
            stara się rozpoznać z kontekstu i zapisać poprawnie jako $\frac{"{a}"}{"{b}"}$ — mimo to warto sprawdzić
            wynik, zwłaszcza dla zadań ze skomplikowanymi wzorami.
          </CardDescription>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          className="hidden"
          id="matma-pdf-upload-input"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="self-start">
            <FileUp className="h-4 w-4" /> Wybierz plik PDF
          </Button>
          {fileName && <span className="text-sm text-foreground-muted">{fileName}</span>}
        </div>
        <Button isLoading={isSubmitting} onClick={submit} disabled={isSubmitting} className="self-start">
          <Upload className="h-4 w-4" /> Importuj z PDF
        </Button>
        {error && (
          <p className="flex items-center gap-1.5 text-sm text-danger">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          </p>
        )}
      </Card>

      {summary && (
        <Card className={cn("flex flex-col gap-2", isSubmitting && "opacity-60")}>
          <CardTitle>{summary.filename}</CardTitle>
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
