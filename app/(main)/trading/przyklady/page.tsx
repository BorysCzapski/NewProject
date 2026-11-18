// ============================================================================
// app/(main)/trading/przyklady/page.tsx
// Trener decyzji na scenariuszach (oparty na przykładowych transakcjach).
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { ScenarioTrainer } from "@/components/trading/scenario-trainer";
import { SCENARIOS } from "@/lib/trading/content";

export default async function PrzykladyPage() {
  await requireProfile();
  return (
    <div>
      <PageHeader title="Przykłady" subtitle="Co robisz w tej sytuacji?" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <ScenarioTrainer scenarios={SCENARIOS} />
      </div>
    </div>
  );
}
