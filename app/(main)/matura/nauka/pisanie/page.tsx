// ============================================================================
// app/(main)/matura/nauka/pisanie/page.tsx
// "Wypowiedź pisemna" hub: the section's theory library (CKE rubric, forms,
// connectors — see supabase/seed/matura*/04_lessons_pisanie.sql) followed by
// the FORMS the student practises — e-mail, wpis na blogu, rozprawka…
//
// Lessons are listed rather than inlined, matching [sectionSlug]/page.tsx —
// see the note there for why.
//
// Like the exact-match sections, this page used to list the writing bank as
// "Zadanie 1..N": four prompts at poziom podstawowy, each done once, and then
// the section had nothing left to offer. It now lists FORMS with a counter of
// how many wypowiedzi the student has written in each, and starting one hands
// out a prompt they have not answered — generating a new one when the queue
// runs dry (lib/matura/writing-stock.ts). matura_writing_tasks.form_type was
// already the right axis; it just was not the one the UI was built on.
// ============================================================================
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { getSectionLessons, groupLessonsByKind } from "@/lib/matura/theory";
import { getWritingTypeStats } from "@/lib/matura/writing-stock";
import { startWritingType } from "@/lib/matura/practice-actions";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { TaskTypeCard } from "@/components/practice/type-card";
import type { MaturaSection } from "@/lib/types/database";

// Handing out a task can generate one inline, and the after() top-up runs on
// this segment's budget too — both are AI calls. The platform default (10s on
// Vercel) would cut them off; 60 is what every other AI path in this repo uses
// (see app/api/geografia/import-exercises/route.ts).
export const maxDuration = 60;

export default async function PisaniePage({
  searchParams,
}: {
  searchParams: Promise<{ pusto?: string }>;
}) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");
  const { pusto } = await searchParams;

  const { data: sectionRow } = await supabase
    .from("matura_sections")
    .select("*")
    .eq("language", settings.language)
    .eq("level", settings.level)
    .eq("slug", "pisanie")
    .maybeSingle();
  if (!sectionRow) notFound();
  const section = sectionRow as MaturaSection;

  const [lessons, typeStats] = await Promise.all([
    getSectionLessons(supabase, profile.id, section.id),
    getWritingTypeStats(supabase, profile.id, section.id, settings.level),
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
              <Link key={lesson.id} href={`/matura/nauka/pisanie/teoria/${lesson.slug}`}>
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
          <h2 className="text-sm font-semibold text-foreground-muted">Formy wypowiedzi</h2>
          {totalCompleted > 0 && (
            <span className="text-xs tabular-nums text-foreground-muted">
              {totalCompleted} napisanych łącznie
            </span>
          )}
        </div>

        <p className="-mt-2 text-xs text-foreground-muted">
          Każdą formę możesz ćwiczyć bez końca — za każdym razem dostajesz inne polecenie.
        </p>

        {pusto && (
          <Card className="border-danger/40 text-sm text-foreground-muted">
            Nie udało się przygotować nowego polecenia. Spróbuj ponownie za chwilę.
          </Card>
        )}

        {typeStats.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Zadania do tej części pojawią się wkrótce.
          </Card>
        )}

        {typeStats.map((stat) => (
          <TaskTypeCard
            key={stat.typeDef.formType}
            action={startWritingType}
            fields={{ formType: stat.typeDef.formType }}
            label={stat.typeDef.label}
            description={stat.typeDef.description}
            completedCount={stat.completedCount}
            lastPoints={stat.lastPoints}
            lastMaxPoints={stat.lastMaxPoints}
            averagePercent={stat.averagePercent}
          />
        ))}
      </div>
    </div>
  );
}
