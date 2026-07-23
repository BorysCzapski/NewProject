// ============================================================================
// app/(main)/paragony/cykliczne/page.tsx
// Rachunki cykliczne — full management screen for recurring bills, including
// paused ones. getUpcomingRecurring (lib/paragony/queries.ts) only returns
// is_active=true rows for the dashboard widget, so this screen queries
// recurring_transactions directly to also surface suspended items.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAccountsWithBalances, getCategories } from "@/lib/paragony/queries";
import { PageHeader } from "@/components/layout/page-header";
import { RecurringManager, type RecurringItem } from "@/components/paragony/recurring-manager";
import type { RecurringTransaction } from "@/lib/types/database";

export default async function RecurringPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [{ data: recurringRows, error }, categories, accounts] = await Promise.all([
    supabase
      .from("recurring_transactions")
      .select("*, budget_categories(name), accounts(name)")
      .eq("user_id", profile.id)
      .order("next_due_date", { ascending: true }),
    getCategories(supabase, profile.id),
    getAccountsWithBalances(supabase, profile.id),
  ]);

  if (error) console.error("[paragony] recurring list failed:", error);

  const items: RecurringItem[] = (recurringRows ?? []).map((row) => ({
    ...(row as RecurringTransaction),
    category_name: (row.budget_categories as { name: string } | null)?.name ?? null,
    account_name: (row.accounts as { name: string } | null)?.name ?? "?",
  }));

  return (
    <div>
      <PageHeader title="Rachunki cykliczne" subtitle="Zarządzaj cyklicznymi wpływami i wydatkami" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <RecurringManager items={items} categories={categories} accounts={accounts} />
      </div>
    </div>
  );
}
