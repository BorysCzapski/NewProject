// ============================================================================
// app/(main)/matura/ustawienia/page.tsx
// Change the exam język and poziom after the first-run choice.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ExamPreferencesForm } from "@/components/matura/exam-preferences-form";

export default async function MaturaUstawieniaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Ustawienia matury" subtitle="Zmień w dowolnym momencie" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Card>
          <CardTitle>Do jakiej matury się przygotowujesz?</CardTitle>
          <CardDescription className="mt-1">
            Zmiana przełącza wszystkie działy na treści właściwe dla nowego języka i poziomu. Twoje dotychczasowe
            wyniki zostają — po powrocie zastaniesz je dokładnie tam, gdzie je zostawiłeś.
          </CardDescription>
          <div className="mt-4">
            <ExamPreferencesForm currentLanguage={settings?.language} currentLevel={settings?.level} />
          </div>
        </Card>
      </div>
    </div>
  );
}
