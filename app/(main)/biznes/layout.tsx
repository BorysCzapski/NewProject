// ============================================================================
// app/(main)/biznes/layout.tsx
// Wraps every Matura BiZ screen with the account-progress sync (status line +
// background save). Content itself stays static; see lib/biznes/progress.ts.
// ============================================================================
import { BiznesSync } from "@/components/biznes/biznes-sync";

export default function BiznesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BiznesSync />
    </>
  );
}
