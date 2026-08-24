// ============================================================================
// app/(main)/silownia/suplementy/page.tsx
// Dziennik suplementacji: nazwa, dawka, pora dnia. Patrz
// components/silownia/supplement-log.tsx.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { listSupplements } from "@/lib/silownia/queries";
import { todayKey } from "@/lib/silownia/format";
import { PageHeader } from "@/components/layout/page-header";
import { SupplementLog } from "@/components/silownia/supplement-log";

export default async function SuplementyPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const today = todayKey();

  const entries = await listSupplements(supabase, profile.id, { limit: 100 });

  return (
    <div>
      <PageHeader title="Suplementy" subtitle="Dziennik suplementacji" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        <SupplementLog entries={entries} today={today} />
      </div>
    </div>
  );
}
