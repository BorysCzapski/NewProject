// ============================================================================
// app/(main)/paragony/budzet/page.tsx
// Monthly budget screen: plan vs actual per expense category, driven by
// rok/miesiac searchParams (default to the current calendar month) so the
// prev/next-month header links are plain navigations, not client state.
// ============================================================================
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getBudgetVsActual, getCategories, listTransactions } from "@/lib/paragony/queries";
import { PageHeader } from "@/components/layout/page-header";
import { BudgetChart } from "@/components/paragony/budget-chart";

const MONTH_NAMES = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień",
];

function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const total = year * 12 + (month - 1) + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 + 1 };
}

export default async function BudzetPage({
  searchParams,
}: {
  searchParams: Promise<{ rok?: string; miesiac?: string }>;
}) {
  const { rok, miesiac } = await searchParams;
  const now = new Date();
  const year = rok ? parseInt(rok, 10) : now.getFullYear();
  const month = miesiac ? parseInt(miesiac, 10) : now.getMonth() + 1;

  const profile = await requireProfile();
  const supabase = await createClient();

  const [lines, transactions, categories] = await Promise.all([
    getBudgetVsActual(supabase, profile.id, year, month),
    listTransactions(supabase, profile.id, { year, month }),
    getCategories(supabase, profile.id, "expense"),
  ]);

  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);

  return (
    <div>
      <PageHeader
        title={`Budżet na ${MONTH_NAMES[month - 1]} ${year}`}
        subtitle="Plan vs wykonanie"
        action={
          <div className="flex items-center gap-1">
            <Link
              href={`/paragony/budzet?rok=${prev.year}&miesiac=${prev.month}`}
              aria-label="Poprzedni miesiąc"
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted active:bg-surface-muted"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <Link
              href={`/paragony/budzet?rok=${next.year}&miesiac=${next.month}`}
              aria-label="Następny miesiąc"
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted active:bg-surface-muted"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        }
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <BudgetChart
          lines={lines}
          transactions={transactions}
          categories={categories}
          year={year}
          month={month}
        />
      </div>
    </div>
  );
}
