// ============================================================================
// app/(main)/admin/page.tsx
// Admin dashboard: every homework ever created, newest first, each with a
// rough completion count, linking through to its detail/completions screen.
// ============================================================================
import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { listHomeworkForAdmin } from "@/lib/homework/admin-queries";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HOMEWORK_TYPE_LABELS } from "@/lib/constants";

export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createClient();
  const homeworkList = await listHomeworkForAdmin(supabase);

  return (
    <div>
      <PageHeader
        title="Panel administratora"
        subtitle="Prace domowe"
        action={
          <Link href="/admin/prace-domowe/nowa">
            <Button size="sm">
              <Plus className="h-4 w-4" /> Nowa
            </Button>
          </Link>
        }
      />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        <Link href="/admin/prace-domowe/nowa">
          <Button variant="primary" className="w-full">
            <Plus className="h-4 w-4" /> Nowa praca domowa
          </Button>
        </Link>
        {homeworkList.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-foreground-muted">
            <ClipboardList className="h-10 w-10" />
            <p className="text-sm">Nie utworzono jeszcze żadnej pracy domowej.</p>
          </div>
        ) : (
          homeworkList.map((hw) => (
            <Link key={hw.id} href={`/admin/prace-domowe/${hw.id}`}>
              <Card className="flex flex-col gap-2 active:scale-[0.98] transition-transform">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{hw.title}</CardTitle>
                  <Badge className="shrink-0">{HOMEWORK_TYPE_LABELS[hw.type]}</Badge>
                </div>
                {hw.description && <CardDescription className="line-clamp-2">{hw.description}</CardDescription>}
                <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
                  <span>{hw.levels.join(", ")}</span>
                  <span>•</span>
                  <span>
                    {hw.completedCount}/{hw.eligibleCount} ukończyło
                  </span>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
