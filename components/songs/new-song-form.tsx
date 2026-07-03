"use client";

// ============================================================================
// components/songs/new-song-form.tsx
// Form for adding a new song (title/artist/pasted lyrics) on the songs hub.
// Submitting calls the startSong Server Action, which creates the song and
// redirects to its practice page.
// ============================================================================
import { useState, useTransition, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startSong } from "@/lib/songs/actions";

const textareaClass =
  "w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground " +
  "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70";

export function NewSongForm() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !lyrics.trim() || pending) return;
    setError(null);
    startTransition(async () => {
      try {
        await startSong(title, artist, lyrics);
      } catch (err) {
        // On success the action redirects, which throws a special Next.js
        // navigation error that must propagate, not be swallowed here.
        unstable_rethrow(err);
        setError("Nie udało się zapisać piosenki. Spróbuj ponownie.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="song-title">Tytuł</Label>
        <Input
          id="song-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={pending}
          required
        />
      </div>
      <div>
        <Label htmlFor="song-artist">Wykonawca (opcjonalnie)</Label>
        <Input
          id="song-artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          disabled={pending}
        />
      </div>
      <div>
        <Label htmlFor="song-lyrics">Tekst piosenki</Label>
        <textarea
          id="song-lyrics"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          disabled={pending}
          rows={10}
          required
          className={textareaClass}
        />
        <p className="mt-1.5 text-xs text-foreground-muted">wklej tekst piosenki</p>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={pending}
        disabled={!title.trim() || !lyrics.trim()}
      >
        Rozpocznij naukę
      </Button>
    </form>
  );
}
