// ============================================================================
// lib/fiszki/mode-state.ts
// Czysta logika menu trybów: które tryby są dostępne dla materiału i co pokazać
// pod ich opisem. Osobno od strony serwerowej, żeby dało się ją przetestować bez
// bazy. Importuje tylko lib/fiszki/modes (też czysty).
// ============================================================================
import {
  FISZKI_MODES,
  LEVEL_UNSUPPORTED_REASON,
  MIN_PRACTICE_ENTRIES,
  modeSupported,
  type FiszkiModeId,
  type MaterialKind,
} from "@/lib/fiszki/modes";

/** Liczby potrzebne menu — wyciągnięte z zapytań leksykonu przez stronę. */
export interface DeckStats {
  /** Postęp w "Znaczeniach": cała talia. */
  meanings: { started: number; total: number; due: number };
  /** Pisownia / Trening: tylko hasła z tłumaczeniem ("available"). */
  spelling: { available: number; started: number; due: number } | null;
  recall: { available: number; started: number; due: number } | null;
}

export interface ModeState {
  /** Dlaczego tryb jest niedostępny; null = można wejść. */
  blocked: string | null;
  /** Krótki wiersz ze stanem postępu pod opisem. */
  stats: string | null;
}

const NEEDS_TRANSLATED = "Najpierw poznaj kilka słów w „Znaczeniach” — tu ćwiczysz tylko te z tłumaczeniem.";
const TOO_FEW = "Za mało słów z tłumaczeniem — najpierw poznaj kilka w „Znaczeniach”.";

function due(count: number): string {
  return count > 0 ? ` • ${count} do powtórki` : "";
}

export function modeStates(kind: MaterialKind, deck: DeckStats | null): Record<FiszkiModeId, ModeState> {
  const result = {} as Record<FiszkiModeId, ModeState>;
  for (const mode of FISZKI_MODES) {
    if (!modeSupported(kind, mode.id)) {
      result[mode.id] = { blocked: LEVEL_UNSUPPORTED_REASON, stats: null };
      continue;
    }
    if (!deck) {
      // Słownictwo wg poziomu: liczby ma sama strona trenera.
      result[mode.id] = { blocked: null, stats: null };
      continue;
    }
    switch (mode.id) {
      case "znaczenia":
        result.znaczenia = {
          blocked: null,
          stats: `${deck.meanings.started}/${deck.meanings.total} poznanych${due(deck.meanings.due)}`,
        };
        break;
      case "pisownia":
      case "trening": {
        const skill = mode.id === "pisownia" ? deck.spelling : deck.recall;
        const available = skill?.available ?? 0;
        result[mode.id] =
          available === 0
            ? { blocked: NEEDS_TRANSLATED, stats: null }
            : {
                blocked: null,
                stats: `${skill?.started ?? 0}/${available} ćwiczonych${due(skill?.due ?? 0)}`,
              };
        break;
      }
      default: {
        // Tryby swobodne: liczba gotowych słów jest wspólna (te z tłumaczeniem).
        const ready = deck.spelling?.available ?? deck.recall?.available ?? 0;
        result[mode.id] =
          ready < MIN_PRACTICE_ENTRIES
            ? { blocked: TOO_FEW, stats: null }
            : { blocked: null, stats: `${ready} słów do ćwiczenia` };
      }
    }
  }
  return result;
}
