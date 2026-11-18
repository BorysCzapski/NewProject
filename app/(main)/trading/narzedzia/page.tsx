// ============================================================================
// app/(main)/trading/narzedzia/page.tsx
// Kalkulator pozycji i lista kontrolna przed wejściem.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { Calculator } from "@/components/trading/calculator";
import { Checklist } from "@/components/trading/checklist";
import { PRE_TRADE_CHECKLIST } from "@/lib/trading/content";

export default async function NarzedziaPage() {
  await requireProfile();
  return (
    <div>
      <PageHeader title="Kalkulator" subtitle="Najpierw stop, potem wolumen" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Calculator />
        <Checklist items={PRE_TRADE_CHECKLIST} />
      </div>
    </div>
  );
}
