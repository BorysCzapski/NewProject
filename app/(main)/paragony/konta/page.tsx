// ============================================================================
// app/(main)/paragony/konta/page.tsx
// Accounts management screen: lists every account with its computed balance
// and hands off to AccountsManager for create/edit/delete.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAccountsWithBalances } from "@/lib/paragony/queries";
import { PageHeader } from "@/components/layout/page-header";
import { AccountsManager } from "@/components/paragony/accounts-manager";

export default async function AccountsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const accounts = await getAccountsWithBalances(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Konta" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <AccountsManager accounts={accounts} />
      </div>
    </div>
  );
}
