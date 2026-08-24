// ============================================================================
// app/(main)/gitara/piosenki/[slug]/page.tsx
// One song: chords-over-lyrics (SongLyrics) and/or a raw tab excerpt,
// whichever the song has.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getSongBySlug } from "@/lib/gitara/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { SongLyrics } from "@/components/gitara/song-lyrics";

export default async function GitaraSongDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await requireProfile();
  const supabase = await createClient();

  const song = await getSongBySlug(supabase, slug);
  if (!song) notFound();

  return (
    <div>
      <PageHeader title={song.title} subtitle={song.artist || "Autor nieznany"} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Link
          href="/gitara/piosenki"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie piosenki
        </Link>

        {(song.tempo_bpm || song.capo > 0) && (
          <div className="flex gap-2 text-xs text-foreground-muted">
            {song.tempo_bpm && <span>Tempo: ok. {song.tempo_bpm} BPM</span>}
            {song.capo > 0 && <span>Capo: {song.capo} próg</span>}
          </div>
        )}

        {song.content_chordpro && (
          <Card className="overflow-x-auto">
            <SongLyrics content={song.content_chordpro} />
          </Card>
        )}

        {song.tab_text && (
          <Card className="overflow-x-auto">
            <pre className="text-xs leading-relaxed">
              <code className="font-mono text-foreground">{song.tab_text}</code>
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}
