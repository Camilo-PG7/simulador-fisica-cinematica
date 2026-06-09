/**
 * audio.js — Procedural SFX Engine v6 (Web Audio API)
 *
 * Final architecture fix for missing first sounds.
 * 
 * THE PROBLEM WITH v5:
 * The play methods immediately returned if `ctx.state !== 'running'`.
 * Because `ctx.resume()` is asynchronous, it takes several milliseconds to resolve.
 * If a click triggered `_unlock()` (which called `resume()`) and then immediately 
 * triggered `playClick()`, `ctx.state` was still 'suspended', so the sound was 
 * silently dropped.
 * 
 * THE SOLUTION:
 * Do NOT block sound scheduling if the context is suspended. Web Audio allows 
 * scheduling nodes on a suspended context. They will simply sit there and play 
 * perfectly as soon as the `resume()` promise resolves and the clock starts moving.
 */

class SFX {
  static ctx        = null;
  static masterGain = null;
  static isMuted    = localStorage.getItem('sim_muted') === 'true';

  // Wind nodes
  static windNode   = null;
  static windGain   = null;
  static windFilter = null;

  static _booted = false;

  // ═══════════════════════════════════════════════════════════════════════
  //  UNLOCK
  // ═══════════════════════════════════════════════════════════════════════

  static _unlock() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = this.isMuted ? 0 : 0.5;
      } catch (e) {
        console.warn('[SFX] Could not create AudioContext:', e);
        return;
      }
    }

    // Resume if suspended (browser allows this inside a user gesture)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  MUTE TOGGLE
  // ═══════════════════════════════════════════════════════════════════════

  static toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('sim_muted', this.isMuted);

    this._unlock(); // Ensure context is awake

    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : 0.5;
      try {
        this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
      } catch(e) {}
    }

    if (this.isMuted) {
      this.stopWind();
    } else {
      this.playClick();
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

  // ═══════════════════════════════════════════════════════════════════════
  //  SOUND SCHEDULERS
  // ═══════════════════════════════════════════════════════════════════════

  static _scheduleHover() {
    try {
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
    } catch(e) {}
  }

  static _scheduleClick() {
    try {
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
    } catch(e) {}
  }

  static _scheduleThud(intensity = 1.0) {
    try {
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
    } catch(e) {}
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  PUBLIC SOUND API
  // ═══════════════════════════════════════════════════════════════════════

  static playClick() {
    if (this.isMuted || !this.ctx) return;
    this._scheduleClick();
  }

  static playHover() {
    if (this.isMuted || !this.ctx) return;
    this._scheduleHover();
  }

  static playThud(intensity = 1.0) {
    if (this.isMuted || !this.ctx) return;
    this._scheduleThud(intensity);
  }

  static playWind(velocity) {
    if (this.isMuted || !this.ctx) return;

    if (!this.windNode) {
      try {
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
      } catch(e) { return; }
    }

    try {
      const clamped = Math.max(0, Math.min(50, velocity));
      const t = this.ctx.currentTime;
      this.windFilter.frequency.setTargetAtTime(200 + clamped * 25, t, 0.1);
      this.windGain.gain.setTargetAtTime(
        clamped > 1 ? Math.min(0.3, clamped * 0.015) : 0, t, 0.1
      );
    } catch(e) {}
  }

  static stopWind() {
    try {
      if (this.windGain && this.ctx) {
        this.windGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
    } catch(e) {}
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  BOOT
  // ═══════════════════════════════════════════════════════════════════════

  static boot() {
    if (this._booted) return;
    this._booted = true;

    const onGesture = () => {
      if (!SFX.isMuted) SFX._unlock();
    };

    ['mousedown', 'pointerdown', 'touchstart', 'click', 'keydown'].forEach(evt => {
      document.addEventListener(evt, onGesture, { capture: true, passive: true });
    });

    const getInteractive = (el) => {
      let depth = 0;
      while (el && el !== document.body && depth < 10) {
        if (
          el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'SELECT' ||
          el.tagName === 'LABEL' || (el.tagName === 'INPUT' && (el.type === 'range' || el.type === 'checkbox'))
        ) {
          return el;
        }
        el = el.parentElement;
        depth++;
      }
      return null;
    };

    document.addEventListener('pointerdown', (e) => {
      if (SFX.isMuted) return;
      if (getInteractive(e.target)) {
        SFX.playClick();
      }
    }, { capture: true, passive: true });

    let lastHoverEl = null;
    document.addEventListener('mouseover', (e) => {
      if (SFX.isMuted) return;
      const interactive = getInteractive(e.target);
      const paramGroup = (e.target && e.target.classList && e.target.classList.contains('param-group')) ? e.target : null;
      const target = interactive || paramGroup;
      
      if (target && target !== lastHoverEl) {
        lastHoverEl = target;
        SFX.playHover();
      } else if (!target) {
        lastHoverEl = null;
      }
    }, true);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && SFX.ctx && SFX.ctx.state === 'suspended' && !SFX.isMuted) {
        SFX.ctx.resume().catch(() => {});
      }
    });

    const initButtons = () => SFX.updateMuteButtons();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initButtons);
    } else {
      initButtons();
    }
  }
}

SFX.boot();
