// ============================================================================
// app/(main)/matura/nauka/page.tsx
// "Nauka" hub: the 4 exam parts for the student's chosen poziom. Redirects
// to the dashboard (which shows the picker) if no poziom is set yet.
// ============================================================================
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { getSectionsWithProgress } from "@/lib/matura/progress";
import { PageHeader } from "@/components/layout/page-header";
import { SectionList } from "@/components/matura/section-list";

export default async function MaturaNaukaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const sections = await getSectionsWithProgress(supabase, profile.id, settings.level);

  return (
    <div>
      <PageHeader title="Nauka" subtitle="Wybierz część egzaminu, żeby zacząć" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <SectionList sections={sections} />
      </div>
    </div>
  );
}
