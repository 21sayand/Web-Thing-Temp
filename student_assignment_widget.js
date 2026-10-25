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

  // 1. Session Auth Verification
  let authUser = null;
  try {
    const raw = sessionStorage.getItem('college_portal_auth_user');
    if (raw) {
      const data = JSON.parse(raw);
      authUser = data.user || data;
    }
  } catch(e) {}

  const isOwnerOrFaculty = authUser && (authUser.role === 'faculty' || authUser.id === studentId);

  // 2. Inject Bottom Floating Widget Dock (Always visible for viewing, submitting, returning home)
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
      width: 320px;
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
      padding: 6px 10px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dock-user-tag.auth {
      color: #58a6ff;
      background: rgba(56, 139, 253, 0.1);
      border: 1px solid rgba(56, 139, 253, 0.2);
    }

    .dock-user-tag.guest {
      color: #8b949e;
      background: rgba(139, 148, 158, 0.1);
      border: 1px solid rgba(139, 148, 158, 0.2);
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

    let authSnippet = '';
    let formSnippet = '';

    if (isOwnerOrFaculty) {
      // Find current student profile
      const students = window.STUDENTS_DATA || [];
      const currentProfile = students.find(s => s.id === studentId) || {};
      const currentName = currentProfile.name || (authUser ? authUser.name : '');
      const currentBlood = currentProfile.blood || 'O+';
      const currentCgpa = currentProfile.cgpa || '';

      authSnippet = `
        <div class="dock-user-tag auth">
          <span>Signed In: <strong>${authUser.name}</strong></span>
          <button class="dock-logout-btn" id="dockLogoutBtn">Sign Out</button>
        </div>
      `;

      formSnippet = `
        <!-- Profile Customization Tab/Section -->
        <div style="background: rgba(88, 166, 255, 0.08); border: 1px solid rgba(88, 166, 255, 0.2); border-radius: 6px; padding: 10px; margin-bottom: 6px;">
          <div style="font-size: 11px; font-weight: 700; color: #58a6ff; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
            <span>✏️ Edit Profile Info</span>
            <span style="font-size: 10px; color: #8b949e; font-weight: 400;">Owner Controls</span>
          </div>

          <div class="dock-field-group">
            <label>Display Name</label>
            <input type="text" id="dockEditName" value="${currentName.replace(/"/g, '&quot;')}" placeholder="Full Name">
          </div>

          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <div class="dock-field-group" style="flex: 1;">
              <label>Blood Group</label>
              <select id="dockEditBlood">
                <option value="A+" ${currentBlood === 'A+' ? 'selected' : ''}>A+</option>
                <option value="A-" ${currentBlood === 'A-' ? 'selected' : ''}>A-</option>
                <option value="B+" ${currentBlood === 'B+' ? 'selected' : ''}>B+</option>
                <option value="B-" ${currentBlood === 'B-' ? 'selected' : ''}>B-</option>
                <option value="O+" ${currentBlood === 'O+' ? 'selected' : ''}>O+</option>
                <option value="O-" ${currentBlood === 'O-' ? 'selected' : ''}>O-</option>
                <option value="AB+" ${currentBlood === 'AB+' ? 'selected' : ''}>AB+</option>
                <option value="AB-" ${currentBlood === 'AB-' ? 'selected' : ''}>AB-</option>
              </select>
            </div>
            <div class="dock-field-group" style="flex: 1;">
              <label>CGPA</label>
              <input type="number" step="0.01" min="0" max="10" id="dockEditCgpa" value="${currentCgpa}" placeholder="e.g. 8.45">
            </div>
          </div>

          <button class="dock-submit-btn" style="width: 100%; margin-top: 8px; background: #1f6feb;" id="dockSaveProfileBtn">
            Save & Update Site Info
          </button>
        </div>

        <!-- Assignment Section -->
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
      `;
    } else {
      authSnippet = `
        <div class="dock-user-tag guest">
          <span>Viewing as: <strong>Guest</strong></span>
          <button class="dock-submit-btn" style="padding: 2px 8px; font-size: 11px;" id="dockOpenLoginBtn">Sign In</button>
        </div>
      `;

      formSnippet = `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
          <span style="font-size: 12px; color: #8b949e;">Assignment 1:</span>
          <span style="font-size: 11px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: ${isSub ? 'rgba(46, 160, 67, 0.15)' : 'rgba(210, 153, 34, 0.15)'}; color: ${isSub ? '#3fb950' : '#d29922'};">
            ${isSub ? '✓ Submitted (1)' : '⏳ Pending (0)'}
          </span>
        </div>

        <div style="background: rgba(56, 139, 253, 0.1); border: 1px solid rgba(56, 139, 253, 0.2); border-radius: 6px; padding: 8px 10px; font-size: 11px; color: #79c0ff; line-height: 1.4;">
          🔒 Only this student or faculty can edit profile details or submit assignments. Sign in to edit your info.
        </div>

        <div id="dockInlineLogin" style="display: none; flex-direction: column; gap: 8px;">
          <input type="text" id="dockLoginUser" placeholder="Register Number" style="background:#0d1117; border:1px solid #30363d; color:#f0f6fc; padding:6px; border-radius:4px; font-size:12px;">
          <input type="password" id="dockLoginPass" placeholder="Password (Register Number)" style="background:#0d1117; border:1px solid #30363d; color:#f0f6fc; padding:6px; border-radius:4px; font-size:12px;">
          <div id="dockLoginErr" style="display:none; color:#f85149; font-size:11px;"></div>
          <button type="button" class="dock-submit-btn" id="dockLoginSubmit">Sign In to Edit</button>
        </div>
      `;
    }

    dock.innerHTML = `
      <div class="dock-panel" id="collegeDockPanel">
        <div class="dock-panel-header">
          <h4>Assignment Desk (Student #${studentId})</h4>
          <button class="dock-close-btn" id="closeDockPanel">&times;</button>
        </div>

        ${authSnippet}

        <a href="../index.html" class="dock-home-btn">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Return to Main Directory
        </a>

        ${formSnippet}
      </div>

      <div class="dock-pill-trigger" id="dockPillTrigger" title="Click to open assignment tools or return to directory">
        <span class="dock-status-dot ${isSub ? 'submitted' : ''}" id="dockTriggerDot"></span>
        <span>Assignment Desk</span>
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

    const logoutBtn = document.getElementById('dockLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('college_portal_auth_user');
        localStorage.removeItem('college_portal_auth_user');
        window.location.reload();
      });
    }

    const openLoginBtn = document.getElementById('dockOpenLoginBtn');
    if (openLoginBtn) {
      openLoginBtn.addEventListener('click', () => {
        const loginBox = document.getElementById('dockInlineLogin');
        if (loginBox) {
          loginBox.style.display = loginBox.style.display === 'flex' ? 'none' : 'flex';
        }
      });
    }

    const loginSubmitBtn = document.getElementById('dockLoginSubmit');
    if (loginSubmitBtn) {
      loginSubmitBtn.addEventListener('click', () => {
        const u = document.getElementById('dockLoginUser').value.trim();
        const p = document.getElementById('dockLoginPass').value.trim();
        const res = window.CollegeAuth ? window.CollegeAuth.login(u, p) : null;
        if (res && res.success) {
          window.location.reload();
        } else {
          const err = document.getElementById('dockLoginErr');
          err.textContent = res ? res.message : 'Invalid credentials.';
          err.style.display = 'block';
        }
      });
    }

    const submitBtn = document.getElementById('dockSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const aId = document.getElementById('dockAssignSelect').value;
        const fileInput = document.getElementById('dockFileInput');
        const fileName = fileInput && fileInput.files[0] ? fileInput.files[0].name : `assignment_${aId}.pdf`;

        try {
          const store = JSON.parse(localStorage.getItem('college_portal_assignments_state') || '{}');
          if (!store[studentId]) store[studentId] = {};
          store[studentId][aId] = 1;
          if (!store[studentId]._meta) store[studentId]._meta = {};
          store[studentId]._meta[aId] = { fileName, submittedAt: new Date().toISOString() };
          localStorage.setItem('college_portal_assignments_state', JSON.stringify(store));
        } catch (e) {}

        const badge = document.getElementById('dockStatusBadge');
        if (badge) {
          badge.textContent = '✓ Submitted (1)';
          badge.style.background = 'rgba(46, 160, 67, 0.15)';
          badge.style.color = '#3fb950';
        }
        const dot = document.getElementById('dockTriggerDot');
        if (dot) dot.classList.add('submitted');

        alert(`Assignment ${aId} submitted for Student #${studentId}! Submission bit updated to 1.`);
        document.getElementById('collegeDockPanel').classList.remove('open');
      });
    }

    const saveProfileBtn = document.getElementById('dockSaveProfileBtn');
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener('click', () => {
        const nameVal = document.getElementById('dockEditName').value.trim();
        const bloodVal = document.getElementById('dockEditBlood').value;
        const cgpaVal = parseFloat(document.getElementById('dockEditCgpa').value) || 0;

        if (!nameVal) {
          alert('Please enter a display name.');
          return;
        }

        const updatedFields = {
          name: nameVal,
          blood: bloodVal,
          cgpa: cgpaVal
        };

        if (window.updateStudentProfileData) {
          window.updateStudentProfileData(studentId, updatedFields);
        }

        // Live DOM Updates on the student's personal portfolio page
        const oldName = currentName;
        function replaceTextInPage(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            if (oldName && oldName.length > 2 && node.nodeValue.includes(oldName)) {
              node.nodeValue = node.nodeValue.split(oldName).join(nameVal);
            }
          } else {
            for (let child of node.childNodes) {
              if (child.id !== 'collegeDockPanel') {
                replaceTextInPage(child);
              }
            }
          }
        }
        replaceTextInPage(document.body);

        alert('Profile information updated successfully! Changes saved across directory and your portfolio.');
        document.getElementById('collegeDockPanel').classList.remove('open');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDock);
  } else {
    createDock();
  }
})();
