// ============================================================================
// lib/silownia/suggestion.ts
// "Sugestie treningowe": co trenować dziś, na podstawie ostatniego wpisu.
// Świadomie proste — naprzemienne A/B (spec pokazuje dokładnie dwa warianty:
// „1️⃣ Triceps/Klatka/Barki" i „2️⃣ Biceps/Plecy/Przedramiona") zamiast modelu
// AI: reguła jest w pełni przewidywalna, nie kosztuje zapytania do Groq i nie
// wymaga wyjaśniania użytkownikowi "dlaczego AI tak zdecydowało". Dni Nogi/
// Cardio/własne nie wchodzą w rotację — są traktowane jako "dzień dodatkowy",
// nie zaburzają naprzemienności A/B.
// ============================================================================
import { SPLIT_PRESETS } from "@/lib/silownia/constants";
import type { GymWorkout } from "@/lib/types/database";

const SPLIT_A = SPLIT_PRESETS[0].label;
const SPLIT_B = SPLIT_PRESETS[1].label;

export function suggestNextSplit(lastWorkout: GymWorkout | null): string {
  if (!lastWorkout) return SPLIT_A;
  if (lastWorkout.split_label === SPLIT_A) return SPLIT_B;
  if (lastWorkout.split_label === SPLIT_B) return SPLIT_A;
  // Ostatni dzień był Nogi/Cardio/własny — wracamy do rotacji od A.
  return SPLIT_A;
}
