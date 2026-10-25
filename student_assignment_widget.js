(function() {
  // Determine student folder ID from path (e.g. /01/ or /42/)
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  let studentId = '';
  for (let i = pathParts.length - 1; i >= 0; i--) {
    if (/^\d+$/.test(pathParts[i])) {
      studentId = pathParts[i];
      break;
    }
  }

  if (!studentId) {
    const scripts = document.getElementsByTagName('script');
    for (let s of scripts) {
      if (s.src && s.src.includes('student_assignment_widget.js')) {
        const match = s.src.match(/\/(\d+)\//);
        if (match) studentId = match[1];
      }
    }
  }

  if (!studentId) studentId = '01';

  // 1. Tab Session Auth Verification (Persists as long as the tab is open)
  let authUser = null;
  try {
    const raw = sessionStorage.getItem('college_portal_auth_user');
    if (raw) {
      const data = JSON.parse(raw);
      authUser = data.user || data;
    }
  } catch(e) {}

  const isAuthorized = authUser && (authUser.role === 'faculty' || authUser.id === studentId);

  if (isAuthorized) {
    // Immediately un-shield the page (Zero Flicker)
    const shield = document.getElementById('auth-shield-style');
    if (shield) shield.remove();
    document.documentElement.style.visibility = 'visible';
    document.documentElement.style.opacity = '1';
  } else {
    // Keep page protected and render unlock screen immediately
    document.documentElement.style.visibility = 'visible';
    document.documentElement.style.opacity = '1';
    renderUnlockView();
    return;
  }

  function renderUnlockView() {
    function mount() {
      document.body.innerHTML = `
        <div style="min-height: 100vh; background: #0d1117; color: #f0f6fc; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; padding: 20px;">
          <div style="background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 24px 28px; max-width: 380px; width: 100%; box-shadow: 0 16px 32px rgba(0,0,0,0.5); text-align: left;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
              <div style="width: 32px; height: 32px; border-radius: 6px; background: #21262d; border: 1px solid #30363d; color: #58a6ff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">ST</div>
              <div>
                <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #f0f6fc;">Portfolio #${studentId} Verification</h3>
                <p style="margin: 0; font-size: 12px; color: #8b949e;">Authenticate to access this portfolio</p>
              </div>
            </div>

            ${authUser ? `
              <div style="background: rgba(210, 153, 34, 0.15); border: 1px solid rgba(210, 153, 34, 0.3); border-radius: 6px; padding: 8px 10px; margin-bottom: 14px; font-size: 12px; color: #d29922;">
                Active session: <strong>${authUser.name}</strong>.<br>Enter credentials for #${studentId} or switch below.
              </div>
            ` : `
              <p style="font-size: 12px; color: #8b949e; margin-bottom: 14px; line-height: 1.4;">
                Enter this student's University Register Number to unlock and view.
              </p>
            `}

            <form id="portfolioUnlockForm" onsubmit="handleUnlock(event)">
              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #8b949e; margin-bottom: 4px;">
                  Register Number
                </label>
                <input type="text" id="unlockIdentifier" required autocomplete="username" placeholder="University Register Number" 
                       style="width: 100%; box-sizing: border-box; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 7px 10px; color: #f0f6fc; font-size: 13px; outline: none;">
              </div>

              <div style="margin-bottom: 14px;">
                <label style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #8b949e; margin-bottom: 4px;">
                  Password
                </label>
                <input type="password" id="unlockPassword" required autocomplete="current-password" placeholder="Password (Register Number)" 
                       style="width: 100%; box-sizing: border-box; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 7px 10px; color: #f0f6fc; font-size: 13px; outline: none;">
              </div>

              <div id="unlockError" style="display: none; color: #f85149; font-size: 12px; margin-bottom: 10px;"></div>

              <button type="submit" style="width: 100%; background: #238636; color: #fff; border: 1px solid rgba(240,246,252,0.1); padding: 7px 12px; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer; margin-bottom: 10px;">
                Unlock & View
              </button>

              <div style="display: flex; gap: 8px;">
                ${authUser ? `
                  <a href="../${authUser.id}/index.html" style="flex: 1; text-align: center; background: #21262d; color: #c9d1d9; border: 1px solid #30363d; padding: 6px 10px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">
                    My Portfolio (#${authUser.id})
                  </a>
                ` : ''}
                <a href="../index.html" style="flex: 1; text-align: center; background: #21262d; color: #c9d1d9; border: 1px solid #30363d; padding: 6px 10px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">
                  Return to Home
                </a>
              </div>
            </form>
          </div>
        </div>
      `;

      window.handleUnlock = function(e) {
        e.preventDefault();
        const id = document.getElementById('unlockIdentifier').value.trim();
        const pass = document.getElementById('unlockPassword').value.trim();
        const res = window.CollegeAuth ? window.CollegeAuth.login(id, pass) : null;
        if (res && res.success) {
          window.location.reload();
        } else {
          const err = document.getElementById('unlockError');
          err.textContent = res ? res.message : 'Invalid credentials.';
          err.style.display = 'block';
        }
      };
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mount);
    } else {
      mount();
    }
  }

  // 2. Bottom-Right Floating Pill Widget for Authenticated Student
  const style = document.createElement('style');
  style.textContent = `
    .college-bottom-dock {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .dock-pill-trigger {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #161b22;
      color: #f0f6fc;
      border: 1px solid #30363d;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      transition: all 0.15s ease;
      user-select: none;
    }

    .dock-pill-trigger:hover {
      background: #21262d;
      border-color: #8b949e;
    }

    .dock-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d29922;
    }

    .dock-status-dot.submitted {
      background: #3fb950;
    }

    .dock-panel {
      background: #161b22;
      color: #f0f6fc;
      border: 1px solid #30363d;
      border-radius: 8px;
      width: 300px;
      padding: 16px;
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
      display: none;
      flex-direction: column;
      gap: 12px;
    }

    .dock-panel.open { display: flex; }

    .dock-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #21262d;
      padding-bottom: 8px;
    }

    .dock-panel-header h4 {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
    }

    .dock-close-btn {
      background: none;
      border: none;
      color: #8b949e;
      font-size: 18px;
      cursor: pointer;
      line-height: 1;
    }

    .dock-close-btn:hover { color: #f0f6fc; }

    .dock-user-tag {
      font-size: 12px;
      color: #58a6ff;
      background: rgba(56, 139, 253, 0.1);
      border: 1px solid rgba(56, 139, 253, 0.2);
      padding: 6px 10px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dock-home-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: #21262d;
      border: 1px solid #30363d;
      color: #c9d1d9;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      text-decoration: none;
      transition: background 0.15s;
    }

    .dock-home-btn:hover {
      background: #30363d;
      color: #f0f6fc;
    }

    .dock-field-group label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: #8b949e;
      display: block;
      margin-bottom: 4px;
    }

    .dock-field-group select, .dock-field-group input {
      width: 100%;
      background: #0d1117;
      border: 1px solid #30363d;
      color: #f0f6fc;
      padding: 6px 8px;
      border-radius: 6px;
      font-size: 12px;
      box-sizing: border-box;
      outline: none;
    }

    .dock-submit-btn {
      background: #238636;
      color: #fff;
      border: 1px solid rgba(240, 246, 252, 0.1);
      padding: 7px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
    }

    .dock-submit-btn:hover { background: #2ea043; }

    .dock-logout-btn {
      background: none;
      border: 1px solid rgba(248, 81, 73, 0.4);
      color: #ff7b72;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }

    .dock-logout-btn:hover { background: rgba(248, 81, 73, 0.15); }
  `;
  document.head.appendChild(style);

  function createDock() {
    function checkSubmitted(aId = 'A1') {
      try {
        const store = JSON.parse(localStorage.getItem('college_portal_assignments_state') || '{}');
        return store[studentId] && store[studentId][aId] === 1;
      } catch (e) {
        return false;
      }
    }

    const isSub = checkSubmitted('A1');

    const dock = document.createElement('div');
    dock.className = 'college-bottom-dock';
    dock.innerHTML = `
      <div class="dock-panel" id="collegeDockPanel">
        <div class="dock-panel-header">
          <h4>Portal Hub (Student #${studentId})</h4>
          <button class="dock-close-btn" id="closeDockPanel">&times;</button>
        </div>

        <div class="dock-user-tag">
          <span>User: <strong>${authUser ? authUser.name : 'Authorized'}</strong></span>
          <button class="dock-logout-btn" id="dockLogoutBtn">Sign Out</button>
        </div>

        <a href="../index.html" class="dock-home-btn">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Return to Portal Homepage
        </a>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
          <span style="font-size: 12px; color: #8b949e;">Assignment 1:</span>
          <span style="font-size: 11px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: ${isSub ? 'rgba(46, 160, 67, 0.15)' : 'rgba(210, 153, 34, 0.15)'}; color: ${isSub ? '#3fb950' : '#d29922'};" id="dockStatusBadge">
            ${isSub ? '✓ Submitted (1)' : '⏳ Pending (0)'}
          </span>
        </div>

        <div class="dock-field-group">
          <label>Assignment</label>
          <select id="dockAssignSelect">
            <option value="A1">Assignment 1 (Web Profile)</option>
            <option value="A2">Assignment 2 (JS DOM & Validation)</option>
          </select>
        </div>

        <div class="dock-field-group">
          <label>Attach File</label>
          <input type="file" id="dockFileInput">
        </div>

        <button class="dock-submit-btn" id="dockSubmitBtn">Submit Assignment (Bit 1)</button>
      </div>

      <div class="dock-pill-trigger" id="dockPillTrigger" title="Click to open portal tools or return home">
        <span class="dock-status-dot ${isSub ? 'submitted' : ''}" id="dockTriggerDot"></span>
        <span>Portal Hub</span>
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"></path></svg>
      </div>
    `;

    document.body.appendChild(dock);

    document.getElementById('dockPillTrigger').addEventListener('click', () => {
      document.getElementById('collegeDockPanel').classList.toggle('open');
    });

    document.getElementById('closeDockPanel').addEventListener('click', () => {
      document.getElementById('collegeDockPanel').classList.remove('open');
    });

    document.getElementById('dockLogoutBtn').addEventListener('click', () => {
      sessionStorage.removeItem('college_portal_auth_user');
      localStorage.removeItem('college_portal_auth_user');
      window.location.href = '../index.html';
    });

    document.getElementById('dockSubmitBtn').addEventListener('click', () => {
      const aId = document.getElementById('dockAssignSelect').value;
      const fileInput = document.getElementById('dockFileInput');
      const fileName = fileInput.files[0] ? fileInput.files[0].name : `assignment_${aId}.pdf`;

      try {
        const store = JSON.parse(localStorage.getItem('college_portal_assignments_state') || '{}');
        if (!store[studentId]) store[studentId] = {};
        store[studentId][aId] = 1;
        if (!store[studentId]._meta) store[studentId]._meta = {};
        store[studentId]._meta[aId] = { fileName, submittedAt: new Date().toISOString() };
        localStorage.setItem('college_portal_assignments_state', JSON.stringify(store));
      } catch (e) {}

      document.getElementById('dockStatusBadge').textContent = '✓ Submitted (1)';
      document.getElementById('dockStatusBadge').style.background = 'rgba(46, 160, 67, 0.15)';
      document.getElementById('dockStatusBadge').style.color = '#3fb950';
      document.getElementById('dockTriggerDot').classList.add('submitted');

      alert(`Assignment ${aId} submitted for Student #${studentId}! Flag updated to 1.`);
      document.getElementById('collegeDockPanel').classList.remove('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDock);
  } else {
    createDock();
  }
})();
