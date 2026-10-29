// ============================================================================
// app/(main)/biznes/teoria/[lessonId]/page.tsx
// One lesson's theory: table of contents + sections, with shortcuts to the
// lesson's practice material (training, mind map, flashcards).
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { TheoryBlocks } from "@/components/biznes/theory-blocks";
import { MIND_MAPS } from "@/lib/biznes/mindmaps";
import { LESSONS, getLesson, getTheoryForLesson } from "@/lib/biznes/theory";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ lessonId: l.id }));
}

export default async function BiznesLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();

  const sections = getTheoryForLesson(lesson.id);
  const maps = MIND_MAPS.filter((m) => m.lesson === lesson.id);
  const index = LESSONS.findIndex((l) => l.id === lesson.id);
  const next = LESSONS[index + 1];

  return (
    <div>
      <PageHeader title={lesson.title} subtitle={lesson.short} />
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-5">
        <p className="text-xs text-foreground-muted">Źródło: {lesson.source}</p>

        <nav aria-label="Spis treści" className="rounded-(--radius-card) border border-border/70 bg-surface p-4">
          <p className="text-sm font-semibold text-foreground">W tym dziale</p>
          <ol className="mt-2 flex flex-col gap-1 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex gap-2 py-0.5 text-foreground-muted hover:text-primary">
                  <span className="w-5 shrink-0 text-primary">{i + 1}.</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="mb-3 text-lg font-bold tracking-tight text-foreground">
              <span className="mr-1.5 text-primary">{i + 1}.</span>
              {s.title}
            </h2>
            <TheoryBlocks blocks={s.blocks} />
          </section>
        ))}

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <p className="text-sm font-semibold text-foreground">Utrwal ten dział</p>
          <div className="grid grid-cols-2 gap-2 text-center text-sm font-medium">
            <Link href="/biznes/trening" className="rounded-(--radius-control) border border-border bg-surface px-3 py-2.5 text-foreground">
              Trening
            </Link>
            <Link href="/biznes/fiszki" className="rounded-(--radius-control) border border-border bg-surface px-3 py-2.5 text-foreground">
              Fiszki
            </Link>
            {maps.map((m) => (
              <Link key={m.id} href={`/biznes/mapy/${m.id}`} className="col-span-2 rounded-(--radius-control) border border-primary/30 bg-primary-soft px-3 py-2.5 text-primary">
                Mapa myśli: {m.center}
              </Link>
            ))}
          </div>
          {next && (
            <Link href={`/biznes/teoria/${next.id}`} className="mt-1 rounded-(--radius-control) bg-primary px-4 py-3 text-center font-medium text-primary-foreground">
              Dalej: {next.title}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
