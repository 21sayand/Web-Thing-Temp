(function() {
  // Ensure responsive viewport meta tag is present on all devices
  if (!document.querySelector('meta[name="viewport"]')) {
    const metaVp = document.createElement('meta');
    metaVp.name = 'viewport';
    metaVp.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';
    document.head.appendChild(metaVp);
  }

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

  // 1. Session Auth Verification & Access Privacy Enforcement
  let authUser = null;
  try {
    const raw = sessionStorage.getItem('college_portal_auth_user');
    if (raw) {
      const data = JSON.parse(raw);
      authUser = data.user || data;
    }
  } catch(e) {}

  const isOwnerOrFaculty = authUser && (authUser.role === 'faculty' || authUser.id === studentId);
  const guestAccessAllowed = window.CollegeAuth ? window.CollegeAuth.isGuestAccessAllowed() : (localStorage.getItem('college_portal_guest_access_allowed') !== 'false');

  // If faculty has restricted guest access and the user is NOT the owner or faculty, block content
  if (!guestAccessAllowed && !isOwnerOrFaculty) {
    const shield = document.createElement('div');
    shield.id = 'guestPrivacyShield';
    shield.style.cssText = `
      position: fixed; inset: 0; z-index: 10000000;
      background: #0d1117; color: #f0f6fc;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 24px; text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;
    shield.innerHTML = `
      <div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 32px 24px; max-width: 440px; box-shadow: 0 16px 36px rgba(0,0,0,0.5);">
        <div style="font-size: 38px; margin-bottom: 12px;">🔒</div>
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Private Student Portfolio</h3>
        <p style="font-size: 13px; color: #8b949e; line-height: 1.5; margin-bottom: 20px;">
          Guest access has been restricted by faculty administration. Only the authenticated student owner or faculty members may view this academic profile.
        </p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="../index.html" style="display: inline-block; background: #238636; color: #fff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px;">
            Sign In on Homepage
          </a>
          <a href="../index.html" style="display: inline-block; background: #21262d; border: 1px solid #30363d; color: #c9d1d9; text-decoration: none; padding: 9px 18px; border-radius: 6px; font-weight: 500; font-size: 13px;">
            Return to Homepage
          </a>
        </div>
      </div>
    `;
    document.documentElement.appendChild(shield);
    return; // Halt widget execution and leave privacy shield in place
  }

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

    /* New Assignment Broadcast Notification Popup */
    @keyframes dockSlideBounce {
      0% { opacity: 0; transform: translateY(20px) scale(0.95); }
      70% { transform: translateY(-4px) scale(1.02); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(88, 166, 255, 0.4); }
      50% { box-shadow: 0 0 0 8px rgba(88, 166, 255, 0); }
    }

    .dock-announcement-banner {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: #161b22;
      color: #f0f6fc;
      border: 1px solid #388bfd;
      border-radius: 8px;
      padding: 12px 14px;
      width: 320px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
      animation: dockSlideBounce 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
      cursor: pointer;
      position: relative;
    }

    .dock-announcement-badge {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 10px;
      background: rgba(56, 139, 253, 0.15);
      color: #58a6ff;
      border: 1px solid rgba(56, 139, 253, 0.3);
      display: inline-block;
      margin-bottom: 4px;
    }

    .dock-announcement-close {
      position: absolute;
      top: 6px;
      right: 8px;
      background: none;
      border: none;
      color: #8b949e;
      font-size: 16px;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
    }

    .dock-announcement-close:hover {
      color: #f0f6fc;
    }

    .dock-pill-trigger.has-notification {
      animation: pulseGlow 2s infinite;
      border-color: #58a6ff;
    }

    .dock-notif-count {
      background: #f85149;
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      padding: 1px 6px;
      border-radius: 10px;
      margin-left: 2px;
    }

    /* Mobile Responsive Safeguards for Dock */
    @media (max-width: 600px) {
      .college-bottom-dock {
        bottom: 14px;
        right: 14px;
        left: 14px;
        align-items: stretch;
      }
      .dock-pill-trigger {
        align-self: flex-end;
      }
      .dock-panel {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }
    }

    /* Subtle non-destructive responsive safeguard: prevent rigid elements from causing horizontal overflow */
    @media (max-width: 768px) {
      body {
        overflow-x: hidden;
      }
      img, video, canvas, svg {
        max-width: 100%;
        height: auto;
      }
      table {
        display: block;
        max-width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      pre, code {
        max-width: 100%;
        overflow-x: auto;
      }
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
            ${(window.AssignmentStore ? window.AssignmentStore.getAssignments() : [
              { id: 'A1', title: 'Assignment 1 (Web Profile)' },
              { id: 'A2', title: 'Assignment 2 (JS DOM & Validation)' }
            ]).map(a => `<option value="${a.id}">${a.title}</option>`).join('')}
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

      let notificationBanner = '';
      let hasUnreadAnnouncement = false;
      let latestAnnouncement = null;

      try {
        const rawAnnounce = localStorage.getItem('college_portal_latest_announcement');
        if (rawAnnounce) {
          latestAnnouncement = JSON.parse(rawAnnounce);
          const dismissedId = localStorage.getItem(`college_portal_dismissed_notif_${studentId}`);
          if (latestAnnouncement && dismissedId !== latestAnnouncement.id) {
            hasUnreadAnnouncement = true;
            notificationBanner = `
              <div class="dock-announcement-banner" id="dockAnnouncementBanner">
                <button class="dock-announcement-close" id="dockCloseAnnouncement" title="Dismiss">&times;</button>
                <div style="font-size: 20px; line-height: 1;">📢</div>
                <div style="flex: 1;">
                  <span class="dock-announcement-badge">New Assignment Assigned!</span>
                  <div style="font-size: 13px; font-weight: 700; color: #f0f6fc; margin-bottom: 2px;">
                    ${latestAnnouncement.title}
                  </div>
                  <div style="font-size: 11px; color: #8b949e;">
                    Due Date: <strong>${latestAnnouncement.dueDate || 'Ongoing'}</strong> • Open Assignment Desk to submit.
                  </div>
                </div>
              </div>
            `;
          }
        }
      } catch (e) {}

      dock.innerHTML = `
        ${notificationBanner}

        <div class="dock-panel" id="collegeDockPanel">
          <div class="dock-panel-header">
            <h4>Assignment Desk (Student #${studentId})</h4>
            <button class="dock-close-btn" id="closeDockPanel">&times;</button>
          </div>

          ${authSnippet}

          <a href="../index.html" class="dock-home-btn">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Return to Homepage
          </a>

          ${formSnippet}
        </div>

        <div class="dock-pill-trigger ${hasUnreadAnnouncement ? 'has-notification' : ''}" id="dockPillTrigger" title="Click to open assignment tools or return to homepage">
          <span class="dock-status-dot ${isSub ? 'submitted' : ''}" id="dockTriggerDot"></span>
          <span>Assignment Desk</span>
          ${hasUnreadAnnouncement ? '<span class="dock-notif-count">1 NEW</span>' : ''}
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"></path></svg>
        </div>
      `;

      document.body.appendChild(dock);

      // Handle Announcement Interaction
      const banner = document.getElementById('dockAnnouncementBanner');
      if (banner) {
        banner.addEventListener('click', (e) => {
          if (e.target.id === 'dockCloseAnnouncement') return;
          document.getElementById('collegeDockPanel').classList.add('open');
          banner.style.display = 'none';
          if (latestAnnouncement) {
            localStorage.setItem(`college_portal_dismissed_notif_${studentId}`, latestAnnouncement.id);
          }
        });
      }

      const closeBannerBtn = document.getElementById('dockCloseAnnouncement');
      if (closeBannerBtn) {
        closeBannerBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (banner) banner.style.display = 'none';
          if (latestAnnouncement) {
            localStorage.setItem(`college_portal_dismissed_notif_${studentId}`, latestAnnouncement.id);
          }
        });
      }

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
        const oldCgpaStr = currentCgpa ? String(currentCgpa) : '';
        const newCgpaStr = cgpaVal > 0 ? cgpaVal.toFixed(2) : '';

        function replaceTextInPage(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            let val = node.nodeValue;
            let changed = false;

            // Replace Name
            if (oldName && oldName.length > 2 && val.includes(oldName)) {
              val = val.split(oldName).join(nameVal);
              changed = true;
            }
            // Replace CGPA text
            if (oldCgpaStr && val.includes(oldCgpaStr)) {
              val = val.split(oldCgpaStr).join(newCgpaStr || oldCgpaStr);
              changed = true;
            }
            if (changed) node.nodeValue = val;
          } else {
            // Check form inputs or elements with common IDs
            if (node.tagName === 'INPUT' && node.id !== 'dockEditName' && node.id !== 'dockEditCgpa') {
              if (node.id === 'name' || node.name === 'name') node.value = nameVal;
              if (node.id === 'cgpa' || node.name === 'cgpa') node.value = cgpaVal;
            }
            if (node.tagName === 'SELECT' && node.id !== 'dockEditBlood') {
              if (node.id === 'blood' || node.name === 'blood' || node.id === 'bloodGroup') node.value = bloodVal;
            }

            // Check element tags like #dossierCGPATag or badges
            if (node.id === 'dossierCGPATag' || node.classList && node.classList.contains('cgpa-val')) {
              node.textContent = newCgpaStr;
            }
            if (node.id === 'dossierBloodBadge') {
              node.textContent = `Blood: ${bloodVal}`;
            }
            if (node.id === 'dossierBloodGroup') {
              node.textContent = bloodVal;
            }
            if (node.id === 'dossierName') {
              node.textContent = nameVal;
            }

            for (let child of node.childNodes) {
              if (child.id !== 'collegeDockPanel' && child.id !== 'dockAnnouncementBanner') {
                replaceTextInPage(child);
              }
            }
          }
        }
        replaceTextInPage(document.body);

        alert(`Profile details updated!\n\n• Name: ${nameVal}\n• Blood Group: ${bloodVal}\n• CGPA: ${newCgpaStr || cgpaVal}\n\nChanges have been saved to your site and synchronized with the batch directory.`);
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
