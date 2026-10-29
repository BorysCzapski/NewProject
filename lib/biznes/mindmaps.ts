// ============================================================================
// lib/biznes/mindmaps.ts
// One mind map per knowledge-base article, derived from its structure: the
// article title is the centre, every h2 heading a branch, and the branch items
// are its h3 headings plus the terms the article highlights in bold (falling
// back to the first sentence). Rendered by components/biznes/mind-map.tsx
// with a recall mode that hides the leaves.
// ============================================================================
import { THEORY } from "./theory";
import type { Block, MindMap, MindMapBranch } from "./types";

const MAX_BRANCHES = 8;
const MAX_ITEMS = 6;

const GENERIC = /^(zadanie|rozwiązanie|ćwiczenie|ćwiczenie praktyczne|definicja|przykład|wskazówka|uwaga|wniosek|sprawdź wiedzę)\b/i;

const plain = (s: string) => s.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
const clip = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n).replace(/\s+\S*$/, "")}…`);

function itemsFor(blocks: Block[]): string[] {
  const items: string[] = [];
  const push = (s: string) => {
    const t = clip(plain(s).replace(/[:.]$/, ""), 90);
    if (t.length >= 3 && !GENERIC.test(t) && !items.some((x) => x.toLowerCase() === t.toLowerCase())) items.push(t);
  };
  for (const b of blocks) if (b.type === "h") push(b.text.replace(/^\d+\.\s*/, ""));
  for (const b of blocks) {
    const texts = b.type === "p" ? [b.text] : b.type === "list" ? b.items : b.type === "important" ? [b.text] : [];
    for (const t of texts) for (const m of t.matchAll(/\*\*(.+?)\*\*/g)) if (m[1].length <= 60) push(m[1]);
  }
  if (items.length === 0) {
    const p = blocks.find((b) => b.type === "p");
    if (p && p.type === "p") push(p.text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? p.text);
  }
  return items.slice(0, MAX_ITEMS);
}

function build(): MindMap[] {
  const maps: MindMap[] = [];
  for (const section of THEORY) {
    if (section.title === "Podsumowanie działu") continue;
    const branches: MindMapBranch[] = [];
    let label: string | null = null;
    let bucket: Block[] = [];
    const close = () => {
      if (label && !GENERIC.test(plain(label))) {
        const items = itemsFor(bucket);
        if (items.length) branches.push({ label: clip(plain(label), 70), items });
      }
    };
    for (const b of section.blocks) {
      if (b.type === "h" && b.level === 2) {
        close();
        label = b.text;
        bucket = [];
      } else if (label) bucket.push(b);
    }
    close();
    if (branches.length >= 2) maps.push({ id: `mm-${section.id}`, lesson: section.lesson, center: section.title, branches: branches.slice(0, MAX_BRANCHES) });
  }
  return maps;
}

export const MIND_MAPS: MindMap[] = build();

export function getMindMap(id: string): MindMap | undefined {
  return MIND_MAPS.find((m) => m.id === id);
}
