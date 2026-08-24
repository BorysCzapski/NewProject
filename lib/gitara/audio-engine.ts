// ============================================================================
// lib/gitara/audio-engine.ts
// Client-only Web Audio: a plucked-string synth (Karplus-Strong, so a played
// chord sounds like a guitar rather than a beep), a look-ahead metronome
// scheduler (the standard technique for jitter-free timing — see Chris
// Wilson's "A Tale of Two Clocks"), and a chromatic tuner built on
// autocorrelation pitch detection over the microphone.
//
// No framework import, no module-scope AudioContext/window access — every
// export is a function or class whose methods touch the browser only when
// called, so this file is safe to import from a Server Component too (it is
// only ever *invoked* from "use client" components). AudioContext creation
// always happens inside a call that originates from a user gesture (a button
// click), which is what browser autoplay policy requires.
//
// This is playback and tuning ONLY — it does not attempt full chord
// recognition from a recording. See the module comment on gtr_drill_attempts
// in the migration for why: a single note's pitch is objectively checkable,
// a strummed chord's "correctness" from a live mic signal is not, without a
// much heavier model this app does not ship in v1.
// ============================================================================
import { NOTE_NAMES, type NoteName } from "@/lib/gitara/theory";

let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedContext) {
    sharedContext = new AudioContext();
  }
  if (sharedContext.state === "suspended") {
    void sharedContext.resume();
  }
  return sharedContext;
}

