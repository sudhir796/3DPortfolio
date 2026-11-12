/**
 * GuildAudioEngine: Procedural Web Audio API sound synthesizer.
 * Zero external audio files. Generates ambient tavern drone, fireplace crackle,
 * and delicate UI sound flourishes.
 */

class GuildAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.droneGain = null;
    this.crackleGain = null;
    this.isMuted = true;
    this.isInitialized = false;
    this.crackleInterval = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();

      // Master output gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupAmbientDrone();
      this.setupFireCrackle();
      this.isInitialized = true;
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  setupAmbientDrone() {
    if (!this.ctx) return;

    // Sub-bass root and fifth harmonic for a warm cozy wooden room resonance
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    this.droneGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note (warm 55Hz)
    osc1.detune.setValueAtTime(3, this.ctx.currentTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110, this.ctx.currentTime); // A2 note
    osc2.detune.setValueAtTime(-4, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);
    filter.Q.setValueAtTime(2, this.ctx.currentTime);

    this.droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
  }

  setupFireCrackle() {
    if (!this.ctx) return;

    // Procedural noise buffer for fire embers
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.crackleGain = this.ctx.createGain();
    this.crackleGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    this.crackleGain.connect(this.masterGain);

    // Filtered noise loop with periodic random ember micro-bursts
    const triggerPop = () => {
      if (this.isMuted || !this.ctx || this.ctx.state !== 'running') {
        this.crackleInterval = setTimeout(triggerPop, 300);
        return;
      }

      const now = this.ctx.currentTime;
      const popSource = this.ctx.createBufferSource();
      popSource.buffer = noiseBuffer;

      const popFilter = this.ctx.createBiquadFilter();
      popFilter.type = 'bandpass';
      popFilter.frequency.setValueAtTime(1200 + Math.random() * 1400, now);
      popFilter.Q.setValueAtTime(4 + Math.random() * 6, now);

      const popGain = this.ctx.createGain();
      const intensity = 0.03 + Math.random() * 0.08;
      popGain.gain.setValueAtTime(intensity, now);
      popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015 + Math.random() * 0.03);

      popSource.connect(popFilter);
      popFilter.connect(popGain);
      popGain.connect(this.crackleGain);

      popSource.start(now);
      popSource.stop(now + 0.06);

      const nextInterval = 80 + Math.random() * 240;
      this.crackleInterval = setTimeout(triggerPop, nextInterval);
    };

    triggerPop();
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (!muted) {
      this.ensureContext();
    }
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.18, now + 0.2);
    }
  }

  // --- UI Sound Effects ---

  playHover() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5 crystal chime
      osc.frequency.exponentialRampToValueAtTime(1046, now + 0.06);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Audio context might be restricted
    }
  }

  playClick() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.05);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore
    }
  }

  playScrollOpen() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;

      // Ascending chord triad (D4, A4, F#5)
      [293.66, 440.0, 739.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.035);

        gain.gain.setValueAtTime(0.05, now + idx * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.035);
        osc.stop(now + 0.38);
      });
    } catch {
      // Ignore
    }
  }

  playScrollClose() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  playStationArrival() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      // Gentle mystical chime triad
      [587.33, 880.0, 1174.66].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.035, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + i * 0.05);
        osc.stop(now + 0.5);
      });
    } catch {
      // Ignore
    }
  }

  playModeSwitch() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.22);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Ignore
    }
  }

  dispose() {
    if (this.crackleInterval) clearTimeout(this.crackleInterval);
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const guildAudio = new GuildAudioEngine();

