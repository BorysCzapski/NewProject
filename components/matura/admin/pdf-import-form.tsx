"use client";

// ============================================================================
// components/matura/admin/pdf-import-form.tsx
// Upload-an-arkusz-PDF import flow (see lib/matura/import-pdf.ts) — extracts
// środki-językowe/czytanie/pisanie tasks automatically. An optional second
// file (klucz odpowiedzi / answer key) improves correctAnswers accuracy for
// closed tasks; without it the AI infers answers itself.
// ============================================================================
import { useRef, useState } from "react";
import { AlertTriangle, FileUp, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { runMaturaPdfImport } from "@/lib/matura/import-actions";
import type { MaturaLevel } from "@/lib/types/database";
import type { MaturaPdfImportSummary } from "@/lib/matura/import-pdf";

export function MaturaPdfImportForm() {
  const arkuszInputRef = useRef<HTMLInputElement>(null);
  const kluczInputRef = useRef<HTMLInputElement>(null);
  const [level, setLevel] = useState<MaturaLevel>("podstawowa");
  const [arkuszName, setArkuszName] = useState<string | null>(null);
  const [kluczName, setKluczName] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<MaturaPdfImportSummary | null>(null);

  async function submit() {
    const arkusz = arkuszInputRef.current?.files?.[0];
    if (!arkusz) {
      setError("Wybierz najpierw plik PDF z arkuszem.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("level", level);
      formData.set("arkusz", arkusz);
      const klucz = kluczInputRef.current?.files?.[0];
      if (klucz) formData.set("klucz", klucz);
      if (note.trim()) formData.set("note", note.trim());

      const result = await runMaturaPdfImport(formData);
      if (result.ok) {
        setSummary(result.data);
        if (arkuszInputRef.current) arkuszInputRef.current.value = "";
        if (kluczInputRef.current) kluczInputRef.current.value = "";
        setArkuszName(null);
        setKluczName(null);
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
      <Card className="flex flex-col gap-4">
        <div>
          <CardTitle>Import z arkusza PDF</CardTitle>
          <CardDescription>
            Wgraj arkusz maturalny (dowolny rok) jako PDF — AI wyodrębni z niego zadania „Znajomość środków
            językowych”, „Rozumienie tekstów pisanych” i „Wypowiedź pisemna” (dział „kuratorowane”, zawsze wymaga
            przeglądu). „Rozumienie ze słuchu” NIE jest obsługiwane — arkusz nie zawiera nagrania ani transkrypcji.
          </CardDescription>
        </div>

        <div>
          <Label>Poziom</Label>
          <div className="flex gap-2">
            {(["podstawowa", "rozszerzona"] as MaturaLevel[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={cn(
                  "flex-1 rounded-(--radius-control) border px-3 py-2 text-sm font-medium",
                  level === l ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-foreground-muted"
                )}
              >
                {l === "podstawowa" ? "Podstawowa" : "Rozszerzona"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Arkusz (PDF, wymagany)</Label>
          <input
            ref={arkuszInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => setArkuszName(e.target.files?.[0]?.name ?? null)}
            className="hidden"
            id="matura-arkusz-upload-input"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => arkuszInputRef.current?.click()} className="self-start">
              <FileUp className="h-4 w-4" /> Wybierz arkusz
            </Button>
            {arkuszName && <span className="text-sm text-foreground-muted">{arkuszName}</span>}
          </div>
        </div>

        <div>
          <Label>Klucz odpowiedzi (PDF, opcjonalny — poprawia trafność odpowiedzi)</Label>
          <input
            ref={kluczInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => setKluczName(e.target.files?.[0]?.name ?? null)}
            className="hidden"
            id="matura-klucz-upload-input"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => kluczInputRef.current?.click()} className="self-start">
              <FileUp className="h-4 w-4" /> Wybierz klucz
            </Button>
            {kluczName && <span className="text-sm text-foreground-muted">{kluczName}</span>}
          </div>
        </div>

        <div>
          <Label htmlFor="matura-import-note">Notatka źródła (opcjonalna)</Label>
          <Input
            id="matura-import-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="np. matura 2024, sesja majowa"
          />
        </div>

        <Button isLoading={isSubmitting} onClick={submit} disabled={isSubmitting} className="self-start">
          <Upload className="h-4 w-4" /> Importuj z arkusza
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
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              Środki językowe: <span className="font-semibold text-foreground">{summary.srodkiJezykoweInserted}</span>/
              {summary.srodkiJezykoweFound}
            </li>
            <li>
              Czytanie: <span className="font-semibold text-foreground">{summary.czytanieInserted}</span>/
              {summary.czytanieFound}
            </li>
            <li>
              Pisanie: <span className="font-semibold text-foreground">{summary.pisanieInserted}</span>/{summary.pisanieFound}
            </li>
          </ul>
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
