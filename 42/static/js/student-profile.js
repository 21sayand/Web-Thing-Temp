

document.addEventListener('DOMContentLoaded', () => {
  initLiquidCanvas();
  initFormInteractivity();
  initAcademicCalculator();
  initLivePreviewSync();
  initDemoDataLoader();
  initBlurredPhone();
  initFavPlayerHover();
});

function initBlurredPhone() {
  const phoneElems = document.querySelectorAll('.blurred-phone');
  phoneElems.forEach(elem => {
    let timer = null;
    elem.addEventListener('mouseenter', () => {
      elem.classList.add('revealed');
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        elem.classList.remove('revealed');
      }, 10000);
    });
  });
}

function initFavPlayerHover() {
  const trigger = document.getElementById('favPlayerTrigger');
  const overlay = document.getElementById('benStokesOverlay');
  const textElem = document.getElementById('benStokesText');
  if (!trigger || !overlay || !textElem) return;

  const smileys = ['😊', '😄', '😁', '😎', '🏏', '🔥', '👑', '🤩', '😇', '⚡'];
  let leaveTimer = null;

  trigger.addEventListener('mouseenter', () => {
    if (leaveTimer) clearTimeout(leaveTimer);
    const randomSmiley = smileys[Math.floor(Math.random() * smileys.length)];
    textElem.textContent = `${randomSmiley} benstokes`;
    overlay.classList.add('active');
  });

  trigger.addEventListener('mouseleave', () => {
    leaveTimer = setTimeout(() => {
      overlay.classList.remove('active');
    }, 1200);
  });

  overlay.addEventListener('mouseenter', () => {
    if (leaveTimer) clearTimeout(leaveTimer);
  });

  overlay.addEventListener('mouseleave', () => {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', () => {
    overlay.classList.remove('active');
  });
}

const DEFAULT_PROFILE = {
  fullName: "Sayand",
  regNo: "stm23cs043",
  department: "Computer Science & Engineering",
  semester: "Semester 7 (Final Year)",
  email: "sayand.r23@gmail.com",
  phone: "9995311232",
  dob: "March 2026",
  address: "Kuthuparamba, Kannur, Kerala",
  gender: "male",
  bloodGroup: "O+",
  favoriteCompany: "Tesla, IBM",
  skills: ["python", "java_android", "web_dev", "dsa", "flutter", "sql_db"],
  extracurricular: ["cricket_stokes"]
};

const SEMESTER_RECORDS = [
  { sem: 1, term: "Fall 2021", subjects: "Programming in C, Engineering Physics, Calculus", sgpa: 7.35 },
  { sem: 2, term: "Spring 2022", subjects: "Data Structures, Digital Electronics, Differential Equations", sgpa: 7.50 },
  { sem: 3, term: "Fall 2022", subjects: "Discrete Math, Object Oriented Programming (Java), Computer Organization", sgpa: 7.68 },
  { sem: 4, term: "Spring 2023", subjects: "Design & Analysis of Algorithms, Operating Systems, Database Systems", sgpa: 8.45 },
  { sem: 5, term: "Fall 2023", subjects: "Formal Languages & Automata, Computer Networks, Microprocessors", sgpa: 7.82 },
  { sem: 6, term: "Spring 2024", subjects: "Compiler Design, Software Engineering, Mobile Computing", sgpa: 7.75 },
  { sem: 7, term: "Fall 2024", subjects: "Artificial Intelligence, Cloud Computing, Cryptography, Seminar", sgpa: 7.70 }
];

function initLivePreviewSync() {
  const cardName = document.getElementById('cardStudentName');
  const cardReg = document.getElementById('cardRegNo');
  const cardDept = document.getElementById('cardDepartment');
  const cardBlood = document.getElementById('cardBloodGroup');
  const cardCompany = document.getElementById('cardCompany');
  const cardGender = document.getElementById('cardGender');
  const cardCgpa = document.getElementById('cardCgpa');

  if (cardName) cardName.textContent = DEFAULT_PROFILE.fullName;
  if (cardReg) cardReg.textContent = DEFAULT_PROFILE.regNo;
  if (cardDept) cardDept.textContent = `${DEFAULT_PROFILE.department} • Sem 7`;
  if (cardBlood) cardBlood.textContent = DEFAULT_PROFILE.bloodGroup;
  if (cardCompany) cardCompany.textContent = DEFAULT_PROFILE.favoriteCompany;
  if (cardGender) cardGender.textContent = "Male";
  if (cardCgpa) cardCgpa.textContent = "7.75";

  updateCardSkills();
}

