// ============================================================================
// app/(main)/gitara/akordy/page.tsx
// Chord library ("Lekcje akordów"): every chord in gtr_chords, grouped by
// category (open → power → barre → rozszerzony — roughly the order a
// beginner should learn them in) and tappable to a diagram + audio.
// ============================================================================
import Link from "next/link";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { chordShape, getChords } from "@/lib/gitara/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ChordDiagram } from "@/components/gitara/chord-diagram";

const CATEGORY_LABELS: Record<string, string> = {
  open: "Otwarte",
  power: "Potęgowe (power chords)",
  barre: "Barre (z chwytem barowym)",
  rozszerzony: "Rozszerzone",
};
const CATEGORY_ORDER = ["open", "power", "barre", "rozszerzony"];

export default async function GitaraChordsPage() {
  await requireProfile();
  const supabase = await createClient();
  const chords = await getChords(supabase);

  return (
    <div>
      <PageHeader title="Akordy" subtitle="Biblioteka chwytów" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        {CATEGORY_ORDER.map((category) => {
          const inCategory = chords.filter((c) => c.category === category);
          if (inCategory.length === 0) return null;
          return (
            <section key={category} className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
              <div className="grid grid-cols-3 gap-2.5">
                {inCategory.map((chord) => (
                  <Link key={chord.id} href={`/gitara/akordy/${chord.slug}`}>
                    <Card className="p-2 transition-transform active:scale-[0.97]">
                      <ChordDiagram chord={chordShape(chord)} label={chord.symbol} size="sm" showPlay={false} />
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {chords.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Biblioteka akordów pojawi się po wgraniu danych startowych z <code>supabase/seed/gitara/</code>.
          </Card>
        )}
      </div>
    </div>
  );
}
