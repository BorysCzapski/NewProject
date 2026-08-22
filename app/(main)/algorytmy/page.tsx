// ============================================================================
// app/(main)/algorytmy/page.tsx
// Algorytmy dashboard: where you are in the curriculum, what to read next and
// how the practice is going.
//
// "Next lesson" is the first unread lesson in curriculum order, not a
// recommendation engine. The order in lib/algorytmy/topics.ts is a genuine
// prerequisite chain, so following it IS the right advice — and a student who
// wants to jump ahead has the dział list one tap away.
// ============================================================================
import Link from "next/link";
import { ArrowRight, BookOpen, Binary, Target } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getCompletedLessonIds, getTopics } from "@/lib/algorytmy/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { StreakBadge } from "@/components/dashboard/streak-badge";
import type { AlgoLesson, AlgoTopic } from "@/lib/types/database";

export default async function AlgorytmyDashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [topics, completedIds, { data: lessonRows }, { data: attemptRows }] = await Promise.all([
    getTopics(supabase),
    getCompletedLessonIds(supabase, profile.id),
    supabase.from("algo_lessons").select("id, topic_id, slug, title, order_index").order("order_index"),
    supabase.from("algo_exercise_attempts").select("is_correct").eq("user_id", profile.id),
  ]);

  const lessons = (lessonRows ?? []) as Array<
    Pick<AlgoLesson, "id" | "topic_id" | "slug" | "title" | "order_index">
  >;
  const attempts = (attemptRows ?? []) as Array<{ is_correct: boolean }>;
  const topicById = new Map<string, AlgoTopic>(topics.map((t) => [t.id, t]));

  // Curriculum order = topic order, then lesson order inside the topic.
  const ordered = lessons
    .filter((lesson) => topicById.has(lesson.topic_id))
    .sort((a, b) => {
      const ta = topicById.get(a.topic_id)!.order_index;
      const tb = topicById.get(b.topic_id)!.order_index;
      return ta !== tb ? ta - tb : a.order_index - b.order_index;
    });

  const nextLesson = ordered.find((lesson) => !completedIds.has(lesson.id));
  const nextTopic = nextLesson ? topicById.get(nextLesson.topic_id) : undefined;

  const doneLessons = ordered.filter((lesson) => completedIds.has(lesson.id)).length;
  const solved = attempts.length;
  const correct = attempts.filter((a) => a.is_correct).length;
  const accuracy = solved > 0 ? Math.round((correct / solved) * 100) : null;

  return (
    <div>
      <PageHeader title="Algorytmy" subtitle="Struktury danych i algorytmy" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-foreground-muted">Cześć, {profile.username}</p>
            <p className="text-lg font-semibold text-foreground">
              {doneLessons === 0 ? "Zacznijmy od podstaw" : "Ładny postęp"}
            </p>
          </div>
          <StreakBadge streak={profile.current_streak} size="lg" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
              <BookOpen className="h-3.5 w-3.5" />
              Lekcje
            </span>
            <span className="text-xl font-bold tabular-nums text-foreground">
              {doneLessons}
              <span className="text-sm font-normal text-foreground-muted">/{ordered.length}</span>
            </span>
          </Card>
          <Card className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
              <Target className="h-3.5 w-3.5" />
              Skuteczność
            </span>
            <span className="text-xl font-bold tabular-nums text-foreground">
              {accuracy === null ? "—" : `${accuracy}%`}
              {solved > 0 && (
                <span className="text-sm font-normal text-foreground-muted"> z {solved}</span>
              )}
            </span>
          </Card>
        </div>

        {nextLesson && nextTopic && (
          <Link href={`/algorytmy/dzialy/${nextTopic.slug}/lekcja/${nextLesson.slug}`}>
            <Card className="flex items-center justify-between gap-3 bg-primary-soft transition-transform active:scale-[0.99]">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Następna lekcja
                </p>
                <CardTitle className="line-clamp-1">{nextLesson.title}</CardTitle>
                <CardDescription className="mt-0.5">
                  Dział {nextTopic.order_index}: {nextTopic.title}
                </CardDescription>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
            </Card>
          </Link>
        )}

        {!nextLesson && ordered.length > 0 && (
          <Card className="bg-accent-soft">
            <CardTitle>Cała teoria przerobiona</CardTitle>
            <CardDescription className="mt-0.5">
              Zadania możesz rozwiązywać dalej bez końca — każdy typ generuje nowe.
            </CardDescription>
          </Card>
        )}

        <Link href="/algorytmy/dzialy">
          <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-1.5">
                <Binary className="h-4 w-4 text-primary" />
                Wszystkie działy
              </CardTitle>
              <CardDescription className="mt-0.5">
                {topics.length} działów: od złożoności po programowanie dynamiczne
              </CardDescription>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted" />
          </Card>
        </Link>

        {topics.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Dane startowe nie są jeszcze wgrane. Uruchom migrację <code>0024_algorytmy.sql</code> i seedy
            z <code>supabase/seed/algorytmy/</code>.
          </Card>
        )}
      </div>
    </div>
  );
}
