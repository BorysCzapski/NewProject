// ============================================================================
// app/schola/(shell)/msze/page.tsx
// ============================================================================
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listScholaMassPlans } from "@/lib/schola/queries";
import { ScholaPageHeader } from "@/components/schola/page-header";
import { Card, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const dateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });

export default async function ScholaMassPlansPage() {
  const supabase = await createClient();
  const plans = await listScholaMassPlans(supabase);

  return (
    <div>
      <ScholaPageHeader
        title="Plany Mszy"
        action={
          <Link href="/schola/msze/nowa">
            <Button size="sm">
              <Plus className="h-4 w-4" /> Dodaj
            </Button>
          </Link>
        }
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        {plans.length === 0 ? (
          <Card>
            <CardDescription>Nie masz jeszcze żadnych planów Mszy.</CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {plans.map((plan) => (
              <Link
                key={plan.id}
                href={`/schola/msze/${plan.id}`}
                className="flex flex-col gap-0.5 rounded-(--radius-control) border border-border bg-surface px-4 py-3 active:opacity-80"
              >
                <span className="font-medium text-foreground">{plan.title}</span>
                <span className="text-xs text-foreground-muted">
                  {dateFormatter.format(new Date(plan.mass_date))}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
