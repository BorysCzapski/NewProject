// ============================================================================
// app/(main)/matma/diagnoza/page.tsx
// Startup diagnostic hub: an optional, per-topic quick placement test. Lists
// every math topic, marking the ones already diagnosed (still clickable —
// re-running is allowed), plus a prominent skip-everything escape hatch.
// ============================================================================
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopics } from "@/lib/matma/content";
import { getAllTopicProgress } from "@/lib/matma/progress";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkipDiagnosticButton } from "@/components/matma/diagnostic/skip-button";

export default async function DiagnozaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [topics, progress] = await Promise.all([
    getTopics(supabase),
    getAllTopicProgress(supabase, profile.id),
  ]);

  const diagnosedTopicIds = new Set(
    progress.filter((p) => p.diagnosed_at !== null).map((p) => p.topic_id)
  );

  return (
    <div>
      <PageHeader
        title="Diagnoza startowa"
        subtitle="Kilka szybkich pytań z każdego działu, żeby wiedzieć, od czego zacząć"
      />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Card className="bg-primary-soft">
          <p className="text-sm text-primary">
            To krótki, opcjonalny test po kilka pytań na dział — możesz zdiagnozować tylko wybrane działy albo
            pominąć to całkowicie i zacząć naukę od podstaw.
          </p>
        </Card>

        <SkipDiagnosticButton />

        {topics.length === 0 ? (
          <Card className="text-center text-sm text-foreground-muted">Bank działów jest jeszcze pusty.</Card>
        ) : (
          <div className="flex flex-col gap-3">
            {topics.map((topic) => {
              const diagnosed = diagnosedTopicIds.has(topic.id);
              return (
                <Link key={topic.id} href={`/matma/diagnoza/${topic.slug}`}>
                  <Card className="flex items-center gap-3 transition-transform active:scale-[0.98]">
                    <div className="min-w-0 flex-1">
                      <CardTitle>{topic.title}</CardTitle>
                      {diagnosed ? (
                        <Badge className="mt-1.5 bg-accent-soft text-accent">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          już zdiagnozowano
                        </Badge>
                      ) : (
                        <CardDescription className="mt-1 line-clamp-2">{topic.description}</CardDescription>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
