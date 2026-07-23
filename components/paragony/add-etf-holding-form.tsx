"use client";

// ============================================================================
// components/paragony/add-etf-holding-form.tsx
// Form for adding a new ETF holding (metadata + provider) plus its first buy
// transaction in one submit — see addEtfHolding, which reuses an existing
// holding row when the ticker is already held. The provider segmented
// control defaults itself from the ticker (a dot suggests a foreign
// exchange suffix, e.g. "VWCE.DE", so FMP; otherwise GPW/Stooq) until the
// user manually picks one, after which the auto-guess stops overriding them.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addEtfHolding } from "@/lib/paragony/etf-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, toDateKey } from "@/lib/utils";
import type { EtfProvider } from "@/lib/types/database";

const PROVIDER_OPTIONS: { value: EtfProvider; label: string }[] = [
  { value: "stooq", label: "GPW (Stooq)" },
  { value: "fmp", label: "Zagraniczny (FMP)" },
];

export function AddEtfHoldingForm() {
  const router = useRouter();

  const [ticker, setTicker] = useState("");
  const [provider, setProvider] = useState<EtfProvider>("stooq");
  const [providerTouched, setProviderTouched] = useState(false);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("PLN");
  const [assetClass, setAssetClass] = useState("");
  const [region, setRegion] = useState("");
  const [ter, setTer] = useState("");
  const [units, setUnits] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [transactionDate, setTransactionDate] = useState(toDateKey(new Date()));

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleTickerChange(value: string) {
    setTicker(value);
    if (!providerTouched) {
      setProvider(value.includes(".") ? "fmp" : "stooq");
    }
  }

  function selectProvider(value: EtfProvider) {
    setProvider(value);
    setProviderTouched(true);
  }

  const canSubmit = ticker.trim() !== "" && units.trim() !== "" && pricePerUnit.trim() !== "" && !!transactionDate;

  function submit() {
    if (!canSubmit || pending) return;
    setError(null);
    startTransition(async () => {
      const result = await addEtfHolding({
        ticker,
        provider,
        name,
        currency,
        assetClass,
        region,
        ter: ter.trim() ? Number(ter) : null,
        units: Number(units),
        pricePerUnit: Number(pricePerUnit),
        transactionDate,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/paragony/etf");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label htmlFor="ticker">Ticker</Label>
        <Input
          id="ticker"
          value={ticker}
          onChange={(e) => handleTickerChange(e.target.value)}
          placeholder="np. CDR (GPW) albo VWCE.DE (zagraniczny)"
          disabled={pending}
        />
      </div>

      <div>
        <Label>Giełda / źródło notowań</Label>
        <div className="flex gap-1 rounded-full bg-surface-muted p-1">
          {PROVIDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={pending}
              onClick={() => selectProvider(opt.value)}
              className={cn(
                "flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50",
                provider === opt.value ? "bg-primary text-primary-foreground" : "text-foreground-muted"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="name">Nazwa (opcjonalnie)</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="np. Vanguard FTSE All-World"
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="currency">Waluta</Label>
        <Input
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="PLN"
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="asset-class">Klasa aktywów</Label>
        <Input
          id="asset-class"
          value={assetClass}
          onChange={(e) => setAssetClass(e.target.value)}
          placeholder="np. akcje, obligacje, surowce"
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="region">Region</Label>
        <Input
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="np. Globalny, Europa, USA"
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="ter">Roczny koszt zarządzania — TER (%, opcjonalnie)</Label>
        <Input
          id="ter"
          type="number"
          step="0.01"
          value={ter}
          onChange={(e) => setTer(e.target.value)}
          placeholder="np. 0.22"
          disabled={pending}
        />
      </div>

      <div className="flex flex-col gap-4 rounded-(--radius-card) border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground">Pierwszy zakup</p>

        <div>
          <Label htmlFor="units">Liczba jednostek</Label>
          <Input
            id="units"
            type="number"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            placeholder="np. 10"
            disabled={pending}
          />
        </div>

        <div>
          <Label htmlFor="price-per-unit">Cena za jednostkę</Label>
          <Input
            id="price-per-unit"
            type="number"
            step="0.01"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            placeholder="np. 350.00"
            disabled={pending}
          />
        </div>

        <div>
          <Label htmlFor="transaction-date">Data transakcji</Label>
          <Input
            id="transaction-date"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            disabled={pending}
          />
        </div>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button size="lg" className="w-full" onClick={submit} disabled={!canSubmit} isLoading={pending}>
        Dodaj ETF
      </Button>
    </div>
  );
}
