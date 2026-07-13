// ============================================================================
// app/(main)/nauka/gramatyka/page.tsx
// Grammar module hub: lists every grammar_topics row at the user's level as
// tappable cards, each showing a teaser and a "X/Y ćwiczeń ukończonych"
// progress indicator computed from grammar_progress.
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import type { GrammarTopic } from "@/lib/types/database";

function teaser(explanation: string): string {
  const flat = explanation.replace(/\s+/g, " ").trim();
  return flat.length > 80 ? `${flat.slice(0, 80)}…` : flat;
}

export default async function GrammarTopicsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: topics } = await supabase
    .from("grammar_topics")
    .select("*")
    .eq("level", profile.level)
    .eq("language", profile.target_language)
    .order("order_index");

  const topicList = (topics ?? []) as GrammarTopic[];
  const topicIds = topicList.map((t) => t.id);

  const totalsByTopic = new Map<string, number>();
  const doneByTopic = new Map<string, Set<string>>();

  if (topicIds.length > 0) {
    const [{ data: exercises }, { data: progress }] = await Promise.all([
      supabase.from("grammar_exercises").select("id, topic_id").in("topic_id", topicIds),
      supabase
        .from("grammar_progress")
        .select("exercise_id, topic_id")
        .eq("user_id", profile.id)
        .eq("is_correct", true)
        .in("topic_id", topicIds),
    ]);

    for (const ex of exercises ?? []) {
      totalsByTopic.set(ex.topic_id, (totalsByTopic.get(ex.topic_id) ?? 0) + 1);
    }
    for (const p of progress ?? []) {
      if (!p.exercise_id) continue;
      const set = doneByTopic.get(p.topic_id) ?? new Set<string>();
      set.add(p.exercise_id);
      doneByTopic.set(p.topic_id, set);
    }
  }

  return (
    <div>
      <PageHeader
        title="Gramatyka"
        subtitle="Wyjaśnienia i ćwiczenia dopasowane do Twojego poziomu"
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        {topicList.length === 0 ? (
          <Card>
            <CardDescription>
              Brak tematów gramatycznych dla poziomu {profile.level}. Wróć tu później.
            </CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {topicList.map((topic) => {
              const total = totalsByTopic.get(topic.id) ?? 0;
              const done = doneByTopic.get(topic.id)?.size ?? 0;
              return (
                <Link key={topic.id} href={`/jezyki/nauka/gramatyka/${topic.slug}`}>
                  <Card className="flex items-center gap-3 active:scale-[0.98] transition-transform">
                    <div className="min-w-0 flex-1">
                      <CardTitle>{topic.title}</CardTitle>
                      <CardDescription className="mt-0.5">{teaser(topic.explanation)}</CardDescription>
                      <p className="mt-2 text-xs font-medium text-foreground-muted">
                        {done}/{total} ćwiczeń ukończonych
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-foreground-muted" />
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
