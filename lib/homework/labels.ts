// ============================================================================
// lib/homework/labels.ts
// Turns a homework row's type + config into a clear, human-readable Polish
// requirement sentence, so students see EXACTLY what they must do (e.g.
// "Opanuj 80% słówek z kategorii „jedzenie”") instead of a vague title, and
// admins can sanity-check what they created. Pure — safe on client or server.
// ============================================================================
import type { Homework, TrainingModule } from "@/lib/types/database";

const MODULE_LABELS: Record<TrainingModule, string> = {
  vocabulary: "słówek",
  grammar: "gramatyki",
  writing: "pisania",
};

function num(v: unknown, fallback = 1): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** One-line, concrete description of what completing this homework requires. */
export function homeworkRequirementText(hw: Pick<Homework, "type" | "config">): string {
  const c = (hw.config ?? {}) as Record<string, unknown>;

  switch (hw.type) {
    case "vocabulary_mastery": {
      const pct = Math.round(num(c.threshold, 0.8) * 100);
      const cat = typeof c.category === "string" && c.category ? c.category : null;
      return cat
        ? `Opanuj co najmniej ${pct}% słówek z kategorii „${cat}”.`
        : `Opanuj co najmniej ${pct}% wszystkich słówek na Twoim poziomie.`;
    }
    case "training_count": {
      const mod = MODULE_LABELS[c.module as TrainingModule] ?? "treningów";
      return `Wykonaj ${num(c.count, 5)} treningów ${mod}.`;
    }
    case "reading_count":
      return `Przeczytaj ${num(c.count, 3)} teksty i odpowiedz na pytania.`;
    case "flashcards_count":
      return `Zrób ${num(c.count, 3)} sesje fiszek.`;
    case "grammar_topic":
      return `Rozwiąż poprawnie ćwiczenia z przypisanego tematu gramatycznego.`;
    case "writing_task":
      return c.task_id
        ? `Napisz i wyślij przypisane zadanie pisemne.`
        : `Napisz i wyślij dowolne zadanie pisemne.`;
    case "song_translation":
      return `Przetłumacz poprawnie wszystkie linijki przypisanej piosenki.`;
    case "listening_task":
      return `Uzupełnij luki w przypisanym nagraniu ze słuchania.`;
    case "matching_game": {
      const cat = typeof c.category === "string" && c.category ? c.category : null;
      return cat
        ? `Zagraj ${num(c.count, 1)} razy w „łączenie tłumaczeń” (kategoria „${cat}”).`
        : `Zagraj ${num(c.count, 1)} razy w „łączenie tłumaczeń”.`;
    }
    default:
      return "Wykonaj zadanie.";
  }
}
