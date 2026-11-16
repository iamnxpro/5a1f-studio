/**
 * PROCEDURAL WEB AUDIO ENGINE — zero dependencies, zero audio files.
 * -----------------------------------------------------------------------------
 * All sounds are synthesised at runtime with oscillators, gain envelopes and
 * filtered noise. Nothing is fetched, so there is no licensing or privacy cost.
 *
 * Autoplay compliance: the AudioContext is only created inside `unlock()`,
 * which is called from an explicit user gesture ("Enter Studio" / unmute).
 */

const MASTER_GAIN = 0.15;
const HOVER_THROTTLE = 0.06; // seconds — max one tick per 60ms

type AudioContextConstructor = typeof AudioContext;

class StudioSoundEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;
  private unlocked = false;
  private lastHoverAt = 0;

  get isUnlocked(): boolean {
    return this.unlocked;
  }

  async unlock(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    if (!this.context) {
      const Constructor: AudioContextConstructor | undefined =
        window.AudioContext ??
        (
          window as unknown as {
            webkitAudioContext?: AudioContextConstructor;
          }
        ).webkitAudioContext;

      if (!Constructor) return false;

      this.context = new Constructor();
      this.master = this.context.createGain();
      this.master.gain.value = MASTER_GAIN;
      this.master.connect(this.context.destination);
    }

    try {
      if (this.context.state === "suspended") {
        await this.context.resume();
      }
    } catch {
      return false;
    }

    this.unlocked = true;
    this.applyMuteState();
    return this.context.state === "running";
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.applyMuteState();
  }

  private applyMuteState(): void {
    if (!this.context || !this.master) return;
    this.master.gain.setTargetAtTime(
      this.muted ? 0 : MASTER_GAIN,
      this.context.currentTime,
      0.02,
    );
  }

  private get playable(): boolean {
    return Boolean(
      this.unlocked &&
        !this.muted &&
        this.context &&
        this.master &&
        this.context.state === "running",
    );
  }

  /* ------------------------------------------------------------ intro ----- */

  playIntroWhoosh(): void {
    if (!this.playable || !this.context || !this.master) return;

    const context = this.context;
    const master = this.master;
    const now = context.currentTime;
    const duration = 0.9;

    // Filtered noise sweep (air / whoosh).
    const buffer = context.createBuffer(
      1,
      Math.floor(context.sampleRate * duration),
      context.sampleRate,
    );
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) {
      samples[index] = Math.random() * 2 - 1;
    }

    const noise = context.createBufferSource();
    noise.buffer = buffer;

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(220, now);
    filter.frequency.exponentialRampToValueAtTime(3600, now + 0.32);
    filter.frequency.exponentialRampToValueAtTime(240, now + duration);

    const noiseGain = context.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.5, now + 0.16);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter).connect(noiseGain).connect(master);
    noise.start(now);
    noise.stop(now + duration + 0.05);

    // Sub-bass drop.
    const sub = context.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(120, now);
    sub.frequency.exponentialRampToValueAtTime(38, now + 0.7);

    const subGain = context.createGain();
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.exponentialRampToValueAtTime(0.55, now + 0.05);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.82);

    sub.connect(subGain).connect(master);
    sub.start(now);
    sub.stop(now + 0.85);
  }

  /* -------------------------------------------------------------- hover --- */

  playHoverTick(): void {
    if (!this.playable || !this.context || !this.master) return;

    const context = this.context;
    const now = context.currentTime;

    if (now - this.lastHoverAt < HOVER_THROTTLE) return;
    this.lastHoverAt = now;

    const oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(2400, now);

    const highpass = context.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 1400;

    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    oscillator.connect(highpass).connect(gain).connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + 0.06);
  }

  /* -------------------------------------------------------------- click --- */

  playClickConfirm(): void {
    if (!this.playable || !this.context || !this.master) return;

    const context = this.context;
    const now = context.currentTime;

    [760, 1180].forEach((frequency, index) => {
      const start = now + index * 0.055;
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(
        frequency * 1.18,
        start + 0.07,
      );

      const gain = context.createGain();
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.11, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.11);

      oscillator.connect(gain).connect(this.master!);
      oscillator.start(start);
      oscillator.stop(start + 0.12);
    });
  }
}

export const soundEngine = new StudioSoundEngine();
