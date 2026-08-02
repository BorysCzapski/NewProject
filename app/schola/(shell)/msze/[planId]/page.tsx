// ============================================================================
// app/schola/(shell)/msze/[planId]/page.tsx
// ============================================================================
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getScholaMassPlanDetail, listScholaSongs } from "@/lib/schola/queries";
import { ScholaPageHeader } from "@/components/schola/page-header";
import { MassPlanDetail } from "@/components/schola/mass-plan-detail";

export default async function ScholaMassPlanDetailPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  const supabase = await createClient();

  const [detail, allSongs] = await Promise.all([
    getScholaMassPlanDetail(supabase, planId),
    listScholaSongs(supabase),
  ]);
  if (!detail) notFound();

  return (
    <div>
      <ScholaPageHeader title={detail.plan.title} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <MassPlanDetail plan={detail.plan} items={detail.items} allSongs={allSongs} />
      </div>
    </div>
  );
}
