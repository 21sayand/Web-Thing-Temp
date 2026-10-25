(function() {
  // Determine student folder ID from path (e.g. /01/ or /59/)
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

  // Fallback to 2-digit pad if needed
  if (!studentId) studentId = '01';

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    .college-portal-bar {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .portal-nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(15, 23, 42, 0.88);
      color: #f8fafc;
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .portal-nav-btn:hover {
      background: #4f46e5;
      color: #ffffff;
      border-color: #6366f1;
      transform: translateY(-2px);
    }

    .portal-upload-btn {
      background: #10b981;
      border-color: #059669;
      color: #ffffff;
    }

    .portal-upload-btn.submitted {
      background: #059669;
    }

    .student-upload-popup {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 320px;
      background: #111827;
      color: #f9fafb;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      padding: 18px;
      z-index: 999999;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      display: none;
      flex-direction: column;
      gap: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .student-upload-popup.active {
      display: flex;
    }

    .upload-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .upload-popup-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
    }

    .upload-popup-close {
      background: none;
      border: none;
      color: #9ca3af;
      font-size: 18px;
      cursor: pointer;
    }

    .upload-popup-body label {
      font-size: 12px;
      color: #9ca3af;
      display: block;
      margin-bottom: 4px;
    }

    .upload-popup-body select, .upload-popup-body input {
      width: 100%;
      background: #1f2937;
      border: 1px solid #374151;
      color: #fff;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 13px;
      box-sizing: border-box;
      margin-bottom: 10px;
    }

    .upload-submit-btn {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 8px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      width: 100%;
    }
  `;
  document.head.appendChild(style);

  function createWidget() {
    const isSub = (function() {
      try {
        const store = JSON.parse(localStorage.getItem('college_portal_assignments_state') || '{}');
        return store[studentId] && store[studentId]['A1'] === 1;
      } catch (e) {
        return false;
      }
    })();

    const bar = document.createElement('div');
    bar.className = 'college-portal-bar';
    bar.innerHTML = `
      <a href="../index.html" class="portal-nav-btn">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 12H5m7 7l-7-7 7-7"></path></svg>
        Central Directory
      </a>
      <a href="../assignment.html" class="portal-nav-btn">
        Assignments
      </a>
      <button class="portal-nav-btn portal-upload-btn ${isSub ? 'submitted' : ''}" id="portalUploadToggle">
        ${isSub ? '✓ Submitted (Bit 1)' : '📤 Upload Assignment'}
      </button>
    `;
    document.body.appendChild(bar);

    const popup = document.createElement('div');
    popup.className = 'student-upload-popup';
    popup.id = 'studentUploadPopup';
    popup.innerHTML = `
      <div class="upload-popup-header">
        <h4>Assignment Submission (#${studentId})</h4>
        <button class="upload-popup-close" id="closeUploadPopup">&times;</button>
      </div>
      <div class="upload-popup-body">
        <label>Select Assignment</label>
        <select id="widgetAssignSelect">
          <option value="A1">Assignment 1 (Responsive Web Profile)</option>
          <option value="A2">Assignment 2 (JS DOM & Validation)</option>
        </select>
        <label>Upload File (PDF / ZIP)</label>
        <input type="file" id="widgetFileInput">
        <button class="upload-submit-btn" id="widgetConfirmBtn">Confirm & Flip Bit to 1</button>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById('portalUploadToggle').addEventListener('click', () => {
      popup.classList.toggle('active');
    });

    document.getElementById('closeUploadPopup').addEventListener('click', () => {
      popup.classList.remove('active');
    });

    document.getElementById('widgetConfirmBtn').addEventListener('click', () => {
      const aId = document.getElementById('widgetAssignSelect').value;
      const fileInput = document.getElementById('widgetFileInput');
      const fileName = fileInput.files[0] ? fileInput.files[0].name : `assignment_${aId}.pdf`;

      try {
        const store = JSON.parse(localStorage.getItem('college_portal_assignments_state') || '{}');
        if (!store[studentId]) store[studentId] = {};
        store[studentId][aId] = 1;
        if (!store[studentId]._meta) store[studentId]._meta = {};
        store[studentId]._meta[aId] = { fileName, submittedAt: new Date().toISOString() };
        localStorage.setItem('college_portal_assignments_state', JSON.stringify(store));
      } catch (e) {}

      document.getElementById('portalUploadToggle').innerHTML = '✓ Submitted (Bit 1)';
      document.getElementById('portalUploadToggle').classList.add('submitted');
      alert(`Assignment ${aId} submitted successfully for Student #${studentId}! Binary flag set to 1.`);
      popup.classList.remove('active');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
