// ============================================================================
// app/schola/layout.tsx
// Bare passthrough — exists only as the segment boundary between the
// guest/no-chrome pages (logowanie, rejestracja, brak-dostepu) and the
// member-only (shell) tree, exactly like app/login vs app/(main) at the
// Phoenix level. Renders NOTHING of Phoenix's shell (no BottomNav, no
// launcher) — Schola members must never see it.
// ============================================================================
export default function ScholaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
