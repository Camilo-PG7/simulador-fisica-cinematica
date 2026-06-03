/**
 * SFX Engine - Web Audio API
 * Generates procedural UI and physics sounds.
 */

class SFX {
  static ctx = null;
  static isMuted = localStorage.getItem('sim_muted') === 'true';
  static masterGain = null;
  static windNode = null;
  static windGain = null;
  static windFilter = null;

  static hooksInitialized = false;

  static init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = this.isMuted ? 0 : 0.5;
      
      // Attempt to resume context if it starts suspended (browser auto-play policy)
      if (this.ctx.state === 'suspended') {
        const resume = () => {
          if (this.ctx.state === 'suspended') this.ctx.resume();
        };
        document.addEventListener('click', resume, { once: true });
        document.addEventListener('touchstart', resume, { once: true });
        document.addEventListener('keydown', resume, { once: true });
      }
    } catch (e) {
      console.warn("Web Audio API no soportada en este navegador.", e);
    }
  }

  static toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('sim_muted', this.isMuted);
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.5, this.ctx.currentTime, 0.05);
    }
    this.updateMuteButtons();
    
    if (!this.isMuted) {
      this.init(); // Initialize if it wasn't already
      this.playClick();
    }
    return this.isMuted;
  }

  static updateMuteButtons() {
    const btns = document.querySelectorAll('.btn-mute');
    btns.forEach(btn => {
      btn.innerHTML = this.isMuted ? '🔇 Mute' : '🔊 Sonido';
      if(this.isMuted) btn.classList.add('muted');
      else btn.classList.remove('muted');
    });
  }

  static playHover() {
    if (!this.ctx || this.isMuted || this.ctx.state === 'suspended') return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.1);
  }

  static playClick() {
    if (!this.ctx || this.isMuted || this.ctx.state === 'suspended') return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.1);
  }

  static playThud(intensity = 1.0) {
    if (!this.ctx || this.isMuted || this.ctx.state === 'suspended') return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Impact uses a triangle wave dropping rapidly in pitch to simulate a deep thud
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.1);
    
    const maxGain = Math.min(0.8, 0.3 * intensity);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(maxGain, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Continuous wind loop
  static playWind(velocity) {
    if (!this.ctx || this.isMuted || this.ctx.state === 'suspended') return;
    
    if (!this.windNode) {
      // Create white noise buffer
      const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
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
    
    // Map velocity to pitch and volume
    const clampedV = Math.max(0, Math.min(50, velocity));
    const targetFreq = 200 + (clampedV * 25);
    const targetGain = clampedV > 1 ? Math.min(0.3, clampedV * 0.015) : 0;
    
    const t = this.ctx.currentTime;
    this.windFilter.frequency.setTargetAtTime(targetFreq, t, 0.1);
    this.windGain.gain.setTargetAtTime(targetGain, t, 0.1);
  }

  static stopWind() {
    if (this.windGain) {
      const t = this.ctx.currentTime;
      this.windGain.gain.setTargetAtTime(0, t, 0.1);
    }
  }

  static initGlobalUIHooks() {
    if (this.hooksInitialized) return;
    this.hooksInitialized = true;

    // Add audio hooks to common interactive elements dynamically
    document.body.addEventListener('mouseenter', (e) => {
      const t = e.target;
      if (t.tagName === 'BUTTON' || t.tagName === 'A' || t.tagName === 'SELECT' || 
          (t.tagName === 'INPUT' && t.type === 'range') || 
          t.classList?.contains('param-group')) {
        if (SFX.ctx && !SFX.isMuted) SFX.playHover();
      }
    }, true);

    document.body.addEventListener('mousedown', (e) => {
      // Auto-init context on first interaction if not yet created
      if (!SFX.ctx && !SFX.isMuted) {
        SFX.init();
      }
      
      if (SFX.ctx && SFX.ctx.state === 'suspended') {
        SFX.ctx.resume();
      }

      const t = e.target;
      if (t.tagName === 'BUTTON' || t.tagName === 'A' || t.tagName === 'SELECT' || 
          (t.tagName === 'INPUT' && (t.type === 'range' || t.type === 'checkbox'))) {
        if (!SFX.isMuted) SFX.playClick();
      }
    }, true);

    document.body.addEventListener('touchstart', (e) => {
      if (!SFX.ctx && !SFX.isMuted) SFX.init();
      if (SFX.ctx && SFX.ctx.state === 'suspended') SFX.ctx.resume();
    }, { passive: true, capture: true });
  }
}

// Auto-initialize UI hooks on load
window.addEventListener('DOMContentLoaded', () => {
  SFX.updateMuteButtons();
  SFX.initGlobalUIHooks();
});
