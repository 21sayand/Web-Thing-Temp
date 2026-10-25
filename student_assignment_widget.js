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

  // 1. Session verification & Route Guard
  let authUser = null;
  try {
    const raw = sessionStorage.getItem('college_portal_auth_user');
    if (raw) {
      const data = JSON.parse(raw);
      if (data.expiresAt && Date.now() > data.expiresAt) {
        sessionStorage.removeItem('college_portal_auth_user');
        authUser = null;
      } else {
        data.expiresAt = Date.now() + (90 * 1000);
        sessionStorage.setItem('college_portal_auth_user', JSON.stringify(data));
        authUser = data.user;
      }
    }
  } catch(e) {}

  // If visiting without being logged in OR logged in as another student:
  if (!authUser || (authUser.role === 'student' && authUser.id !== studentId)) {
    showAuthUnlockScreen();
    return;
  }

  function showAuthUnlockScreen() {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.innerHTML = `
        <div style="min-height: 100vh; background: #0b0f19; color: #f8fafc; display: flex; align-items: center; justify-content: center; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
          <div style="background: #161e2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; max-width: 460px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: left;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: #1e40af; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem;">ST</div>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #fff;">Portfolio Authentication</h3>
                <p style="margin: 0; font-size: 0.8rem; color: #94a3b8;">Student Portfolio #${studentId} Verification</p>
              </div>
            </div>

            ${authUser ? `
              <div style="background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.25); border-radius: 8px; padding: 10px 12px; margin-bottom: 18px; font-size: 0.82rem; color: #fef08a;">
                Currently active: <strong>${authUser.name}</strong> (${authUser.regNo}).<br>
                To view this portfolio (#${studentId}), enter this student's credentials below or switch to your own portfolio.
              </div>
            ` : `
              <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 18px; line-height: 1.5;">
                Please authenticate with your University Register Number to access this portfolio.
              </p>
            `}

            <form id="portfolioUnlockForm" onsubmit="handleUnlock(event)">
              <div style="margin-bottom: 14px;">
                <label style="display: block; font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 6px;">
                  University Register Number
                </label>
                <input type="text" id="unlockIdentifier" required autocomplete="username" placeholder="Enter University Register Number" 
                       style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 0.9rem; outline: none;">
              </div>

              <div style="margin-bottom: 18px;">
                <label style="display: block; font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 6px;">
                  Password
                </label>
                <input type="password" id="unlockPassword" required autocomplete="current-password" placeholder="Password (Same as Register Number)" 
                       style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 0.9rem; outline: none;">
              </div>

              <div id="unlockError" style="display: none; background: #fee2e2; color: #991b1b; padding: 8px 12px; border-radius: 6px; font-size: 0.8rem; margin-bottom: 14px;"></div>

              <button type="submit" style="width: 100%; background: #2563eb; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; margin-bottom: 10px;">
                Unlock & View Portfolio
              </button>

              <div style="display: flex; gap: 8px;">
                ${authUser ? `
                  <a href="../${authUser.id}/index.html" style="flex: 1; text-align: center; background: rgba(255,255,255,0.06); color: #cbd5e1; border: 1px solid #334155; padding: 8px; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 600;">
                    My Portfolio (#${authUser.id})
                  </a>
                ` : ''}
                <a href="../index.html" style="flex: 1; text-align: center; background: rgba(255,255,255,0.06); color: #cbd5e1; border: 1px solid #334155; padding: 8px; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 600;">
                  Central Portal Home
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
        const res = window.CollegeAuth.login(id, pass);
        if (res.success) {
          window.location.reload();
        } else {
          const err = document.getElementById('unlockError');
          err.textContent = res.message;
          err.style.display = 'block';
        }
      };
    });
  }

  // 2. Inject Bottom-Right Expandable Floating Dock
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .dock-pill-trigger {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #0f172a;
      color: #f8fafc;
      border: 1px solid #334155;
      padding: 9px 16px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
      transition: all 0.2s ease;
      user-select: none;
    }

    .dock-pill-trigger:hover {
      background: #1e293b;
      transform: translateY(-2px);
    }

    .dock-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d97706;
    }

    .dock-status-dot.submitted {
      background: #16a34a;
    }

    .dock-panel {
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      width: 320px;
      padding: 16px;
      box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.2);
      display: none;
      flex-direction: column;
      gap: 12px;
    }

    .dock-panel.open { display: flex; }

    .dock-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 8px;
    }

    .dock-panel-header h4 {
      margin: 0;
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
    }

    .dock-close-btn {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 18px;
      cursor: pointer;
    }

    .dock-user-tag {
      font-size: 12px;
      color: #0369a1;
      background: #f0f9ff;
      border: 1px solid #e0f2fe;
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
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      color: #334155;
      padding: 7px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s;
    }

    .dock-home-btn:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    .dock-field-group label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #64748b;
      display: block;
      margin-bottom: 4px;
    }

    .dock-field-group select, .dock-field-group input {
      width: 100%;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      color: #0f172a;
      padding: 6px 8px;
      border-radius: 6px;
      font-size: 12px;
      box-sizing: border-box;
      outline: none;
    }

    .dock-submit-btn {
      background: #1e40af;
      color: #fff;
      border: none;
      padding: 8px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
    }

    .dock-submit-btn:hover { background: #1d4ed8; }

    .dock-logout-btn {
      background: none;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
    }

    .dock-logout-btn:hover { background: #fee2e2; }
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
          <span>User: <strong>${authUser ? authUser.name : 'Authenticated'}</strong></span>
          <button class="dock-logout-btn" id="dockLogoutBtn">Sign Out</button>
        </div>

        <a href="../index.html" class="dock-home-btn">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Return to Portal Homepage
        </a>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
          <span style="font-size: 12px; color: #64748b;">Assignment 1:</span>
          <span style="font-size: 11px; font-weight: 700; padding: 3px 6px; border-radius: 4px; background: ${isSub ? '#dcfce7' : '#fef3c7'}; color: ${isSub ? '#15803d' : '#b45309'};" id="dockStatusBadge">
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
          <label>File Attachment</label>
          <input type="file" id="dockFileInput">
        </div>

        <button class="dock-submit-btn" id="dockSubmitBtn">Submit Assignment (Flip to 1)</button>
      </div>

      <div class="dock-pill-trigger" id="dockPillTrigger" title="Click to open portal tools or return home">
        <span class="dock-status-dot ${isSub ? 'submitted' : ''}" id="dockTriggerDot"></span>
        <span>Portal & Assignment</span>
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
      document.getElementById('dockStatusBadge').style.background = '#dcfce7';
      document.getElementById('dockStatusBadge').style.color = '#15803d';
      document.getElementById('dockTriggerDot').classList.add('submitted');

      alert(`Assignment ${aId} submitted successfully for Student #${studentId}! Flag updated to 1.`);
      document.getElementById('collegeDockPanel').classList.remove('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDock);
  } else {
    createDock();
  }
})();
