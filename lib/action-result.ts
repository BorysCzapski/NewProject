// ============================================================================
// lib/action-result.ts
// Discriminated result type returned by Server Actions that can fail for
// reasons the user needs to see. In production Next.js REDACTS messages of
// errors thrown inside Server Actions (the client only gets a digest), so
// any Polish user-facing failure message must be RETURNED, not thrown.
// ============================================================================

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export type ActionFailure = { ok: false; error: string };

export function actionFailure(error: string): ActionFailure {
  return { ok: false, error };
}
