// ============================================================================
// app/(main)/gitara/akordy/[slug]/page.tsx
// One chord: a large diagram with tap-to-play, description, and the rest of
// its category to browse next.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { chordShape, getChordBySlug, getChords } from "@/lib/gitara/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ChordDiagram } from "@/components/gitara/chord-diagram";

const CATEGORY_LABELS: Record<string, string> = {
  open: "otwarty",
  power: "potęgowy (power chord)",
  barre: "barre",
  rozszerzony: "rozszerzony",
};

export default async function GitaraChordDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireProfile();
  const supabase = await createClient();

  const [chord, allChords] = await Promise.all([getChordBySlug(supabase, slug), getChords(supabase)]);
  if (!chord) notFound();

  const related = allChords.filter((c) => c.category === chord.category && c.id !== chord.id);

  return (
    <div>
      <PageHeader title={chord.symbol} subtitle={`Akord ${CATEGORY_LABELS[chord.category] ?? chord.category}`} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Link
          href="/gitara/akordy"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie akordy
        </Link>

        <Card className="flex flex-col items-center gap-2 py-6">
          <ChordDiagram chord={chordShape(chord)} label={chord.symbol} size="lg" />
        </Card>

        {chord.description && (
          <Card>
            <p className="text-sm text-foreground">{chord.description}</p>
          </Card>
        )}

        {related.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
              Więcej z tej kategorii
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              {related.map((c) => (
                <Link key={c.id} href={`/gitara/akordy/${c.slug}`}>
                  <Card className="p-2 transition-transform active:scale-[0.97]">
                    <ChordDiagram chord={chordShape(c)} label={c.symbol} size="sm" showPlay={false} />
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
