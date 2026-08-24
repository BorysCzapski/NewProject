import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { expect, type Page } from "@playwright/test";

// ============================================================================
// e2e/helpers/user.ts
// Disposable-account helpers for e2e tests. There is no mock backend in this
// repo — tests run against a real Supabase project — so isolation between
// tests comes from giving each one its own throwaway auth user rather than
// sharing state. Accounts are created via the service-role admin API (never
// through the public signup form) so tests are unaffected by whatever the
// project's "Confirm email" setting is, and are deleted again in a fixture's
// teardown — see e2e/fixtures.ts.
// ============================================================================

export interface DisposableUser {
  id: string;
  email: string;
  username: string;
  password: string;
}

function adminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set — e2e tests need the same " +
        ".env.local the app uses (see README.md → \"Uruchomienie lokalne\")."
    );
  }
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function createDisposableUser(): Promise<DisposableUser> {
  const admin = adminClient();
  const username = `e2e${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const email = `${username}@example.com`;
  const password = "E2eTestPass123!";

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  });
  if (error || !data.user) {
    throw new Error(`Nie udało się utworzyć jednorazowego konta testowego: ${error?.message}`);
  }
  return { id: data.user.id, email, username, password };
}

export async function deleteDisposableUser(id: string): Promise<void> {
  const admin = adminClient();
  // profiles.id -> auth.users.id is ON DELETE CASCADE (0001_init.sql), so this
  // also removes the profile row and everything keyed off it.
  await admin.auth.admin.deleteUser(id);
}

export async function loginAs(page: Page, identifier: string, password: string): Promise<void> {
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.fill("#identifier", identifier);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
  // The login Server Action's own redirect() is what actually leaves /login —
  // waiting for "networkidle" alone can resolve before that redirect fires
  // and races the caller's next step onto a still-unauthenticated page.
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20_000 });
  // The post-login redirect chain (login -> "/" -> proxy gate -> /onboarding
  // or /matura/...) can land the client router a beat before the address bar
  // settles further, so callers that care about the destination should do a
  // fresh page.goto rather than trust page.url() immediately after this.
  await page.waitForLoadState("networkidle");
}

/** Completes Phoenix's own first-login gate (Linguo target language + CEFR
 * level) — unrelated to the matura exam picker, but proxy.ts blocks every
 * route behind it until it's done once per account. */
export async function completePhoenixOnboarding(page: Page): Promise<void> {
  await page.goto("/onboarding", { waitUntil: "networkidle" });
  await page.locator('input[type="radio"][name="language"]').first().check();
  await page.locator('input[type="radio"][name="level"]').first().check();
  await page.getByRole("button", { name: "Zaczynamy!" }).click();
  // completeOnboarding() always redirect()s to /jezyki (lib/actions/auth.ts).
  // This form posts through useActionState, whose redirect is carried out by
  // the client router as a follow-up RSC fetch AFTER the action's own POST
  // has already gone idle — waiting on "networkidle" alone can land in that
  // gap and return before the navigation actually happens.
  await page.waitForURL((url) => url.pathname === "/jezyki", { timeout: 20_000 });
  await page.waitForLoadState("networkidle");
}

/** Fills and submits the matura język+poziom form — same component for the
 * first-visit picker on /matura and the change form on /matura/ustawienia. */
export async function pickMaturaExam(
  page: Page,
  { language, level }: { language: "en" | "es"; level: "podstawowa" | "rozszerzona" }
): Promise<void> {
  await page.locator(`input[type="radio"][name="language"][value="${language}"]`).check();
  await page.locator(`input[type="radio"][name="level"][value="${level}"]`).check();
  await page.getByRole("button", { name: /Zaczynamy!|Zapisz ustawienia/ }).click();
  // setExamPreferences() always redirect()s to /matura (lib/matura/actions.ts)
  // — but the first-visit picker IS ALREADY on /matura (it's what /matura
  // renders when matura_settings doesn't exist yet), so waiting for that
  // pathname here would be trivially true before the submission even lands.
  // Wait for the picker's own content to go away instead — true only once
  // matura_settings actually exists and /matura renders the dashboard.
  await expect(page.getByText("Do jakiej matury się przygotowujesz?")).not.toBeVisible({ timeout: 20_000 });
  await page.waitForLoadState("networkidle");
}
