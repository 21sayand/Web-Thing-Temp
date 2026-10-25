/**
 * Portal Directory Logic
 * Handles themes, Web Audio hover effects, filter state, metrics, and student card rendering.
 */

let activeBlood = 'all';
let activeCgpa = 'all';
let activeStatus = 'all';
let searchQuery = '';
let currentAuthTab = 'student';

// --- Sound Effects via Native Web Audio API ---
let soundEnabled = localStorage.getItem('college_portal_sound') !== 'disabled';
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playHoverSound() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;

    // Elegant soft glass pop/bubble sound (560Hz -> 740Hz quick exponential decay)
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const now = audioCtx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(560, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.05);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    // audio policy or unsupported - ignore silently
  }
}

function toggleSoundFromSettings() {
  initAudio();
  soundEnabled = !soundEnabled;
  localStorage.setItem('college_portal_sound', soundEnabled ? 'enabled' : 'disabled');
  updateSoundSettingsUI();
  if (soundEnabled) playHoverSound();
}

function updateSoundSettingsUI() {
  const toggleBtn = document.getElementById('settingsSoundToggle');
  const statusLabel = document.getElementById('settingsSoundStatus');
  if (toggleBtn) {
    toggleBtn.textContent = soundEnabled ? 'Enabled (Turn Off)' : 'Disabled (Turn On)';
    toggleBtn.className = soundEnabled ? 'btn btn-green settings-toggle-btn' : 'btn settings-toggle-btn';
  }
  if (statusLabel) {
    statusLabel.textContent = soundEnabled ? 'Active' : 'Muted';
  }
}

// --- Theme Management ---
function applyTheme(themeKey) {
  document.documentElement.setAttribute('data-theme', themeKey);
  localStorage.setItem('college_portal_theme', themeKey);

  // Update theme modal radio & active card state
  document.querySelectorAll('.theme-option-card').forEach(card => card.classList.remove('selected'));
  const activeCard = document.getElementById(`card-${themeKey}`);
  if (activeCard) activeCard.classList.add('selected');

  const radio = document.getElementById(`radio-${themeKey}`);
  if (radio) radio.checked = true;
}

function selectTheme(themeKey) {
  applyTheme(themeKey);
}

function openSettingsModal() {
  document.getElementById('settingsModal').style.display = 'flex';
  updateSoundSettingsUI();
}

function closeSettingsModal() {
  document.getElementById('settingsModal').style.display = 'none';
}

// --- Filters & Popover ---
function toggleFilterPopover() {
  document.getElementById('filterPopover').classList.toggle('open');
}

function resetFilters() {
  activeBlood = 'all';
  activeCgpa = 'all';
  activeStatus = 'all';
  searchQuery = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('cgpaFilter').value = 'all';
  document.getElementById('statusFilter').value = 'all';
  document.querySelectorAll('#bloodPills .filter-pill').forEach(b => b.classList.remove('active'));
  const allPill = document.querySelector('#bloodPills [data-blood="all"]');
  if (allPill) allPill.classList.add('active');
  updateFilterCountBadge();
  render();
}

function updateFilterCountBadge() {
  let count = 0;
  if (activeBlood !== 'all') count++;
  if (activeCgpa !== 'all') count++;
  if (activeStatus !== 'all') count++;

  const badge = document.getElementById('filterActiveCount');
  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
}

// --- Authentication UI & Handlers ---
function switchAuthTab(tab) {
  currentAuthTab = tab;
  const tabStudent = document.getElementById('tabStudentBtn');
  const tabFaculty = document.getElementById('tabFacultyBtn');
  const desc = document.getElementById('authModalDesc');
  const idInput = document.getElementById('authIdentifier');
  const passInput = document.getElementById('authPassword');
  const err = document.getElementById('authError');
  if (err) err.style.display = 'none';

  if (tab === 'student') {
    tabStudent.style.background = 'var(--surface-hover)';
    tabStudent.style.borderColor = 'var(--accent)';
    tabFaculty.style.background = '';
    tabFaculty.style.borderColor = '';
    desc.textContent = 'Sign in to highlight your portfolio at the top and manage your assignment submissions.';
    idInput.placeholder = 'Register Number (e.g. STM23CS043)';
    passInput.placeholder = 'Password (Register Number)';
  } else {
    tabFaculty.style.background = 'var(--surface-hover)';
    tabFaculty.style.borderColor = 'var(--accent)';
    tabStudent.style.background = '';
    tabStudent.style.borderColor = '';
    desc.textContent = 'Sign in with faculty credentials to access evaluation matrix and update marks.';
    idInput.placeholder = 'Faculty Username';
    passInput.placeholder = 'Faculty Password';
  }
}

