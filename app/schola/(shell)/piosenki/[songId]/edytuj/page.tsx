// ============================================================================
// app/schola/(shell)/piosenki/[songId]/edytuj/page.tsx
// ============================================================================
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getScholaSong } from "@/lib/schola/queries";
import { ScholaPageHeader } from "@/components/schola/page-header";
import { SongForm } from "@/components/schola/song-form";

export default async function EditScholaSongPage({
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
      <ScholaPageHeader title="Edytuj pieśń" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <SongForm
          songId={song.id}
          song={{
            title: song.title,
            lyrics_chordpro: song.lyrics_chordpro,
            tags: song.tags,
            youtube_url: song.youtube_url ?? "",
            sheet_music_url: song.sheet_music_url ?? "",
          }}
        />
      </div>
    </div>
  );
}
