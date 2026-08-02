// ============================================================================
// lib/client/resize-image.ts
// Client-only: downscales a photo to a capped JPEG data URL before sending
// it to a Server Action. A real phone photo can be several MB — comfortably
// over the default ~1MB Server Action body limit (no experimental.
// serverActions.bodySizeLimit override exists in next.config.ts) — so this
// is the portable fix (works regardless of framework config), and it also
// speeds up vision AI calls and keeps payloads small. Originally written
// for components/paragony/receipt-scan-flow.tsx; reused as-is by
// components/schola/song-photo-import-flow.tsx.
// ============================================================================

export function resizeImageToDataUrl(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Nie udało się odczytać pliku."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Nie udało się wczytać zdjęcia."));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Przeglądarka nie obsługuje przetwarzania obrazu."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
