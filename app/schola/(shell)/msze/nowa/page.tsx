// ============================================================================
// app/schola/(shell)/msze/nowa/page.tsx
// ============================================================================
import { ScholaPageHeader } from "@/components/schola/page-header";
import { NewMassPlanForm } from "@/components/schola/new-mass-plan-form";

export default function NewScholaMassPlanPage() {
  return (
    <div>
      <ScholaPageHeader title="Nowy plan Mszy" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <NewMassPlanForm />
      </div>
    </div>
  );
}
