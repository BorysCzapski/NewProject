// ============================================================================
// app/(main)/jezyki/nauka/podrecznik/[id]/gramatyka/[topicId]/page.tsx
// A textbook's grammar topic: renders the AI-extracted lesson blocks via the
// same GrammarLesson component the global grammar module uses, then the
// same GrammarExerciseStepper for its gap_fill/multiple_choice exercises —
// with persistence overridden since this topic isn't a grammar_topics row.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { GrammarLesson } from "@/components/grammar/lesson/grammar-lesson";
import { GrammarExerciseStepper } from "@/components/grammar/grammar-exercise-stepper";
import { noopTextbookGrammarAttempt, completeTextbookGrammarTopic } from "@/lib/textbook/actions";
import type { GrammarBlock } from "@/lib/grammar/lesson-blocks";
import type { GrammarExercise, TextbookGrammarTopic } from "@/lib/types/database";

export default async function TextbookGrammarTopicPage({
  params,
}: {
  params: Promise<{ id: string; topicId: string }>;
}) {
  const { id, topicId } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: topic } = await supabase
    .from("textbook_grammar_topics")
    .select("*")
    .eq("id", topicId)
    .eq("textbook_id", id)
    .eq("user_id", profile.id)
    .maybeSingle();
  if (!topic) notFound();

  const { data: exercises } = await supabase
    .from("textbook_grammar_exercises")
    .select("*")
    .eq("topic_id", topicId)
    .order("order_index");

  const backHref = `/jezyki/nauka/podrecznik/${id}`;

  return (
    <div>
      <PageHeader title={(topic as TextbookGrammarTopic).title} subtitle="Gramatyka" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Podręcznik
        </Link>

        <div className="mb-5">
          <GrammarLesson blocks={(topic as TextbookGrammarTopic).blocks as GrammarBlock[]} />
        </div>

        <GrammarExerciseStepper
          topicId={topicId}
          exercises={(exercises ?? []) as GrammarExercise[]}
          language="en"
          backHref={backHref}
          onAttempt={noopTextbookGrammarAttempt}
          onComplete={completeTextbookGrammarTopic}
        />
      </div>
    </div>
  );
}
