/**
 * audio.js — Procedural SFX Engine (Web Audio API)
 *
 * Root cause fix: AudioContext.resume() is async. The previous version called
 * playSound() immediately after resume(), before the context was actually running.
 * This version uses async/await to guarantee the context is "running" before
 * any sound node is scheduled. All user-gesture handlers are made async.
 */

class SFX {
  static ctx        = null;
  static masterGain = null;
  static isMuted    = localStorage.getItem('sim_muted') === 'true';

  // Wind nodes
  static windNode   = null;
  static windGain   = null;
  static windFilter = null;

  static hooksInitialized = false;

  // ─── Core: ensure AudioContext is created AND running ─────────────────────
  // This is the only place that interacts with browser autoplay policy.
  // Must be called from within a user-gesture handler (click/mousedown/touchstart).
  static async _ensureRunning() {
    // 1. Create context if it doesn't exist yet
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = this.isMuted ? 0 : 0.5;
      } catch (e) {
        console.warn('[SFX] Web Audio API not supported.', e);
        return false;
      }
    }

    // 2. If suspended (browser autoplay policy), resume and WAIT for it
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn('[SFX] Could not resume AudioContext.', e);
        return false;
      }
    }

    // 3. Only return true when context is confirmed running
    return this.ctx.state === 'running';
  }

  // ─── Mute toggle ──────────────────────────────────────────────────────────
  static async toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('sim_muted', this.isMuted);

    if (!this.isMuted) {
      // Un-muting: ensure context is running before setting gain
      const running = await this._ensureRunning();
      if (running && this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.05);
        this.playClick(); // confirm with sound
      }
    } else {
      // Muting: just drop gain, no context needed
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
      this.stopWind();
    }

    this.updateMuteButtons();
    return this.isMuted;
  }

  static updateMuteButtons() {
    document.querySelectorAll('.btn-mute').forEach(btn => {
      btn.textContent = this.isMuted ? '🔇 Mute' : '🔊 Sonido';
      btn.classList.toggle('muted', this.isMuted);
    });
  }

  // ─── Sound primitives ─────────────────────────────────────────────────────
  // These do NOT check ctx.state — callers must ensure context is running first.

  static _playHoverRaw() {
    const t = this.ctx.currentTime;
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  static _playClickRaw() {
    const t = this.ctx.currentTime;
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  static _playThudRaw(intensity = 1.0) {
    const t = this.ctx.currentTime;
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.12);
    const maxGain = Math.min(0.8, 0.3 * intensity);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(maxGain, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.38);
  }

  // ─── Public sound API ─────────────────────────────────────────────────────
  // These are safe to call from physics hooks (outside gesture handlers).
  // They skip playing if context isn't already running to avoid errors.

  static playClick() {
    if (!this.ctx || this.isMuted || this.ctx.state !== 'running') return;
    this._playClickRaw();
  }

  static playHover() {
    if (!this.ctx || this.isMuted || this.ctx.state !== 'running') return;
    this._playHoverRaw();
  }

  static playThud(intensity = 1.0) {
    if (!this.ctx || this.isMuted || this.ctx.state !== 'running') return;
    this._playThudRaw(intensity);
  }

  // Wind: continuous filtered noise
  static playWind(velocity) {
    if (!this.ctx || this.isMuted || this.ctx.state !== 'running') return;

    if (!this.windNode) {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      this.windNode = this.ctx.createBufferSource();
      this.windNode.buffer = buffer;
      this.windNode.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.Q.value = 1.5;

      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = 0;

      this.windNode.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);
      this.windNode.start();
    }

    const clamped = Math.max(0, Math.min(50, velocity));
    const t = this.ctx.currentTime;
    this.windFilter.frequency.setTargetAtTime(200 + clamped * 25, t, 0.1);
    this.windGain.gain.setTargetAtTime(
      clamped > 1 ? Math.min(0.3, clamped * 0.015) : 0, t, 0.1
    );
  }

  static stopWind() {
    if (this.windGain && this.ctx) {
      this.windGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }
  }

  // ─── Global UI hooks ──────────────────────────────────────────────────────
  static initGlobalUIHooks() {
    if (this.hooksInitialized) return;
    this.hooksInitialized = true;

    const isInteractive = (el) =>
      el.tagName === 'BUTTON' ||
      el.tagName === 'A' ||
      el.tagName === 'SELECT' ||
      (el.tagName === 'INPUT' && (el.type === 'range' || el.type === 'checkbox'));

    // Hover sound (context must already be running — no gesture needed here)
    document.body.addEventListener('mouseenter', (e) => {
      if (isInteractive(e.target) || e.target.classList?.contains('param-group')) {
        SFX.playHover();
      }
    }, true);

    // Click/mousedown — async handler so we can await resume()
    document.body.addEventListener('mousedown', async (e) => {
      if (SFX.isMuted) return;

      // THIS is the user gesture. Resume context here and await it.
      const running = await SFX._ensureRunning();
      if (!running) return;

      if (isInteractive(e.target)) {
        SFX._playClickRaw(); // use raw since we just confirmed running
      }
    }, true);

    // Touch support
    document.body.addEventListener('touchstart', async (e) => {
      if (SFX.isMuted) return;
      await SFX._ensureRunning();
    }, { passive: true, capture: true });
  }
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  SFX.updateMuteButtons();
  SFX.initGlobalUIHooks();
});
