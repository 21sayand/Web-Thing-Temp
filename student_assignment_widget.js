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

  // 1. Enforce Student Route Protection
  const authUser = (function() {
    try {
      return JSON.parse(sessionStorage.getItem('college_portal_auth_user') || localStorage.getItem('college_portal_auth_user') || 'null');
    } catch(e) { return null; }
  })();

  // If not logged in or a student trying to view another student's portfolio:
  if (!authUser) {
    // Show login block overlay
    showAuthGate('Please authenticate with your University Register Number to view this portfolio.');
    return;
  } else if (authUser.role === 'student' && authUser.id !== studentId) {
    // Block access and redirect to their own portfolio
    showAuthGate(`Access Restricted: You are logged in as ${authUser.name} (${authUser.regNo}). You may only access your own portfolio (#${authUser.id}).`, authUser.id);
    return;
  }

  function showAuthGate(message, ownId = null) {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.innerHTML = `
        <div style="min-height: 100vh; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
          <div style="background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; max-width: 440px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <div style="width: 56px; height: 56px; border-radius: 12px; background: rgba(239, 68, 68, 0.15); color: #f87171; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-5a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">Institutional Access Guard</h2>
            <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.5; margin-bottom: 24px;">${message}</p>
            <div style="display: flex; gap: 10px;">
              ${ownId ? `<a href="../${ownId}/index.html" style="flex: 1; background: #2563eb; color: #fff; padding: 10px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.85rem;">Go to My Portfolio (#${ownId})</a>` : ''}
              <a href="../index.html" style="flex: 1; background: rgba(255,255,255,0.1); color: #fff; padding: 10px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.85rem;">Return to Login</a>
            </div>
          </div>
        </div>
      `;
    });
  }

  // 2. Inject sleek bottom-right dock styles
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
      gap: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .dock-pill-trigger {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #18181b;
      color: #fafafa;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 10px 18px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
      transition: all 0.25s ease;
      user-select: none;
    }

    .dock-pill-trigger:hover {
      background: #27272a;
      transform: translateY(-2px);
    }

    .dock-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #f59e0b;
    }

    .dock-status-dot.submitted {
      background: #10b981;
    }

    .dock-panel {
      background: #18181b;
      color: #fafafa;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      width: 320px;
      padding: 18px;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
      display: none;
      flex-direction: column;
      gap: 14px;
    }

    .dock-panel.open {
      display: flex;
    }

    .dock-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 10px;
    }

    .dock-panel-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }

    .dock-close-btn {
      background: none;
      border: none;
      color: #a1a1aa;
      font-size: 18px;
      cursor: pointer;
    }

    .dock-user-tag {
      font-size: 11px;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      padding: 4px 8px;
      border-radius: 6px;
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dock-field-group label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #a1a1aa;
      display: block;
      margin-bottom: 5px;
    }

    .dock-field-group select, .dock-field-group input {
      width: 100%;
      background: #27272a;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #fff;
      padding: 7px 10px;
      border-radius: 8px;
      font-size: 12px;
      box-sizing: border-box;
      outline: none;
    }

    .dock-submit-btn {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 9px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
    }

    .dock-submit-btn:hover {
      background: #1d4ed8;
    }

    .dock-logout-btn {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #ef4444;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }

    .dock-logout-btn:hover {
      background: rgba(239, 68, 68, 0.1);
    }
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
      <!-- Collapsible Panel -->
      <div class="dock-panel" id="collegeDockPanel">
        <div class="dock-panel-header">
          <h4>Portal Hub (#${studentId})</h4>
          <button class="dock-close-btn" id="closeDockPanel">&times;</button>
        </div>

        <div class="dock-user-tag">
          <span>Logged in: <strong>${authUser.name}</strong></span>
          <button class="dock-logout-btn" id="dockLogoutBtn">Logout</button>
        </div>

        ${authUser.role === 'faculty' ? `
          <div style="display: flex; gap: 8px; margin-bottom: 6px;">
            <a href="../index.html" style="flex:1; text-align:center; background:#334155; color:#fff; padding:6px; border-radius:6px; font-size:11px; text-decoration:none;">← Central Directory</a>
            <a href="../assignment.html" style="flex:1; text-align:center; background:#334155; color:#fff; padding:6px; border-radius:6px; font-size:11px; text-decoration:none;">Evaluation Matrix ↗</a>
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; color: #a1a1aa;">Assignment 1 Status:</span>
          <span style="font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 6px; background: ${isSub ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color: ${isSub ? '#34d399' : '#fbbf24'};" id="dockStatusBadge">
            ${isSub ? '✓ Submitted (Bit 1)' : '⏳ Pending (Bit 0)'}
          </span>
        </div>

        <div class="dock-field-group">
          <label>Select Assignment</label>
          <select id="dockAssignSelect">
            <option value="A1">Assignment 1 (Web Profile)</option>
            <option value="A2">Assignment 2 (JS DOM & Validation)</option>
          </select>
        </div>

        <div class="dock-field-group">
          <label>Attach Assignment File</label>
          <input type="file" id="dockFileInput">
        </div>

        <button class="dock-submit-btn" id="dockSubmitBtn">Upload & Flip Bit to 1</button>
      </div>

      <!-- Floating Pill Trigger -->
      <div class="dock-pill-trigger" id="dockPillTrigger" title="Click to view submission status or upload">
        <span class="dock-status-dot ${isSub ? 'submitted' : ''}" id="dockTriggerDot"></span>
        <span>My Assignment Hub</span>
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"></path></svg>
      </div>
    `;

    document.body.appendChild(dock);

    const trigger = document.getElementById('dockPillTrigger');
    const panel = document.getElementById('collegeDockPanel');
    const closeBtn = document.getElementById('closeDockPanel');
    const submitBtn = document.getElementById('dockSubmitBtn');
    const logoutBtn = document.getElementById('dockLogoutBtn');

    trigger.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
    });

    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('college_portal_auth_user');
      localStorage.removeItem('college_portal_auth_user');
      window.location.href = '../index.html';
    });

    submitBtn.addEventListener('click', () => {
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

      document.getElementById('dockStatusBadge').textContent = '✓ Submitted (Bit 1)';
      document.getElementById('dockStatusBadge').style.background = 'rgba(16, 185, 129, 0.15)';
      document.getElementById('dockStatusBadge').style.color = '#34d399';
      document.getElementById('dockTriggerDot').classList.add('submitted');

      alert(`Assignment ${aId} submitted successfully! Binary flag set to 1.`);
      panel.classList.remove('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDock);
  } else {
    createDock();
  }
})();
