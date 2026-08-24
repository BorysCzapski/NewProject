// ============================================================================
// lib/silownia/constants.ts
// Statyczne słowniki dla "Siłowni": domyślne warianty dnia treningowego (spec:
// „1️⃣ Triceps/Klatka/Barki, 2️⃣ Biceps/Plecy/Przedramiona") i etykiety celu.
// Bez next/react — używane po obu stronach.
// ============================================================================
import type { GymGoal } from "@/lib/types/database";

export interface SplitOption {
  id: string;
  label: string;
}

/** Proponowane warianty dnia — pole w formularzu jest wolnym tekstem, więc to
 * tylko skróty do wyboru jednym kliknięciem, nie enum w bazie. */
export const SPLIT_PRESETS: SplitOption[] = [
  { id: "a", label: "Triceps / Klatka / Barki" },
  { id: "b", label: "Biceps / Plecy / Przedramiona" },
  { id: "nogi", label: "Nogi" },
  { id: "cardio", label: "Cardio" },
];

export const GOAL_LABELS: Record<GymGoal, string> = {
  redukcja: "Redukcja",
  masa: "Budowa masy",
  utrzymanie: "Utrzymanie formy",
  wytrzymalosc: "Wytrzymałość",
};

export const GOALS: GymGoal[] = ["redukcja", "masa", "utrzymanie", "wytrzymalosc"];
