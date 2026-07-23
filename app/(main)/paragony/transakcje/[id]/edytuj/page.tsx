// ============================================================================
// app/(main)/paragony/transakcje/[id]/edytuj/page.tsx
// Edit (or delete) a single manual ledger entry. The transaction row itself
// is fetched directly (listTransactions joins for display, not for editing
// the raw editable fields), while accounts/categories reuse the same
// queries as the "new transaction" screen.
// ============================================================================
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAccountsWithBalances, getCategories } from "@/lib/paragony/queries";
import { PageHeader } from "@/components/layout/page-header";
import { TransactionForm } from "@/components/paragony/transaction-form";
import type { Transaction } from "@/lib/types/database";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const [accounts, categories] = await Promise.all([
    getAccountsWithBalances(supabase, profile.id),
    getCategories(supabase, profile.id),
  ]);

  const { data: transaction, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !transaction) notFound();

  return (
    <div>
      <PageHeader title="Edytuj transakcję" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <TransactionForm
          accounts={accounts}
          categories={categories}
          transaction={transaction as Transaction}
          transactionId={id}
        />
      </div>
    </div>
  );
}
