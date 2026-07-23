// ============================================================================
// app/(main)/paragony/etf/page.tsx
// ETF portfolio dashboard: value-over-time chart, allocation donut, headline
// metrics (return/CAGR/volatility/drawdown/concentration) and a sortable
// holdings table. All numbers come straight from getPortfolioOverview.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getPortfolioOverview } from "@/lib/paragony/etf-queries";
import { PageHeader } from "@/components/layout/page-header";
import { EtfDashboard } from "@/components/paragony/etf-dashboard";

export default async function EtfPortfolioPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const overview = await getPortfolioOverview(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Portfel ETF" subtitle="Wartość, alokacja i wyniki" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <EtfDashboard overview={overview} />
      </div>
    </div>
  );
}
