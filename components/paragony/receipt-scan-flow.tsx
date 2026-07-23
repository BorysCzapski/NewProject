"use client";

// ============================================================================
// components/paragony/receipt-scan-flow.tsx
// Capture -> AI OCR draft -> review/correct -> confirm. The AI read (via
// scanReceipt) is NEVER trusted as final — this screen always lands on an
// editable review step before anything becomes a real transaction (see
// lib/paragony/receipts-actions.ts confirmReceipt).
//
// Photos are downscaled client-side to a JPEG capped at 1600px/~0.82 quality
// before being sent as a data URL — a real phone photo can be several MB,
// comfortably over the default Server Action body size limit; resizing here
// is the portable fix (works regardless of framework config) and also
// speeds up the vision call and keeps Storage usage down.
// ============================================================================
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Plus, Trash2, AlertTriangle, X } from "lucide-react";
import { scanReceipt, confirmReceipt, deleteReceipt } from "@/lib/paragony/receipts-actions";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryIcon } from "@/components/paragony/category-icon";
import type { AccountBalance } from "@/lib/paragony/queries";
import type { BudgetCategory, Receipt } from "@/lib/types/database";

const selectClass =
  "h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

interface DraftItem {
  name: string;
  quantity: number;
  unit_price: number | null;
  total_price: number;
  category_id: string | null;
}

