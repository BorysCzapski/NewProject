"use client";

// ============================================================================
// components/trading/calculator.tsx
// Kalkulator pozycji: z ceny wejścia, SL, TP i wolumenu liczy ryzyko i zysk
// w PLN, relację TP:SL, minimalną skuteczność i maksymalny wolumen dla limitu
// ryzyka. Kolejność pól odzwierciedla zasadę „najpierw stop, potem wolumen”.
// ============================================================================
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { calcPosition } from "@/lib/trading/calc";

function num(v: string): number {
  return Number(v.replace(",", "."));
}

const pln = (n: number) => `${n.toLocaleString("pl-PL", { maximumFractionDigits: 2, minimumFractionDigits: 2 })} PLN`;

export function Calculator() {
  const [side, setSide] = useState<"long" | "short">("long");
  const [entry, setEntry] = useState("97,00");
  const [sl, setSl] = useState("96,70");
  const [tp, setTp] = useState("97,50");
  const [volume, setVolume] = useState("0,01");
  const [capital, setCapital] = useState("1600");
  const [riskPct, setRiskPct] = useState("2");
  const [perUnit, setPerUnit] = useState("40");

  const r = calcPosition({
    side,
    entry: num(entry),
    sl: num(sl),
    tp: num(tp),
    volume: num(volume),
    plnPerUsdPer001: num(perUnit),
    capital: num(capital),
    riskPct: num(riskPct),
  });

  const field = (label: string, value: string, set: (v: string) => void, id: string) => (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} inputMode="decimal" value={value} onChange={(e) => set(e.target.value)} />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <CardTitle>Kapitał i limit ryzyka</CardTitle>
        <div className="grid grid-cols-2 gap-3">
          {field("Kapitał (PLN)", capital, setCapital, "calc-capital")}
          {field("Ryzyko na transakcję (%)", riskPct, setRiskPct, "calc-risk")}
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Pozycja</CardTitle>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Kierunek">
          {(["long", "short"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={cn(
                "h-11 rounded-(--radius-control) border text-sm font-semibold transition-colors",
                side === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-foreground"
              )}
            >
              {s === "long" ? "Long (Buy)" : "Short (Sell)"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {field("Wejście", entry, setEntry, "calc-entry")}
          {field("Stop Loss", sl, setSl, "calc-sl")}
          {field("Take Profit", tp, setTp, "calc-tp")}
          {field("Wolumen (loty)", volume, setVolume, "calc-volume")}
        </div>
        <div>
          <Label htmlFor="calc-per">PLN na 1 USD ruchu dla 0,01 lota</Label>
          <Input id="calc-per" inputMode="decimal" value={perUnit} onChange={(e) => setPerUnit(e.target.value)} />
        </div>
      </Card>

      <Card className="flex flex-col gap-3" aria-live="polite">
        <CardTitle>Wynik</CardTitle>
        {!r.valid ? (
          <p className="text-sm text-danger">{r.error}</p>
        ) : (
          <>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <dt className="text-foreground-muted">Strata na SL</dt>
              <dd className="text-right font-semibold text-danger">−{pln(r.riskPln)}</dd>
              <dt className="text-foreground-muted">Zysk na TP</dt>
              <dd className="text-right font-semibold text-primary">+{pln(r.rewardPln)}</dd>
              <dt className="text-foreground-muted">Relacja TP : SL</dt>
              <dd className="text-right font-semibold">{r.rr.toFixed(2)} : 1</dd>
              <dt className="text-foreground-muted">Min. % wygranych na zero</dt>
              <dd className="text-right font-semibold">{r.minWinRatePct.toFixed(0)}%</dd>
              <dt className="text-foreground-muted">Ryzyko to % kapitału</dt>
              <dd className="text-right font-semibold">{r.riskOfCapitalPct.toFixed(2)}%</dd>
              <dt className="text-foreground-muted">Limit ryzyka</dt>
              <dd className="text-right font-semibold">{pln(r.riskLimitPln)}</dd>
              <dt className="text-foreground-muted">Max wolumen dla limitu</dt>
              <dd className="text-right font-semibold">{r.maxVolume.toFixed(2)} lota</dd>
            </dl>
            <ul className="flex flex-col gap-1.5 text-sm">
              <li className={r.withinLimit ? "text-primary" : "text-danger"}>
                {r.withinLimit ? "✓ Strata na SL mieści się w limicie ryzyka." : "✗ Strata na SL przekracza limit — zmniejsz wolumen lub zbliż SL."}
              </li>
              <li className={r.rr >= 1.3 ? "text-primary" : "text-danger"}>
                {r.rr >= 1.3 ? "✓ Relacja zysku do ryzyka ≥ 1,3 : 1." : "✗ Relacja poniżej 1,3 : 1 — odsuń TP albo zrezygnuj."}
              </li>
              <li className={num(volume) <= 0.02 ? "text-primary" : "text-danger"}>
                {num(volume) <= 0.02 ? "✓ Wolumen w Twojej zasadzie (max 0,02)." : "✗ Wolumen powyżej własnej zasady (max 0,02)."}
              </li>
            </ul>
          </>
        )}
      </Card>
      <p className="text-xs text-foreground-muted">
        Wartość PLN na 1 USD to przybliżenie (0,01 lota ≈ 10 baryłek ≈ ok. 40 PLN) i zależy od kursu USD/PLN. Nie
        uwzględnia spreadu ani poślizgu. Materiał edukacyjny, nie porada inwestycyjna.
      </p>
    </div>
  );
}
