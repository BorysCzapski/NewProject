// ============================================================================
// app/(main)/nauka/sciezka/page.tsx
// "Ścieżka nauki" roadmap: an ordered list of stages (vocabulary category +
// paired grammar topic) for the user's level. Stages unlock sequentially as
// vocabulary mastery in the current stage's category reaches the threshold.
// ============================================================================
import Link from "next/link";
import { ArrowRight, Type } from "lucide-react";
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
  const { stages, currentStageIndex } = await getLearningPath(supabase, profile.id, profile.level, profile.target_language);

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
        {/* Russian: stage-1 flashcards are unreadable without the alphabet,
            so the path opens with a visible detour to the Cyrillic primer. */}
        {profile.target_language === "ru" && (
          <Link href="/nauka/cyrylica" className="mb-4 block">
            <Card className="flex items-center gap-4 border-primary bg-primary-soft active:scale-[0.98] transition-transform">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
                <Type className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <CardTitle>Zacznij od cyrylicy</CardTitle>
                <CardDescription>
                  Zanim ruszysz z fiszkami: ~30 minut i przeczytasz wszystko
                </CardDescription>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
            </Card>
          </Link>
        )}
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