function updateAuthHeader() {
  const user = window.CollegeAuth.getCurrentUser();
  const statusText = document.getElementById('authStatusText');
  const authBtn = document.getElementById('authBtn');

  if (user) {
    if (user.role === 'faculty') {
      statusText.textContent = `Faculty: ${user.name}`;
      authBtn.textContent = 'Sign Out';
    } else if (user.role === 'student') {
      statusText.textContent = `Signed In: ${user.name} (#${user.id})`;
      authBtn.textContent = 'Sign Out';
    }
  } else {
    statusText.textContent = 'Batch Directory';
    authBtn.textContent = 'Sign In';
  }
}

function toggleAuthSign() {
  const user = window.CollegeAuth.getCurrentUser();
  if (user) {
    window.CollegeAuth.logout();
    updateAuthHeader();
    render();
  } else {
    openAuthModal('student');
  }
}

function openFacultyModal() {
  const user = window.CollegeAuth.getCurrentUser();
  if (user && user.role === 'faculty') {
    window.location.href = 'assignment.html';
    return;
  }
  openAuthModal('faculty');
}

function openAuthModal(defaultTab = 'student') {
  switchAuthTab(defaultTab);
  document.getElementById('authModal').style.display = 'flex';
  document.getElementById('authError').style.display = 'none';
  document.getElementById('authIdentifier').value = '';
  document.getElementById('authPassword').value = '';
  document.getElementById('authIdentifier').focus();
}

function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const u = document.getElementById('authIdentifier').value.trim();
  const p = document.getElementById('authPassword').value.trim();
  const res = window.CollegeAuth.login(u, p);

  if (res.success) {
    closeAuthModal();
    updateAuthHeader();
    render();

    if (res.user.role === 'faculty' && currentAuthTab === 'faculty') {
      window.location.href = 'assignment.html';
    }
  } else {
    const err = document.getElementById('authError');
    err.textContent = res.message || 'Invalid credentials.';
    err.style.display = 'block';
  }
}

// --- Metrics & Grid Rendering ---
function updateMetrics() {
  const students = window.STUDENTS_DATA || [];
  const total = students.length;
  let submitted = 0;

  students.forEach(s => {
    if (window.AssignmentStore.isSubmitted(s.id, 'A1')) submitted++;
  });

  const pending = total - submitted;

  document.getElementById('totalCount').textContent = total;
  document.getElementById('submittedCount').textContent = submitted;
  document.getElementById('pendingCount').textContent = pending;
}

let mobileBatchSize = 13;
let visibleCount = 13;
let isMobileDevice = window.innerWidth <= 768;

window.addEventListener('resize', () => {
  const newIsMobile = window.innerWidth <= 768;
  if (newIsMobile !== isMobileDevice) {
    isMobileDevice = newIsMobile;
    visibleCount = isMobileDevice ? mobileBatchSize : 9999;
    render();
  }
});

function handleLoadMore() {
  const spinner = document.getElementById('loadMoreSpinner');
  const btn = document.getElementById('loadMoreBtn');
  const label = document.getElementById('loadMoreLabel');

  if (spinner) spinner.style.display = 'inline-block';
  if (label) label.textContent = 'Loading...';
  if (btn) btn.disabled = true;

  setTimeout(() => {
    visibleCount += mobileBatchSize;
    render(true);
    if (spinner) spinner.style.display = 'none';
    if (label) label.textContent = 'Load More Portfolios';
    if (btn) btn.disabled = false;
  }, 240);
}

