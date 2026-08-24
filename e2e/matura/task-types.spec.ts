import type { Page } from "@playwright/test";
import { test, expect } from "../fixtures";
import { pickMaturaExam } from "../helpers/user";

// ============================================================================
// CKE task-type practice loop for the exact-match sections (środki językowe,
// czytanie, słuchanie) — README.md's central description of how this module
// works: a type hands out a task you haven't solved yet, generating one on
// the spot when the queue is empty (lib/matura/task-stock.ts).
//
// This depends on `matura_tasks.task_type`
// (supabase/migrations/0023_matura_task_types.sql) actually being applied —
// run `npm run db status` if this fails with a "pusto" empty state instead
// of a real task; that's the symptom of that migration being pending, not
// an app bug.
// ============================================================================

async function answerVisibleTask(page: Page) {
  const itemCards = page.locator("div.bg-surface", { has: page.getByText(/^Zadanie \d+$/) });
  const count = await itemCards.count();
  for (let i = 0; i < count; i++) {
    const card = itemCards.nth(i);
    const mcButtons = card.locator('button[type="button"]');
    if (await mcButtons.count()) {
      await mcButtons.first().click();
      continue;
    }
    await card.locator("input").fill("test");
  }
}

test("starting a task type serves a fresh task and grades a submitted attempt", async ({ page, freshUser: _freshUser }) => {
  await page.goto("/matura", { waitUntil: "networkidle" });
  await pickMaturaExam(page, { language: "en", level: "podstawowa" });

  await page.goto("/matura/nauka/srodki-jezykowe", { waitUntil: "networkidle" });
  const form = page.locator("form").filter({ has: page.locator('button[type="submit"]') }).first();
  // startTaskType() always redirect()s, either to the task or back to the hub
  // with ?pusto=... — wait for either rather than "networkidle" (a
  // useActionState redirect's follow-up navigation can start after the
  // network already looks idle, see e2e/helpers/user.ts for the full story).
  await Promise.all([
    page.waitForURL((url) => url.pathname.includes("/zadanie/") || url.searchParams.has("pusto"), {
      timeout: 20_000,
    }),
    form.locator('button[type="submit"]').click(),
  ]);
  await page.waitForLoadState("networkidle");

  expect(page.url(), 'starting a type must not bounce back to the "pusto" empty state').not.toContain("pusto=");
  expect(page.url()).toContain("/zadanie/");

  await answerVisibleTask(page);
  await page.getByRole("button", { name: "Sprawdź całe zadanie" }).click();
  await expect(page.getByText(/Wynik: \d+\/\d+ pkt/)).toBeVisible({ timeout: 20_000 });
});
