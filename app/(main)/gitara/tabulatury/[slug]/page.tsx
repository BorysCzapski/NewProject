// ============================================================================
// app/(main)/gitara/tabulatury/[slug]/page.tsx
// One tab: header with capo / tempo / credit, then the tab itself.
// ============================================================================
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTabBySlug } from "@/lib/gitara/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { TabViewer } from "@/components/gitara/tab-viewer";

export default async function TabulaturaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await requireProfile();
  const supabase = await createClient();
  const tab = await getTabBySlug(supabase, slug);
  if (!tab) notFound();

  const facts = [
    tab.capo > 0 ? `Kapodaster: ${tab.capo}. próg` : "Bez kapodastra",
    tab.tempo ? `${tab.tempo} BPM` : null,
    `${tab.bar_count} taktów`,
    tab.tuning === "standard" ? "Strój standardowy" : null,
  ].filter(Boolean);

  return (
    <div>
      <PageHeader title={tab.title} subtitle={tab.artist} />
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 py-5">
        <Card className="flex flex-col gap-1.5 text-sm">
          <p className="font-medium text-foreground">{facts.join(" · ")}</p>
          {tab.capo > 0 && (
            <p className="text-foreground-muted">Numery progów liczysz od kapodastra — pierwszy próg to ten tuż za nim.</p>
          )}
          {tab.note && <p className="text-foreground-muted">{tab.note}</p>}
          <p className="text-xs text-foreground-muted">
            {tab.arranger ? `Aranżacja: ${tab.arranger}. ` : ""}Tabulatura do prywatnej nauki — nie udostępniaj jej dalej.
          </p>
          <p className="text-xs text-foreground-muted">
            Kolor <span className="font-semibold text-primary">zielony</span> = flażolet sztuczny (AH), <span className="font-mono">x</span> = wyciszona nuta,{" "}
            <span className="font-mono">(n)</span> = nuta przetrzymana, H / P = hammer-on / pull-off.
          </p>
        </Card>
        <TabViewer bars={tab.bars} />
      </div>
    </div>
  );
}
