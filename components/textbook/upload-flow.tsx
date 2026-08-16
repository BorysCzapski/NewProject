"use client";

// ============================================================================
// components/textbook/upload-flow.tsx
// Upload an English-textbook PDF -> POST to the Route Handler that extracts
// and directly persists units/vocabulary/grammar via AI -> redirect to the
// new textbook. Unlike Schola's song import there's no review step: a
// textbook's structure is too deeply nested (units -> words + grammar topics
// + exercises) to review inline, so the route commits it straight away.
// ============================================================================
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileUp } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

type Step = "upload" | "processing";

export function TextbookUploadFlow() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  const [step, setStep] = useState<Step>("upload");
  const [error, setError] = useState<string | null>(null);

  function handleFileChosen(file: File) {
    setError(null);
    setStep("processing");
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/jezyki/import-textbook", { method: "POST", body: formData });
        const body = (await response.json()) as { ok: boolean; textbookId?: string; error?: string };
        if (!body.ok || !body.textbookId) {
          setError(body.error ?? "Nie udało się przetworzyć pliku.");
          setStep("upload");
          return;
        }
        router.push(`/jezyki/nauka/podrecznik/${body.textbookId}`);
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
        <CardTitle>Czytam podręcznik…</CardTitle>
        <CardDescription>
          AI dzieli treść na działy, słówka i gramatykę — to może potrwać do minuty.
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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
        className="flex flex-col items-center gap-3 rounded-(--radius-card) border-2 border-dashed border-border bg-surface px-6 py-14 text-center transition-colors hover:border-primary"
      >
        <FileUp className="h-10 w-10 text-primary" />
        <span className="text-base font-semibold text-foreground">Wybierz plik PDF z podręcznikiem</span>
        <span className="text-sm text-foreground-muted">
          AI podzieli go na działy, wypisze słówka z tłumaczeniami i przygotuje ćwiczenia z gramatyki.
        </span>
      </button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