function updateCardSkills() {
  const container = document.getElementById('cardSkillsTags');
  if (!container) return;

  const skillTitles = [
    "Python Programming",
    "Java & Android SDK",
    "HTML5, CSS3 & JavaScript",
    "Data Structures & Algorithms",
    "Flutter & Dart",
    "Databases (SQL & Firebase)"
  ];

  container.innerHTML = '';
  skillTitles.forEach(title => {
    const chip = document.createElement('span');
    chip.className = 'id-skill-chip';
    chip.textContent = title;
    container.appendChild(chip);
  });
}

function initAcademicCalculator() {
  renderAcademicTable(SEMESTER_RECORDS);

  const avgCgpaCard = document.getElementById('summaryAvgCgpa');
  const sem4Card = document.getElementById('summarySem4Sgpa');
  const cardCgpa = document.getElementById('cardCgpa');

  if (avgCgpaCard) avgCgpaCard.textContent = "7.75";
  if (sem4Card) sem4Card.textContent = "8.45";
  if (cardCgpa) cardCgpa.textContent = "7.75";
}

function renderAcademicTable(records) {
  const tbody = document.getElementById('academicTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  let cumulativeSum = 0;

  records.forEach((rec, idx) => {
    cumulativeSum += rec.sgpa;
    const currentCgpa = (cumulativeSum / (idx + 1)).toFixed(2);
    const tr = document.createElement('tr');

    const semBadge = `<span class="sem-badge regular">Sem ${rec.sem}</span>`;

    tr.innerHTML = `
      <td>${semBadge}</td>
      <td>
        <div style="font-weight:600;">${rec.term}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${rec.subjects}</div>
      </td>
      <td>
        <span class="score-badge" style="font-family:'JetBrains Mono', monospace; font-weight:700; font-size:0.9rem; background:rgba(217, 119, 6, 0.08); color:var(--ink-primary); padding:0.3rem 0.6rem; border-radius:6px; border:1px solid rgba(217, 119, 6, 0.2);">${rec.sgpa.toFixed(2)}</span>
      </td>
      <td>
        <strong style="font-family:'JetBrains Mono', monospace; color:var(--ink-primary); font-size:0.95rem;">${currentCgpa}</strong>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function initFormInteractivity() {
  const printBtn = document.getElementById('printProfileBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function initDemoDataLoader() {
  loadStudentData(DEFAULT_PROFILE);
}

function loadStudentData(data) {
  if (document.getElementById('fullName')) document.getElementById('fullName').value = data.fullName;
  if (document.getElementById('regNo')) document.getElementById('regNo').value = data.regNo;
  if (document.getElementById('department')) document.getElementById('department').value = data.department;
  if (document.getElementById('semester')) document.getElementById('semester').value = data.semester;
  if (document.getElementById('email')) document.getElementById('email').value = data.email;
  if (document.getElementById('phone')) document.getElementById('phone').value = data.phone;
  if (document.getElementById('dob')) document.getElementById('dob').value = data.dob;
  if (document.getElementById('address')) document.getElementById('address').value = data.address;
  if (document.getElementById('favoriteCompany')) document.getElementById('favoriteCompany').value = data.favoriteCompany;

  const genderRadio = document.querySelector(`input[name="gender"][value="${data.gender}"]`);
  if (genderRadio) {
    genderRadio.checked = true;
  }

  const bloodGroup = document.getElementById('bloodGroup');
  if (bloodGroup) {
    bloodGroup.value = data.bloodGroup;
  }

  document.querySelectorAll('input[name="skills"]').forEach(cb => {
    cb.checked = data.skills.includes(cb.value);
  });
  updateCardSkills();

  document.querySelectorAll('input[name="extracurricular"]').forEach(cb => {
    cb.checked = data.extracurricular.includes(cb.value);
  });
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  toast.innerHTML = `
    <div class="toast-icon" style="color:var(--${type === 'success' ? 'emerald' : type === 'error' ? 'rose' : 'primary-light'})">
      ${iconMap[type] || '✦'}
    </div>
    <div class="toast-content">
      <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
      <p>${message}</p>
    </div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
