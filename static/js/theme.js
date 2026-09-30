(function () {
  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
    } catch (e) {
      // localStorage may be disabled or throw in strict sandboxes
    }
    return window.matchMedia
      ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // localStorage may be disabled or throw in strict sandboxes
    }
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  document.addEventListener('DOMContentLoaded', function () {
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    setTheme(current);
  });
})();
