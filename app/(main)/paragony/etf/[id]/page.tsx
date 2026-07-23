// ============================================================================
// app/(main)/paragony/etf/[id]/page.tsx
// Single ETF holding detail: metadata, current position, full buy/sell and
// dividend history with add/delete controls — see getHoldingDetail.
// ============================================================================
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getHoldingDetail } from "@/lib/paragony/etf-queries";
import { PageHeader } from "@/components/layout/page-header";
import { EtfHoldingDetail } from "@/components/paragony/etf-holding-detail";

export default async function EtfHoldingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireProfile();
  const supabase = await createClient();

  const detail = await getHoldingDetail(supabase, id);
  if (!detail) notFound();

  return (
    <div>
      <PageHeader title={detail.holding.ticker.toUpperCase()} subtitle={detail.holding.name ?? undefined} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <EtfHoldingDetail detail={detail} />
      </div>
    </div>
  );
}
