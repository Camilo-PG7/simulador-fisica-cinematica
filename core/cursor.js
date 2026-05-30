(function initGlobalCustomCursor() {
  // Prevent duplicate initialization
  if (document.getElementById('customCursorDot') || document.getElementById('customCursorRing')) {
    return;
  }

  // Create style element
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (hover: hover) and (pointer: fine) {
      body, 
      a, button, input, select, textarea, label, [role="button"],
      .sim-card, .btn-primary, .btn-back-top, .btn-clear-hist, 
      .chatbot-fab, .chatbot-chip, .chatbot-input, .chatbot-btn-close,
      .sim-btn, .btn-verificar, .slider-sw {
        cursor: none !important;
      }
      
      .custom-cursor-dot {
        width: 8px;
        height: 8px;
        background: var(--theme-accent, #00e5ff);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 100000;
        transform: translate(-50%, -50%);
        transition: width 0.2s, height 0.2s, background-color 0.2s;
        box-shadow: 0 0 10px var(--theme-accent, #00e5ff);
      }
      
      .custom-cursor-ring {
        width: 36px;
        height: 36px;
        border: 2px solid var(--theme-accent-alpha-hover, rgba(0, 229, 255, 0.4));
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        transition: border-color 0.25s, width 0.25s, height 0.25s, background-color 0.25s;
        box-shadow: 0 0 15px var(--theme-accent-alpha, rgba(0, 229, 255, 0.1));
      }
      
      /* Hover state */
      .custom-cursor-hover-dot {
        width: 4px;
        height: 4px;
        background: var(--accent2, #ff3c6e) !important;
        box-shadow: 0 0 12px var(--accent2, #ff3c6e) !important;
      }
      
      .custom-cursor-hover-ring {
        width: 56px;
        height: 56px;
        border-color: var(--accent2, #ff3c6e) !important;
        background: rgba(255, 60, 110, 0.08) !important;
        box-shadow: 0 0 20px rgba(255, 60, 110, 0.2) !important;
      }

      /* Click state */
      .custom-cursor-clicking-dot {
        background-color: var(--accent3, #a3ff6b) !important;
        box-shadow: 0 0 10px var(--accent3, #a3ff6b) !important;
      }
      
      .custom-cursor-clicking-ring {
        transform: translate(-50%, -50%) scale(0.7) !important;
        border-color: var(--accent3, #a3ff6b) !important;
        background: rgba(163, 255, 107, 0.15) !important;
        box-shadow: 0 0 15px rgba(163, 255, 107, 0.4) !important;
      }
    }
    
    @media (hover: none) {
      .custom-cursor-dot, .custom-cursor-ring {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(styleEl);

  // Create cursor elements
  const dot = document.createElement('div');
  dot.id = 'customCursorDot';
  dot.className = 'custom-cursor-dot';
  dot.style.opacity = '0';

  const ring = document.createElement('div');
  ring.id = 'customCursorRing';
  ring.className = 'custom-cursor-ring';
  ring.style.opacity = '0';

  // Append cursor elements
  function appendCursor() {
    if (document.body) {
      document.body.appendChild(dot);
      document.body.appendChild(ring);
      setupListeners();
    } else {
      setTimeout(appendCursor, 50);
    }
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isMoving = false;

  function setupListeners() {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isMoving) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        isMoving = true;
      }

      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Lerp tracking for trailing ring
    function lerpRing() {
      const ease = 0.15;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;
      
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      
      requestAnimationFrame(lerpRing);
    }
    lerpRing();

    // Mouse hover state delegation
    const interactiveSelector = 'a, button, input, select, textarea, label, [role="button"], .sim-card, .btn-primary, .btn-back-top, .btn-clear-hist, .chatbot-fab, .chatbot-chip, .chatbot-input, .chatbot-btn-close, .sim-btn, .btn-verificar, .slider-sw';
    
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(interactiveSelector);
      if (target) {
        dot.classList.add('custom-cursor-hover-dot');
        ring.classList.add('custom-cursor-hover-ring');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(interactiveSelector);
      if (target) {
        dot.classList.remove('custom-cursor-hover-dot');
        ring.classList.remove('custom-cursor-hover-ring');
      }
    });

    // Mouse down/up click transitions
    window.addEventListener('mousedown', () => {
      dot.classList.add('custom-cursor-clicking-dot');
      ring.classList.add('custom-cursor-clicking-ring');
    });

    window.addEventListener('mouseup', () => {
      dot.classList.remove('custom-cursor-clicking-dot');
      ring.classList.remove('custom-cursor-clicking-ring');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      isMoving = false;
    });
  }

  // Run append
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', appendCursor);
  } else {
    appendCursor();
  }
})();
