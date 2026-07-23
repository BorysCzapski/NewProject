// ============================================================================
// app/(main)/paragony/etf/nowy/page.tsx
// "Dodaj ETF" — creates a new holding (or, for an already-held ticker, just
// another buy transaction — see addEtfHolding) via AddEtfHoldingForm.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { AddEtfHoldingForm } from "@/components/paragony/add-etf-holding-form";

export default async function NewEtfHoldingPage() {
  await requireProfile();

  return (
    <div>
      <PageHeader title="Dodaj ETF" subtitle="Nowa pozycja w portfelu" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <AddEtfHoldingForm />
      </div>
    </div>
  );
}
