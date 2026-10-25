/**
 * Yashika Prasanth — Student Profile Portal
 * Interactive Controllers: Theme Switcher, Live Clock,
 * Chips, Dynamic Semester Filters & Search.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------
  // 1. Live Real-Time Digital Clock
  // ---------------------------------------------------------
  const liveClockEl = document.getElementById('liveClock');

  function updateClock() {
    if (!liveClockEl) return;
    const now = new Date();
    
    // Format: 30 Sept 2026, 11:53:16 am
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;

    liveClockEl.textContent = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // ---------------------------------------------------------
  // 2. Dark / Light Mode Toggle with Persistence
  // ---------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('ktu_profile_theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const target = current === 'dark' ? 'light' : 'dark';
      applyTheme(target);
      localStorage.setItem('ktu_profile_theme', target);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (themeIcon && themeText) {
      if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light';
      } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark';
      }
    }
  }

  // ---------------------------------------------------------
  // 4. Interactive Chips (Company & Skills Toggle)
  // ---------------------------------------------------------
  const chips = document.querySelectorAll('.interactive-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });

  // ---------------------------------------------------------
  // 5. Marks Table: Semester Filters & Real-Time Search
  // ---------------------------------------------------------
  const filterBtns = document.querySelectorAll('.sem-filter-btn');
  const searchInput = document.getElementById('marksSearch');
  const marksRows = document.querySelectorAll('#marksTable tbody tr');
  const emptyState = document.getElementById('emptySearchState');

  let activeSem = 'all';
  let searchTerm = '';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSem = btn.getAttribute('data-sem');
      applyTableFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      applyTableFilters();
    });
  }

  function applyTableFilters() {
    let visibleCount = 0;

    marksRows.forEach(row => {
      const rowSem = row.getAttribute('data-sem');
      const rowText = row.textContent.toLowerCase();

      const matchesSem = (activeSem === 'all' || rowSem === activeSem);
      const matchesSearch = (!searchTerm || rowText.includes(searchTerm));

      if (matchesSem && matchesSearch) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }
});
