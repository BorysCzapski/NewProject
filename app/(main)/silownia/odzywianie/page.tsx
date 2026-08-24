// ============================================================================
// app/(main)/silownia/odzywianie/page.tsx
// Dziennik posiłków: opis → oszacowanie kalorii/makr przez AI → zapis.
// Patrz components/silownia/meal-log.tsx i lib/silownia/ai.ts.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { listMeals } from "@/lib/silownia/queries";
import { todayKey } from "@/lib/silownia/format";
import { PageHeader } from "@/components/layout/page-header";
import { MealLog } from "@/components/silownia/meal-log";

export default async function OdzywianiePage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const today = todayKey();

  const meals = await listMeals(supabase, profile.id, { limit: 100 });

  return (
    <div>
      <PageHeader title="Odżywianie" subtitle="Kalorie i makroskładniki (AI)" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        <MealLog meals={meals} today={today} />
      </div>
    </div>
  );
}
