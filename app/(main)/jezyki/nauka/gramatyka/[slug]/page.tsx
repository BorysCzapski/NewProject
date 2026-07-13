// ============================================================================
// app/(main)/nauka/gramatyka/[slug]/page.tsx
// Grammar topic detail: renders the explanation and hands the exercise list
// off to a client-side stepper that handles answering, grading and progress.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { GrammarExerciseStepper } from "@/components/grammar/grammar-exercise-stepper";
import { GrammarLesson } from "@/components/grammar/lesson/grammar-lesson";
import { getGrammarLesson } from "@/lib/grammar/content";
import type { GrammarExercise, GrammarTopic } from "@/lib/types/database";

export default async function GrammarTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: topic } = await supabase
    .from("grammar_topics")
    .select("*")
    .eq("slug", slug)
    .eq("language", profile.target_language)
    .maybeSingle();

  if (!topic) notFound();

  const { data: exercises } = await supabase
    .from("grammar_exercises")
    .select("*")
    .eq("topic_id", topic.id)
    .order("order_index");

  return (
    <div>
      <PageHeader title={(topic as GrammarTopic).title} subtitle={`Poziom ${profile.level}`} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href="/jezyki/nauka/gramatyka"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie tematy
        </Link>

        <LessonSection topic={topic as GrammarTopic} />

        <GrammarExerciseStepper
          topicId={topic.id}
          exercises={(exercises ?? []) as GrammarExercise[]}
          language={(topic as GrammarTopic).language}
        />
      </div>
    </div>
  );
}

/**
 * Interactive lesson when one is authored for this topic
 * (lib/grammar/content/*), otherwise the plain-text explanation from the DB.
 */
function LessonSection({ topic }: { topic: GrammarTopic }) {
  const lesson = getGrammarLesson(topic.level, topic.slug);

  if (lesson) {
    return (
      <div className="mb-5">
        <GrammarLesson blocks={lesson} />
      </div>
    );
  }

  return (
    <Card className="mb-5">
      <CardTitle>Wyjaśnienie</CardTitle>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
        {topic.explanation}
      </p>
    </Card>
  );
}
