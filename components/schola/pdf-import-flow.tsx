"use client";

// ============================================================================
// components/schola/pdf-import-flow.tsx
// Upload a songbook PDF -> POST to the Route Handler that splits it into
// song drafts via AI -> review/edit every draft (discard any that look
// wrong) -> one bulk save. Nothing is written to the DB until "Zapisz".
// ============================================================================
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Trash2 } from "lucide-react";
import { importScholaSongs, type DraftScholaSong } from "@/lib/schola/import-actions";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChordProView } from "@/components/schola/chordpro-view";

const textareaClass =
  "w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary";

type Step = "upload" | "processing" | "review";

export function PdfImportFlow() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<Step>("upload");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<DraftScholaSong[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleFileChosen(file: File) {
    setUploadError(null);
    setStep("processing");
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/schola/import-pdf", { method: "POST", body: formData });
        const body = (await response.json()) as { ok: boolean; songs?: DraftScholaSong[]; error?: string };
        if (!body.ok) {
          setUploadError(body.error ?? "Nie udało się przetworzyć pliku.");
          setStep("upload");
          return;
        }
        if (!body.songs || body.songs.length === 0) {
          setUploadError("Nie znaleziono żadnych pieśni w tym pliku.");
          setStep("upload");
          return;
        }
        setDrafts(body.songs);
        setStep("review");
      } catch {
        setUploadError("Nie udało się przesłać pliku. Sprawdź połączenie i spróbuj ponownie.");
        setStep("upload");
      }
    });
  }

  function updateDraft(index: number, patch: Partial<DraftScholaSong>) {
    setDrafts((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  function discardDraft(index: number) {
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSaveAll() {
    if (drafts.length === 0) return;
    setSaveError(null);
    startTransition(async () => {
      const result = await importScholaSongs(drafts);
      if (!result.ok) {
        setSaveError(result.error);
        return;
      }
      router.push("/schola/piosenki");
      router.refresh();
    });
  }

  if (step === "upload") {
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
          <span className="text-base font-semibold text-foreground">Wybierz plik PDF ze śpiewnikiem</span>
          <span className="text-sm text-foreground-muted">
            AI podzieli plik na pojedyncze pieśni — będziesz mógł je poprawić przed zapisaniem.
          </span>
        </button>
        {uploadError && <p className="text-sm text-danger">{uploadError}</p>}
      </div>
    );
  }

  if (step === "processing") {
    return (
      <Card className="flex flex-col items-center gap-3 py-14 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <CardTitle>Przetwarzam śpiewnik…</CardTitle>
        <CardDescription>To może potrwać do minuty przy większych plikach.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground-muted">
        Znaleziono {drafts.length} {drafts.length === 1 ? "pieśń" : "pieśni"}. Sprawdź i popraw przed
        zapisaniem — to tylko wstępny odczyt AI.
      </p>

      {drafts.map((draft, index) => (
        <Card key={index} className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <Label htmlFor={`draft-title-${index}`}>Tytuł</Label>
              <Input
                id={`draft-title-${index}`}
                value={draft.title}
                onChange={(e) => updateDraft(index, { title: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={() => discardDraft(index)}
              aria-label="Odrzuć tę pieśń"
              className="mt-6 rounded-(--radius-control) p-2 text-foreground-muted hover:bg-danger-soft hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div>
            <Label htmlFor={`draft-lyrics-${index}`}>Tekst z akordami</Label>
            <textarea
              id={`draft-lyrics-${index}`}
              value={draft.lyrics_chordpro}
              onChange={(e) => updateDraft(index, { lyrics_chordpro: e.target.value })}
              rows={6}
              className={textareaClass}
            />
          </div>
          {draft.lyrics_chordpro.trim() && (
            <div className="rounded-(--radius-control) bg-surface-muted p-3">
              <ChordProView text={draft.lyrics_chordpro} />
            </div>
          )}
        </Card>
      ))}

      {saveError && <p className="text-sm text-danger">{saveError}</p>}

      <Button size="lg" className="w-full" isLoading={isPending} disabled={drafts.length === 0} onClick={handleSaveAll}>
        Zapisz {drafts.length} {drafts.length === 1 ? "pieśń" : "piosenek"}
      </Button>
    </div>
  );
}
