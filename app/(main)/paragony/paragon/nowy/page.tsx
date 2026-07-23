// ============================================================================
// app/(main)/paragony/paragon/nowy/page.tsx
// Entry point for the receipt scan flow: fetches the account/category lookups
// the review screen needs, then hands off to the client-driven capture ->
// OCR -> review -> confirm flow (components/paragony/receipt-scan-flow.tsx).
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAccountsWithBalances, getCategories } from "@/lib/paragony/queries";
import { PageHeader } from "@/components/layout/page-header";
import { ReceiptScanFlow } from "@/components/paragony/receipt-scan-flow";

export default async function NewReceiptPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [accounts, categories] = await Promise.all([
    getAccountsWithBalances(supabase, profile.id),
    getCategories(supabase, profile.id, "expense"),
  ]);

  return (
    <div>
      <PageHeader title="Skanuj paragon" subtitle="Zrób zdjęcie lub wgraj plik" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <ReceiptScanFlow accounts={accounts} categories={categories} />
      </div>
    </div>
  );
}
