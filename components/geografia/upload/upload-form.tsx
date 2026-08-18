"use client";

// ============================================================================
// components/geografia/upload/upload-form.tsx
// Upload a worksheet PDF -> POST to the Route Handler that stores it,
// extracts exercises via AI, and routes each to its CKE topic (see
// app/api/geografia/import-exercises/route.ts). Unlike Podręcznik's import,
// there's no single destination page to redirect to (exercises land across
// many topics), so this just reports the outcome and refreshes the file list.
// ============================================================================
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileUp } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

type Step = "upload" | "processing";

export function UploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  const [step, setStep] = useState<Step>("upload");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ exercisesExtracted: number } | null>(null);

  function handleFileChosen(file: File) {
    setError(null);
    setResult(null);
    setStep("processing");
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/geografia/import-exercises", { method: "POST", body: formData });
        const body = (await response.json()) as { ok: boolean; exercisesExtracted?: number; error?: string };
        setStep("upload");
        if (!body.ok) {
          setError(body.error ?? "Nie udało się przetworzyć pliku.");
          return;
        }
        setResult({ exercisesExtracted: body.exercisesExtracted ?? 0 });
        router.refresh();
      } catch {
        setError("Nie udało się przesłać pliku. Sprawdź połączenie i spróbuj ponownie.");
        setStep("upload");
      }
    });
  }

  if (step === "processing") {
    return (
      <Card className="flex flex-col items-center gap-3 py-14 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <CardTitle>Czytam arkusz…</CardTitle>
        <CardDescription>
          AI wyodrębnia zadania i przypisuje je do działów CKE — to może potrwać do minuty.
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChosen(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center gap-3 rounded-(--radius-card) border-2 border-dashed border-border bg-surface px-6 py-10 text-center transition-colors hover:border-primary"
      >
        <FileUp className="h-10 w-10 text-primary" />
        <span className="text-base font-semibold text-foreground">Wybierz plik PDF z arkuszem ćwiczeń</span>
        <span className="text-sm text-foreground-muted">
          Maks. ok. 4 MB. AI wyodrębni pytania zamknięte i otwarte (z kluczem odpowiedzi) i doda je do wspólnej
          biblioteki ćwiczeń — z oznaczeniem &bdquo;niesprawdzone&rdquo; do czasu weryfikacji.
        </span>
      </button>
      {error && <p className="text-sm text-danger">{error}</p>}
      {result && (
        <p className="text-sm font-medium text-accent">
          Wyodrębniono {result.exercisesExtracted} {result.exercisesExtracted === 1 ? "ćwiczenie" : "ćwiczeń"}.
        </p>
      )}
    </div>
  );
}
