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

  // If studentId not found from URL path, check folder name
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

  // Inject sleek bottom-right dock styles
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

    /* Minimal floating pill toggle button */
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
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
    }

    .dock-pill-trigger:hover {
      background: #27272a;
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.5);
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

    /* Collapsible action panel */
    .dock-panel {
      background: #18181b;
      color: #fafafa;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      width: 310px;
      padding: 18px;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
      display: none;
      flex-direction: column;
      gap: 14px;
      animation: dockSlideUp 0.2s ease-out;
    }

    .dock-panel.open {
      display: flex;
    }

    @keyframes dockSlideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
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
      line-height: 1;
    }

    .dock-nav-links {
      display: flex;
      gap: 8px;
    }

    .dock-nav-btn {
      flex: 1;
      text-align: center;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e4e4e7;
      padding: 7px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s;
    }

    .dock-nav-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
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
      transition: background 0.2s;
    }

    .dock-submit-btn:hover {
      background: #1d4ed8;
    }

    .dock-badge-status {
      font-size: 11px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 6px;
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      display: inline-block;
    }

    .dock-badge-status.submitted {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
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
          <h4>Portal Hub (Student #${studentId})</h4>
          <button class="dock-close-btn" id="closeDockPanel">&times;</button>
        </div>

        <div class="dock-nav-links">
          <a href="../index.html" class="dock-nav-btn">← Central Directory</a>
          <a href="../assignment.html" class="dock-nav-btn">Evaluation Matrix ↗</a>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; color: #a1a1aa;">Assignment 1 Status:</span>
          <span class="dock-badge-status ${isSub ? 'submitted' : ''}" id="dockStatusBadge">
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
      <div class="dock-pill-trigger" id="dockPillTrigger" title="Click to open college portal actions & assignment upload">
        <span class="dock-status-dot ${isSub ? 'submitted' : ''}" id="dockTriggerDot"></span>
        <span>College Portal</span>
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"></path></svg>
      </div>
    `;

    document.body.appendChild(dock);

    const trigger = document.getElementById('dockPillTrigger');
    const panel = document.getElementById('collegeDockPanel');
    const closeBtn = document.getElementById('closeDockPanel');
    const submitBtn = document.getElementById('dockSubmitBtn');

    trigger.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
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
      document.getElementById('dockStatusBadge').classList.add('submitted');
      document.getElementById('dockTriggerDot').classList.add('submitted');

      alert(`Assignment ${aId} submitted for Student #${studentId}! Flag set to 1.`);
      panel.classList.remove('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDock);
  } else {
    createDock();
  }
})();
