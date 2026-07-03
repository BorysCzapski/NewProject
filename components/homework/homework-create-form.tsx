"use client";

// ============================================================================
// components/homework/homework-create-form.tsx
// Admin homework creator form: shared fields (title/description/levels/
// deadline/type) plus a section of type-specific fields that swaps based on
// the chosen homework type. An "AI zaproponuj" button prefills title/
// description/type from an AI suggestion; submitting calls
// createHomeworkAction which builds the config object and creates any
// backing resource (song/writing task/listening exercise) first.
// ============================================================================
import { useActionState, useState } from "react";
import { Sparkles } from "lucide-react";
import { createHomeworkAction, suggestHomework, type ActionState } from "@/lib/homework/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { LEVELS, HOMEWORK_TYPE_LABELS, WRITING_TASK_TYPE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { GrammarTopic, HomeworkType, TrainingModule, UserLevel } from "@/lib/types/database";
import type { VocabularyCategoryOption } from "@/lib/homework/admin-queries";

const TRAINING_MODULE_LABELS: Record<TrainingModule, string> = {
  vocabulary: "Słówka",
  grammar: "Gramatyka",
  writing: "Pisanie",
};

const selectClass =
  "h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary";
const textareaClass =
  "w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary";

const initialState: ActionState = {};

