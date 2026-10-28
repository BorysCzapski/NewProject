// ============================================================================
// lib/lexicon/next-due.ts
// Opis terminu najbliższej powtórki dla pustej sesji ("jutro", "za 3 dni").
// Czysta funkcja, bez I/O, żeby dało się ją sprawdzić bez bazy.
// ============================================================================

/**
 * Terminy w harmonogramie Leitnera są co do doby (1, 2, 4, 9, 20, 45 dni), więc
 * liczymy w pełnych dobach, zaokrąglając W GÓRĘ: powtórka za 20 godzin to
 * "jutro", a nie "dziś". Zwraca null, gdy nie ma żadnej zaplanowanej powtórki.
 */
export function describeNextDue(nextDueAt: string | null, now: Date = new Date()): string | null {
  if (!nextDueAt) return null;
  const due = new Date(nextDueAt).getTime();
  if (!Number.isFinite(due)) return null;

  const days = Math.ceil((due - now.getTime()) / 86_400_000);
  if (days <= 0) return "już teraz";
  if (days === 1) return "jutro";
  return `za ${days} dni`;
}
