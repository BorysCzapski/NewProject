// ============================================================================
// lib/grammar/shuffle.ts
// Deterministic shuffling for lesson drill blocks (matchPairs, orderWords).
//
// Math.random() cannot be used here. Lesson blocks render on the server first
// and hydrate on the client; two different orders means a hydration mismatch
// and React discards the server HTML. Seeding from the content itself gives
// one stable order per drill, which also means a student who reloads mid-drill
// gets the same board back instead of a reshuffled one.
// ============================================================================

/** FNV-1a — small, fast, and good enough to spread similar strings apart. */
function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** mulberry32 — a compact, well-distributed 32-bit PRNG. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates driven by a seed derived from `seed`. Never mutates `items`. */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  const random = mulberry32(hashSeed(seed));
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Shuffle that is guaranteed to differ from the input order when that is
 * possible — a "put these in order" drill that opens already solved teaches
 * nothing. Falls back to the plain shuffle for inputs of fewer than two
 * distinct elements, where no different order exists.
 */
export function seededShuffleDistinct<T>(items: T[], seed: string): T[] {
  if (new Set(items.map((item) => String(item))).size < 2) return [...items];
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = seededShuffle(items, `${seed}#${attempt}`);
    const same = candidate.every((item, i) => item === items[i]);
    if (!same) return candidate;
  }
  // Vanishingly unlikely; rotating by one is still a different order.
  return [...items.slice(1), items[0]];
}