function render(isAppend = false) {
  const container = document.getElementById('studentsGrid');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const loadMoreCount = document.getElementById('loadMoreCount');
  const students = window.STUDENTS_DATA || [];
  const user = window.CollegeAuth.getCurrentUser();
  const currentStudentId = user && user.role === 'student' ? user.id : null;

  isMobileDevice = window.innerWidth <= 768;

  const filtered = students.filter(s => {
    if (searchQuery) {
      const matchName = (s.name || '').toLowerCase().includes(searchQuery);
      const matchReg = (s.regNo || '').toLowerCase().includes(searchQuery);
      const matchRoll = (s.rollNo || '').toString() === searchQuery;
      if (!matchName && !matchReg && !matchRoll) return false;
    }

    if (activeBlood !== 'all') {
      const b = (s.blood || '').toUpperCase();
      if (b !== activeBlood.toUpperCase()) return false;
    }

    if (activeCgpa !== 'all') {
      const c = s.cgpa || 0;
      if (activeCgpa === '9' && c < 9.0) return false;
      if (activeCgpa === '8' && c < 8.0) return false;
      if (activeCgpa === '7' && c < 7.0) return false;
      if (activeCgpa === '6' && c < 6.0) return false;
      if (activeCgpa === 'below6' && c >= 6.0) return false;
    }

    const isSub = window.AssignmentStore.isSubmitted(s.id, 'A1');
    if (activeStatus === 'submitted' && !isSub) return false;
    if (activeStatus === 'pending' && isSub) return false;

    return true;
  });

  // If a student is authenticated, sort their portfolio to the top!
  if (currentStudentId) {
    filtered.sort((a, b) => {
      if (a.id === currentStudentId) return -1;
      if (b.id === currentStudentId) return 1;
      return 0;
    });
  }

  // Determine slice for mobile pagination vs desktop
  const effectiveLimit = isMobileDevice ? visibleCount : filtered.length;
  const displayed = filtered.slice(0, effectiveLimit);

  const isGuestAllowed = window.CollegeAuth.isGuestAccessAllowed();

  container.innerHTML = displayed.map((s, index) => {
    const isSub = window.AssignmentStore.isSubmitted(s.id, 'A1');
    const isMe = s.id === currentStudentId;
    const isFaculty = user && user.role === 'faculty';
    const canAccess = isGuestAllowed || isMe || isFaculty;

    const avatar = s.photo 
      ? `<img src="${s.photo}" alt="${s.name}" class="avatar-circle" onerror="this.outerHTML='<div class=\\'avatar-fallback\\'>${(s.name || 'S')[0]}</div>'">`
      : `<div class="avatar-fallback">${(s.name || 'S')[0]}</div>`;

    const animDelay = isAppend ? Math.min((index % mobileBatchSize) * 0.04, 0.4) : 0;

    let actionLabel = 'View Portfolio';
    if (isMe) actionLabel = 'Open My Portfolio (Full Edit)';
    else if (!canAccess) actionLabel = '🔒 Private (Sign In Required)';

    return `
      <a href="${s.id}/index.html" class="student-card anim-enter ${isMe ? 'my-portfolio' : ''}" target="_blank" onmouseenter="playHoverSound()" style="animation-delay: ${animDelay}s; ${!canAccess ? 'opacity: 0.88;' : ''}">
        ${isMe ? '<div class="my-portfolio-badge">✦ Your Portfolio</div>' : ''}
        <div>
          <div class="card-top">
            ${avatar}
            <div class="student-info">
              <h3>${s.name}</h3>
              <div class="student-meta-line">Roll ${s.rollNo} • ${s.regNo}</div>
            </div>
          </div>

          <div class="tags-row">
            <span class="tag-chip chip-blood">${s.blood || 'O+'}</span>
            <span class="tag-chip chip-cgpa">${s.cgpa ? Number(s.cgpa).toFixed(2) : '7.50'} CGPA</span>
            <span class="tag-chip ${isSub ? 'chip-sub' : 'chip-pen'}">
              ${isSub ? '✓ Submitted' : '⏳ Pending'}
            </span>
            ${!isGuestAllowed && !isMe ? '<span class="tag-chip" style="background: rgba(248,81,73,0.12); color: var(--badge-blood-text); border: 1px solid rgba(248,81,73,0.2);">🔒 Private</span>' : ''}
          </div>
        </div>

        <div class="card-action-bar">
          <span style="${!canAccess ? 'color: var(--text-muted); font-size: 11px;' : ''}">${actionLabel}</span>
          <span>${!canAccess ? '🔒' : '→'}</span>
        </div>
      </a>
    `;
  }).join('');

  // Handle Load More Button Visibility
  if (loadMoreWrap) {
    if (isMobileDevice && filtered.length > effectiveLimit) {
      loadMoreWrap.style.display = 'flex';
      if (loadMoreCount) {
        loadMoreCount.textContent = `Showing ${displayed.length} of ${filtered.length} students`;
      }
    } else {
      loadMoreWrap.style.display = 'none';
    }
  }
}

function setupListeners() {
  document.querySelectorAll('#bloodPills .filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#bloodPills .filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeBlood = btn.getAttribute('data-blood');
      updateFilterCountBadge();
      render();
    });
  });

  document.getElementById('cgpaFilter').addEventListener('change', (e) => {
    activeCgpa = e.target.value;
    updateFilterCountBadge();
    render();
  });

  document.getElementById('statusFilter').addEventListener('change', (e) => {
    activeStatus = e.target.value;
    updateFilterCountBadge();
    render();
  });

  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    render();
  });

  // Close filter popover on outside click
  document.addEventListener('click', (e) => {
    const pop = document.getElementById('filterPopover');
    const btn = document.getElementById('filterToggleBtn');
    if (pop && !pop.contains(e.target) && !btn.contains(e.target)) {
      pop.classList.remove('open');
    }
  });
}

function init() {
  const savedTheme = localStorage.getItem('college_portal_theme') || 'dark-default';
  applyTheme(savedTheme);
  updateSoundSettingsUI();

  // Resume audio context on first user click anywhere
  document.addEventListener('pointerdown', initAudio, { once: true });

  setupListeners();
  render();
  updateMetrics();
  updateAuthHeader();

  window.addEventListener('submissionsUpdated', () => {
    render();
    updateMetrics();
  });

  window.addEventListener('assignmentsUpdated', () => {
    render();
    updateMetrics();
  });

  window.addEventListener('guestAccessUpdated', () => {
    render();
  });
}

document.addEventListener('DOMContentLoaded', init);
