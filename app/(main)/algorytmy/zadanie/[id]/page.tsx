// ============================================================================
// app/(main)/algorytmy/zadanie/[id]/page.tsx
// Solves one exercise. correct_option_id is deliberately NOT passed to the
// client — grading happens in lib/algorytmy/actions.ts and the answer comes
// back only after the student commits.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAlgoTaskType } from "@/lib/algorytmy/task-types";
import { startExerciseType } from "@/lib/algorytmy/practice-actions";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { McSolver } from "@/components/algorytmy/exercise/mc-solver";
import { RichText } from "@/components/algorytmy/lesson/rich-text";
import { NextOfTypeButton } from "@/components/practice/next-of-type-button";
import type { AlgoExercise, AlgoTopic } from "@/lib/types/database";

export const maxDuration = 60;

export default async function AlgorytmyExercisePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ typ?: string; dzial?: string }>;
}) {
  const { id } = await params;
  const { typ, dzial } = await searchParams;
  await requireProfile();
  const supabase = await createClient();

  const { data: exerciseRow } = await supabase
    .from("algo_exercises")
    // correct_option_id and explanation stay on the server.
    .select("id, topic_id, task_type, statement, code, code_language, options, difficulty")
    .eq("id", id)
    .maybeSingle();
  if (!exerciseRow) notFound();
  const exercise = exerciseRow as Pick<
    AlgoExercise,
    "id" | "topic_id" | "task_type" | "statement" | "code" | "code_language" | "options" | "difficulty"
  >;

  const { data: topicRow } = await supabase
    .from("algo_topics")
    .select("slug, title, order_index")
    .eq("id", exercise.topic_id)
    .maybeSingle();
  const topic = topicRow as Pick<AlgoTopic, "slug" | "title" | "order_index"> | null;

  // The ?typ=/?dzial= markers say the student came from a type card, so they
  // get the "next one of these" loop. Both are query-string input, so the type
  // is validated and the dział cross-checked against the exercise's own topic.
  const typeDef = typ ? getAlgoTaskType(typ) : undefined;
  const showNextOfType =
    typeDef && typeDef.slug === exercise.task_type && !!topic && dzial === topic.slug;

  const backHref = topic ? `/algorytmy/dzialy/${topic.slug}` : "/algorytmy/dzialy";

  return (
    <div>
      <PageHeader title={topic ? `Dział ${topic.order_index}` : "Zadanie"} subtitle={topic?.title ?? ""} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć do działu
        </Link>

        {typeDef && <Badge>{typeDef.label}</Badge>}

        {exercise.code && (
          <pre className="overflow-x-auto rounded-(--radius-control) bg-surface-muted px-3.5 py-3 text-xs leading-relaxed">
            <code className="font-mono text-foreground">{exercise.code}</code>
          </pre>
        )}

        <RichText text={exercise.statement} className="text-base font-medium text-foreground" />

        <McSolver exerciseId={exercise.id} options={exercise.options} />

        {showNextOfType && typeDef && topic && (
          <NextOfTypeButton
            action={startExerciseType}
            fields={{ topicSlug: topic.slug, typeSlug: typeDef.slug }}
          />
        )}
      </div>
    </div>
  );
}
