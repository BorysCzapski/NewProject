// ============================================================================
// app/(main)/nauka/piosenki/[id]/page.tsx
// Song practice page: loads the song, splits its lyrics into lines (the
// exact same expression lib/homework/progress.ts uses, so homework progress
// stays reproducible), and hands off to the client practice component.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { SongPractice } from "@/components/songs/song-practice";
import type { Song } from "@/lib/types/database";

export default async function SongDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireProfile();
  const supabase = await createClient();

  const { data: song } = await supabase.from("songs").select("*").eq("id", id).maybeSingle();
  if (!song) notFound();

  const typedSong = song as Song;
  const lines = typedSong.lyrics.split("\n").filter((l) => l.trim().length > 0);

  return (
    <div>
      <PageHeader title={typedSong.title} subtitle={typedSong.artist ?? "Piosenka"} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href="/nauka/piosenki"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie piosenki
        </Link>
        <SongPractice song={typedSong} lines={lines} />
      </div>
    </div>
  );
}
