// ============================================================================
// app/(main)/biznes/teoria/page.tsx
// Theory index: one card per lesson with its section titles.
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { LESSONS, getTheoryForLesson } from "@/lib/biznes/theory";

export default function BiznesTheoryIndexPage() {
  return (
    <div>
      <PageHeader title="Teoria" subtitle="Materiał podzielony na działy" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {LESSONS.map((lesson) => {
          const sections = getTheoryForLesson(lesson.id);
          return (
            <Link
              key={lesson.id}
              href={`/biznes/teoria/${lesson.id}`}
              className="rounded-(--radius-card) border border-border/70 bg-surface p-4 shadow-(--shadow-card) transition-transform active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">{lesson.short}</p>
                  <h2 className="mt-0.5 text-base font-semibold text-foreground">{lesson.title}</h2>
                  <p className="mt-0.5 text-sm text-foreground-muted">{lesson.subtitle}</p>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-foreground-muted" aria-hidden />
              </div>
              <p className="mt-2 text-xs text-foreground-muted">{sections.length} tematów</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
