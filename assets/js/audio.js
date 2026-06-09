/**
 * audio.js — Procedural SFX Engine v5 (Web Audio API)
 *
 * Complete rewrite for maximum reliability.
 *
 * ROOT CAUSE OF PREVIOUS FAILURES:
 *   1. Gesture listeners were on `document.body` which might not exist when
 *      the script loads, causing all event registrations to silently fail.
 *   2. `_autoResume()` called `ctx.resume()` from physics loops (non-gesture
 *      code). Browsers IGNORE resume() calls outside real user gestures,
 *      so the context stayed suspended forever.
 *   3. HTML files cached the old version via `?v=4` query parameter.
 *
 * DESIGN PRINCIPLES OF THIS VERSION:
 *   - Boot IMMEDIATELY at script parse time (no DOMContentLoaded dependency).
 *   - All gesture listeners on `document` (always exists, even before <body>).
 *   - `_unlock()` creates + resumes AudioContext ONLY inside real user gestures.
 *   - Public sound API only plays when context is confirmed running; never
 *     tries to schedule nodes on a suspended context.
 *   - Handles tab-switch suspension via visibilitychange.
 *   - try-catch around all Web Audio node creation to prevent exceptions
 *     from crashing the simulation.
 */

class SFX {
  static ctx        = null;
  static masterGain = null;
  static isMuted    = localStorage.getItem('sim_muted') === 'true';

  // Wind nodes (continuous sound)
  static windNode   = null;
  static windGain   = null;
  static windFilter = null;

  static _booted = false;

  // ═══════════════════════════════════════════════════════════════════════
  //  UNLOCK — called on EVERY user gesture to create/resume AudioContext
  // ═══════════════════════════════════════════════════════════════════════

  static _unlock() {
    // 1. Create context if it doesn't exist
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

    // 2. Resume if suspended (must be inside a gesture handler to work)
    if (this.ctx.state !== 'running') {
      this.ctx.resume().catch(() => {});
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  MUTE TOGGLE
  // ═══════════════════════════════════════════════════════════════════════

  static toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('sim_muted', this.isMuted);

    // This is a user gesture → unlock the context
    this._unlock();

    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : 0.5;
      try {
        this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
      } catch(e) { /* ignore */ }
    }

    if (this.isMuted) {
      this.stopWind();
    } else {
      // Confirmation beep after un-muting (slight delay for context to activate)
      requestAnimationFrame(() => this.playClick());
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
  //  SOUND PRIMITIVES — wrapped in try-catch, never throw
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
    } catch(e) { /* swallow */ }
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
    } catch(e) { /* swallow */ }
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
    } catch(e) { /* swallow */ }
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  PUBLIC SOUND API
  //  Only plays when context is confirmed running. Safe to call anytime.
  // ═══════════════════════════════════════════════════════════════════════

  static playClick() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    this._scheduleClick();
  }

  static playHover() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    this._scheduleHover();
  }

  static playThud(intensity = 1.0) {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    this._scheduleThud(intensity);
  }

  static playWind(velocity) {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;

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
    } catch(e) { /* swallow */ }
  }

  static stopWind() {
    try {
      if (this.windGain && this.ctx) {
        this.windGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
    } catch(e) { /* swallow */ }
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  BOOT — called ONCE at script parse time (no DOM dependency)
  // ═══════════════════════════════════════════════════════════════════════

  static boot() {
    if (this._booted) return;
    this._booted = true;

    // ── 1. Gesture unlock handler ─────────────────────────────────────
    //    Called on EVERY user gesture. Creates + resumes AudioContext.
    const onGesture = () => {
      if (!SFX.isMuted) {
        SFX._unlock();
      }
    };

    //    Register on `document` (always exists, even before <body> is parsed).
    //    Using capture phase so we fire before any other handler.
    ['mousedown', 'pointerdown', 'touchstart', 'click', 'keydown'].forEach(evt => {
      document.addEventListener(evt, onGesture, { capture: true, passive: true });
    });

    // ── 2. Interactive element detection (walks up DOM tree) ──────────
    const getInteractive = (el) => {
      let depth = 0;
      while (el && el !== document.body && depth < 10) {
        if (
          el.tagName === 'BUTTON' ||
          el.tagName === 'A' ||
          el.tagName === 'SELECT' ||
          el.tagName === 'LABEL' ||
          (el.tagName === 'INPUT' && (el.type === 'range' || el.type === 'checkbox'))
        ) {
          return el;
        }
        el = el.parentElement;
        depth++;
      }
      return null;
    };

    // ── 3. Click sound on interactive elements ───────────────────────
    //    Uses requestAnimationFrame to give _unlock() one frame to
    //    take effect on the very first interaction after page load.
    document.addEventListener('pointerdown', (e) => {
      if (SFX.isMuted) return;
      if (getInteractive(e.target)) {
        requestAnimationFrame(() => SFX.playClick());
      }
    }, { capture: true, passive: true });

    // ── 4. Hover sounds ──────────────────────────────────────────────
    let lastHoverEl = null;
    document.addEventListener('mouseover', (e) => {
      if (SFX.isMuted) return;
      const interactive = getInteractive(e.target);
      const paramGroup = (e.target && e.target.classList && e.target.classList.contains('param-group'))
        ? e.target : null;
      const target = interactive || paramGroup;
      if (target && target !== lastHoverEl) {
        lastHoverEl = target;
        SFX.playHover();
      } else if (!target) {
        lastHoverEl = null;
      }
    }, true);

    // ── 5. Tab visibility handler ────────────────────────────────────
    //    When the user leaves and returns to the tab, the browser may
    //    have suspended the AudioContext. We flag it for re-unlock on
    //    the next gesture.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && SFX.ctx &&
          SFX.ctx.state === 'suspended' && !SFX.isMuted) {
        // Try to resume; may fail outside gesture, but will succeed
        // on the next click/keydown thanks to the gesture listeners.
        SFX.ctx.resume().catch(() => {});
      }
    });

    // ── 6. Update mute buttons when DOM is ready ─────────────────────
    const initButtons = () => SFX.updateMuteButtons();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initButtons);
    } else {
      initButtons();
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BOOT IMMEDIATELY — do NOT wait for DOMContentLoaded.
//  `document` always exists at script parse time.
// ═══════════════════════════════════════════════════════════════════════════════
SFX.boot();
