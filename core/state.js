/**
 * core/state.js
 * Central application state. Single source of truth.
 */

const AppState = (() => {
  // Possible app screens
  const SCREENS = { WELCOME: 'welcome', MENU: 'menu', SIM: 'sim' };

  let _currentScreen = SCREENS.WELCOME;
  let _activeSim     = null;   // 'mru' | 'mua' | 'mua-f'
  let _p5Instance    = null;   // Active p5 instance
  let _charts        = {};     // Active Chart.js instances  { id: Chart }

  return {
    SCREENS,

    get currentScreen() { return _currentScreen; },
    get activeSim()     { return _activeSim; },

    setScreen(name) {
      _currentScreen = name;
    },

    setActiveSim(sim) {
      _activeSim = sim;
    },

    getP5() { return _p5Instance; },

    setP5(instance) {
      if (_p5Instance) {
        _p5Instance.remove();
      }
      _p5Instance = instance;
    },

    getChart(id) { return _charts[id]; },

    setChart(id, chart) {
      if (_charts[id]) {
        _charts[id].destroy();
      }
      _charts[id] = chart;
    },

    destroyAllCharts() {
      Object.values(_charts).forEach(c => c.destroy());
      _charts = {};
    }
  };
})();
