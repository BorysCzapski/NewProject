// ============================================================================
// app/(main)/geografia/tematy/[slug]/lekcja/[lessonSlug]/page.tsx
// One theory lesson. Lessons are addressed by (topic slug, lesson slug) —
// see 0018_geografia_lessons.sql — so links stay stable across re-seeds.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getCompletedLessonIds, getLessonsForTopic, getTopicBySlug } from "@/lib/geografia/content";
import { PageHeader } from "@/components/layout/page-header";
import { LessonViewer } from "@/components/geografia/lesson/lesson-viewer";
import type { GeoBlock } from "@/lib/geografia/lesson-blocks";

export default async function GeografiaLessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const topic = await getTopicBySlug(supabase, slug);
  if (!topic) notFound();

  const [lessons, completedIds] = await Promise.all([
    getLessonsForTopic(supabase, topic.id),
    getCompletedLessonIds(supabase, profile.id),
  ]);

  const index = lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) notFound();
  const lesson = lessons[index];
  const next = lessons[index + 1];

  return (
    <div>
      <PageHeader title={lesson.title} subtitle={`Dział ${topic.cke_number} · ${topic.title}`} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Link
          href={`/geografia/tematy/${topic.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć do działu
        </Link>

        <div className="flex items-center gap-3 text-xs text-foreground-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            ok. {lesson.reading_minutes} min
          </span>
          <span>
            Lekcja {index + 1} z {lessons.length}
          </span>
        </div>

        {lesson.summary && <p className="text-sm text-foreground-muted">{lesson.summary}</p>}

        <LessonViewer
          blocks={lesson.content as GeoBlock[]}
          lessonId={lesson.id}
          alreadyCompleted={completedIds.has(lesson.id)}
        />

        {next && (
          <Link
            href={`/geografia/tematy/${topic.slug}/lekcja/${next.slug}`}
            className="flex items-center justify-between gap-2 rounded-(--radius-card) border border-border bg-surface px-4 py-3.5 active:opacity-80"
          >
            <span className="min-w-0">
              <span className="block text-xs text-foreground-muted">Następna lekcja</span>
              <span className="block truncate text-sm font-medium text-foreground">{next.title}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
          </Link>
        )}
      </div>
    </div>
  );
}
