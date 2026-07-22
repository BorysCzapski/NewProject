// ============================================================================
// app/(main)/matma/nauka/[topicSlug]/page.tsx
// Topic detail: lessons list + a practice CTA that surfaces the student's
// current unlocked difficulty tier (see getUnlockedDifficulty) so it's clear
// why they might only be seeing easy problems.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, ChevronRight, PenTool } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopicBySlug, getLessonsForTopic } from "@/lib/matma/content";
import { getUnlockedDifficulty } from "@/lib/matma/progress";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DIFFICULTY_LABELS: Record<1 | 2 | 3, string> = {
  1: "Poziom 1 · podstawowy",
  2: "Poziom 2 · średni",
  3: "Poziom 3 · trudny",
};

export default async function MatmaTopicPage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const topic = await getTopicBySlug(supabase, topicSlug);
  if (!topic) notFound();

  const [lessons, unlockedDifficulty] = await Promise.all([
    getLessonsForTopic(supabase, topic.id),
    getUnlockedDifficulty(supabase, profile.id, topic.id),
  ]);

  return (
    <div>
      <PageHeader title={topic.title} subtitle={topic.description} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Lekcje
          </h2>
          {lessons.length === 0 ? (
            <Card className="text-center text-sm text-foreground-muted">
              Lekcje dla tego działu pojawią się wkrótce.
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {lessons.map((lesson, i) => (
                <Link key={lesson.id} href={`/matma/nauka/${topic.slug}/lekcja/${lesson.id}`}>
                  <Card className="flex items-center gap-3 transition-transform active:scale-[0.99]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <CardTitle className="truncate">{lesson.title}</CardTitle>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <Card>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-4 w-4 text-primary" />
              Ćwicz ten dział
            </CardTitle>
            <Badge>{DIFFICULTY_LABELS[unlockedDifficulty]}</Badge>
          </div>
          <CardDescription className="mt-1">
            Zadania dobrane do Twojego aktualnego poziomu — trudniejsze odblokują się, gdy opanujesz
            łatwiejsze.
          </CardDescription>
          <Link href={`/matma/nauka/${topic.slug}/cwiczenia`} className="mt-3 block">
            <Button className="w-full">
              <BookOpen className="h-4 w-4" />
              Rozpocznij ćwiczenia
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
