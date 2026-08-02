"use client";

// ============================================================================
// components/schola/song-form.tsx
// Reusable song create/edit form — also reused verbatim as the review step
// for both AI import flows (PDF split, photo OCR), pre-filled with the AI's
// draft instead of empty fields, per the "AI output is a draft, human
// reviews before save" principle (see lib/paragony/receipts-actions.ts).
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  createScholaSong,
  updateScholaSong,
  deleteScholaSong,
  type SongInput,
} from "@/lib/schola/songs-actions";
import { SUGGESTED_SCHOLA_TAGS } from "@/lib/schola/tags";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChordProView } from "@/components/schola/chordpro-view";

const textareaClass =
  "w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary";

export function SongForm({
  song,
  songId,
  onSaved,
  onDiscard,
}: {
  song?: SongInput;
  songId?: string;
  /** Called with the new/updated song id after a successful save. Defaults
   * to router.push("/schola/piosenki/{id}") when omitted. */
  onSaved?: (id: string) => void;
  /** When present, renders a "discard" button instead of a delete-confirm
   * (used by the PDF/photo import review screens, which have nothing to
   * delete yet — only a draft to drop). */
  onDiscard?: () => void;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(song?.title ?? "");
  const [lyrics, setLyrics] = useState(song?.lyrics_chordpro ?? "");
  const [tags, setTags] = useState<string[]>(song?.tags ?? []);
  const [customTag, setCustomTag] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState(song?.youtube_url ?? "");
  const [sheetMusicUrl, setSheetMusicUrl] = useState(song?.sheet_music_url ?? "");

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function addCustomTag() {
    const value = customTag.trim();
    if (value && !tags.includes(value)) setTags((prev) => [...prev, value]);
    setCustomTag("");
  }

  function submit() {
    if (!title.trim() || pending) return;
    setError(null);
    const input: SongInput = {
      title,
      lyrics_chordpro: lyrics,
      tags,
      youtube_url: youtubeUrl,
      sheet_music_url: sheetMusicUrl,
    };
    startTransition(async () => {
      let id: string;
      if (songId) {
        const result = await updateScholaSong(songId, input);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        id = songId;
      } else {
        const result = await createScholaSong(input);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        id = result.data.id;
      }
      if (onSaved) {
        onSaved(id);
      } else {
        router.push(`/schola/piosenki/${id}`);
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!songId) return;
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteScholaSong(songId);
      if (!result.ok) {
        setDeleteError(result.error);
        return;
      }
      router.push("/schola/piosenki");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label htmlFor="song-title">Tytuł</Label>
        <Input id="song-title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={pending} />
      </div>

      <div>
        <Label htmlFor="song-lyrics">Tekst z akordami</Label>
        <p className="mb-1.5 text-xs text-foreground-muted">
          Akordy w nawiasach kwadratowych tuż przed sylabą, np. &quot;Panie, [C]przyjdź [G]do nas&quot;.
        </p>
        <textarea
          id="song-lyrics"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          rows={10}
          className={textareaClass}
          disabled={pending}
        />
      </div>

      {lyrics.trim() && (
        <Card>
          <p className="mb-2 text-xs font-medium text-foreground-muted">Podgląd</p>
          <ChordProView text={lyrics} />
        </Card>
      )}

      <div>
        <Label>Tagi</Label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {SUGGESTED_SCHOLA_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              disabled={pending}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                tags.includes(tag)
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-surface text-foreground-muted"
              )}
            >
              {tag}
            </button>
          ))}
          {tags
            .filter((t) => !(SUGGESTED_SCHOLA_TAGS as readonly string[]).includes(t))
            .map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                disabled={pending}
                className="rounded-full border border-primary bg-primary-soft px-3 py-1.5 text-sm text-primary"
              >
                {tag}
              </button>
            ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Własny tag"
            disabled={pending}
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={addCustomTag} disabled={pending}>
            Dodaj
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="song-youtube">Link do nagrania (YouTube)</Label>
        <Input
          id="song-youtube"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://youtube.com/..."
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="song-sheet">Link do nut (np. Dysk Google)</Label>
        <Input
          id="song-sheet"
          value={sheetMusicUrl}
          onChange={(e) => setSheetMusicUrl(e.target.value)}
          placeholder="https://drive.google.com/..."
          disabled={pending}
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button size="lg" className="w-full" onClick={submit} disabled={!title.trim()} isLoading={pending}>
        {songId ? "Zapisz zmiany" : "Zapisz pieśń"}
      </Button>

      {onDiscard && (
        <Button type="button" variant="ghost" className="w-full" onClick={onDiscard}>
          Odrzuć
        </Button>
      )}

      {songId && !onDiscard && (
        <div>
          {confirmDelete ? (
            <Card className="flex flex-col gap-3 bg-warning-soft">
              <div className="flex gap-2.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <p className="text-sm text-foreground">
                  Na pewno chcesz usunąć tę pieśń? Zniknie też z planów Mszy, w których się znajduje.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={deleting}
                  onClick={() => setConfirmDelete(false)}
                >
                  Anuluj
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  className="flex-1"
                  isLoading={deleting}
                  onClick={handleDelete}
                >
                  Usuń
                </Button>
              </div>
            </Card>
          ) : (
            <Button
              type="button"
              variant="danger"
              className="w-full"
              disabled={pending}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" /> Usuń pieśń
            </Button>
          )}
          {deleteError && <p className="mt-2 text-sm text-danger">{deleteError}</p>}
        </div>
      )}
    </div>
  );
}
