// ============================================================================
// app/(main)/biznes/mapy/page.tsx
// Mind-map list, grouped by lesson.
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { MIND_MAPS } from "@/lib/biznes/mindmaps";
import { LESSONS } from "@/lib/biznes/lessons";

export default function BiznesMindMapsPage() {
  return (
    <div>
      <PageHeader title="Mapy myśli" subtitle="Z każdego działu" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        {LESSONS.map((lesson) => {
          const maps = MIND_MAPS.filter((m) => m.lesson === lesson.id);
          if (maps.length === 0) return null;
          return (
            <section key={lesson.id} className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-foreground">
                <span className="text-primary">{lesson.short}</span> · {lesson.title}
              </h2>
              {maps.map((m) => (
                <Link
                  key={m.id}
                  href={`/biznes/mapy/${m.id}`}
                  className="flex items-center justify-between gap-3 rounded-(--radius-control) border border-border bg-surface px-3.5 py-3 transition-transform active:scale-[0.99]"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{m.center}</span>
                    <span className="block text-xs text-foreground-muted">{m.branches.length} gałęzi</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" aria-hidden />
                </Link>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
