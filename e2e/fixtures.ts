import { test as base } from "@playwright/test";
import {
  createDisposableUser,
  deleteDisposableUser,
  loginAs,
  completePhoenixOnboarding,
  type DisposableUser,
} from "./helpers/user";

// ============================================================================
// e2e/fixtures.ts
// `freshUser` gives a test its own throwaway account, already logged in and
// past Phoenix's onboarding gate (Linguo language + CEFR level) — but NOT yet
// past matura's own język+poziom picker, since some specs need to exercise
// that screen itself. Tests that just need to be past it should call
// pickMaturaExam() as their first step.
// ============================================================================
export const test = base.extend<{ freshUser: DisposableUser }>({
  freshUser: async ({ page }, use) => {
    const user = await createDisposableUser();
    await loginAs(page, user.username, user.password);
    await completePhoenixOnboarding(page);
    await use(user);
    await deleteDisposableUser(user.id);
  },
});

export { expect } from "@playwright/test";
