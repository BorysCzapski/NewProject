// ============================================================================
// app/(main)/matura/nauka/page.tsx
// "Nauka" hub: the 4 exam parts for the student's chosen poziom. Redirects
// to the dashboard (which shows the picker) if no poziom is set yet.
// ============================================================================
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookMarked, ChevronRight, Layers } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { getSectionsWithProgress } from "@/lib/matura/progress";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { SectionList } from "@/components/matura/section-list";

export default async function MaturaNaukaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const sections = await getSectionsWithProgress(supabase, profile.id, settings.level);

  return (
    <div>
      <PageHeader title="Nauka" subtitle="Zacznij od teorii, potem ćwicz zadania z egzaminu" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground-muted">Teoria</h2>
        <div className="mb-5 flex flex-col gap-3">
          <Link href="/matura/nauka/gramatyka">
            <Card className="flex items-center gap-3 transition-transform active:scale-[0.98]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Layers className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <CardTitle>Gramatyka</CardTitle>
                <CardDescription>Wyjaśnienia struktur wymaganych na maturze + ćwiczenia</CardDescription>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
            </Card>
          </Link>
          <Link href="/matura/nauka/slownictwo">
            <Card className="flex items-center gap-3 transition-transform active:scale-[0.98]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <BookMarked className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <CardTitle>Słownictwo</CardTitle>
                <CardDescription>Fiszki wg kręgów tematycznych CKE</CardDescription>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
            </Card>
          </Link>
        </div>

        <h2 className="mb-3 text-sm font-semibold text-foreground-muted">Części egzaminu</h2>
        <SectionList sections={sections} />
      </div>
    </div>
  );
}
