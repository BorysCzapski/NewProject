// ============================================================================
// app/(main)/matma/nauka/[topicSlug]/lekcja/[lessonId]/page.tsx
// Lesson viewer: resolves the topic + lesson, guards that the lesson really
// belongs to that topic (a mistyped/foreign lessonId in the URL 404s instead
// of silently rendering the wrong lesson), and hands the authored content
// off to the interactive client-side LessonViewer.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopicBySlug, getLessonById } from "@/lib/matma/content";
import { PageHeader } from "@/components/layout/page-header";
import { LessonViewer } from "@/components/matma/lesson/lesson-viewer";
import type { MathBlock } from "@/lib/matma/lesson-blocks";

export default async function MatmaLessonPage({
  params,
}: {
  params: Promise<{ topicSlug: string; lessonId: string }>;
}) {
  const { topicSlug, lessonId } = await params;
  await requireProfile();
  const supabase = await createClient();

  const [topic, lesson] = await Promise.all([
    getTopicBySlug(supabase, topicSlug),
    getLessonById(supabase, lessonId),
  ]);

  if (!topic || !lesson || lesson.topic_id !== topic.id) notFound();

  // Safe cast at this boundary: math_lessons.content is authored as
  // MathBlock[] jsonb but kept `unknown[]` in the DB row type (see
  // lib/types/database.ts) to avoid a client-type <-> db-type import cycle.
  const blocks = lesson.content as MathBlock[];

  return (
    <div>
      <PageHeader
        title={lesson.title}
        subtitle={topic.title}
        action={
          <Link
            href={`/matma/nauka/${topic.slug}`}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        }
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <LessonViewer blocks={blocks} topicSlug={topic.slug} lessonId={lesson.id} />
      </div>
    </div>
  );
}
