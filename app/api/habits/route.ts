// ============================================================================
// app/api/habits/route.ts
// API nawyków dla Skrótów macOS / curl. Autoryzacja tokenem w nagłówku
// "Authorization: Bearer hab_..." (token z /habits → "Skrót macOS"), nie
// sesją — trasa jest w PUBLIC_PATHS w proxy.ts i sama waliduje token.
//
//   GET  /api/habits[?date=YYYY-MM-DD]   lista nawyków + czy odhaczone
//   POST /api/habits                      { habit | habit_id, date?, checked? }
//
// POST jest idempotentny: ustawia stan (checked domyślnie true), nie przełącza.
// ============================================================================
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authenticateHabitRequest } from "@/lib/habits/api-token";
import { isValidDateKey, todayKey } from "@/lib/habits/dates";

const NO_STORE = { "cache-control": "no-store" };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

function unauthorized() {
  return NextResponse.json(
    { error: "Brak lub nieprawidłowy token." },
    { status: 401, headers: { ...NO_STORE, "www-authenticate": 'Bearer realm="habits"' } }
  );
}

export async function GET(request: NextRequest) {
  const userId = await authenticateHabitRequest(request);
  if (!userId) return unauthorized();

  const date = request.nextUrl.searchParams.get("date") ?? todayKey();
  if (!isValidDateKey(date)) return json({ error: "Niepoprawna data (oczekiwano YYYY-MM-DD)." }, 400);

  const admin = createAdminClient();
  const [{ data: habits, error }, { data: checks }] = await Promise.all([
    admin.from("habits").select("id, name").eq("user_id", userId).order("position").order("created_at"),
    admin.from("habit_checks").select("habit_id").eq("user_id", userId).eq("day", date),
  ]);
  if (error) return json({ error: "Błąd serwera." }, 500);

  const done = new Set((checks ?? []).map((c) => c.habit_id as string));
  return json({
    date,
    habits: (habits ?? []).map((h) => ({ id: h.id, name: h.name, checked: done.has(h.id as string) })),
  });
}

export async function POST(request: NextRequest) {
  const userId = await authenticateHabitRequest(request);
  if (!userId) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Oczekiwano JSON." }, 400);
  }
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  const habitId = typeof b.habit_id === "string" ? b.habit_id : null;
  const habitName = typeof b.habit === "string" ? b.habit.trim() : null;
  const date = b.date === undefined ? todayKey() : b.date;
  const checked = b.checked === undefined ? true : b.checked;

  if (!habitId && !habitName) return json({ error: "Podaj 'habit' (nazwa) albo 'habit_id'." }, 400);
  if (habitId && !UUID_RE.test(habitId)) return json({ error: "Niepoprawne habit_id." }, 400);
  if (typeof date !== "string" || !isValidDateKey(date)) {
    return json({ error: "Niepoprawna data (oczekiwano YYYY-MM-DD)." }, 400);
  }
  if (date > todayKey()) return json({ error: "Nie można odhaczyć dnia z przyszłości." }, 400);
  if (typeof checked !== "boolean") return json({ error: "'checked' musi być true albo false." }, 400);

  const admin = createAdminClient();
  const { data: habits, error } = await admin
    .from("habits")
    .select("id, name")
    .eq("user_id", userId);
  if (error) return json({ error: "Błąd serwera." }, 500);

  let habit: { id: string; name: string } | undefined;
  if (habitId) {
    habit = (habits ?? []).find((h) => h.id === habitId);
  } else {
    const wanted = habitName!.toLocaleLowerCase("pl-PL");
    const exact = (habits ?? []).filter((h) => (h.name as string).toLocaleLowerCase("pl-PL") === wanted);
    const matches =
      exact.length > 0
        ? exact
        : (habits ?? []).filter((h) => (h.name as string).toLocaleLowerCase("pl-PL").includes(wanted));
    if (matches.length > 1) {
      return json({ error: "Nazwa pasuje do kilku nawyków.", matches: matches.map((h) => h.name) }, 409);
    }
    habit = matches[0];
  }
  if (!habit) return json({ error: "Nie znaleziono nawyku." }, 404);

  if (checked) {
    const { error: e } = await admin
      .from("habit_checks")
      .upsert({ habit_id: habit.id, user_id: userId, day: date });
    if (e) return json({ error: "Nie udało się zapisać." }, 500);
  } else {
    const { error: e } = await admin
      .from("habit_checks")
      .delete()
      .eq("habit_id", habit.id)
      .eq("user_id", userId)
      .eq("day", date);
    if (e) return json({ error: "Nie udało się zapisać." }, 500);
  }

  return json({ ok: true, habit: habit.name, habit_id: habit.id, date, checked });
}
