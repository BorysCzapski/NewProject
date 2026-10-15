// ============================================================================
// app/(main)/maturalnik/ustawienia/page.tsx
// Set/change the exam date that drives the countdown heatmap.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturalnikSettings } from "@/lib/maturalnik/settings";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ExamDateForm } from "@/components/maturalnik/exam-date-form";

export default async function MaturalnikUstawieniaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturalnikSettings(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Ustawienia" subtitle="Maturalnik" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Card>
          <CardTitle>Data matury</CardTitle>
          <CardDescription className="mt-1">
            Na jej podstawie liczymy odliczanie dni i rysujemy siatkę aktywności na stronie głównej.
          </CardDescription>
          <div className="mt-4">
            <ExamDateForm currentExamDate={settings?.exam_date ?? null} />
          </div>
        </Card>
      </div>
    </div>
  );
}
