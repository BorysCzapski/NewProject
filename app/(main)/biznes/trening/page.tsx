// ============================================================================
// app/(main)/biznes/trening/page.tsx
// Thin server shell for the Trening screen; all interaction lives in the
// client component.
// ============================================================================
import { PageHeader } from "@/components/layout/page-header";
import { TrainingClient } from "@/components/biznes/training-client";

export default function BiznesTrainingPage() {
  return (
    <div>
      <PageHeader title="Trening" subtitle="Ćwicz z natychmiastową odpowiedzią" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <TrainingClient />
      </div>
    </div>
  );
}
