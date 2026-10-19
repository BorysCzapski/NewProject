// ============================================================================
// app/(main)/silownia/page.tsx
// Ekran główny "Siłowni": nawodnienie dziś, status dzisiejszego treningu (+
// sugestia co trenować), szybkie liczby (tydzień treningów, kalorie dziś,
// suplementy dziś) i skróty do pełnych dzienników. Ten sam kształt co
// app/(main)/tracker/page.tsx: jedno pytanie na ekran — "co się dziś dzieje".
// ============================================================================
import Link from "next/link";
import { ArrowRight, Dumbbell, Flame, Pill } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getLastWorkout, getOverview } from "@/lib/silownia/queries";
import { suggestNextSplit } from "@/lib/silownia/suggestion";
import { todayKey } from "@/lib/silownia/format";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { HydrationWidget } from "@/components/silownia/hydration-widget";

export default async function SilowniaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const today = todayKey();

  const [overview, lastWorkout] = await Promise.all([
    getOverview(supabase, profile.id, today),
    getLastWorkout(supabase, profile.id),
  ]);

  const suggestedSplit = suggestNextSplit(lastWorkout);

  return (
    <div>
      <PageHeader title="Siłownia" subtitle="Trening, nawodnienie, odżywianie" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        <HydrationWidget
          initialConsumedMl={overview.hydration.consumedMl}
          recommendedMl={overview.hydration.recommendedMl}
          isFallback={overview.hydration.isFallback}
          wasClamped={overview.hydration.wasClamped}
        />

        <Link href="/silownia/treningi">
          <Card className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Dumbbell className="h-6 w-6 shrink-0 text-primary" />
              <div>
                {overview.todayWorkout ? (
                  <>
                    <CardTitle>{overview.todayWorkout.split_label}</CardTitle>
                    <CardDescription>Trening dziś zapisany ✓</CardDescription>
                  </>
                ) : (
                  <>
                    <CardTitle>Dziś jeszcze nic</CardTitle>
                    <CardDescription>Sugerowany trening: {suggestedSplit}</CardDescription>
                  </>
                )}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-foreground-muted" />
          </Card>
        </Link>

        <section className="grid grid-cols-3 gap-2">
          <SummaryTile label="Treningi (tydz.)" value={String(overview.weekWorkoutCount)} />
          <SummaryTile
            label="Kalorie dziś"
            value={overview.todayMealsCount > 0 ? `${overview.todayMealsCalories}` : "—"}
          />
          <SummaryTile label="Suplementy dziś" value={String(overview.todaySupplementsCount)} />
        </section>

        <div className="grid grid-cols-2 gap-3">
          <QuickLink href="/silownia/odzywianie" icon={Flame} label="Odżywianie" />
          <QuickLink href="/silownia/suplementy" icon={Pill} label="Suplementy" />
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <Card className="flex flex-col gap-0.5 p-3">
      <span className="text-xs text-foreground-muted">{label}</span>
      <span className="text-lg font-bold text-foreground">{value}</span>
    </Card>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Flame;
  label: string;
}) {
  return (
    <Link href={href}>
      <Card className="flex items-center gap-2.5">
        <Icon className="h-5 w-5 shrink-0 text-primary" />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </Card>
    </Link>
  );
}
