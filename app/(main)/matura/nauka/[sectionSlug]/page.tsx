// ============================================================================
// app/(main)/matura/nauka/[sectionSlug]/page.tsx
// Hub for any exact-match-graded section (środki językowe, czytanie, słuchanie
// — see MATURA_EXACT_MATCH_SECTION_SLUGS): the section's THEORY LIBRARY,
// grouped by kind, followed by the CKE TASK TYPES it is practised through.
// "pisanie" has its own dedicated route (different tables, AI-graded
// holistically) and is NOT served here.
//
// Lessons are listed, not inlined. Before 0017 this page concatenated every
// lesson in the section onto one screen, which was tolerable at one lesson per
// section and unusable at a dozen — each lesson now has its own page under
// teoria/, and this page only reads their titles and summaries.
//
// Tasks used to be listed the same way: "Zadanie 1..N" straight out of the
// bank, each showing the student's last score. That made every task a one-shot
// item — once answered it was done, and a section was "finished" after four
// attempts. Since 0023 the bank is tagged with CKE TASK TYPES and this page
// lists those instead: each type is a counter of how many times the student has
// done it, and starting one hands out a task they have not seen (generating a
// new one when the queue runs dry — lib/matura/task-stock.ts).
// ============================================================================
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { MATURA_EXACT_MATCH_SECTION_SLUGS } from "@/lib/matura/sections";
import { getSectionLessons, groupLessonsByKind } from "@/lib/matura/theory";
import { getTypeStats } from "@/lib/matura/task-stock";
import { startTaskType } from "@/lib/matura/practice-actions";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { TaskTypeCard } from "@/components/practice/type-card";
import type { MaturaSection, MaturaSectionSlug } from "@/lib/types/database";

// Handing out a task can generate one inline, and the after() top-up runs on
// this segment's budget too — both are AI calls. The platform default (10s on
// Vercel) would cut them off; 60 is what every other AI path in this repo uses
// (see app/api/geografia/import-exercises/route.ts).
export const maxDuration = 60;

export default async function MaturaSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ sectionSlug: string }>;
  searchParams: Promise<{ pusto?: string }>;
}) {
  const { sectionSlug } = await params;
  if (!MATURA_EXACT_MATCH_SECTION_SLUGS.includes(sectionSlug as MaturaSectionSlug)) notFound();
  const { pusto } = await searchParams;

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

  const [lessons, typeStats] = await Promise.all([
    getSectionLessons(supabase, profile.id, section.id),
    getTypeStats(supabase, profile.id, { id: section.id, slug: section.slug }, settings.level),
  ]);

  const groups = groupLessonsByKind(lessons);
  const doneCount = lessons.filter((item) => item.completed).length;
  const totalCompleted = typeStats.reduce((sum, stat) => sum + stat.completedCount, 0);

  return (
    <div>
      <PageHeader title={section.title} subtitle={section.description} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground-muted">Teoria</h2>
          {lessons.length > 0 && (
            <span className="text-xs tabular-nums text-foreground-muted">
              {doneCount}/{lessons.length} przerobione
            </span>
          )}
        </div>

        {lessons.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Teoria do tej części pojawi się wkrótce.
          </Card>
        )}

        {groups.map((group) => (
          <section key={group.kind} className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
              {group.label}
            </h3>
            {group.lessons.map(({ lesson, completed }) => (
              <Link key={lesson.id} href={`/matura/nauka/${sectionSlug}/teoria/${lesson.slug}`}>
                <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="line-clamp-1">{lesson.title}</CardTitle>
                    <CardDescription className="mt-0.5 line-clamp-2">{lesson.summary}</CardDescription>
                    <p className="mt-1 text-xs text-foreground-muted">{lesson.estimated_minutes} min</p>
                  </div>
                  {completed ? (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                      <Check className="h-3.5 w-3.5 text-accent" />
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
                  )}
                </Card>
              </Link>
            ))}
          </section>
        ))}

        <div className="mt-2 flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground-muted">Typy zadań</h2>
          {totalCompleted > 0 && (
            <span className="text-xs tabular-nums text-foreground-muted">
              {totalCompleted} wykonanych łącznie
            </span>
          )}
        </div>

        <p className="-mt-2 text-xs text-foreground-muted">
          Każdy typ możesz rozwiązywać bez końca — za każdym razem dostajesz inne zadanie.
        </p>

        {pusto && (
          <Card className="border-danger/40 text-sm text-foreground-muted">
            Do tego typu nie ma jeszcze żadnego zadania. Nagrania do rozumienia ze słuchu dodaje
            administrator — wróć tu wkrótce.
          </Card>
        )}

        {typeStats.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Zadania do tej części pojawią się wkrótce.
          </Card>
        )}

        {typeStats.map((stat) => (
          <TaskTypeCard
            key={stat.typeDef.slug}
            action={startTaskType}
            fields={{ sectionSlug, typeSlug: stat.typeDef.slug }}
            label={stat.typeDef.label}
            description={stat.typeDef.description}
            completedCount={stat.completedCount}
            lastPoints={stat.lastPoints}
            lastMaxPoints={stat.lastMaxPoints}
            averagePercent={stat.averagePercent}
            unavailableNote={
              !stat.typeDef.aiGeneratable && stat.freshAvailable === 0 && stat.completedCount > 0
                ? "Wszystkie nagrania z tej puli masz już za sobą — kolejne podejście powtórzy najstarsze."
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
