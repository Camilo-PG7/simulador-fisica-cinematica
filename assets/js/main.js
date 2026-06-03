/**
 * main.js
 * Landing controller (welcome + menu only)
 * Simulations are now independent HTML pages.
 */

// ── Particle Background ───────────────────────────────────────────
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 16) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    p.style.background =
      ['#00e5ff','#ff3c6e','#a3ff6b','#ffb830']
      [Math.floor(Math.random() * 4)];

    container.appendChild(p);
  }
})();

// ── Screen Transitions (ONLY welcome ↔ menu) ──────────────────────
function _showScreen(id) {
  document.querySelectorAll('.screen')
    .forEach(s => s.classList.remove('active'));

  const target = document.getElementById(`screen-${id}`);
  if (target) target.classList.add('active');
}

function showMenu() {
  _showScreen('menu');
}

function showWelcome() {
  _showScreen('welcome');
}
