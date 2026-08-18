/**
 * theme.js — Controlador global de modo claro / oscuro
 * Gestiona el estado, persistencia en localStorage y sincronización en tiempo real.
 */
const ThemeManager = (() => {
  const STORAGE_KEY = 'fisica_sim_theme';

  // 1. Obtener tema inicial
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  // 2. Aplicar tema al DOM
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('localStorage no disponible para guardar el tema:', e);
    }
    updateToggleButtons(theme);

    // Disparar evento personalizado para canvas y componentes que lo escuchen
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  // 3. Alternar tema
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // 4. Actualizar botones en pantalla
  function updateToggleButtons(theme) {
    const isLight = theme === 'light';
    document.querySelectorAll('.btn-theme').forEach(btn => {
      btn.innerHTML = isLight ? '🌙 Modo Oscuro' : '☀️ Modo Claro';
      btn.setAttribute('aria-label', `Cambiar a modo ${isLight ? 'oscuro' : 'claro'}`);
      btn.setAttribute('title', `Cambiar a modo ${isLight ? 'oscuro' : 'claro'}`);
    });
  }

  // Inicialización cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
      updateToggleButtons(current);
    });
  } else {
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    updateToggleButtons(current);
  }

  return {
    init: () => applyTheme(getPreferredTheme()),
    toggle: toggleTheme,
    current: () => document.documentElement.getAttribute('data-theme') || 'dark',
    apply: applyTheme
  };
})();
