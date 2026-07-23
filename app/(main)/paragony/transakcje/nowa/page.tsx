// ============================================================================
// app/(main)/paragony/transakcje/nowa/page.tsx
// "Dodaj transakcję" — manual ledger entry (income/expense/transfer) via
// TransactionForm.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAccountsWithBalances, getCategories } from "@/lib/paragony/queries";
import { PageHeader } from "@/components/layout/page-header";
import { TransactionForm } from "@/components/paragony/transaction-form";

export default async function NewTransactionPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [accounts, categories] = await Promise.all([
    getAccountsWithBalances(supabase, profile.id),
    getCategories(supabase, profile.id),
  ]);

  return (
    <div>
      <PageHeader title="Nowa transakcja" subtitle="Dodaj ręczny wpis do rejestru" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <TransactionForm accounts={accounts} categories={categories} />
      </div>
    </div>
  );
}
