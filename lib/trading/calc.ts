// ============================================================================
// lib/trading/calc.ts
// Czysta matematyka pozycji: ryzyko, zysk, relacja TP:SL, minimalna
// skuteczność i maksymalny wolumen dla limitu ryzyka.
// ============================================================================

export interface PositionInput {
  side: "long" | "short";
  entry: number;
  sl: number;
  tp: number;
  /** Wolumen w lotach (np. 0,01). */
  volume: number;
  /** Wartość 1 USD ruchu ceny dla 0,01 lota, w PLN (domyślnie ~40). */
  plnPerUsdPer001: number;
  capital: number;
  riskPct: number;
}

export interface PositionResult {
  valid: boolean;
  error?: string;
  slDistance: number;
  tpDistance: number;
  riskPln: number;
  rewardPln: number;
  rr: number;
  minWinRatePct: number;
  riskLimitPln: number;
  riskOfCapitalPct: number;
  /** Największy wolumen (krok 0,01), który mieści się w limicie ryzyka. */
  maxVolume: number;
  withinLimit: boolean;
}

export function calcPosition(i: PositionInput): PositionResult {
  const empty: PositionResult = {
    valid: false,
    slDistance: 0,
    tpDistance: 0,
    riskPln: 0,
    rewardPln: 0,
    rr: 0,
    minWinRatePct: 0,
    riskLimitPln: 0,
    riskOfCapitalPct: 0,
    maxVolume: 0,
    withinLimit: false,
  };

  const nums = [i.entry, i.sl, i.tp, i.volume, i.plnPerUsdPer001, i.capital, i.riskPct];
  if (nums.some((n) => !Number.isFinite(n)) || i.entry <= 0 || i.volume <= 0 || i.plnPerUsdPer001 <= 0) {
    return { ...empty, error: "Uzupełnij cenę wejścia, wolumen i kapitał." };
  }

  const dir = i.side === "long" ? 1 : -1;
  const slDistance = (i.entry - i.sl) * dir;
  const tpDistance = (i.tp - i.entry) * dir;

  if (slDistance <= 0) {
    return {
      ...empty,
      error: i.side === "long" ? "Przy long SL musi być poniżej wejścia." : "Przy short SL musi być powyżej wejścia.",
    };
  }
  if (tpDistance <= 0) {
    return {
      ...empty,
      error: i.side === "long" ? "Przy long TP musi być powyżej wejścia." : "Przy short TP musi być poniżej wejścia.",
    };
  }

  const perUsdPerLot = (i.plnPerUsdPer001 / 0.01) * i.volume; // PLN na 1 USD dla tego wolumenu
  const riskPln = slDistance * perUsdPerLot;
  const rewardPln = tpDistance * perUsdPerLot;
  const riskLimitPln = (i.capital * i.riskPct) / 100;
  const maxVolume = Math.floor((riskLimitPln / (slDistance * (i.plnPerUsdPer001 / 0.01))) * 100 + 1e-9) / 100;

  return {
    valid: true,
    slDistance,
    tpDistance,
    riskPln,
    rewardPln,
    rr: tpDistance / slDistance,
    minWinRatePct: (slDistance / (slDistance + tpDistance)) * 100,
    riskLimitPln,
    riskOfCapitalPct: i.capital > 0 ? (riskPln / i.capital) * 100 : 0,
    maxVolume,
    withinLimit: riskPln <= riskLimitPln + 1e-9,
  };
}
