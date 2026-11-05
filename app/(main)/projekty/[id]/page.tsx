// ============================================================================
// app/(main)/projekty/[id]/page.tsx
// Jeden projekt: status, postęp, kroki, potrzebne rzeczy i dziennik sesji.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectDetail } from "@/components/projekty/project-detail";
import type { Project, ProjectItem, ProjectSession } from "@/lib/types/database";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", profile.id)
    .maybeSingle();
  if (!project) notFound();

  const [{ data: items }, { data: sessions }] = await Promise.all([
    supabase.from("project_items").select("*").eq("project_id", id).order("position").order("created_at"),
    supabase
      .from("project_sessions")
      .select("*")
      .eq("project_id", id)
      .order("day", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <PageHeader title={(project as Project).title} subtitle="Projekt" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Link href="/projekty" className="inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Wszystkie projekty
        </Link>
        <ProjectDetail
          project={project as Project}
          items={(items ?? []) as ProjectItem[]}
          sessions={(sessions ?? []) as ProjectSession[]}
        />
      </div>
    </div>
  );
}
