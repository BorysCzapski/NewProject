// ============================================================================
// app/(main)/modlitwa/layout.tsx
// Wspólna powłoka aplikacji Modlitwa: tryb dużej czcionki (ustawienie
// użytkownika, klasa .modlitwa-large w app/globals.css) oraz przypomnienie o
// modlitwie.
//
// Ustawienia czytamy TYLKO do odczytu — wiersz w prayer_settings powstaje
// dopiero na ekranie ustawień, żeby samo wejście do aplikacji nie generowało
// tokenu kalendarza komuś, kto z tej funkcji nie korzysta.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getPrayerSettings, getTodayLogEntry } from "@/lib/modlitwa/queries";
import { todayKey } from "@/lib/modlitwa/liturgical-calendar";
import { PrayerReminder } from "@/components/modlitwa/prayer-reminder";

export default async function ModlitwaLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const today = todayKey();
  const [settings, todayEntry] = await Promise.all([
    getPrayerSettings(supabase, profile.id),
    getTodayLogEntry(supabase, profile.id, today),
  ]);

  return (
    <div className={settings?.large_text ? "modlitwa-large" : undefined}>
      {settings?.notifications_enabled && (
        <PrayerReminder
          enabled
          reminderTime={settings.reminder_time}
          alreadyPrayed={todayEntry !== null}
          todayKey={today}
        />
      )}
      {children}
    </div>
  );
}
