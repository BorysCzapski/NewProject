// ============================================================================
// app/(main)/algorytmy/dzialy/[slug]/lekcja/[lessonSlug]/page.tsx
// One lesson: its blocks rendered in order, then the "przerobione" marker and
// a link to the next lesson in the dział.
//
// Every lesson gets its own address rather than being concatenated onto the
// dział page — the same call Matura and Geografia made once their działy grew
// past a couple of lessons each.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import {
  getCompletedLessonIds,
  getLessonBySlug,
  getLessonsForTopic,
  getTopicBySlug,
  lessonBlocks,
} from "@/lib/algorytmy/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { BlockRenderer } from "@/components/algorytmy/lesson/block-renderer";
import { LessonDoneButton } from "@/components/algorytmy/lesson-done-button";

export default async function AlgorytmyLessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const topic = await getTopicBySlug(supabase, slug);
  if (!topic) notFound();

  const [lesson, lessons, completedIds] = await Promise.all([
    getLessonBySlug(supabase, topic.id, lessonSlug),
    getLessonsForTopic(supabase, topic.id),
    getCompletedLessonIds(supabase, profile.id),
  ]);
  if (!lesson) notFound();

  const blocks = lessonBlocks(lesson);
  const position = lessons.findIndex((l) => l.id === lesson.id);
  const next = position >= 0 ? lessons[position + 1] : undefined;

  return (
    <div>
      <PageHeader title={topic.title} subtitle={lesson.title} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Link
          href={`/algorytmy/dzialy/${topic.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć do działu
        </Link>

        {blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}

        <LessonDoneButton
          lessonId={lesson.id}
          topicSlug={topic.slug}
          lessonSlug={lesson.slug}
          initiallyDone={completedIds.has(lesson.id)}
        />

        {next && (
          <Link href={`/algorytmy/dzialy/${topic.slug}/lekcja/${next.slug}`}>
            <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                  Następna lekcja
                </p>
                <CardTitle className="line-clamp-1">{next.title}</CardTitle>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted" />
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
