"use client";

// ============================================================================
// components/modlitwa/settings-form.tsx
// Ustawienia aplikacji Modlitwa: przypomnienie o modlitwie, tryb dużej
// czcionki i synchronizacja kalendarza (subskrypcja ICS).
//
// Przypomnienia: włączenie prosi przeglądarkę o zgodę na powiadomienia od
// razu — bez zgody sam zapis ustawienia byłby pustą obietnicą. Samo
// powiadomienie wysyła komponent PrayerReminder, gdy aplikacja jest otwarta;
// świadomie NIE udajemy, że mamy pełny push (wymagałby service workera i
// serwera powiadomień — patrz opis w README aplikacji).
// ============================================================================
import { useState, useTransition } from "react";
import { CalendarPlus, Check, Copy, RefreshCw, TriangleAlert } from "lucide-react";
import {
  rotateCalendarToken,
  syncCurrentAndNextYear,
  updatePrayerSettings,
} from "@/lib/modlitwa/settings-actions";
import type { PrayerSettings } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <Label htmlFor={id}>{label}</Label>
        {description && <p className="text-sm text-foreground-muted">{description}</p>}
      </div>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-6 w-6 shrink-0 accent-[var(--primary)]"
      />
    </div>
  );
}

export function SettingsForm({
  settings,
  feedUrl,
}: {
  settings: PrayerSettings;
  feedUrl: string;
}) {
  const [state, setState] = useState(settings);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmRotate, setConfirmRotate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentFeedUrl = feedUrl.replace(settings.calendar_token, state.calendar_token);

  function save(patch: Parameters<typeof updatePrayerSettings>[0], optimistic: Partial<PrayerSettings>) {
    setError(null);
    const previous = state;
    setState((s) => ({ ...s, ...optimistic }));

    startTransition(async () => {
      const result = await updatePrayerSettings(patch);
      if (!result.ok) {
        setState(previous);
        setError(result.error);
        return;
      }
      setState(result.data);
    });
  }

  async function handleNotifications(enabled: boolean) {
    if (enabled && typeof Notification !== "undefined" && Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Przeglądarka nie zgodziła się na powiadomienia — możesz to zmienić w jej ustawieniach.");
        return;
      }
    }
    save({ notificationsEnabled: enabled }, { notifications_enabled: enabled });
  }

  function handleSync() {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await syncCurrentAndNextYear();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setNotice(`Zapisano ${result.data.count} dni liturgicznych na ten i przyszły rok.`);
    });
  }

  function handleRotate() {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await rotateCalendarToken();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setState(result.data);
      setConfirmRotate(false);
      setNotice("Nowy adres wygenerowany. Zaktualizuj subskrypcję w swoim kalendarzu.");
    });
  }

  async function copyFeed() {
    try {
      await navigator.clipboard.writeText(currentFeedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Nie udało się skopiować adresu — zaznacz go i skopiuj ręcznie.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <CardTitle>Przypomnienia</CardTitle>
        <Toggle
          id="notifications"
          label="Przypominaj o modlitwie"
          description="Powiadomienie o ustalonej porze, gdy aplikacja jest otwarta."
          checked={state.notifications_enabled}
          onChange={handleNotifications}
          disabled={isPending}
        />
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="reminderTime">Godzina przypomnienia</Label>
          <Input
            id="reminderTime"
            type="time"
            value={state.reminder_time.slice(0, 5)}
            onChange={(e) => save({ reminderTime: e.target.value }, { reminder_time: e.target.value })}
            className="w-32"
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <CardTitle>Czytelność</CardTitle>
        <Toggle
          id="largeText"
          label="Duża czcionka"
          description="Powiększa teksty modlitw i czytań w całej aplikacji."
          checked={state.large_text}
          onChange={(value) => save({ largeText: value }, { large_text: value })}
          disabled={isPending}
        />
      </Card>

      <Card className="flex flex-col gap-4">
        <CardTitle>Kalendarz Google / Apple</CardTitle>
        <CardDescription>
          Zamiast pobierać Twój kalendarz, aplikacja udostępnia własny — subskrybujesz jeden adres, a
          uroczystości i święta pojawiają się w Kalendarzu Google, Apple albo Outlooku i same się
          odświeżają. Aplikacja nie prosi o dostęp do Twoich prywatnych wydarzeń.
        </CardDescription>

        <Toggle
          id="calendarSync"
          label="Udostępniaj kalendarz liturgiczny"
          checked={state.calendar_sync_enabled}
          onChange={(value) => save({ calendarSyncEnabled: value }, { calendar_sync_enabled: value })}
          disabled={isPending}
        />

        <Toggle
          id="includeIntentions"
          label="Dołącz moje intencje"
          description="Intencje trafią do subskrybowanego kalendarza. Włącz tylko, jeśli kalendarz jest wyłącznie Twój."
          checked={state.include_intentions_in_calendar}
          onChange={(value) =>
            save({ includeIntentionsInCalendar: value }, { include_intentions_in_calendar: value })
          }
          disabled={isPending || !state.calendar_sync_enabled}
        />

        {state.calendar_sync_enabled && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="feedUrl">Adres do subskrypcji</Label>
            <Input id="feedUrl" readOnly value={currentFeedUrl} onFocus={(e) => e.currentTarget.select()} />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copyFeed}>
                {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                {copied ? "Skopiowano" : "Kopiuj adres"}
              </Button>
              <a
                href={currentFeedUrl.replace(/^https?:/, "webcal:")}
                className="inline-flex h-9 items-center gap-1.5 rounded-(--radius-control) border border-border px-3.5 text-sm font-medium text-foreground active:opacity-80"
              >
                <CalendarPlus className="h-4 w-4" />
                Dodaj do kalendarza
              </a>
            </div>
            <p className="text-xs text-foreground-muted">
              Google Calendar: „Inne kalendarze” → „Z adresu URL”. Apple: Kalendarz → Plik → Nowa
              subskrypcja kalendarza.
            </p>

            {confirmRotate ? (
              <div className="flex flex-col gap-2 rounded-(--radius-control) bg-warning-soft p-3">
                <p className="flex items-center gap-2 text-sm text-foreground">
                  <TriangleAlert className="h-4 w-4 text-warning" />
                  Nowy adres unieważni wszystkie dotychczasowe subskrypcje. Kontynuować?
                </p>
                <div className="flex gap-2">
                  <Button variant="danger" size="sm" onClick={handleRotate} isLoading={isPending}>
                    Wygeneruj nowy adres
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmRotate(false)}>
                    Anuluj
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmRotate(true)}
                className="self-start text-sm font-medium text-primary"
              >
                Wygeneruj nowy adres (unieważnia stary)
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <p className="text-sm text-foreground-muted">
            Zapisz wyliczone uroczystości i święta w bazie — przyspiesza widok kalendarza i pozwala
            innym częściom aplikacji korzystać z tych samych dat.
          </p>
          <Button variant="outline" size="sm" onClick={handleSync} isLoading={isPending} className="self-start">
            <RefreshCw className="h-4 w-4" />
            Odśwież kalendarz liturgiczny
          </Button>
        </div>
      </Card>

      {notice && <p className="text-sm text-accent">{notice}</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
