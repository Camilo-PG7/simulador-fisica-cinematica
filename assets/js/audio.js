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

  static _initContextSync() {
    if (this.ctx) return true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = this.isMuted ? 0 : 0.5;
      return true;
    } catch (e) {
      console.warn('[SFX] Web Audio API not supported.', e);
      return false;
    }
  }

  static _autoResume() {
    this._initContextSync();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(e => console.warn('[SFX] Auto-resume failed:', e));
    }
  }

  // ─── Core: ensure AudioContext is created AND running ─────────────────────
  // This is the only place that interacts with browser autoplay policy.
  // Must be called from within a user-gesture handler.
  static async _ensureRunning() {
    if (!this._initContextSync()) return false;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn('[SFX] Could not resume AudioContext.', e);
        return false;
      }
    }

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
  // They automatically try to resume the context in the background.

  static playClick() {
    if (this.isMuted) return;
    this._autoResume();
    if (!this.ctx) return;
    this._playClickRaw();
  }

  static playHover() {
    if (this.isMuted) return;
    this._autoResume();
    if (!this.ctx) return;
    this._playHoverRaw();
  }

  static playThud(intensity = 1.0) {
    if (this.isMuted) return;
    this._autoResume();
    if (!this.ctx) return;
    this._playThudRaw(intensity);
  }

  // Wind: continuous filtered noise
  static playWind(velocity) {
    if (this.isMuted) return;
    this._autoResume();
    if (!this.ctx) return;

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
      el && (
        el.tagName === 'BUTTON' ||
        el.tagName === 'A' ||
        el.tagName === 'SELECT' ||
        (el.tagName === 'INPUT' && (el.type === 'range' || el.type === 'checkbox'))
      );

    // Hover sound (only plays if context is already active or we auto-resume it)
    document.body.addEventListener('mouseenter', (e) => {
      if (isInteractive(e.target) || e.target?.classList?.contains('param-group')) {
        SFX.playHover();
      }
    }, true);

    // Auto-resume helper for general user gestures
    const resumeOnGesture = async () => {
      if (SFX.isMuted) return;
      await SFX._ensureRunning();
    };

    // Register resume triggers for all common user gestures (including keyboard navigations)
    ['click', 'keydown', 'pointerdown', 'touchstart'].forEach(eventName => {
      document.body.addEventListener(eventName, resumeOnGesture, { passive: true, capture: true });
    });

    // Play click sound on interactive element pointerdown
    document.body.addEventListener('pointerdown', (e) => {
      if (SFX.isMuted) return;
      if (isInteractive(e.target)) {
        SFX.playClick();
      }
    }, { passive: true, capture: true });
  }
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  SFX.updateMuteButtons();
  SFX.initGlobalUIHooks();
});
