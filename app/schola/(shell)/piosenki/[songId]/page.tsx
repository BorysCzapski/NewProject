// ============================================================================
// app/schola/(shell)/piosenki/[songId]/page.tsx
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Music4, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getScholaSong } from "@/lib/schola/queries";
import { ScholaPageHeader } from "@/components/schola/page-header";
import { ChordProView } from "@/components/schola/chordpro-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ScholaSongDetailPage({
  params,
}: {
  params: Promise<{ songId: string }>;
}) {
  const { songId } = await params;
  const supabase = await createClient();
  const song = await getScholaSong(supabase, songId);
  if (!song) notFound();

  return (
    <div>
      <ScholaPageHeader
        title={song.title}
        action={
          <Link href={`/schola/piosenki/${song.id}/edytuj`}>
            <Button size="sm" variant="outline">
              <Pencil className="h-4 w-4" /> Edytuj
            </Button>
          </Link>
        }
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        {song.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {song.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        {(song.youtube_url || song.sheet_music_url) && (
          <div className="mb-4 flex flex-col gap-2">
            {song.youtube_url && (
              <a
                href={song.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-primary"
              >
                <Music4 className="h-4 w-4" /> Posłuchaj nagrania
              </a>
            )}
            {song.sheet_music_url && (
              <a
                href={song.sheet_music_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-primary"
              >
                <FileText className="h-4 w-4" /> Nuty
              </a>
            )}
          </div>
        )}

        <ChordProView text={song.lyrics_chordpro} />
      </div>
    </div>
  );
}
