// ============================================================================
// app/(main)/gitara/piosenki/page.tsx
// Song/tab library ("Biblioteka tabulatur"): every gtr_songs row, with a link
// to import more from a PDF songbook.
// ============================================================================
import Link from "next/link";
import { ChevronRight, Upload } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getSongs } from "@/lib/gitara/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

const DIFFICULTY_LABELS: Record<number, string> = { 1: "Łatwa", 2: "Średnia", 3: "Trudna" };

export default async function GitaraSongsPage() {
  await requireProfile();
  const supabase = await createClient();
  const songs = await getSongs(supabase);

  return (
    <div>
      <PageHeader title="Piosenki" subtitle="Akordy i tabulatury" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        <Link href="/gitara/piosenki/wgraj">
          <Card className="flex items-center justify-between gap-3 bg-primary-soft transition-transform active:scale-[0.99]">
            <div className="flex items-center gap-2.5">
              <Upload className="h-4 w-4 text-primary" />
              <CardTitle className="text-primary">Wgraj śpiewnik PDF</CardTitle>
            </div>
          </Card>
        </Link>

        {songs.map((song) => (
          <Link key={song.id} href={`/gitara/piosenki/${song.slug}`}>
            <Card className="flex items-center justify-between gap-3 transition-transform active:scale-[0.99]">
              <div className="min-w-0 flex-1">
                <CardTitle className="line-clamp-1">{song.title}</CardTitle>
                <CardDescription className="mt-0.5">
                  {song.artist || "Autor nieznany"} · {DIFFICULTY_LABELS[song.difficulty]}
                  {song.tempo_bpm ? ` · ${song.tempo_bpm} BPM` : ""}
                </CardDescription>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
            </Card>
          </Link>
        ))}

        {songs.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Biblioteka jest pusta. Wgraj śpiewnik PDF albo poczekaj na dane startowe.
          </Card>
        )}
      </div>
    </div>
  );
}