// ----------------------------------------------------------------------------
// Plucked-string synth (Karplus-Strong): a short noise burst one period long,
// fed through a delay line of that same period with damped feedback. The
// delay + decaying feedback IS the string; the lowpass in the loop is what
// makes the timbre darken as the note decays, the way a real string does.
// ----------------------------------------------------------------------------
function pluckString(ctx: AudioContext, frequency: number, when: number, gain: number): void {
  const period = 1 / frequency;
  const burstLength = Math.max(2, Math.floor(ctx.sampleRate * period));
  const noiseBuffer = ctx.createBuffer(1, burstLength, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < burstLength; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const delay = ctx.createDelay(1);
  delay.delayTime.value = period;

  const damping = ctx.createBiquadFilter();
  damping.type = "lowpass";
  damping.frequency.value = Math.min(frequency * 6, 8000);

  const feedback = ctx.createGain();
  feedback.gain.value = 0.985;

  const outputGain = ctx.createGain();
  outputGain.gain.value = gain;

  source.connect(delay);
  delay.connect(damping);
  damping.connect(feedback);
  feedback.connect(delay);
  delay.connect(outputGain);
  outputGain.connect(ctx.destination);

  source.start(when);

  // The feedback loop has no natural end — disconnect everything once it has
  // decayed inaudibly rather than leaking nodes for the session's lifetime.
  const cleanupDelayMs = (when - ctx.currentTime + 3) * 1000;
  setTimeout(() => {
    source.disconnect();
    delay.disconnect();
    damping.disconnect();
    feedback.disconnect();
    outputGain.disconnect();
  }, Math.max(0, cleanupDelayMs));
}

/** Plays a single note now (or `delaySeconds` from now). */
export function playNote(frequency: number, delaySeconds = 0, gain = 0.35): void {
  const ctx = getAudioContext();
  pluckString(ctx, frequency, ctx.currentTime + delaySeconds, gain);
}

/** Plays every frequency as a strum: staggered a few ms apart, low to high,
 * the way a downstroke actually sounds rather than a synthetic chord stab. */
export function playChordStrum(frequencies: number[], strumMs = 18, gain = 0.28): void {
  const ctx = getAudioContext();
  frequencies.forEach((freq, i) => {
    pluckString(ctx, freq, ctx.currentTime + (i * strumMs) / 1000, gain);
  });
}

// ----------------------------------------------------------------------------
// Metronome — look-ahead scheduler. A plain setInterval click would drift
// and stutter under JS event-loop jitter; instead a fast (25ms) poller keeps
// scheduling precisely-timed AudioContext clicks a little ahead of now, and
// UI beat callbacks are timed with setTimeout to land close to the same
// instant the audio actually plays.
// ----------------------------------------------------------------------------
const SCHEDULE_AHEAD_SECONDS = 0.1;
const SCHEDULER_INTERVAL_MS = 25;

/** A short percussive click, `delaySeconds` from now — the metronome's own
 * sound, also reused by the rhythm-values lesson block so a demonstrated
 * subdivision sounds exactly like the practice metronome. */
export function playClick(delaySeconds = 0, accent = false): void {
  const ctx = getAudioContext();
  const when = ctx.currentTime + delaySeconds;
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.value = accent ? 1500 : 1000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(accent ? 0.5 : 0.32, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + 0.05);
}

export class Metronome {
  private ctx: AudioContext | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private nextClickTime = 0;
  private beatInMeasure = 0;
  private bpm: number;
  private beatsPerMeasure: number;
  private onBeat?: (beatIndex: number) => void;

  constructor(bpm = 90, beatsPerMeasure = 4) {
    this.bpm = bpm;
    this.beatsPerMeasure = beatsPerMeasure;
  }

  get isRunning(): boolean {
    return this.intervalId !== null;
  }

  setTempo(bpm: number): void {
    this.bpm = bpm;
  }

  setBeatsPerMeasure(n: number): void {
    this.beatsPerMeasure = n;
  }

  start(onBeat?: (beatIndex: number) => void): void {
    if (this.isRunning) return;
    this.ctx = getAudioContext();
    this.onBeat = onBeat;
    this.beatInMeasure = 0;
    this.nextClickTime = this.ctx.currentTime + 0.05;
    this.intervalId = setInterval(() => this.scheduleAhead(), SCHEDULER_INTERVAL_MS);
  }

  stop(): void {
    if (this.intervalId !== null) clearInterval(this.intervalId);
    this.intervalId = null;
  }

  private scheduleAhead(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    while (this.nextClickTime < ctx.currentTime + SCHEDULE_AHEAD_SECONDS) {
      playClick(this.nextClickTime - ctx.currentTime, this.beatInMeasure === 0);
      const beatIndex = this.beatInMeasure;
      const delayMs = Math.max(0, (this.nextClickTime - ctx.currentTime) * 1000);
      setTimeout(() => this.onBeat?.(beatIndex), delayMs);

      this.nextClickTime += 60 / this.bpm;
      this.beatInMeasure = (this.beatInMeasure + 1) % this.beatsPerMeasure;
    }
  }
}

// ----------------------------------------------------------------------------
// Tuner — chromatic pitch detection from the microphone via autocorrelation.
// ----------------------------------------------------------------------------
export interface TunerReading {
  frequency: number;
  note: NoteName;
  octave: number;
  /** Deviation from the nearest note in cents, -50..50. */
  cents: number;
}

/** Standard time-domain autocorrelation pitch detector: trims near-silence
 * off both ends of the frame, autocorrelates the rest, then refines the peak
 * lag with parabolic interpolation. Returns -1 when the signal is too quiet
 * or no clear periodicity is found. */
function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const size = buffer.length;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return -1;

  const threshold = 0.2;
  let start = 0;
  while (start < size / 2 && Math.abs(buffer[start]) < threshold) start++;
  let end = size - 1;
  while (end > size / 2 && Math.abs(buffer[end]) < threshold) end--;

  const trimmed = buffer.subarray(start, end);
  const n = trimmed.length;
  if (n < 8) return -1;

  const correlations = new Float32Array(n);
  for (let lag = 0; lag < n; lag++) {
    let sum = 0;
    for (let i = 0; i < n - lag; i++) sum += trimmed[i] * trimmed[i + lag];
    correlations[lag] = sum;
  }

  let d = 0;
  while (d + 1 < n && correlations[d] > correlations[d + 1]) d++;

  let maxValue = -1;
  let maxLag = -1;
  for (let i = d; i < n; i++) {
    if (correlations[i] > maxValue) {
      maxValue = correlations[i];
      maxLag = i;
    }
  }
  if (maxLag <= 0) return -1;

  const x1 = correlations[maxLag - 1] ?? correlations[maxLag];
  const x2 = correlations[maxLag];
  const x3 = correlations[maxLag + 1] ?? correlations[maxLag];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  const refinedLag = a !== 0 ? maxLag - b / (2 * a) : maxLag;

  return sampleRate / refinedLag;
}

export function frequencyToTunerReading(frequency: number): TunerReading {
  const midiFloat = 69 + 12 * Math.log2(frequency / 440);
  const midi = Math.round(midiFloat);
  const cents = Math.round((midiFloat - midi) * 100);
  return {
    frequency,
    note: NOTE_NAMES[((midi % 12) + 12) % 12],
    octave: Math.floor(midi / 12) - 1,
    cents,
  };
}

export class Tuner {
  private stream: MediaStream | null = null;
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private rafId: number | null = null;

  /** Requests the microphone and starts reporting readings. Resolves once
   * listening has started; rejects with the original getUserMedia error on
   * denial/no-device, which the caller renders as the spec's "no mic access"
   * fallback rather than a generic failure. */
  async start(onReading: (reading: TunerReading | null) => void): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.ctx = getAudioContext();
    const source = this.ctx.createMediaStreamSource(this.stream);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    source.connect(this.analyser);

    const buffer = new Float32Array(this.analyser.fftSize);
    const loop = () => {
      if (!this.analyser || !this.ctx) return;
      this.analyser.getFloatTimeDomainData(buffer);
      const frequency = autoCorrelate(buffer, this.ctx.sampleRate);
      onReading(frequency > 0 ? frequencyToTunerReading(frequency) : null);
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.analyser = null;
  }
}
