// ============================================================================
// lib/silownia/hydration.ts
// Kalkulator dziennej rekomendacji nawodnienia. Czysta funkcja (bez I/O), żeby
// dało się jej użyć zarówno na serwerze (dashboard), jak i przetestować w
// izolacji.
//
// Spec wymieniał też warunki atmosferyczne jako wejście — pominięte: w tym
// środowisku nie ma klucza do żadnego API pogodowego, a fałszywa precyzja
// ("rekomendacja liczona z pogody" bez realnych danych pogodowych) byłaby
// gorsza niż jawne pominięcie tego czynnika.
//
// Formuła: 33 ml na kg masy ciała (standardowa wytyczna nawodnieniowa) +
// bonus za intensywność treningu (12 ml/min, tylko za dzisiejszy trening).
// Wynik jest CLAMPOWANY do [1500, 5000] ml — spec wprost wymaga sygnalizować
// nierealistyczne rekomendacje, więc zamiast pokazać np. 8 litrów przy wpisanej
// przez pomyłkę wadze 250 kg, wynik jest przycinany i `wasClamped` mówi o tym
// wywołującemu (patrz UI w hydration-widget.tsx).
// ============================================================================

export const HYDRATION_DISCLAIMER =
  "Orientacyjne wyliczenie, nie porada medyczna — przy chorobach nerek/serca lub innych ograniczeniach płynowych skonsultuj się z lekarzem.";

const ML_PER_KG = 33;
const ML_PER_WORKOUT_MINUTE = 12;
const FALLBACK_ML = 2000;
const MIN_ML = 1500;
const MAX_ML = 5000;

export interface HydrationRecommendation {
  recommendedMl: number;
  /** True gdy brak wagi w profilu — wynik to stały fallback, nie wyliczenie. */
  isFallback: boolean;
  /** True gdy surowy wynik wykroczył poza [MIN_ML, MAX_ML] i został przycięty. */
  wasClamped: boolean;
}

export function recommendedHydrationMl(
  weightKg: number | null,
  workoutMinutesToday: number
): HydrationRecommendation {
  if (!weightKg || weightKg <= 0) {
    return { recommendedMl: FALLBACK_ML, isFallback: true, wasClamped: false };
  }

  const raw = Math.round(weightKg * ML_PER_KG + Math.max(0, workoutMinutesToday) * ML_PER_WORKOUT_MINUTE);
  const clamped = Math.min(MAX_ML, Math.max(MIN_ML, raw));

  return { recommendedMl: clamped, isFallback: false, wasClamped: clamped !== raw };
}
