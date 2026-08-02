// ============================================================================
// app/schola/(shell)/page.tsx
// Schola home: a welcome, the next few Mass plans, and quick actions.
// ============================================================================
import Link from "next/link";
import { Plus, Music4, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireScholaMember } from "@/lib/schola/get-member";
import { listScholaMassPlans } from "@/lib/schola/queries";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const dateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });

export default async function ScholaHomePage() {
  const member = await requireScholaMember();
  const supabase = await createClient();
  const plans = (await listScholaMassPlans(supabase)).slice(0, 5);

  return (
    <div className="mx-auto max-w-lg px-5 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Cześć, {member.display_name}!</h1>
        <p className="text-sm text-foreground-muted">Śpiewnik i plany Mszy scholi</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Link href="/schola/piosenki/nowa">
          <Button className="w-full">
            <Music4 className="h-4 w-4" /> Nowa pieśń
          </Button>
        </Link>
        <Link href="/schola/msze/nowa">
          <Button variant="secondary" className="w-full">
            <CalendarDays className="h-4 w-4" /> Nowy plan Mszy
          </Button>
        </Link>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <CardTitle>Najbliższe plany Mszy</CardTitle>
          <Link href="/schola/msze" className="text-sm font-medium text-primary">
            Zobacz wszystkie
          </Link>
        </div>
        {plans.length === 0 ? (
          <CardDescription>Nie masz jeszcze żadnych planów Mszy.</CardDescription>
        ) : (
          <div className="flex flex-col gap-2">
            {plans.map((plan) => (
              <Link
                key={plan.id}
                href={`/schola/msze/${plan.id}`}
                className="flex flex-col gap-0.5 rounded-(--radius-control) bg-surface-muted px-3.5 py-3 active:opacity-80"
              >
                <span className="font-medium text-foreground">{plan.title}</span>
                <span className="text-xs text-foreground-muted">
                  {dateFormatter.format(new Date(plan.mass_date))}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Link
        href="/schola/piosenki"
        className="mt-4 flex items-center justify-center gap-2 rounded-(--radius-card) border border-border bg-surface px-4 py-3.5 text-sm font-medium text-foreground active:opacity-80"
      >
        <Plus className="h-4 w-4" /> Przeglądaj śpiewnik
      </Link>
    </div>
  );
}
