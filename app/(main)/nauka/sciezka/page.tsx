// ============================================================================
// app/(main)/nauka/sciezka/page.tsx
// "Ścieżka nauki" roadmap: an ordered list of stages (vocabulary category +
// paired grammar topic) for the user's level. Stages unlock sequentially as
// vocabulary mastery in the current stage's category reaches the threshold.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getLearningPath } from "@/lib/learning-path/progress";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { PathRoadmap } from "@/components/learning-path/path-roadmap";

export default async function SciezkaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { stages, currentStageIndex } = await getLearningPath(supabase, profile.id, profile.level);

  return (
    <div>
      <PageHeader
        title="Ścieżka nauki"
        subtitle={
          stages.length > 0
            ? `Etap ${Math.min(currentStageIndex + 1, stages.length)} z ${stages.length}`
            : undefined
        }
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        {stages.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 py-10 text-center">
            <CardTitle>Ścieżka jeszcze niedostępna</CardTitle>
            <CardDescription>
              Nie znaleziono etapów dla poziomu {profile.level}. Wróć tu później.
            </CardDescription>
          </Card>
        ) : (
          <PathRoadmap stages={stages} />
        )}
      </div>
    </div>
  );
}
