// ============================================================================
// app/(main)/projekty/page.tsx
// Lista projektów z hobby: status, pasek postępu (z kroków) i liczba
// brakujących rzeczy. Na górze formularz nowego projektu.
// ============================================================================
import Link from "next/link";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { NewProjectForm } from "@/components/projekty/new-project-form";
import { STATUS_LABELS, stepProgress } from "@/lib/projekty/constants";
import type { Project, ProjectItem } from "@/lib/types/database";

export default async function ProjektyPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [{ data: projects }, { data: items }] = await Promise.all([
    supabase.from("projects").select("*").eq("user_id", profile.id).order("updated_at", { ascending: false }),
    supabase.from("project_items").select("project_id, kind, done").eq("user_id", profile.id),
  ]);

  const byProject = new Map<string, Pick<ProjectItem, "kind" | "done">[]>();
  for (const i of items ?? []) {
    const list = byProject.get(i.project_id) ?? [];
    list.push(i);
    byProject.set(i.project_id, list);
  }

  return (
    <div>
      <PageHeader title="Projekty" subtitle="Hobby, naprawy, nauka — krok po kroku" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <NewProjectForm />
        {(projects ?? []).length === 0 && (
          <p className="text-center text-sm text-foreground-muted">Nie masz jeszcze projektów. Dodaj pierwszy powyżej.</p>
        )}
        {((projects ?? []) as Project[]).map((p) => {
          const list = byProject.get(p.id) ?? [];
          const progress = stepProgress(list);
          const missing = list.filter((i) => i.kind === "need" && !i.done).length;
          return (
            <Link key={p.id} href={`/projekty/${p.id}`}>
              <Card className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{p.title}</CardTitle>
                  <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
                    {STATUS_LABELS[p.status]}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${progress.pct ?? 0}%` }} />
                </div>
                <CardDescription>
                  {progress.total === 0 ? "Brak kroków" : `${progress.done}/${progress.total} kroków`}
                  {missing > 0 && ` • do zdobycia: ${missing}`}
                </CardDescription>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
