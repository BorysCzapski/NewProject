// ============================================================================
// app/(main)/matura/nauka/gramatyka/page.tsx
// Grammar theory hub for Matura Angielski: lists every matura_grammar_topics
// row at the student's chosen poziom, each with a "X/Y ćwiczeń ukończonych"
// progress indicator — same shape as Linguo's grammar hub
// (app/(main)/jezyki/nauka/gramatyka/page.tsx), scoped to MaturaLevel instead
// of CEFR UserLevel.
// ============================================================================
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { MATURA_LEVEL_LABELS, visibleMaturaLevels } from "@/lib/matura/constants";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MaturaGrammarTopic } from "@/lib/types/database";

export default async function MaturaGramatykaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const { data: topics } = await supabase
    .from("matura_grammar_topics")
    .select("*")
    .in("level", visibleMaturaLevels(settings.level))
    .order("level", { ascending: true })
    .order("order_index", { ascending: true });

  const topicList = (topics ?? []) as MaturaGrammarTopic[];
  const topicIds = topicList.map((t) => t.id);

  const totalsByTopic = new Map<string, number>();
  const doneByTopic = new Map<string, Set<string>>();

  if (topicIds.length > 0) {
    const [{ data: exercises }, { data: progress }] = await Promise.all([
      supabase.from("matura_grammar_exercises").select("id, topic_id").in("topic_id", topicIds),
      supabase
        .from("matura_grammar_progress")
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
        subtitle="Teoria i ćwiczenia dopasowane do poziomu matury"
        action={<Badge>{MATURA_LEVEL_LABELS[settings.level]}</Badge>}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        {topicList.length === 0 ? (
          <Card>
            <CardDescription>Brak tematów gramatycznych dla tego poziomu — wróć tu później.</CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {topicList.map((topic, i) => {
              const total = totalsByTopic.get(topic.id) ?? 0;
              const done = doneByTopic.get(topic.id)?.size ?? 0;
              const isFirstOfLevel = settings.level === "rozszerzona" && (i === 0 || topicList[i - 1].level !== topic.level);
              return (
                <div key={topic.id}>
                  {isFirstOfLevel && (
                    <h2 className="mb-2 mt-1 text-sm font-semibold text-foreground-muted">
                      {topic.level === "podstawowa" ? "Podstawy" : "Rozszerzenie"}
                    </h2>
                  )}
                  <Link href={`/matura/nauka/gramatyka/${topic.slug}`}>
                    <Card className="flex items-center gap-3 transition-transform active:scale-[0.98]">
                      <div className="min-w-0 flex-1">
                        <CardTitle>{topic.title}</CardTitle>
                        <p className="mt-2 text-xs font-medium text-foreground-muted">
                          {done}/{total} ćwiczeń ukończonych
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-foreground-muted" />
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
