// ============================================================================
// app/(main)/zusia/layout.tsx
// Wraps every ZUSia screen with the account-progress sync (status line +
// background save). Content itself stays static; see lib/zusia/progress.ts.
// ============================================================================
import { ZusiaSync } from "@/components/zusia/zusia-sync";

export default function ZusiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ZusiaSync />
    </>
  );
}
