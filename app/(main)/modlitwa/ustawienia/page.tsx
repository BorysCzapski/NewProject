// ============================================================================
// app/(main)/modlitwa/ustawienia/page.tsx
// Ustawienia aplikacji Modlitwa.
//
// Adres feedu ICS budujemy z nagłówków żądania (host + protokół), a nie ze
// zmiennej środowiskowej — dzięki temu działa tak samo lokalnie, na podglądzie
// Vercela i na produkcji, bez dodatkowej konfiguracji.
// ============================================================================
import { headers } from "next/headers";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { calendarFeedUrl, ensurePrayerSettings } from "@/lib/modlitwa/settings";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsForm } from "@/components/modlitwa/settings-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function UstawieniaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const settings = await ensurePrayerSettings(supabase, profile.id);

  if (!settings) {
    return (
      <div>
        <PageHeader title="Ustawienia" subtitle="Modlitwa" />
        <div className="mx-auto max-w-lg px-5 py-5">
          <Card>
            <CardTitle>Nie udało się wczytać ustawień</CardTitle>
            <CardDescription>Odśwież stronę albo spróbuj ponownie za chwilę.</CardDescription>
          </Card>
        </div>
      </div>
    );
  }

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  return (
    <div>
      <PageHeader title="Ustawienia" subtitle="Modlitwa" />

      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <SettingsForm settings={settings} feedUrl={calendarFeedUrl(settings.calendar_token, `${protocol}://${host}`)} />

        <p className="text-xs text-foreground-muted">
          Dane modlitewne (dziennik, streak, intencje) są prywatne i chronione politykami dostępu w
          bazie — nie widzi ich nikt poza Tobą. Kalendarz udostępniasz świadomie, jednym adresem,
          który możesz w każdej chwili unieważnić.
        </p>
      </div>
    </div>
  );
}