type Step = "capture" | "scanning" | "review";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function resizeImageToDataUrl(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
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

export function ReceiptScanFlow({
  accounts,
  categories,
}: {
  accounts: AccountBalance[];
  categories: BudgetCategory[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<Step>("capture");
  const [captureError, setCaptureError] = useState<string | null>(null);

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [imageSignedUrl, setImageSignedUrl] = useState<string | null>(null);
  const [ocrFailed, setOcrFailed] = useState(false);

  const [storeName, setStoreName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(todayIso);
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [items, setItems] = useState<DraftItem[]>([]);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [discardConfirm, setDiscardConfirm] = useState(false);

  function handleFileChosen(file: File) {
    setCaptureError(null);
    setStep("scanning");
    startTransition(async () => {
      try {
        const dataUrl = await resizeImageToDataUrl(file);
        const result = await scanReceipt(dataUrl);
        if (!result.ok) {
          setCaptureError(result.error);
          setStep("capture");
          return;
        }
        const { receipt: newReceipt, items: newItems, imageSignedUrl: signedUrl, ocrFailed: failed } =
          result.data;
        setReceipt(newReceipt);
        setImageSignedUrl(signedUrl);
        setOcrFailed(failed);
        setStoreName(newReceipt.store_name ?? "");
        setPurchaseDate(newReceipt.purchase_date ?? todayIso());
        setItems(
          newItems.length > 0
            ? newItems.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price,
                category_id: item.category_id,
              }))
            : [{ name: "", quantity: 1, unit_price: null, total_price: 0, category_id: null }]
        );
        setStep("review");
      } catch {
        setCaptureError("Nie udało się przetworzyć zdjęcia. Spróbuj ponownie.");
        setStep("capture");
      }
    });
  }

  function updateItem(index: number, patch: Partial<DraftItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { name: "", quantity: 1, unit_price: null, total_price: 0, category_id: null },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const total = items.reduce((sum, item) => sum + (item.total_price || 0), 0);

  function handleConfirm() {
    if (!receipt) return;
    setConfirmError(null);
    startTransition(async () => {
      const result = await confirmReceipt({
        receiptId: receipt.id,
        storeName,
        purchaseDate,
        accountId,
        items,
      });
      if (!result.ok) {
        setConfirmError(result.error);
        return;
      }
      router.push("/paragony");
      router.refresh();
    });
  }

  function handleDiscard() {
    if (!receipt) return;
    startTransition(async () => {
      await deleteReceipt(receipt.id);
      setReceipt(null);
      setImageSignedUrl(null);
      setItems([]);
      setDiscardConfirm(false);
      setStep("capture");
      router.refresh();
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
            AI odczyta sklep, datę, sumę i pozycje — będziesz mógł je poprawić przed zapisaniem.
          </span>
        </button>
        {captureError && <p className="text-sm text-danger">{captureError}</p>}
      </div>
    );
  }

  if (step === "scanning") {
    return (
      <Card className="flex flex-col items-center gap-3 py-14 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <CardTitle>Odczytuję paragon…</CardTitle>
        <CardDescription>To może potrwać kilka sekund.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {ocrFailed && (
        <Card className="flex gap-2.5 bg-warning-soft">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p className="text-sm text-foreground">
            Nie udało się automatycznie odczytać paragonu — uzupełnij dane ręcznie poniżej.
          </p>
        </Card>
      )}

      {imageSignedUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- private, per-user signed URL, not a static asset
        <img
          src={imageSignedUrl}
          alt="Zdjęcie paragonu"
          className="max-h-64 w-full rounded-(--radius-card) border border-border object-contain"
        />
      )}

      <Card className="flex flex-col gap-4">
        <CardTitle>To jest odczyt automatyczny — sprawdź przed zapisaniem</CardTitle>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="store-name">Sklep</Label>
          <Input id="store-name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="purchase-date">Data zakupu</Label>
          <Input
            id="purchase-date"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="account">Zapłacono z konta</Label>
          {accounts.length === 0 ? (
            <p className="text-sm text-danger">
              Najpierw dodaj konto w <Link href="/paragony/konta" className="underline">ustawieniach kont</Link>.
            </p>
          ) : (
            <select
              id="account"
              className={selectClass}
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <CardTitle>Pozycje</CardTitle>
          <Button type="button" variant="ghost" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4" /> Dodaj pozycję
          </Button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex flex-col gap-2 rounded-(--radius-control) border border-border p-3">
            <div className="flex items-center gap-2">
              <Input
                value={item.name}
                onChange={(e) => updateItem(index, { name: e.target.value })}
                placeholder="Nazwa produktu"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                aria-label="Usuń pozycję"
                className="rounded-(--radius-control) p-2 text-foreground-muted hover:bg-danger-soft hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Ilość</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, { quantity: Number(e.target.value) })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Cena jedn.</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.unit_price ?? ""}
                  onChange={(e) =>
                    updateItem(index, { unit_price: e.target.value === "" ? null : Number(e.target.value) })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Cena łączna</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.total_price}
                  onChange={(e) => updateItem(index, { total_price: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CategoryIcon
                name={categories.find((c) => c.id === item.category_id)?.icon ?? null}
                className="h-4 w-4 shrink-0 text-foreground-muted"
              />
              <select
                className={selectClass}
                value={item.category_id ?? ""}
                onChange={(e) => updateItem(index, { category_id: e.target.value || null })}
              >
                <option value="">Bez kategorii</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="font-semibold text-foreground">Razem</span>
          <span className="font-semibold text-foreground">
            {new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(total)}
          </span>
        </div>
      </Card>

      {confirmError && <p className="text-sm text-danger">{confirmError}</p>}

      <Button
        type="button"
        variant="primary"
        className="w-full"
        isLoading={isPending}
        disabled={accounts.length === 0}
        onClick={handleConfirm}
      >
        Zapisz jako potwierdzony
      </Button>

      {discardConfirm ? (
        <Card className="flex flex-col gap-3 bg-warning-soft">
          <div className="flex gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-sm text-foreground">
              Na pewno odrzucić ten paragon? Zdjęcie i odczyt zostaną usunięte.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setDiscardConfirm(false)}>
              Wróć
            </Button>
            <Button type="button" variant="danger" className="flex-1" isLoading={isPending} onClick={handleDiscard}>
              Odrzuć paragon
            </Button>
          </div>
        </Card>
      ) : (
        <button
          type="button"
          onClick={() => setDiscardConfirm(true)}
          className="flex items-center justify-center gap-1.5 text-sm text-foreground-muted hover:text-danger"
        >
          <X className="h-4 w-4" /> Odrzuć ten paragon
        </button>
      )}
    </div>
  );
}
