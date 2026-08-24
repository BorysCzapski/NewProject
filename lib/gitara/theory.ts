// ============================================================================
// lib/gitara/theory.ts
// Core music theory for standard-tuned 6-string guitar: string/fret → note,
// note → frequency, and the FrettedChord shape shared by every diagram in
// this app (gtr_chords rows, lesson chord-diagram blocks, and the 5 CAGED
// shapes below). Framework/DB-free — safe on both server and client.
//
// String indexing is 0 = low E (6th string) .. 5 = high e (1st string)
// throughout this app, matching how a chord diagram is read left-to-right
// on a chart. This is the OPPOSITE of how a guitarist counts strings aloud
// ("1st string" = high e) — a source of real confusion this file avoids by
// never using the word "string number" anywhere else in the codebase.
// ============================================================================

/** MIDI note numbers of the 6 open strings, low E to high e. */
export const STANDARD_TUNING_MIDI = [40, 45, 50, 55, 59, 64] as const;
export const OPEN_STRING_LABELS = ["E", "A", "D", "G", "B", "e"] as const;
export const STRING_COUNT = 6;

export const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;
export type NoteName = (typeof NOTE_NAMES)[number];

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function midiAt(stringIndex: number, fret: number): number {
  return STANDARD_TUNING_MIDI[stringIndex] + fret;
}

export function noteNameAt(stringIndex: number, fret: number): NoteName {
  const midi = midiAt(stringIndex, fret);
  return NOTE_NAMES[((midi % 12) + 12) % 12];
}

export function frequencyAt(stringIndex: number, fret: number): number {
  return midiToFrequency(midiAt(stringIndex, fret));
}

/** One playable shape: frets/fingers run low-E (index 0) to high-e (index 5).
 * `null` = muted string ("x" on a chart), `0` = open. `baseFret` is the
 * lowest fret the diagram should display (1 for nut-position chords). A
 * `barre` fret is absolute, not relative to baseFret. */
export interface FrettedChord {
  frets: (number | null)[];
  fingers: (number | null)[];
  baseFret: number;
  barre?: { fret: number; fromString: number; toString: number };
}

/** Frequencies (Hz) of every sounding string in the shape, low to high —
 * feeds lib/gitara/audio-engine.ts's strum synth. */
export function chordFrequencies(chord: FrettedChord): number[] {
  return chord.frets
    .map((fret, stringIndex) => (fret === null ? null : frequencyAt(stringIndex, fret)))
    .filter((f): f is number => f !== null);
}

/** Highest fret used in a shape — how many frets a diagram needs to show. */
export function chordFretSpan(chord: FrettedChord): number {
  const frets = chord.frets.filter((f): f is number => f !== null && f > 0);
  const barreFret = chord.barre?.fret ?? 0;
  return Math.max(0, ...frets, barreFret) - chord.baseFret + 1;
}

// ----------------------------------------------------------------------------
// System CAGED: the 5 movable shapes, worked out here for root note C — the
// example every CAGED lesson opens with (the mnemonic is literally the C, A,
// G, E and D open-chord shapes). Each is the real open-position C/A/G/E/D
// chord transposed so its own root string lands on C; see the lesson content
// in supabase/seed/gitara for the derivation and the "G shape is the hard,
// rarely-played one" caveat that falls out of the transposition (its root
// string is the same low E string the E-shape uses, so for a shared root the
// two shapes' anchor fret coincides — a real, well-known CAGED quirk, not a
// bug in this data).
// ----------------------------------------------------------------------------
export interface CagedShape {
  label: "C" | "A" | "G" | "E" | "D";
  chord: FrettedChord;
}

export const CAGED_SHAPES_ROOT_C: CagedShape[] = [
  {
    label: "C",
    chord: {
      frets: [null, 3, 2, 0, 1, 0],
      fingers: [null, 3, 2, null, 1, null],
      baseFret: 1,
    },
  },
  {
    label: "A",
    chord: {
      frets: [null, 3, 5, 5, 5, 3],
      fingers: [null, 1, 3, 3, 3, 1],
      baseFret: 3,
      barre: { fret: 3, fromString: 1, toString: 5 },
    },
  },
  {
    label: "G",
    chord: {
      // High e omitted (not muted mid-shape, simply left out): a full 6-string
      // grip here needs the pinky to span two non-adjacent strings, which no
      // finger can do — real players drop it or play this shape on 5 strings.
      frets: [8, 7, 5, 5, 5, null],
      fingers: [4, 3, 1, 1, 1, null],
      baseFret: 5,
    },
  },
  {
    label: "E",
    chord: {
      frets: [8, 10, 10, 9, 8, 8],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 8,
      barre: { fret: 8, fromString: 0, toString: 5 },
    },
  },
  {
    label: "D",
    chord: {
      frets: [null, null, 10, 12, 13, 12],
      fingers: [null, null, null, 1, 3, 2],
      baseFret: 10,
    },
  },
];
