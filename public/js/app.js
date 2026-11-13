(() => {
  const root = document.documentElement;
  const button = document.getElementById('themeToggle');

  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('gcc-theme') || 'light';
  } catch (_) {
    // The interface remains usable if browser storage is disabled.
  }
  root.dataset.theme = savedTheme === 'dark' ? 'dark' : 'light';
  updateToggle();

  if (button) {
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('gcc-theme', root.dataset.theme);
      } catch (_) {
        // Theme still changes for the current page if storage is unavailable.
      }
      updateToggle();
    });
  }

  function updateToggle() {
    if (!button) return;
    const dark = root.dataset.theme === 'dark';
    button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    button.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
    button.textContent = dark ? '☼' : '◐';
  }

  const roleSelect = document.getElementById('roleSelect');
  const themeField = document.getElementById('themeField');
  if (roleSelect && themeField) {
    const syncThemeField = () => {
      const isTeacher = roleSelect.value === 'teacher';
      themeField.hidden = !isTeacher;
      const select = themeField.querySelector('select');
      if (select) select.disabled = !isTeacher;
    };
    roleSelect.addEventListener('change', syncThemeField);
    syncThemeField();
  }
})();
