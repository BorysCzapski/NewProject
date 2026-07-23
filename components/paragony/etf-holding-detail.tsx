"use client";

// ============================================================================
// components/paragony/etf-holding-detail.tsx
// Single ETF holding screen: inline-editable metadata, current position
// (units/average cost/total cost), full buy/sell transaction history and
// dividend history with add/delete controls, and a whole-holding delete with
// a clear warning that it cascades the entire transaction/dividend history.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  addEtfDividend,
  addEtfTransaction,
  deleteEtfDividend,
  deleteEtfHolding,
  deleteEtfTransaction,
  updateHoldingMetadata,
} from "@/lib/paragony/etf-actions";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, toDateKey } from "@/lib/utils";
import type { HoldingDetail } from "@/lib/paragony/etf-queries";

const selectClass =
  "h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary";
const textareaClass =
  "w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary";

const currencyFormatter = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });
const unitsFormatter = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 4 });
const dateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });

function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function EtfHoldingDetail({ detail }: { detail: HoldingDetail }) {
  const router = useRouter();
  const { holding, transactions, dividends, position } = detail;

  // --- Metadata edit ---
  const [editingMeta, setEditingMeta] = useState(false);
  const [name, setName] = useState(holding.name ?? "");
  const [assetClass, setAssetClass] = useState(holding.asset_class ?? "");
  const [region, setRegion] = useState(holding.region ?? "");
  const [ter, setTer] = useState(holding.ter !== null ? String(holding.ter) : "");
  const [metaPending, startMetaTransition] = useTransition();
  const [metaError, setMetaError] = useState<string | null>(null);

  function cancelEditMeta() {
    setName(holding.name ?? "");
    setAssetClass(holding.asset_class ?? "");
    setRegion(holding.region ?? "");
    setTer(holding.ter !== null ? String(holding.ter) : "");
    setMetaError(null);
    setEditingMeta(false);
  }

  function saveMeta() {
    setMetaError(null);
    startMetaTransition(async () => {
      const result = await updateHoldingMetadata(holding.id, {
        name,
        assetClass,
        region,
        ter: ter.trim() ? Number(ter) : null,
      });
      if (!result.ok) {
        setMetaError(result.error);
        return;
      }
      setEditingMeta(false);
      router.refresh();
    });
  }

  // --- Add transaction ---
  const [txType, setTxType] = useState<"buy" | "sell">("buy");
  const [txUnits, setTxUnits] = useState("");
  const [txPrice, setTxPrice] = useState("");
  const [txDate, setTxDate] = useState(toDateKey(new Date()));
  const [addTxPending, startAddTxTransition] = useTransition();
  const [addTxError, setAddTxError] = useState<string | null>(null);

  const canAddTx = txUnits.trim() !== "" && txPrice.trim() !== "" && !!txDate;

  function submitTransaction() {
    if (!canAddTx || addTxPending) return;
    setAddTxError(null);
    startAddTxTransition(async () => {
      const result = await addEtfTransaction({
        holdingId: holding.id,
        type: txType,
        units: Number(txUnits),
        pricePerUnit: Number(txPrice),
        transactionDate: txDate,
      });
      if (!result.ok) {
        setAddTxError(result.error);
        return;
      }
      setTxUnits("");
      setTxPrice("");
      setTxDate(toDateKey(new Date()));
      router.refresh();
    });
  }

  // --- Delete transaction ---
  const [confirmDeleteTxId, setConfirmDeleteTxId] = useState<string | null>(null);
  const [deleteTxPending, startDeleteTxTransition] = useTransition();
  const [deleteTxError, setDeleteTxError] = useState<string | null>(null);

  function confirmDeleteTransaction(id: string) {
    setDeleteTxError(null);
    startDeleteTxTransition(async () => {
      const result = await deleteEtfTransaction(id);
      if (!result.ok) {
        setDeleteTxError(result.error);
        return;
      }
      setConfirmDeleteTxId(null);
      router.refresh();
    });
  }

  // --- Add dividend ---
  const [divAmount, setDivAmount] = useState("");
  const [divDate, setDivDate] = useState(toDateKey(new Date()));
  const [divNotes, setDivNotes] = useState("");
  const [addDivPending, startAddDivTransition] = useTransition();
  const [addDivError, setAddDivError] = useState<string | null>(null);

  const canAddDiv = divAmount.trim() !== "" && !!divDate;

  function submitDividend() {
    if (!canAddDiv || addDivPending) return;
    setAddDivError(null);
    startAddDivTransition(async () => {
      const result = await addEtfDividend({
        holdingId: holding.id,
        amount: Number(divAmount),
        paymentDate: divDate,
        notes: divNotes.trim() ? divNotes.trim() : null,
      });
      if (!result.ok) {
        setAddDivError(result.error);
        return;
      }
      setDivAmount("");
      setDivDate(toDateKey(new Date()));
      setDivNotes("");
      router.refresh();
    });
  }

  // --- Delete dividend ---
  const [confirmDeleteDivId, setConfirmDeleteDivId] = useState<string | null>(null);
  const [deleteDivPending, startDeleteDivTransition] = useTransition();
  const [deleteDivError, setDeleteDivError] = useState<string | null>(null);

  function confirmDeleteDividend(id: string) {
    setDeleteDivError(null);
    startDeleteDivTransition(async () => {
      const result = await deleteEtfDividend(id);
      if (!result.ok) {
        setDeleteDivError(result.error);
        return;
      }
      setConfirmDeleteDivId(null);
      router.refresh();
    });
  }

  // --- Delete whole holding ---
  const [confirmDeleteHolding, setConfirmDeleteHolding] = useState(false);
  const [deleteHoldingPending, startDeleteHoldingTransition] = useTransition();
  const [deleteHoldingError, setDeleteHoldingError] = useState<string | null>(null);

  function performDeleteHolding() {
    setDeleteHoldingError(null);
    startDeleteHoldingTransition(async () => {
      const result = await deleteEtfHolding(holding.id);
      if (!result.ok) {
        setDeleteHoldingError(result.error);
        return;
      }
      router.push("/paragony/etf");
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Informacje o ETF-ie</CardTitle>
          {!editingMeta && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingMeta(true)}>
              <Pencil className="h-3.5 w-3.5" />
              Edytuj
            </Button>
          )}
        </div>

        {editingMeta ? (
          <div className="flex flex-col gap-3">
            <div>
              <Label htmlFor="meta-name">Nazwa</Label>
              <Input id="meta-name" value={name} onChange={(e) => setName(e.target.value)} disabled={metaPending} />
            </div>
            <div>
              <Label htmlFor="meta-asset-class">Klasa aktywów</Label>
              <Input
                id="meta-asset-class"
                value={assetClass}
                onChange={(e) => setAssetClass(e.target.value)}
                disabled={metaPending}
              />
            </div>
            <div>
              <Label htmlFor="meta-region">Region</Label>
              <Input
                id="meta-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={metaPending}
              />
            </div>
            <div>
              <Label htmlFor="meta-ter">Roczny koszt zarządzania — TER (%)</Label>
              <Input
                id="meta-ter"
                type="number"
                step="0.01"
                value={ter}
                onChange={(e) => setTer(e.target.value)}
                disabled={metaPending}
              />
            </div>
            {metaError && <p className="text-sm text-danger">{metaError}</p>}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={metaPending}
                onClick={cancelEditMeta}
              >
                <X className="h-4 w-4" />
                Anuluj
              </Button>
              <Button type="button" className="flex-1" isLoading={metaPending} onClick={saveMeta}>
                <Check className="h-4 w-4" />
                Zapisz
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-foreground-muted">Nazwa</span>
              <span className="text-right text-foreground">{holding.name || "—"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-foreground-muted">Klasa aktywów</span>
              <span className="text-right text-foreground">{holding.asset_class || "—"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-foreground-muted">Region</span>
              <span className="text-right text-foreground">{holding.region || "—"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-foreground-muted">TER</span>
              <span className="text-right text-foreground">{holding.ter !== null ? `${holding.ter}%` : "—"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-foreground-muted">Waluta</span>
              <span className="text-right text-foreground">{holding.currency}</span>
            </div>
          </div>
        )}
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Pozycja bieżąca</CardTitle>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-foreground-muted">Jednostki</p>
            <p className="mt-1 font-semibold text-foreground">{unitsFormatter.format(position.units)}</p>
          </div>
          <div>
            <p className="text-xs text-foreground-muted">Śr. cena zakupu</p>
            <p className="mt-1 font-semibold text-foreground">{currencyFormatter.format(position.averageCost)}</p>
          </div>
          <div>
            <p className="text-xs text-foreground-muted">Zainwestowano</p>
            <p className="mt-1 font-semibold text-foreground">{currencyFormatter.format(position.totalCost)}</p>
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Transakcje</CardTitle>
        {transactions.length === 0 ? (
          <CardDescription>Brak zapisanych transakcji.</CardDescription>
        ) : (
          <div className="flex flex-col gap-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col gap-2 rounded-(--radius-control) border border-border bg-surface-muted px-3.5 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                        tx.type === "buy" ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"
                      )}
                    >
                      {tx.type === "buy" ? "Kupno" : "Sprzedaż"}
                    </span>
                    <p className="mt-1 text-sm text-foreground">
                      {unitsFormatter.format(tx.units)} j. × {currencyFormatter.format(tx.price_per_unit)}
                    </p>
                    <p className="text-xs text-foreground-muted">{formatDate(tx.transaction_date)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Usuń transakcję"
                    disabled={deleteTxPending}
                    onClick={() => setConfirmDeleteTxId(tx.id)}
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>

                {confirmDeleteTxId === tx.id && (
                  <Card className="flex flex-col gap-3 bg-warning-soft">
                    <div className="flex gap-2.5">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                      <p className="text-sm text-foreground">Na pewno usunąć tę transakcję?</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        disabled={deleteTxPending}
                        onClick={() => setConfirmDeleteTxId(null)}
                      >
                        Anuluj
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        className="flex-1"
                        isLoading={deleteTxPending}
                        onClick={() => confirmDeleteTransaction(tx.id)}
                      >
                        Usuń
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
        {deleteTxError && <p className="text-sm text-danger">{deleteTxError}</p>}

        <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-foreground">Dodaj transakcję</p>
          <div>
            <Label htmlFor="tx-type">Typ</Label>
            <select
              id="tx-type"
              value={txType}
              onChange={(e) => setTxType(e.target.value as "buy" | "sell")}
              className={selectClass}
              disabled={addTxPending}
            >
              <option value="buy">Kupno</option>
              <option value="sell">Sprzedaż</option>
            </select>
          </div>
          <div>
            <Label htmlFor="tx-units">Liczba jednostek</Label>
            <Input
              id="tx-units"
              type="number"
              value={txUnits}
              onChange={(e) => setTxUnits(e.target.value)}
              placeholder="np. 5"
              disabled={addTxPending}
            />
          </div>
          <div>
            <Label htmlFor="tx-price">Cena za jednostkę</Label>
            <Input
              id="tx-price"
              type="number"
              step="0.01"
              value={txPrice}
              onChange={(e) => setTxPrice(e.target.value)}
              placeholder="np. 350.00"
              disabled={addTxPending}
            />
          </div>
          <div>
            <Label htmlFor="tx-date">Data transakcji</Label>
            <Input
              id="tx-date"
              type="date"
              value={txDate}
              onChange={(e) => setTxDate(e.target.value)}
              disabled={addTxPending}
            />
          </div>
          {addTxError && <p className="text-sm text-danger">{addTxError}</p>}
          <Button
            type="button"
            className="w-full"
            disabled={!canAddTx}
            isLoading={addTxPending}
            onClick={submitTransaction}
          >
            <Plus className="h-4 w-4" />
            Dodaj transakcję
          </Button>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Dywidendy</CardTitle>
        {dividends.length === 0 ? (
          <CardDescription>Brak zapisanych dywidend.</CardDescription>
        ) : (
          <div className="flex flex-col gap-2">
            {dividends.map((div) => (
              <div
                key={div.id}
                className="flex flex-col gap-2 rounded-(--radius-control) border border-border bg-surface-muted px-3.5 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{currencyFormatter.format(div.amount)}</p>
                    <p className="text-xs text-foreground-muted">{formatDate(div.payment_date)}</p>
                    {div.notes && <p className="truncate text-xs text-foreground-muted">{div.notes}</p>}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Usuń dywidendę"
                    disabled={deleteDivPending}
                    onClick={() => setConfirmDeleteDivId(div.id)}
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>

                {confirmDeleteDivId === div.id && (
                  <Card className="flex flex-col gap-3 bg-warning-soft">
                    <div className="flex gap-2.5">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                      <p className="text-sm text-foreground">Na pewno usunąć tę dywidendę?</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        disabled={deleteDivPending}
                        onClick={() => setConfirmDeleteDivId(null)}
                      >
                        Anuluj
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        className="flex-1"
                        isLoading={deleteDivPending}
                        onClick={() => confirmDeleteDividend(div.id)}
                      >
                        Usuń
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
        {deleteDivError && <p className="text-sm text-danger">{deleteDivError}</p>}

        <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-foreground">Dodaj dywidendę</p>
          <div>
            <Label htmlFor="div-amount">Kwota</Label>
            <Input
              id="div-amount"
              type="number"
              step="0.01"
              value={divAmount}
              onChange={(e) => setDivAmount(e.target.value)}
              placeholder="np. 25.50"
              disabled={addDivPending}
            />
          </div>
          <div>
            <Label htmlFor="div-date">Data wypłaty</Label>
            <Input
              id="div-date"
              type="date"
              value={divDate}
              onChange={(e) => setDivDate(e.target.value)}
              disabled={addDivPending}
            />
          </div>
          <div>
            <Label htmlFor="div-notes">Notatki (opcjonalnie)</Label>
            <textarea
              id="div-notes"
              value={divNotes}
              onChange={(e) => setDivNotes(e.target.value)}
              rows={2}
              className={textareaClass}
              placeholder="np. dywidenda kwartalna"
              disabled={addDivPending}
            />
          </div>
          {addDivError && <p className="text-sm text-danger">{addDivError}</p>}
          <Button
            type="button"
            className="w-full"
            disabled={!canAddDiv}
            isLoading={addDivPending}
            onClick={submitDividend}
          >
            <Plus className="h-4 w-4" />
            Dodaj dywidendę
          </Button>
        </div>
      </Card>

      {confirmDeleteHolding ? (
        <Card className="flex flex-col gap-3 bg-warning-soft">
          <div className="flex gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-sm text-foreground">
              Na pewno chcesz usunąć ETF {holding.ticker.toUpperCase()}? Zostanie usunięta TAKŻE cała historia
              transakcji i dywidend tej pozycji. Tej operacji nie da się cofnąć.
            </p>
          </div>
          {deleteHoldingError && <p className="text-sm text-danger">{deleteHoldingError}</p>}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={deleteHoldingPending}
              onClick={() => setConfirmDeleteHolding(false)}
            >
              Anuluj
            </Button>
            <Button
              type="button"
              variant="danger"
              className="flex-1"
              isLoading={deleteHoldingPending}
              onClick={performDeleteHolding}
            >
              Tak, usuń ETF
            </Button>
          </div>
        </Card>
      ) : (
        <Button type="button" variant="danger" className="w-full" onClick={() => setConfirmDeleteHolding(true)}>
          <Trash2 className="h-4 w-4" />
          Usuń ten ETF
        </Button>
      )}
    </div>
  );
}
