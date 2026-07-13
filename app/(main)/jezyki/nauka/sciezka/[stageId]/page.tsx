// ============================================================================
// app/(main)/nauka/sciezka/[stageId]/page.tsx
// Detail view for one ścieżka nauki stage: vocabulary progress in this
// stage's category (with links into fiszki/trener pre-filtered to it) and
// the paired grammar topic's progress. Locked stages show why instead of
// any actions.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Layers, BookOpen, GraduationCap, Lock } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getLearningPath } from "@/lib/learning-path/progress";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeworkProgressBar } from "@/components/homework/homework-progress-bar";

export default async function StageDetailPage({
  params,
}: {
  params: Promise<{ stageId: string }>;
}) {
  const { stageId } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();
  const { stages } = await getLearningPath(supabase, profile.id, profile.level, profile.target_language);

  const stage = stages.find((s) => s.id === stageId);
  if (!stage) notFound();

  const encodedCategory = encodeURIComponent(stage.category);

  return (
    <div>
      <PageHeader title={stage.title} subtitle="Ścieżka nauki" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href="/jezyki/nauka/sciezka"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Cała ścieżka
        </Link>

        {stage.status === "locked" ? (
          <Card className="flex flex-col items-center gap-2 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-foreground-muted">
              <Lock className="h-6 w-6" />
            </span>
            <CardTitle>Ten etap jest jeszcze zablokowany</CardTitle>
            <CardDescription>
              Opanuj co najmniej 80% słówek z poprzedniego etapu, aby go odblokować.
            </CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            <Card>
              <div className="mb-2 flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <CardTitle>Słówka: {stage.category}</CardTitle>
              </div>
              <HomeworkProgressBar current={stage.masteredWords} target={stage.totalWords || 1} />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href={`/jezyki/nauka/fiszki?category=${encodedCategory}&stage=${stage.id}`}>
                  <Button variant="primary" className="w-full" size="sm">
                    <Layers className="h-4 w-4" /> Fiszki
                  </Button>
                </Link>
                <Link href={`/jezyki/nauka/slowka?category=${encodedCategory}&stage=${stage.id}`}>
                  <Button variant="outline" className="w-full" size="sm">
                    <BookOpen className="h-4 w-4" /> Trener znaczeń
                  </Button>
                </Link>
              </div>
            </Card>

            {stage.grammarTopicTitle && stage.grammarTopicSlug && (
              <Card>
                <div className="mb-2 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle>Gramatyka: {stage.grammarTopicTitle}</CardTitle>
                </div>
                <HomeworkProgressBar current={stage.grammarSolved} target={stage.grammarTotal || 1} />
                <Link href={`/jezyki/nauka/gramatyka/${stage.grammarTopicSlug}`}>
                  <Button variant="outline" className="mt-4 w-full" size="sm">
                    Przejdź do tematu
                  </Button>
                </Link>
              </Card>
            )}

            {stage.status === "completed" && (
              <Card className="bg-accent-soft text-center text-sm text-accent">
                Ten etap jest ukończony — możesz nadal ćwiczyć, żeby utrwalić słówka.
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
