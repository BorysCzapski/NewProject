import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Test files construct a Supabase admin client directly (see e2e/helpers/user.ts)
// to create/delete disposable accounts, so they need the same .env.local the
// app itself reads — Next.js loads that for the dev server automatically, but
// this config's own process (and the workers it forks, which inherit
// process.env) does not get it for free.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

// ============================================================================
// playwright.config.ts
// E2E config for the Phoenix app. Tests hit a REAL Supabase project (Auth +
// Postgres via PostgREST) — there is no mock backend — so running them
// requires a working .env.local (see README.md → "Uruchomienie lokalne") and
// a seeded database (matura/*, matura-es/* seed files at minimum for the
// e2e/matura/* specs). See e2e/README.md for the full how-to.
// ============================================================================
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  timeout: 30_000,

  use: {
    baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Some sandboxes/CI images install Chromium to a non-default location
    // that Playwright's own version-pinned resolution won't find. Set this
    // to the chrome/chromium binary path to override; unset (the common
    // case) leaves normal Playwright browser resolution untouched.
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {},
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 420, height: 900 } },
    },
  ],

  // Reuse a server the developer already has running (matches how everyone
  // already works with this repo — `npm run dev` in one terminal); start one
  // otherwise. Never auto-starts in CI, where the workflow should start it
  // explicitly against a CI-configured Supabase project.
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run dev",
        url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
