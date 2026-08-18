// ============================================================================
// app/(main)/matura/ustawienia/page.tsx
// Change poziom matury after the first-run choice.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LevelPickerForm } from "@/components/matura/level-picker-form";

export default async function MaturaUstawieniaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Poziom matury" subtitle="Zmień w dowolnym momencie" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Card>
          <CardTitle>Do jakiej matury się przygotowujesz?</CardTitle>
          <CardDescription className="mt-1">
            Zmiana poziomu przełącza dział „Znajomość środków językowych&rdquo; na zadania właściwe dla nowego poziomu.
          </CardDescription>
          <div className="mt-4">
            <LevelPickerForm currentLevel={settings?.level} />
          </div>
        </Card>
      </div>
    </div>
  );
}
