/* ==========================================
   JAVASCRIPT LOGIC & INTERACTIVITY
   Student Profile Web Application
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // List of Available Companies
  let allAvailableCompanies = [
    "Infosys", "TCS", "Wipro", "Accenture", 
    "Cognizant", "Google", "Microsoft", "Amazon", "IBM", "Capgemini"
  ];

  // Default Initial Student Data (Sankeerthana P)
  const defaultStudentData = {
    fullName: "Sankeerthana P",
    rollNumber: "STM23CS041",
    email: "sankeerthanap25@gmail.com",
    phone: "8129423135",
    department: "Computer Science & Engineering",
    semester: "Semester 7",
    gender: "Female",
    bloodGroup: "AB-",
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='100%' height='100%' fill='%236366f1'/><text x='50%' y='55%' font-size='44' font-family='sans-serif' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'>SP</text></svg>",
    companies: ["Infosys", "TCS", "Wipro", "Google"],
    skills: ["HTML/CSS", "JavaScript", "Python", "React", "SQL"],
    activities: ["NSS Volunteer", "Coding Club Lead", "Sports Club"],
    academicRecords: [
      { semester: "Semester 1", internal: 87, sgpa: 8.69, credits: 20 },
      { semester: "Semester 2", internal: 82, sgpa: 7.95, credits: 20 },
      { semester: "Semester 3", internal: 89, sgpa: 8.91, credits: 22 },
      { semester: "Semester 4", internal: 86, sgpa: 9.23, credits: 22 },
      { semester: "Semester 5", internal: 88, sgpa: 8.62, credits: 20 },
       { semester: "Semester 5", internal: 88, sgpa: 8.71, credits: 20 }
    ]
  };

  // Force reset state to user's personalized profile so it loads immediately
  let studentState = defaultStudentData;
  saveProfileState(studentState);

  // Merge custom companies if any
  studentState.companies.forEach(comp => {
    if (!allAvailableCompanies.includes(comp)) {
      allAvailableCompanies.push(comp);
    }
  });

  // DOM Elements
  const themeToggleBtn = document.getElementById('theme-toggle');
  const printBtn = document.getElementById('print-btn');
  const demoDataBtn = document.getElementById('demo-data-btn');
  const studentForm = document.getElementById('student-form');
  const photoUploadInput = document.getElementById('photo-upload');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  const addSemBtn = document.getElementById('add-sem-btn');
  const addSemModal = document.getElementById('add-sem-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  const addSemForm = document.getElementById('add-sem-form');

  const customCompanyInput = document.getElementById('custom-company-input');
  const addCustomCompanyBtn = document.getElementById('add-custom-company-btn');

  // Initial Setup
  initTheme();
  renderCompanyCheckboxesInForm();
  renderSemesterInputsInForm();
  populateFormFields(studentState);
  renderAllViews();
  attachRealtimeInputListeners();

  // ==========================================
  // 1. THEME SWITCHER
  // ==========================================
  function initTheme() {
    const savedTheme = localStorage.getItem('portalTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portalTheme', newTheme);
    showToast(`Switched to ${newTheme.toUpperCase()} theme mode`, 'info');
  });

  // ==========================================
  // 2. TAB NAVIGATION
  // ==========================================
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  function switchTab(tabId) {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);

    if (activeBtn && activeContent) {
      activeBtn.classList.add('active');
      activeContent.classList.add('active');
    }
  }

  // ==========================================
  // 3. COMPANY SELECTOR & ALTERNATE ADDER ENGINE
  // ==========================================
  function renderCompanyCheckboxesInForm() {
    const container = document.getElementById('company-checkboxes-container');
    container.innerHTML = '';

    allAvailableCompanies.forEach(company => {
      const isChecked = studentState.companies.includes(company);
      const label = document.createElement('label');
      label.className = 'checkbox-card';
      label.innerHTML = `
        <input type="checkbox" name="company-checkbox" value="${company}" ${isChecked ? 'checked' : ''}>
        <span class="checkbox-box"><i class="ri-check-line"></i></span>
        <span>${company}</span>
      `;
      container.appendChild(label);
    });

    container.querySelectorAll('input[name="company-checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        studentState.companies = Array.from(container.querySelectorAll('input[name="company-checkbox"]:checked')).map(c => c.value);
        renderTags();
        saveProfileState(studentState);
      });
    });
  }

  function handleAddCustomCompany() {
    const compName = customCompanyInput.value.trim();
    if (!compName) {
      showToast('Please type a company name first.', 'error');
      return;
    }

    if (!allAvailableCompanies.includes(compName)) {
      allAvailableCompanies.push(compName);
    }

    if (!studentState.companies.includes(compName)) {
      studentState.companies.push(compName);
    }

    customCompanyInput.value = '';
    renderCompanyCheckboxesInForm();
    renderTags();
    saveProfileState(studentState);
    showToast(`Added target company "${compName}"!`, 'success');
  }

  addCustomCompanyBtn.addEventListener('click', handleAddCustomCompany);
  customCompanyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomCompany();
    }
  });

  // ==========================================
  // 4. REALTIME TYPING & LIVE UPDATE ENGINE
  // ==========================================
  function attachRealtimeInputListeners() {
    const fullNameInput = document.getElementById('full-name');
    const rollInput = document.getElementById('roll-number');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const deptSelect = document.getElementById('department');
    const semSelect = document.getElementById('semester');
    const bloodSelect = document.getElementById('blood-group');

    fullNameInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      studentState.fullName = val || "Student Name";
      document.getElementById('display-name').textContent = studentState.fullName;
      document.getElementById('overview-name').textContent = studentState.fullName;
      saveProfileState(studentState);
    });

    rollInput.addEventListener('input', (e) => {
      const val = e.target.value.trim().toUpperCase();
      studentState.rollNumber = val || "ID";
      document.getElementById('display-roll').textContent = studentState.rollNumber;
      document.getElementById('overview-roll').textContent = studentState.rollNumber;
      saveProfileState(studentState);
    });

    emailInput.addEventListener('input', (e) => {
      studentState.email = e.target.value.trim();
      document.getElementById('display-email').textContent = studentState.email;
      document.getElementById('overview-email').textContent = studentState.email;
      saveProfileState(studentState);
    });

    phoneInput.addEventListener('input', (e) => {
      studentState.phone = e.target.value.trim();
      document.getElementById('display-phone').textContent = studentState.phone;
      document.getElementById('overview-phone').textContent = studentState.phone;
      saveProfileState(studentState);
    });

    deptSelect.addEventListener('change', (e) => {
      studentState.department = e.target.value;
      document.getElementById('display-dept-sem').textContent = `${studentState.department} • ${studentState.semester}`;
      document.getElementById('overview-dept').textContent = studentState.department;
      saveProfileState(studentState);
    });

    semSelect.addEventListener('change', (e) => {
      studentState.semester = e.target.value;
      document.getElementById('display-dept-sem').textContent = `${studentState.department} • ${studentState.semester}`;
      document.getElementById('overview-sem').textContent = studentState.semester;
      saveProfileState(studentState);
    });

    bloodSelect.addEventListener('change', (e) => {
      studentState.bloodGroup = e.target.value;
      document.getElementById('display-blood-group').textContent = studentState.bloodGroup;
      document.getElementById('overview-blood').textContent = studentState.bloodGroup;
      saveProfileState(studentState);
    });

    document.querySelectorAll('input[name="gender"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        studentState.gender = e.target.value;
        document.getElementById('display-gender').textContent = studentState.gender;
        document.getElementById('overview-gender').textContent = studentState.gender;
        saveProfileState(studentState);
      });
    });

    document.querySelectorAll('input[name="skills"]').forEach(cb => {
      cb.addEventListener('change', () => {
        studentState.skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(c => c.value);
        renderTags();
        saveProfileState(studentState);
      });
    });

    document.querySelectorAll('input[name="activities"]').forEach(cb => {
      cb.addEventListener('change', () => {
        studentState.activities = Array.from(document.querySelectorAll('input[name="activities"]:checked')).map(c => c.value);
        renderTags();
        saveProfileState(studentState);
      });
    });
  }

  function renderTags() {
    document.getElementById('display-companies').innerHTML = studentState.companies.map(c => `<span class="tag company-tag">${c}</span>`).join('');
    document.getElementById('display-skills').innerHTML = studentState.skills.map(s => `<span class="tag skill-tag">${s}</span>`).join('');
    document.getElementById('display-nss').innerHTML = studentState.activities.map(a => `<span class="tag activity-tag">${a}</span>`).join('');

    document.getElementById('overview-companies').innerHTML = studentState.companies.map(c => `<span class="tag company-tag">${c}</span>`).join('');
    document.getElementById('overview-skills').innerHTML = studentState.skills.map(s => `<span class="tag skill-tag">${s}</span>`).join('');
    document.getElementById('overview-activities').innerHTML = studentState.activities.map(a => `<span class="tag activity-tag">${a}</span>`).join('');
  }

  // ==========================================
  // 5. SEMESTER MARKS & SGPA FORM AREA
  // ==========================================
  function renderSemesterInputsInForm() {
    const container = document.getElementById('semesters-form-container');
    container.innerHTML = '';

    studentState.academicRecords.forEach((record, index) => {
      const card = document.createElement('div');
      card.className = 'sem-input-card';
      card.innerHTML = `
        <div class="sem-title">
          <span>${record.semester}</span>
          <small>${record.credits} Credits</small>
        </div>
        <div class="sem-input-row">
          <div class="form-group">
            <label>SGPA (0-10)</label>
            <input type="number" class="sem-sgpa-input" data-index="${index}" step="0.01" min="0" max="10" value="${record.sgpa.toFixed(2)}" placeholder="SGPA">
          </div>
          <div class="form-group">
            <label>Internal (%)</label>
            <input type="number" class="sem-internal-input" data-index="${index}" step="0.1" min="0" max="100" value="${record.internal}" placeholder="Internal %">
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.sem-sgpa-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= 0 && val <= 10) {
          studentState.academicRecords[idx].sgpa = val;
          renderAcademicTable();
          saveProfileState(studentState);
        }
      });
    });

    container.querySelectorAll('.sem-internal-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= 0 && val <= 100) {
          studentState.academicRecords[idx].internal = val;
          renderAcademicTable();
          saveProfileState(studentState);
        }
      });
    });
  }

  // Photo Avatar Upload
  photoUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Photo size must be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(event) {
        studentState.avatar = event.target.result;
        document.getElementById('profile-avatar-preview').src = studentState.avatar;
        document.getElementById('form-avatar-preview').src = studentState.avatar;
        document.getElementById('overview-avatar').src = studentState.avatar;
        saveProfileState(studentState);
        showToast('Profile photo updated!', 'success');
      };
      reader.readAsDataURL(file);
    }
  });

  // Form Submission
  studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (studentState.companies.length === 0) {
      showToast('Please select at least one company.', 'error');
      return;
    }
    saveProfileState(studentState);
    renderAllViews();
    showToast('Student profile successfully saved!', 'success');
  });

  // Reset Form Handler
  studentForm.addEventListener('reset', () => {
    setTimeout(() => {
      studentState = JSON.parse(JSON.stringify(defaultStudentData));
      populateFormFields(studentState);
      renderAllViews();
      saveProfileState(studentState);
      showToast('Form fields reset to default.', 'info');
    }, 50);
  });

  // Demo Data Populate Button
  demoDataBtn.addEventListener('click', () => {
    studentState = JSON.parse(JSON.stringify(defaultStudentData));
    saveProfileState(studentState);
    populateFormFields(studentState);
    renderAllViews();
    showToast('Reset to Sankeerthana P profile data!', 'success');
  });

  // Export / Print Profile Button
  printBtn.addEventListener('click', () => {
    switchTab('overview-tab');
    setTimeout(() => {
      window.print();
    }, 300);
  });

  // ==========================================
  // 6. ACADEMIC TABLE & CGPA CALCULATION ENGINE
  // ==========================================
  function calculateAcademicSummary(records) {
    if (!records || records.length === 0) {
      return { overallCGPA: "0.00", avgInternal: "0%", totalCredits: 0, latestSGPA: "0.00" };
    }

    let totalWeightedPoints = 0;
    let totalCredits = 0;
    let sumInternal = 0;

    records.forEach(r => {
      const cr = parseFloat(r.credits) || 0;
      const sg = parseFloat(r.sgpa) || 0;
      const mark = parseFloat(r.internal) || 0;

      totalWeightedPoints += (sg * cr);
      totalCredits += cr;
      sumInternal += mark;
    });

    const cgpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : "0.00";
    const avgInternal = (sumInternal / records.length).toFixed(1) + "%";
    const latestSGPA = records[records.length - 1].sgpa.toFixed(2);

    return { overallCGPA: cgpa, avgInternal, totalCredits, latestSGPA };
  }

  function getPerformanceBadge(sgpa) {
    const val = parseFloat(sgpa);
    if (val >= 8.5) return '<span class="status-pill status-distinction">Distinction</span>';
    if (val >= 7.0) return '<span class="status-pill status-first">First Class</span>';
    return '<span class="status-pill status-pass">Pass Class</span>';
  }

  function renderAcademicTable() {
    const tbody = document.getElementById('academic-tbody');
    const overviewTbody = document.getElementById('overview-academic-tbody');
    tbody.innerHTML = '';
    overviewTbody.innerHTML = '';

    studentState.academicRecords.forEach((record, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${record.semester}</strong></td>
        <td>${record.internal}%</td>
        <td><strong>${record.sgpa.toFixed(2)}</strong></td>
        <td>${record.sgpa.toFixed(2)}</td>
        <td>${record.credits}</td>
        <td>${getPerformanceBadge(record.sgpa)}</td>
        <td class="no-print">
          <button class="btn-delete-row" data-index="${idx}" title="Delete Record">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);

      const trOverview = document.createElement('tr');
      trOverview.innerHTML = `
        <td>${record.semester}</td>
        <td>${record.internal}%</td>
        <td>${record.sgpa.toFixed(2)}</td>
        <td>${record.sgpa.toFixed(2)}</td>
        <td>${record.credits}</td>
      `;
      overviewTbody.appendChild(trOverview);
    });

    tbody.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
        if (studentState.academicRecords.length <= 1) {
          showToast('Cannot delete the last remaining academic record.', 'error');
          return;
        }
        studentState.academicRecords.splice(idx, 1);
        saveProfileState(studentState);
        renderSemesterInputsInForm();
        renderAllViews();
        showToast('Semester record removed.', 'info');
      });
    });

    const stats = calculateAcademicSummary(studentState.academicRecords);
    document.getElementById('avg-internal-cell').innerHTML = `<strong>${stats.avgInternal} Avg</strong>`;
    document.getElementById('avg-sgpa-cell').innerHTML = `<strong>${stats.latestSGPA} Latest</strong>`;
    document.getElementById('overall-cgpa-cell').innerHTML = `<strong>${stats.overallCGPA} CGPA</strong>`;
    document.getElementById('total-credits-cell').innerHTML = `<strong>${stats.totalCredits} Credits</strong>`;

    document.getElementById('display-cgpa').textContent = stats.overallCGPA;
    document.getElementById('display-sgpa').textContent = stats.latestSGPA;
    document.getElementById('display-internal-avg').textContent = stats.avgInternal;

    document.getElementById('overview-cgpa').textContent = stats.overallCGPA;

    renderSGPAChart();
  }

  function renderSGPAChart() {
    const chartContainer = document.getElementById('sgpa-chart-container');
    chartContainer.innerHTML = '';

    studentState.academicRecords.forEach(rec => {
      const col = document.createElement('div');
      col.className = 'bar-column';
      
      const heightPercent = Math.min((rec.sgpa / 10.0) * 100, 100);

      col.innerHTML = `
        <div class="bar-wrapper" title="${rec.semester}: ${rec.sgpa.toFixed(2)} SGPA">
          <div class="bar-fill" style="height: ${heightPercent}%">
            <span class="bar-value">${rec.sgpa.toFixed(2)}</span>
          </div>
        </div>
        <span class="bar-label">${rec.semester.replace('Semester ', 'Sem ')}</span>
      `;
      chartContainer.appendChild(col);
    });
  }

  addSemBtn.addEventListener('click', () => {
    addSemModal.classList.remove('hidden');
    document.getElementById('new-sem-name').value = `Semester ${studentState.academicRecords.length + 1}`;
  });

  closeModalBtn.addEventListener('click', () => addSemModal.classList.add('hidden'));
  cancelModalBtn.addEventListener('click', () => addSemModal.classList.add('hidden'));

  addSemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const semName = document.getElementById('new-sem-name').value.trim();
    const internal = parseFloat(document.getElementById('new-internal').value);
    const sgpa = parseFloat(document.getElementById('new-sgpa').value);
    const credits = parseInt(document.getElementById('new-credits').value);

    if (!semName || isNaN(internal) || isNaN(sgpa) || isNaN(credits)) {
      showToast('Please fill all fields with valid numbers.', 'error');
      return;
    }

    studentState.academicRecords.push({
      semester: semName,
      internal: internal,
      sgpa: sgpa,
      credits: credits
    });

    saveProfileState(studentState);
    renderSemesterInputsInForm();
    renderAllViews();
    addSemModal.classList.add('hidden');
    addSemForm.reset();
    showToast(`Added ${semName} academic record!`, 'success');
  });

  // ==========================================
  // 7. DATA RENDERERS
  // ==========================================
  function populateFormFields(data) {
    document.getElementById('full-name').value = data.fullName;
    document.getElementById('roll-number').value = data.rollNumber;
    document.getElementById('email').value = data.email;
    document.getElementById('phone').value = data.phone;
    document.getElementById('department').value = data.department;
    document.getElementById('semester').value = data.semester;
    document.getElementById('blood-group').value = data.bloodGroup;

    if (data.avatar) {
      document.getElementById('profile-avatar-preview').src = data.avatar;
      document.getElementById('form-avatar-preview').src = data.avatar;
      document.getElementById('overview-avatar').src = data.avatar;
    }

    const genderRadio = document.querySelector(`input[name="gender"][value="${data.gender}"]`);
    if (genderRadio) genderRadio.checked = true;

    renderCompanyCheckboxesInForm();

    document.querySelectorAll('input[name="skills"]').forEach(cb => {
      cb.checked = data.skills.includes(cb.value);
    });

    document.querySelectorAll('input[name="activities"]').forEach(cb => {
      cb.checked = data.activities.includes(cb.value);
    });

    renderSemesterInputsInForm();
  }

  function renderAllViews() {
    document.getElementById('display-name').textContent = studentState.fullName;
    document.getElementById('display-roll').textContent = studentState.rollNumber;
    document.getElementById('display-dept-sem').textContent = `${studentState.department} • ${studentState.semester}`;
    document.getElementById('display-gender').textContent = studentState.gender;
    document.getElementById('display-blood-group').textContent = studentState.bloodGroup;
    document.getElementById('display-email').textContent = studentState.email;
    document.getElementById('display-phone').textContent = studentState.phone;

    renderTags();

    document.getElementById('overview-name').textContent = studentState.fullName;
    document.getElementById('overview-roll').textContent = studentState.rollNumber;
    document.getElementById('overview-dept').textContent = studentState.department;
    document.getElementById('overview-email').textContent = studentState.email;
    document.getElementById('overview-phone').textContent = studentState.phone;
    document.getElementById('overview-gender').textContent = studentState.gender;
    document.getElementById('overview-blood').textContent = studentState.bloodGroup;
    document.getElementById('overview-sem').textContent = studentState.semester;

    renderAcademicTable();
  }

  function saveProfileState(data) {
    try {
      localStorage.setItem('studentProfileData', JSON.stringify(data));
    } catch (e) {
      console.error('Could not save profile state', e);
    }
  }

  function loadProfileState() {
    try {
      const saved = localStorage.getItem('studentProfileData');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'ri-information-line';
    if (type === 'success') iconClass = 'ri-checkbox-circle-line';
    if (type === 'error') iconClass = 'ri-error-warning-line';

    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
