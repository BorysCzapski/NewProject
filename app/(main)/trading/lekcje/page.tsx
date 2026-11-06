// ============================================================================
// app/(main)/trading/lekcje/page.tsx
// Spis lekcji z odhaczeniem przerobionych (stan w localStorage).
// ============================================================================
import Link from "next/link";
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LessonCheck } from "@/components/trading/lesson-done";
import { LESSONS } from "@/lib/trading/content";

export default async function LekcjePage() {
  await requireProfile();
  return (
    <div>
      <PageHeader title="Lekcje" subtitle={`${LESSONS.length} lekcji`} />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {LESSONS.map((l, i) => (
          <Link key={l.slug} href={`/trading/lekcje/${l.slug}`}>
            <Card className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <CardTitle>{l.title}</CardTitle>
                <CardDescription>{l.lead}</CardDescription>
              </div>
              <LessonCheck slug={l.slug} />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
