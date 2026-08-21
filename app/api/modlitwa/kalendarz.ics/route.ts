// ============================================================================
// app/api/modlitwa/kalendarz.ics/route.ts
// Publiczny (tokenowany) feed iCalendar do subskrypcji w Google Calendar,
// Apple Calendar albo Outlooku.
//
// Uwierzytelnienie tokenem, nie sesją — kalendarz pobiera ten adres własnym
// klientem HTTP, bez ciasteczek. Token jest w prayer_settings.calendar_token,
// unikalny, i da się go w każdej chwili zrotować (rotateCalendarToken), co
// natychmiast unieważnia wszystkie subskrypcje. Trasa jest w PUBLIC_PATHS w
// proxy.ts, więc proxy jej nie przekierowuje na /login.
//
// Zakres: rok wstecz i rok naprzód od dziś — tyle, ile kalendarze i tak
// pokazują, a dokument zostaje mały (kilkadziesiąt wydarzeń).
// ============================================================================
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildLiturgicalIcs, type IntentionEvent } from "@/lib/modlitwa/ics";
import { addDays, toDateKey } from "@/lib/modlitwa/liturgical-calendar";
import type { PrayerRequest, PrayerSettings } from "@/lib/types/database";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  // Zły format tokenu odrzucamy przed dotknięciem bazy — inaczej każdy losowy
  // ciąg znaków generowałby zapytanie.
  if (!token || !UUID_RE.test(token)) {
    return new NextResponse("Nieprawidłowy token kalendarza.", { status: 401 });
  }

  const admin = createAdminClient();
  const { data: settings, error } = await admin
    .from("prayer_settings")
    .select("*")
    .eq("calendar_token", token)
    .maybeSingle();

  if (error) {
    console.error("[modlitwa] ics settings lookup failed:", error);
    return new NextResponse("Błąd serwera.", { status: 500 });
  }

  const prayerSettings = settings as PrayerSettings | null;
  if (!prayerSettings || !prayerSettings.calendar_sync_enabled) {
    // Ten sam komunikat dla „nie ma takiego tokenu” i „synchronizacja
    // wyłączona” — nie podpowiadamy, który token istnieje.
    return new NextResponse("Kalendarz jest niedostępny.", { status: 404 });
  }

  const today = new Date();
  const startDate = toDateKey(addDays(today, -365));
  const endDate = toDateKey(addDays(today, 365));

  let intentions: IntentionEvent[] = [];
  if (prayerSettings.include_intentions_in_calendar) {
    const { data: requests } = await admin
      .from("prayer_requests")
      .select("id, person_name, reason, promise_date")
      .eq("user_id", prayerSettings.user_id)
      .eq("fulfilled", false);

    intentions = ((requests ?? []) as Array<Pick<PrayerRequest, "id" | "person_name" | "reason" | "promise_date">>).map(
      (row) => ({
        id: row.id,
        personName: row.person_name,
        reason: row.reason,
        promiseDate: row.promise_date,
      })
    );
  }

  const ics = buildLiturgicalIcs({ startDate, endDate, intentions });

  return new NextResponse(ics, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": 'inline; filename="modlitwa.ics"',
      // Kalendarze i tak odpytują co kilka godzin; krótki cache chroni przed
      // nadgorliwym klientem, a nie opóźnia realnych zmian (daty świąt są stałe).
      "cache-control": "public, max-age=3600",
    },
  });
}
