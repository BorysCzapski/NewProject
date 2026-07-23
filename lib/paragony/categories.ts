// ============================================================================
// lib/paragony/categories.ts
// Fixed list of the seeded default category names (see
// supabase/migrations/0008_paragony_budzet_etf.sql), used to steer the OCR
// categorization prompt and as icon-name lookups in the UI. The database is
// the source of truth for which categories actually exist (users can add
// their own beyond this starter set) — this is just the built-in names.
// ============================================================================

export const DEFAULT_EXPENSE_CATEGORIES = [
  "Spożywcze",
  "Transport",
  "Rozrywka",
  "Rachunki",
  "Zdrowie",
  "Dom",
  "Odzież",
  "Inne wydatki",
] as const;

export const DEFAULT_INCOME_CATEGORIES = ["Wynagrodzenie", "Zwrot", "Inne przychody"] as const;

/** lucide-react icon names (see components/paragony/category-icon.tsx). */
export const CATEGORY_ICONS: Record<string, string> = {
  Spożywcze: "ShoppingCart",
  Transport: "Car",
  Rozrywka: "Popcorn",
  Rachunki: "FileText",
  Zdrowie: "HeartPulse",
  Dom: "Home",
  Odzież: "Shirt",
  "Inne wydatki": "MoreHorizontal",
  Wynagrodzenie: "Banknote",
  Zwrot: "Undo2",
  "Inne przychody": "PlusCircle",
};

export function normalizeCategoryName(name: string): string {
  return name.trim().toLowerCase();
}
