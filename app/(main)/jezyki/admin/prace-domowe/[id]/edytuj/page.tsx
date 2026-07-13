// ============================================================================
// app/(main)/admin/prace-domowe/[id]/edytuj/page.tsx
// Admin homework editor: loads a single homework by id and hands it to the
// edit form. Only wording (title/description) and the deadline can change —
// type and config are locked because they own backing resources and student
// progress (see updateHomeworkAction).
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { HomeworkEditForm } from "@/components/homework/homework-edit-form";
import type { Homework } from "@/lib/types/database";

export default async function EditHomeworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();
  const supabase = await createClient();

  const { data: homeworkRow } = await supabase
    .from("homework")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!homeworkRow) notFound();
  const homework = homeworkRow as Homework;

  return (
    <div>
      <PageHeader title="Edytuj pracę domową" subtitle={homework.title} />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        <Link
          href={`/jezyki/admin/prace-domowe/${homework.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć do pracy domowej
        </Link>
        <HomeworkEditForm homework={homework} />
      </div>
    </div>
  );
}
