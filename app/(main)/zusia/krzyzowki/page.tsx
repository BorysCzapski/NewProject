// ============================================================================
// app/(main)/zusia/krzyzowki/page.tsx
// Crossword list, grouped by lesson.
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CROSSWORDS } from "@/lib/zusia/crosswords";
import { getLesson } from "@/lib/zusia/theory";

export default function ZusiaCrosswordsPage() {
  return (
    <div>
      <PageHeader title="Krzyżówki" subtitle="Hasła z każdego działu" />
      <div className="mx-auto flex max-w-lg flex-col gap-2.5 px-5 py-5">
        {CROSSWORDS.map((c) => (
          <Link
            key={c.id}
            href={`/zusia/krzyzowki/${c.id}`}
            className="flex items-center justify-between gap-3 rounded-(--radius-card) border border-border/70 bg-surface p-4 shadow-(--shadow-card) transition-transform active:scale-[0.99]"
          >
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-wide text-primary">{getLesson(c.lesson)?.short}</span>
              <span className="block text-base font-semibold text-foreground">{c.title}</span>
              <span className="block text-sm text-foreground-muted">{c.entries.length} haseł</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" aria-hidden />
          </Link>
        ))}
      </div>
    </div>
  );
}
