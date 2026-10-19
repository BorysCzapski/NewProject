// ============================================================================
// app/(main)/gitara/tabulatury/page.tsx
// Tabs to play: whole songs imported from tab PDFs (see gtr_tabs).
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTabs } from "@/lib/gitara/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function TabulaturyPage() {
  await requireProfile();
  const supabase = await createClient();
  const tabs = await getTabs(supabase);

  return (
    <div>
      <PageHeader title="Tabulatury" subtitle="Utwory do zagrania" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {tabs.map((tab) => (
          <Link key={tab.id} href={`/gitara/tabulatury/${tab.slug}`}>
            <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
              <div className="min-w-0 flex-1">
                <CardTitle className="line-clamp-1">{tab.title}</CardTitle>
                <CardDescription className="mt-0.5">
                  {tab.artist}
                  {tab.capo > 0 ? ` · kapodaster ${tab.capo}` : ""}
                  {tab.tempo ? ` · ${tab.tempo} BPM` : ""} · {tab.bar_count} taktów
                </CardDescription>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
            </Card>
          </Link>
        ))}
        {tabs.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Brak tabulatur. Zaimportuj PDF-y skryptem <code>scripts/gitara-tabs-ingest.mjs</code>.
          </Card>
        )}
      </div>
    </div>
  );
}
