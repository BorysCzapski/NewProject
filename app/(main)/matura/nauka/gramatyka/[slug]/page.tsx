// ============================================================================
// app/(main)/matura/nauka/gramatyka/[slug]/page.tsx
// Grammar topic detail: renders the interactive lesson (GrammarLesson,
// reused as-is) and hands the exercise list to GrammarExerciseStepper
// (reused as-is via its onAttempt/onComplete override props) — same pattern
// as app/(main)/jezyki/nauka/gramatyka/[slug]/page.tsx.
// ============================================================================
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { visibleMaturaLevels } from "@/lib/matura/constants";
import { PageHeader } from "@/components/layout/page-header";
import { GrammarLesson } from "@/components/grammar/lesson/grammar-lesson";
import { GrammarExerciseStepper } from "@/components/grammar/grammar-exercise-stepper";
import { recordMaturaGrammarAttempt, completeMaturaGrammarTopic } from "@/lib/matura/grammar-actions";
import type { GrammarBlock } from "@/lib/grammar/lesson-blocks";
import type { GrammarExercise, MaturaGrammarTopic } from "@/lib/types/database";

const BACK_HREF = "/matura/nauka/gramatyka";

export default async function MaturaGramatykaTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const { data: topic } = await supabase
    .from("matura_grammar_topics")
    .select("*")
    .eq("slug", slug)
    .in("level", visibleMaturaLevels(settings.level))
    .maybeSingle();
  if (!topic) notFound();

  const { data: exercises } = await supabase
    .from("matura_grammar_exercises")
    .select("*")
    .eq("topic_id", (topic as MaturaGrammarTopic).id)
    .order("order_index");

  return (
    <div>
      <PageHeader title={(topic as MaturaGrammarTopic).title} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link href={BACK_HREF} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted">
          <ArrowLeft className="h-4 w-4" />
          Wszystkie tematy
        </Link>

        <div className="mb-5">
          <GrammarLesson blocks={(topic as MaturaGrammarTopic).blocks as GrammarBlock[]} />
        </div>

        <GrammarExerciseStepper
          topicId={(topic as MaturaGrammarTopic).id}
          exercises={(exercises ?? []) as GrammarExercise[]}
          backHref={BACK_HREF}
          onAttempt={recordMaturaGrammarAttempt}
          onComplete={completeMaturaGrammarTopic}
        />
      </div>
    </div>
  );
}
