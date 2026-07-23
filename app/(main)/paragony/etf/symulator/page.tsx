// ============================================================================
// app/(main)/paragony/etf/symulator/page.tsx
// "What if" simulator entry point: fetches the current portfolio overview
// (same data as the ETF dashboard) so the client component can recompute
// hypothetical buy/sell impact instantly, with no DB write until confirmed.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getPortfolioOverview } from "@/lib/paragony/etf-queries";
import { PageHeader } from "@/components/layout/page-header";
import { EtfSimulator } from "@/components/paragony/etf-simulator";

export default async function EtfSimulatorPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const overview = await getPortfolioOverview(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Symulator „co jeśli”" subtitle="Bez zapisu do bazy, dopóki nie potwierdzisz" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <EtfSimulator holdings={overview.holdings} totalValue={overview.totalValue} />
      </div>
    </div>
  );
}
