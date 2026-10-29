// ============================================================================
// components/biznes/theory-blocks.tsx
// Renders the content blocks of a theory section: paragraphs, lists,
// callouts (Definicja, Szybka wskazówka…), examples and tables (horizontally scrollable on phones).
// ============================================================================
import { Info, Lightbulb } from "lucide-react";
import type { Block } from "@/lib/biznes/types";
import { RichText } from "./rich-text";

export function TheoryBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-foreground-muted">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h":
            return block.level === 2 ? (
              <h3 key={i} className="mt-3 text-base font-bold tracking-tight text-foreground">
                {block.text}
              </h3>
            ) : (
              <h4 key={i} className="mt-1 text-sm font-semibold text-foreground">
                {block.text}
              </h4>
            );
          case "p":
            return (
              <p key={i}>
                <RichText text={block.text} />
              </p>
            );
          case "list":
            return (
              <ul key={i} className="flex flex-col gap-1.5 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      <RichText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "important":
            return (
              <div key={i} className="flex gap-3 rounded-(--radius-control) border border-primary/25 bg-primary-soft p-3.5">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-foreground">{block.title ?? "Ważne!"}</p>
                  <p className="mt-0.5">
                    <RichText text={block.text} />
                  </p>
                </div>
              </div>
            );
          case "example":
            return (
              <div key={i} className="flex gap-3 rounded-(--radius-control) border border-accent/40 bg-accent-soft p-3.5">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" aria-hidden />
                <div className="text-accent-foreground/90">
                  <p className="text-sm font-semibold text-accent-foreground">{block.title}</p>
                  <p className="mt-0.5">
                    <RichText text={block.text} />
                  </p>
                </div>
              </div>
            );
          case "table":
            return (
              <div key={i} className="-mx-1 overflow-x-auto rounded-(--radius-control) border border-border">
                <table className="w-full min-w-max border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-surface-muted">
                      {block.head.map((h, j) => (
                        <th key={j} className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r} className="border-t border-border">
                        {row.map((cell, c) => (
                          <td key={c} className="max-w-[16rem] px-3 py-2 align-top">
                            <RichText text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