export function HomeworkCreateForm({
  categories,
  topics,
}: {
  categories: VocabularyCategoryOption[];
  topics: GrammarTopic[];
}) {
  const [state, formAction, isPending] = useActionState(createHomeworkAction, initialState);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<HomeworkType | "">("");
  const [selectedLevels, setSelectedLevels] = useState<UserLevel[]>([]);
  const [wtMode, setWtMode] = useState<"any" | "specific">("any");
  const [deadlineLocal, setDeadlineLocal] = useState("");
  const [deadlineIso, setDeadlineIso] = useState("");

  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState<string | null>(null);

  function toggleLevel(level: UserLevel) {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]));
  }

  async function handleSuggest() {
    setIsSuggesting(true);
    setSuggestError(null);
    try {
      const suggestion = await suggestHomework(selectedLevels[0] ?? "A1");
      setTitle(suggestion.title);
      setDescription(suggestion.description);
      setType(suggestion.type);
      setReasoning(suggestion.reasoning);
    } catch {
      setSuggestError("Nie udało się uzyskać propozycji AI. Spróbuj ponownie.");
    } finally {
      setIsSuggesting(false);
    }
  }

  const filteredCategories = categories.filter(
    (c) => selectedLevels.length === 0 || selectedLevels.includes(c.level)
  );
  const filteredTopics = topics.filter((t) => selectedLevels.length === 0 || selectedLevels.includes(t.level));

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Button type="button" variant="outline" onClick={handleSuggest} isLoading={isSuggesting} className="w-full">
        <Sparkles className="h-4 w-4" /> Zaproponuj AI
      </Button>
      {suggestError && <p className="text-sm text-danger">{suggestError}</p>}
      {reasoning && (
        <Card className="bg-primary-soft text-sm text-foreground">
          <p className="font-medium text-primary">Dlaczego ten typ?</p>
          <p className="mt-1">{reasoning}</p>
        </Card>
      )}

      <div>
        <Label htmlFor="title">Tytuł</Label>
        <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="description">Opis</Label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={textareaClass}
          placeholder="Krótki opis dla ucznia..."
        />
      </div>

      <div>
        <Label>Poziomy</Label>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((level) => (
            <label
              key={level}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium",
                selectedLevels.includes(level)
                  ? "border-primary bg-primary-soft text-primary"
                  : "text-foreground-muted"
              )}
            >
              <input
                type="checkbox"
                name="levels"
                value={level}
                checked={selectedLevels.includes(level)}
                onChange={() => toggleLevel(level)}
                className="sr-only"
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="deadline">Termin (opcjonalnie)</Label>
        {/* datetime-local has no timezone info; a raw "2024-03-15T14:00" string
            parsed on the server would be interpreted in the SERVER's timezone,
            not the admin's. Convert to a real UTC instant here in the browser
            (where `new Date(...)` correctly uses the admin's local timezone)
            and submit that instead. */}
        <Input
          id="deadline"
          type="datetime-local"
          value={deadlineLocal}
          onChange={(e) => {
            setDeadlineLocal(e.target.value);
            setDeadlineIso(e.target.value ? new Date(e.target.value).toISOString() : "");
          }}
        />
        <input type="hidden" name="deadline" value={deadlineIso} />
      </div>

      <div>
        <Label htmlFor="type">Typ pracy domowej</Label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as HomeworkType)}
          required
          className={selectClass}
        >
          <option value="" disabled>
            Wybierz typ...
          </option>
          {Object.entries(HOMEWORK_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {type === "song_translation" && (
        <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="song_title">Tytuł piosenki</Label>
            <Input id="song_title" name="song_title" required />
          </div>
          <div>
            <Label htmlFor="song_artist">Wykonawca (opcjonalnie)</Label>
            <Input id="song_artist" name="song_artist" />
          </div>
          <div>
            <Label htmlFor="song_lyrics">Tekst piosenki</Label>
            <textarea id="song_lyrics" name="song_lyrics" rows={6} required className={textareaClass} />
          </div>
        </div>
      )}

      {type === "vocabulary_mastery" && (
        <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="vm_category">Kategoria (opcjonalnie — puste = wszystkie)</Label>
            <Input id="vm_category" name="vm_category" list="vm-categories" placeholder="np. jedzenie" />
            <datalist id="vm-categories">
              {filteredCategories.map((c) => (
                <option key={`${c.level}-${c.category}`} value={c.category} />
              ))}
            </datalist>
          </div>
          <div>
            <Label htmlFor="vm_threshold">Próg opanowania (%)</Label>
            <Input id="vm_threshold" name="vm_threshold" type="number" min={1} max={100} defaultValue={80} />
          </div>
        </div>
      )}

      {type === "training_count" && (
        <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="tc_module">Moduł</Label>
            <select id="tc_module" name="tc_module" required defaultValue="" className={selectClass}>
              <option value="" disabled>
                Wybierz moduł...
              </option>
              {Object.entries(TRAINING_MODULE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="tc_count">Liczba treningów</Label>
            <Input id="tc_count" name="tc_count" type="number" min={1} defaultValue={5} required />
          </div>
        </div>
      )}

      {type === "reading_count" && (
        <div>
          <Label htmlFor="rc_count">Liczba tekstów do przeczytania</Label>
          <Input id="rc_count" name="rc_count" type="number" min={1} defaultValue={3} required />
        </div>
      )}

      {type === "flashcards_count" && (
        <div>
          <Label htmlFor="fc_count">Liczba sesji fiszek</Label>
          <Input id="fc_count" name="fc_count" type="number" min={1} defaultValue={3} required />
        </div>
      )}

      {type === "grammar_topic" && (
        <div>
          <Label htmlFor="gt_topic_id">Temat gramatyczny</Label>
          <select id="gt_topic_id" name="gt_topic_id" required defaultValue="" className={selectClass}>
            <option value="" disabled>
              Wybierz temat...
            </option>
            {filteredTopics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.level})
              </option>
            ))}
          </select>
          {filteredTopics.length === 0 && (
            <p className="mt-1 text-xs text-foreground-muted">Brak tematów gramatycznych dla wybranych poziomów.</p>
          )}
        </div>
      )}

      {type === "writing_task" && (
        <div className="flex flex-col gap-3">
          <div>
            <Label>Zakres zadania</Label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="radio"
                  name="wt_mode"
                  value="any"
                  checked={wtMode === "any"}
                  onChange={() => setWtMode("any")}
                  className="accent-primary"
                />
                Dowolne zgłoszenie pisemne (bez konkretnego tematu)
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="radio"
                  name="wt_mode"
                  value="specific"
                  checked={wtMode === "specific"}
                  onChange={() => setWtMode("specific")}
                  className="accent-primary"
                />
                Konkretne zadanie (utworzę temat)
              </label>
            </div>
          </div>
          {wtMode === "specific" && (
            <>
              <div>
                <Label htmlFor="wt_task_type">Rodzaj zadania</Label>
                <select id="wt_task_type" name="wt_task_type" required defaultValue="" className={selectClass}>
                  <option value="" disabled>
                    Wybierz rodzaj...
                  </option>
                  {Object.entries(WRITING_TASK_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="wt_scenario">Polecenie (opcjonalnie — puste = AI wygeneruje)</Label>
                <textarea id="wt_scenario" name="wt_scenario" rows={3} className={textareaClass} />
              </div>
            </>
          )}
        </div>
      )}

      {type === "listening_task" && (
        <div>
          <Label htmlFor="lt_youtube_url">Link do filmiku YouTube</Label>
          <Input
            id="lt_youtube_url"
            name="lt_youtube_url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>
      )}

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <Button type="submit" isLoading={isPending} className="w-full" disabled={!type}>
        Utwórz pracę domową
      </Button>
    </form>
  );
}
