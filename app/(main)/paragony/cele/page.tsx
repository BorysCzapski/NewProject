// ============================================================================
// app/(main)/paragony/cele/page.tsx
// Savings goals screen: per-goal progress cards with contribute/withdraw/
// edit/delete, plus a form to create new goals. All goal math (progress
// percent, estimated completion date) comes from getGoalsWithProgress.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getGoalsWithProgress } from "@/lib/paragony/queries";
import { PageHeader } from "@/components/layout/page-header";
import { GoalsManager } from "@/components/paragony/goals-manager";

export default async function SavingsGoalsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const goals = await getGoalsWithProgress(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Cele oszczędnościowe" subtitle="Odkładaj pieniądze i śledź postępy" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <GoalsManager goals={goals} />
      </div>
    </div>
  );
}
