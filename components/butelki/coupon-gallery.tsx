"use client";

// ============================================================================
// components/butelki/coupon-gallery.tsx
// Photo strip of deposit-return coupons ("kaucyjne kupony"): capture ->
// upload -> thumbnail at the bottom. Tapping a thumbnail opens it enlarged
// in a lightbox with a delete action. Mirrors the capture/resize pattern of
// components/paragony/receipt-scan-flow.tsx.
// ============================================================================
import { useRef, useState, useTransition } from "react";
import { Camera, Trash2, X } from "lucide-react";
import { addCoupon, deleteCoupon } from "@/lib/butelki/actions";
import { resizeImageToDataUrl } from "@/lib/client/resize-image";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { CouponWithUrl } from "@/lib/butelki/queries";

export function CouponGallery({ initialCoupons }: { initialCoupons: CouponWithUrl[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [selected, setSelected] = useState<CouponWithUrl | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChosen(file: File) {
    setError(null);
    startTransition(async () => {
      try {
        const dataUrl = await resizeImageToDataUrl(file);
        const result = await addCoupon(dataUrl);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setCoupons((prev) => [result.data, ...prev]);
      } catch {
        setError("Nie udało się dodać zdjęcia kuponu.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCoupon(id);
      if (result.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        setSelected(null);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <CardTitle>Kupony kaucyjne</CardTitle>

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

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        isLoading={isPending && !selected}
        onClick={() => fileInputRef.current?.click()}
      >
        <Camera className="h-4 w-4" /> Dodaj kupon
      </Button>

      {error && <p className="text-sm text-danger">{error}</p>}

      {coupons.length === 0 ? (
        <Card>
          <CardDescription>Nie masz jeszcze żadnych kuponów kaucyjnych.</CardDescription>
        </Card>
      ) : (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {coupons.map((coupon) => (
            <button
              key={coupon.id}
              type="button"
              onClick={() => setSelected(coupon)}
              aria-label="Powiększ kupon"
              className="h-20 w-20 shrink-0 overflow-hidden rounded-(--radius-control) border border-border"
            >
              {coupon.signedUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- private, per-user signed URL, not a static asset
                <img src={coupon.signedUrl} alt="Kupon kaucyjny" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-muted text-center text-[10px] text-foreground-muted">
                  brak podglądu
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/80 p-5"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Zamknij"
            className="absolute right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
          >
            <X className="h-5 w-5" />
          </button>

          {selected.signedUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- private, per-user signed URL, not a static asset
            <img
              src={selected.signedUrl}
              alt="Kupon kaucyjny"
              className="max-h-[70vh] max-w-full rounded-(--radius-card) object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <Button
            type="button"
            variant="danger"
            isLoading={isPending}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(selected.id);
            }}
          >
            <Trash2 className="h-4 w-4" /> Usuń kupon
          </Button>
        </div>
      )}
    </div>
  );
}
