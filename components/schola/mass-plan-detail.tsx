"use client";

// ============================================================================
// components/schola/mass-plan-detail.tsx
// Mass plan detail: inline-editable title/date/notes, a song picker + add,
// an ordered item list (▲/▼ reorder, per-item note autosaved on blur,
// remove), and a delete-plan control at the bottom.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import {
  updateMassPlan,
  deleteMassPlan,
  addSongToPlan,
  removeSongFromPlan,
  updatePlanItemNote,
  reorderPlanItems,
} from "@/lib/schola/mass-plan-actions";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ScholaMassPlan, ScholaSong } from "@/lib/types/database";
import type { MassPlanItemWithSong } from "@/lib/schola/queries";

const selectClass =
  "h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary";
const textareaClass =
  "w-full rounded-(--radius-control) border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary";

export function MassPlanDetail({
  plan,
  items,
  allSongs,
}: {
  plan: ScholaMassPlan;
  items: MassPlanItemWithSong[];
  allSongs: ScholaSong[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState(plan.title);
  const [massDate, setMassDate] = useState(plan.mass_date);
  const [notes, setNotes] = useState(plan.notes);
  const [savingDetails, startDetailsTransition] = useTransition();
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const [selectedSongId, setSelectedSongId] = useState(allSongs[0]?.id ?? "");
  const [addingSong, startAddTransition] = useTransition();
  const [addError, setAddError] = useState<string | null>(null);

  const [order, setOrder] = useState(items.map((i) => i.id));
  const [reordering, startReorderTransition] = useTransition();

  const [confirmDeletePlan, setConfirmDeletePlan] = useState(false);
  const [deletingPlan, startDeletePlanTransition] = useTransition();

  const itemsById = new Map(items.map((i) => [i.id, i]));
  const orderedItems = order.map((id) => itemsById.get(id)).filter((i): i is MassPlanItemWithSong => !!i);
  const availableSongs = allSongs.filter((s) => !items.some((i) => i.song_id === s.id));

  function saveDetails() {
    setDetailsError(null);
    startDetailsTransition(async () => {
      const result = await updateMassPlan(plan.id, { title, massDate, notes });
      if (!result.ok) setDetailsError(result.error);
      else router.refresh();
    });
  }

  function handleAddSong() {
    if (!selectedSongId) return;
    setAddError(null);
    startAddTransition(async () => {
      const result = await addSongToPlan(plan.id, selectedSongId);
      if (!result.ok) {
        setAddError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleRemove(itemId: string) {
    startReorderTransition(async () => {
      await removeSongFromPlan(plan.id, itemId);
      router.refresh();
    });
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    startReorderTransition(async () => {
      await reorderPlanItems(plan.id, next);
      router.refresh();
    });
  }

  function handleNoteBlur(itemId: string, note: string) {
    startReorderTransition(async () => {
      await updatePlanItemNote(plan.id, itemId, note);
    });
  }

  function handleDeletePlan() {
    startDeletePlanTransition(async () => {
      await deleteMassPlan(plan.id);
      router.push("/schola/msze");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-3">
        <div>
          <Label htmlFor="plan-title">Nazwa</Label>
          <Input id="plan-title" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={saveDetails} />
        </div>
        <div>
          <Label htmlFor="plan-date">Data Mszy</Label>
          <Input
            id="plan-date"
            type="date"
            value={massDate}
            onChange={(e) => setMassDate(e.target.value)}
            onBlur={saveDetails}
          />
        </div>
        <div>
          <Label htmlFor="plan-notes">Notatki</Label>
          <textarea
            id="plan-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={saveDetails}
            rows={3}
            className={textareaClass}
          />
        </div>
        {savingDetails && <p className="text-xs text-foreground-muted">Zapisywanie…</p>}
        {detailsError && <p className="text-sm text-danger">{detailsError}</p>}
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Pieśni</CardTitle>

        {orderedItems.length === 0 ? (
          <p className="text-sm text-foreground-muted">Nie dodano jeszcze żadnych pieśni.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {orderedItems.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-2 rounded-(--radius-control) border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {index + 1}. {item.song.title}
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0 || reordering}
                      aria-label="Przenieś wyżej"
                      className="rounded-(--radius-control) p-1.5 text-foreground-muted hover:bg-surface-muted disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === orderedItems.length - 1 || reordering}
                      aria-label="Przenieś niżej"
                      className="rounded-(--radius-control) p-1.5 text-foreground-muted hover:bg-surface-muted disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      disabled={reordering}
                      aria-label="Usuń z planu"
                      className="rounded-(--radius-control) p-1.5 text-foreground-muted hover:bg-danger-soft hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <textarea
                  defaultValue={item.note}
                  onBlur={(e) => handleNoteBlur(item.id, e.target.value)}
                  placeholder="Notatka, np. 2x refren, 1x zwrotka"
                  rows={2}
                  className={textareaClass}
                />
              </div>
            ))}
          </div>
        )}

        {availableSongs.length > 0 && (
          <div className="flex items-end gap-2 border-t border-border pt-3">
            <div className="flex-1">
              <Label htmlFor="add-song">Dodaj pieśń</Label>
              <select
                id="add-song"
                className={selectClass}
                value={selectedSongId}
                onChange={(e) => setSelectedSongId(e.target.value)}
              >
                {availableSongs.map((song) => (
                  <option key={song.id} value={song.id}>
                    {song.title}
                  </option>
                ))}
              </select>
            </div>
            <Button type="button" onClick={handleAddSong} isLoading={addingSong}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
        {addError && <p className="text-sm text-danger">{addError}</p>}
      </Card>

      {confirmDeletePlan ? (
        <Card className="flex flex-col gap-3 bg-warning-soft">
          <div className="flex gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-sm text-foreground">Na pewno chcesz usunąć ten plan Mszy?</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setConfirmDeletePlan(false)}>
              Anuluj
            </Button>
            <Button
              type="button"
              variant="danger"
              className="flex-1"
              isLoading={deletingPlan}
              onClick={handleDeletePlan}
            >
              Usuń
            </Button>
          </div>
        </Card>
      ) : (
        <Button type="button" variant="danger" className="w-full" onClick={() => setConfirmDeletePlan(true)}>
          <Trash2 className="h-4 w-4" /> Usuń plan
        </Button>
      )}
    </div>
  );
}
