// ============================================================================
// app/(main)/gitara/page.tsx
// Gitara dashboard: where you are in the curriculum, what to read next, how
// much you've practised, and one tap to the chord library, song library and
// practice tools.
//
// "Next lesson" is the first unread lesson in curriculum order — see
// lib/gitara/topics.ts's module comment for why the order IS the right
// advice rather than a recommendation engine, same stance app/(main)/
// algorytmy/page.tsx takes.
// ============================================================================
import Link from "next/link";
import { ArrowRight, BookOpen, Guitar, ListMusic, Music, Timer } from "lucide-react";
import { Play } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getCompletedLessonIds, getTopics, getTotalPracticeSeconds } from "@/lib/gitara/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { StreakBadge } from "@/components/dashboard/streak-badge";
import type { GtrLesson, GtrTopic } from "@/lib/types/database";

export default async function GitaraDashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [topics, completedIds, practiceSeconds, { data: lessonRows }] = await Promise.all([
    getTopics(supabase),
    getCompletedLessonIds(supabase, profile.id),
    getTotalPracticeSeconds(supabase, profile.id),
    supabase.from("gtr_lessons").select("id, topic_id, slug, title, order_index").order("order_index"),
  ]);

  const lessons = (lessonRows ?? []) as Array<
    Pick<GtrLesson, "id" | "topic_id" | "slug" | "title" | "order_index">
  >;
  const topicById = new Map<string, GtrTopic>(topics.map((t) => [t.id, t]));

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
  const practiceMinutes = Math.round(practiceSeconds / 60);

  return (
    <div>
      <PageHeader title="Gitara" subtitle="Nauka gry na gitarze" />
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
              <Timer className="h-3.5 w-3.5" />
              Czas ćwiczeń
            </span>
            <span className="text-xl font-bold tabular-nums text-foreground">
              {practiceMinutes}
              <span className="text-sm font-normal text-foreground-muted"> min</span>
            </span>
          </Card>
        </div>

        {nextLesson && nextTopic && (
          <Link href={`/gitara/dzialy/${nextTopic.slug}/lekcja/${nextLesson.slug}`}>
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
              Graj dalej — biblioteka akordów, piosenki i tryb ćwiczeń czekają.
            </CardDescription>
          </Card>
        )}

        <Link href="/gitara/dzialy">
          <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-1.5">
                <Guitar className="h-4 w-4 text-primary" />
                Wszystkie działy
              </CardTitle>
              <CardDescription className="mt-0.5">
                {topics.length} działów: od postawy po techniki gry
              </CardDescription>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted" />
          </Card>
        </Link>

        <Link href="/gitara/tabulatury">
          <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-1.5">
                <Play className="h-4 w-4 text-primary" />
                Tabulatury do grania
              </CardTitle>
              <CardDescription className="mt-0.5">Całe utwory w tabulaturze — z kapodastrem i tempem</CardDescription>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted" />
          </Card>
        </Link>

        <div className="grid grid-cols-3 gap-3">
          <Link href="/gitara/akordy">
            <Card className="flex flex-col items-center gap-1.5 py-4 text-center transition-transform active:scale-[0.97]">
              <Music className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-foreground">Akordy</span>
            </Card>
          </Link>
          <Link href="/gitara/piosenki">
            <Card className="flex flex-col items-center gap-1.5 py-4 text-center transition-transform active:scale-[0.97]">
              <ListMusic className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-foreground">Piosenki</span>
            </Card>
          </Link>
          <Link href="/gitara/cwicz">
            <Card className="flex flex-col items-center gap-1.5 py-4 text-center transition-transform active:scale-[0.97]">
              <Timer className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-foreground">Ćwicz</span>
            </Card>
          </Link>
        </div>

        {topics.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Dane startowe nie są jeszcze wgrane. Uruchom migrację <code>0025_gitara.sql</code> i seedy z{" "}
            <code>supabase/seed/gitara/</code>.
          </Card>
        )}
      </div>
    </div>
  );
}
