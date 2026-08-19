"use client";

// ============================================================================
// components/modlitwa/prayer-reminder.tsx
// Przypomnienie o modlitwie o ustalonej porze.
//
// Zakres jest tu celowo uczciwy: to przypomnienie DZIAŁA, gdy aplikacja jest
// otwarta w karcie (Notification API). Prawdziwy push (przy zamkniętej
// aplikacji) wymaga service workera, kluczy VAPID i serwera wysyłkowego —
// specyfikacja dopuszcza powiadomienia jako opcjonalne, więc zamiast udawać
// push, robimy to, co da się dowieźć w całości, i nie obiecujemy więcej.
//
// Komponent nic nie renderuje.
// ============================================================================
import { useEffect } from "react";

const STORAGE_KEY = "modlitwa:last-reminder";

export function PrayerReminder({
  enabled,
  reminderTime,
  alreadyPrayed,
  todayKey,
}: {
  enabled: boolean;
  /** "HH:MM" albo "HH:MM:SS" z bazy. */
  reminderTime: string;
  alreadyPrayed: boolean;
  todayKey: string;
}) {
  useEffect(() => {
    if (!enabled || alreadyPrayed) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

    // Jedno przypomnienie dziennie, nawet jeśli użytkownik odświeży stronę.
    if (localStorage.getItem(STORAGE_KEY) === todayKey) return;

    const [hours, minutes] = reminderTime.split(":").map(Number);
    const target = new Date();
    target.setHours(hours ?? 21, minutes ?? 0, 0, 0);

    const delay = target.getTime() - Date.now();
    // Pora już minęła — przypominamy od razu (użytkownik wszedł wieczorem).
    const timeout = window.setTimeout(
      () => {
        localStorage.setItem(STORAGE_KEY, todayKey);
        new Notification("Czas na modlitwę", {
          body: "Odhacz dzisiejszą modlitwę, żeby nie przerwać łańcucha.",
        });
      },
      delay > 0 ? delay : 0
    );

    return () => window.clearTimeout(timeout);
  }, [enabled, reminderTime, alreadyPrayed, todayKey]);

  return null;
}
