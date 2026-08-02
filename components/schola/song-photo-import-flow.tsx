"use client";

// ============================================================================
// components/schola/song-photo-import-flow.tsx
// Capture -> AI OCR draft -> review (SongForm, pre-filled) -> confirm.
// Mirrors components/paragony/receipt-scan-flow.tsx's capture/scanning/
// review state machine, but simpler: nothing is persisted until the review
// step's SongForm actually saves — no Storage, no intermediate DB row.
// ============================================================================
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, AlertTriangle } from "lucide-react";
import { scanSongPhoto } from "@/lib/schola/song-photo-actions";
import { resizeImageToDataUrl } from "@/lib/client/resize-image";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { SongForm } from "@/components/schola/song-form";
import type { SongInput } from "@/lib/schola/songs-actions";

type Step = "capture" | "scanning" | "review";

export function SongPhotoImportFlow() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  const [step, setStep] = useState<Step>("capture");
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [ocrFailed, setOcrFailed] = useState(false);
  const [draft, setDraft] = useState<SongInput | null>(null);

  function handleFileChosen(file: File) {
    setCaptureError(null);
    setStep("scanning");
    startTransition(async () => {
      try {
        const dataUrl = await resizeImageToDataUrl(file);
        const result = await scanSongPhoto(dataUrl);
        if (!result.ok) {
          setOcrFailed(true);
          setDraft({ title: "", lyrics_chordpro: "", tags: [], youtube_url: "", sheet_music_url: "" });
          setStep("review");
          return;
        }
        setOcrFailed(false);
        setDraft({
          title: result.data.title,
          lyrics_chordpro: result.data.lyrics_chordpro,
          tags: result.data.tags,
          youtube_url: "",
          sheet_music_url: "",
        });
        setStep("review");
      } catch {
        setCaptureError("Nie udało się przetworzyć zdjęcia. Spróbuj ponownie.");
        setStep("capture");
      }
    });
  }

  if (step === "capture") {
    return (
      <div className="flex flex-col gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
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
          <Camera className="h-10 w-10 text-primary" />
          <span className="text-base font-semibold text-foreground">Zrób zdjęcie lub wybierz plik</span>
          <span className="text-sm text-foreground-muted">
            AI odczyta tytuł i tekst z akordami — będziesz mógł je poprawić przed zapisaniem.
          </span>
        </button>
        {captureError && <p className="text-sm text-danger">{captureError}</p>}
      </div>
    );
  }

  if (step === "scanning" || !draft) {
    return (
      <Card className="flex flex-col items-center gap-3 py-14 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <CardTitle>Odczytuję zdjęcie…</CardTitle>
        <CardDescription>To może potrwać kilka sekund.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {ocrFailed && (
        <Card className="flex gap-2.5 bg-warning-soft">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p className="text-sm text-foreground">
            Nie udało się automatycznie odczytać zdjęcia — uzupełnij dane ręcznie poniżej.
          </p>
        </Card>
      )}
      <SongForm
        song={draft}
        onSaved={() => {
          router.push("/schola/piosenki");
          router.refresh();
        }}
        onDiscard={() => {
          setDraft(null);
          setStep("capture");
        }}
      />
    </div>
  );
}
