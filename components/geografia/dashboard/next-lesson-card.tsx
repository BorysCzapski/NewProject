// ============================================================================
// components/geografia/dashboard/next-lesson-card.tsx
// "Kontynuuj naukę" — the next unread theory lesson in curriculum order (see
// getNextLesson in lib/geografia/content.ts), so the dashboard always has a
// single obvious next action rather than making the student go hunting
// through 23 działy for where they left off.
// ============================================================================
import Link from "next/link";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import type { NextLesson } from "@/lib/geografia/content";

export function NextLessonCard({ next }: { next: NextLesson }) {
  const percent = next.totalCount > 0 ? Math.round((next.doneCount / next.totalCount) * 100) : 0;

  return (
    <Link href={`/geografia/tematy/${next.topicSlug}/lekcja/${next.lessonSlug}`}>
      <Card className="flex flex-col gap-2 bg-primary-soft">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <BookOpen className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <CardDescription className="text-primary">
              Kontynuuj naukę · dział {next.ckeNumber}
            </CardDescription>
            <CardTitle>{next.lessonTitle}</CardTitle>
            <p className="mt-0.5 flex items-center gap-2 text-xs text-foreground-muted">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ok. {next.readingMinutes} min
              </span>
              <span>
                {next.doneCount}/{next.totalCount} lekcji teorii
              </span>
            </p>
          </div>
          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
        </div>
      </Card>
    </Link>
  );
}
