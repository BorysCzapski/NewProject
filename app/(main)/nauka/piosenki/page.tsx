// ============================================================================
// app/(main)/nauka/piosenki/page.tsx
// Songs hub: a form to add a new song from pasted lyrics, plus a list of
// every shared song (any user's) to practice translating.
// ============================================================================
import Link from "next/link";
import { Music } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { NewSongForm } from "@/components/songs/new-song-form";
import type { Song } from "@/lib/types/database";

export default async function SongsHubPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: songs } = await supabase
    .from("songs")
    .select("*")
    .eq("language", profile.target_language)
    .order("created_at", { ascending: false });
  const songList = (songs ?? []) as Song[];

  return (
    <div>
      <PageHeader
        title="Piosenki"
        subtitle="Tłumacz teksty piosenek linijka po linijce"
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Card className="mb-6">
          <CardTitle>Nowa piosenka</CardTitle>
          <CardDescription className="mt-1 mb-3">
            Wklej tekst ulubionej piosenki i przetłumacz go na polski.
          </CardDescription>
          <NewSongForm />
        </Card>

        <h2 className="mb-3 text-sm font-semibold text-foreground-muted">Dostępne piosenki</h2>
        {songList.length === 0 ? (
          <Card>
            <CardDescription>Nikt jeszcze nie dodał żadnej piosenki. Bądź pierwszy!</CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {songList.map((song) => (
              <Link key={song.id} href={`/nauka/piosenki/${song.id}`}>
                <Card className="flex items-center gap-3 active:scale-[0.98] transition-transform">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Music className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <CardTitle>{song.title}</CardTitle>
                    {song.artist && <CardDescription className="mt-0.5">{song.artist}</CardDescription>}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
