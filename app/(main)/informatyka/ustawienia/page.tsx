// ============================================================================
// app/(main)/informatyka/ustawienia/page.tsx
// Set/change the exam date that drives the countdown heatmap.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getInformatykaSettings } from "@/lib/informatyka/settings";
import { setExamDate } from "@/lib/informatyka/actions";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ExamDateForm } from "@/components/exam/exam-date-form";

export default async function InformatykaUstawieniaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getInformatykaSettings(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Ustawienia" subtitle="Informatyka" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Card>
          <CardTitle>Data matury</CardTitle>
          <CardDescription className="mt-1">
            Na jej podstawie liczymy odliczanie dni i rysujemy siatkę aktywności na stronie głównej.
          </CardDescription>
          <div className="mt-4">
            <ExamDateForm
              currentExamDate={settings?.exam_date ?? null}
              save={setExamDate}
              backHref="/informatyka"
              label="Data matury z informatyki"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
