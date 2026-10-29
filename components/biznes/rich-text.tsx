// ============================================================================
// components/biznes/rich-text.tsx
// Renders the **bold** inline markup used across the Matura BiZ content files.
// ============================================================================
import { Fragment } from "react";

export function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-foreground">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}
