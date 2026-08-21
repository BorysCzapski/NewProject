// ============================================================================
// components/matura/theory-lesson-view.tsx
// The body of a theory lesson page, shared by every section's teoria/ route.
//
// It exists because "pisanie" has a STATIC route folder (its tasks are a
// different table, AI-graded) which shadows the generic [sectionSlug] segment
// for everything under /matura/nauka/pisanie/*. That means two teoria routes
// must exist, and only their slug differs — so the ~90 lines they share live
// here rather than being copied.
// ============================================================================
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { MATURA_BUILT_SECTION_SLUGS } from "@/lib/matura/sections";
import { getLessonBySlug, MATURA_LESSON_KIND_LABELS } from "@/lib/matura/theory";
import { langInfo } from "@/lib/languages";
import { PageHeader } from "@/components/layout/page-header";
import { GrammarLesson } from "@/components/grammar/lesson/grammar-lesson";
import { LessonFooter } from "@/components/matura/lesson-footer";
import type { GrammarBlock } from "@/lib/grammar/lesson-blocks";
import type { MaturaSection, MaturaSectionSlug } from "@/lib/types/database";

export async function TheoryLessonView({
  sectionSlug,
  lessonSlug,
}: {
  sectionSlug: string;
  lessonSlug: string;
}) {
  if (!MATURA_BUILT_SECTION_SLUGS.includes(sectionSlug as MaturaSectionSlug)) notFound();

  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const { data: sectionRow } = await supabase
    .from("matura_sections")
    .select("*")
    .eq("language", settings.language)
    .eq("level", settings.level)
    .eq("slug", sectionSlug)
    .maybeSingle();
  if (!sectionRow) notFound();
  const section = sectionRow as MaturaSection;

  const found = await getLessonBySlug(supabase, profile.id, section.id, lessonSlug);
  if (!found) notFound();
  const { lesson, completed, next } = found;

  const backHref = `/matura/nauka/${sectionSlug}`;

  return (
    <div>
      <PageHeader title={section.title} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Cała teoria
        </Link>

        <header className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            {MATURA_LESSON_KIND_LABELS[lesson.kind]}
          </span>
          <h1 className="text-2xl font-bold leading-tight text-foreground">{lesson.title}</h1>
          {lesson.summary && (
            <p className="text-sm leading-relaxed text-foreground-muted">{lesson.summary}</p>
          )}
          <p className="flex items-center gap-1 text-xs text-foreground-muted">
            <Clock className="h-3.5 w-3.5" />
            {lesson.estimated_minutes} min
          </p>
        </header>

        {/* Type-in drills inside the lesson get the same character bar as the
            graded tasks — see components/ui/accent-bar.tsx. */}
        <GrammarLesson
          blocks={lesson.content as GrammarBlock[]}
          accentChars={langInfo(settings.language).specialChars}
        />

        <LessonFooter
          lessonId={lesson.id}
          initialCompleted={completed}
          nextHref={next ? `/matura/nauka/${sectionSlug}/teoria/${next.slug}` : undefined}
          nextTitle={next?.title}
        />
      </div>
    </div>
  );
}
