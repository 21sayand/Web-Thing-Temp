/**
 * ==============================================================================
 * B.Tech Student Profile Portal - Master JavaScript Logic
 * Institution: St. Thomas College of Engineering and Technology, Mattanur
 * Student: SAYANAND M P (Register No: STM23CS042)
 * 
 * Features:
 * 1. Full KTU S1-S6 Academic Record Dataset Integration
 * 2. Semester Filter & Search (S1, S2, S3, S4, S5, S6, ALL)
 * 3. Real-time Photo Upload & Avatar Preview
 * 4. Regex & Range Form Validations (Email, 10-digit Phone, CGPA)
 * 5. Two-way Profile Dossier Synchronizer
 * 6. Dynamic Course Row Addition / Deletion
 * ==============================================================================
 */

// Default Fallback Avatar URL - Sayanand M P
const DEFAULT_AVATAR = 'sayii.jpeg';
let currentPhotoDataUrl = DEFAULT_AVATAR;

// Comprehensive Academic Dataset for SAYANAND M P from KTU Grade Cards
const SAYANAND_ACADEMIC_RECORDS = [
  // S1 (SGPA: 6.00, Credits: 17)
  { sem: 'Semester 1', semCode: 'S1', code: 'EST120', name: 'BASICS OF CIVIL AND MECHANICAL ENGINEERING', internals: '41.0', grade: 'P', credits: '4.0', sgpa: '6.00', cgpa: '6.00' },
  { sem: 'Semester 1', semCode: 'S1', code: 'ESL120', name: 'CIVIL AND MECHANICAL WORKSHOP', internals: '83.0', grade: 'A', credits: '1.0', sgpa: '6.00', cgpa: '6.00' },
  { sem: 'Semester 1', semCode: 'S1', code: 'CYT100', name: 'ENGINEERING CHEMISTRY', internals: '38.0', grade: 'P', credits: '4.0', sgpa: '6.00', cgpa: '6.00' },
  { sem: 'Semester 1', semCode: 'S1', code: 'CYL120', name: 'ENGINEERING CHEMISTRY LAB', internals: '89.0', grade: 'A+', credits: '1.0', sgpa: '6.00', cgpa: '6.00' },
  { sem: 'Semester 1', semCode: 'S1', code: 'EST100', name: 'ENGINEERING MECHANICS', internals: '41.0', grade: 'P', credits: '3.0', sgpa: '6.00', cgpa: '6.00' },
  { sem: 'Semester 1', semCode: 'S1', code: 'HUN101', name: 'LIFE SKILLS', internals: '41.0', grade: 'P', credits: '0.0', sgpa: '6.00', cgpa: '6.00' },
  { sem: 'Semester 1', semCode: 'S1', code: 'MAT101', name: 'LINEAR ALGEBRA AND CALCULUS', internals: '40.0', grade: 'D', credits: '4.0', sgpa: '6.00', cgpa: '6.00' },

  // S2 (SGPA: 6.55, Credits: 21)
  { sem: 'Semester 2', semCode: 'S2', code: 'EST130', name: 'BASICS OF ELECTRICAL AND ELECTRONICS ENGINEERING', internals: '41.0', grade: 'P', credits: '4.0', sgpa: '6.55', cgpa: '6.30' },
  { sem: 'Semester 2', semCode: 'S2', code: 'ESL130', name: 'ELECTRICAL AND ELECTRONICS WORKSHOP', internals: '87.0', grade: 'A+', credits: '1.0', sgpa: '6.55', cgpa: '6.30' },
  { sem: 'Semester 2', semCode: 'S2', code: 'EST110', name: 'ENGINEERING GRAPHICS', internals: '36.0', grade: 'B', credits: '3.0', sgpa: '6.55', cgpa: '6.30' },
  { sem: 'Semester 2', semCode: 'S2', code: 'PHT100', name: 'ENGINEERING PHYSICS A', internals: '35.0', grade: 'B', credits: '4.0', sgpa: '6.55', cgpa: '6.30' },
  { sem: 'Semester 2', semCode: 'S2', code: 'PHL120', name: 'ENGINEERING PHYSICS LAB', internals: '79.0', grade: 'B+', credits: '1.0', sgpa: '6.55', cgpa: '6.30' },
  { sem: 'Semester 2', semCode: 'S2', code: 'HUN102', name: 'PROFESSIONAL COMMUNICATION', internals: '42.0', grade: 'P', credits: '0.0', sgpa: '6.55', cgpa: '6.30' },
  { sem: 'Semester 2', semCode: 'S2', code: 'EST102', name: 'PROGRAMMING IN C', internals: '37.0', grade: 'D', credits: '4.0', sgpa: '6.55', cgpa: '6.30' },
  { sem: 'Semester 2', semCode: 'S2', code: 'MAT102', name: 'VECTOR CALCULUS, DIFFERENTIAL EQUATIONS & TRANSFORMS', internals: '41.0', grade: 'P', credits: '4.0', sgpa: '6.55', cgpa: '6.30' },

  // S3 (SGPA: 6.50, Credits: 22)
  { sem: 'Semester 3', semCode: 'S3', code: 'CST201', name: 'DATA STRUCTURES', internals: '40.0', grade: 'C+', credits: '4.0', sgpa: '6.50', cgpa: '6.37' },
  { sem: 'Semester 3', semCode: 'S3', code: 'CSL201', name: 'DATA STRUCTURES LAB', internals: '59.0', grade: 'D', credits: '2.0', sgpa: '6.50', cgpa: '6.37' },
  { sem: 'Semester 3', semCode: 'S3', code: 'EST200', name: 'DESIGN AND ENGINEERING', internals: '47.0', grade: 'B', credits: '2.0', sgpa: '6.50', cgpa: '6.37' },
  { sem: 'Semester 3', semCode: 'S3', code: 'MAT203', name: 'DISCRETE MATHEMATICAL STRUCTURES', internals: '38.0', grade: 'P', credits: '4.0', sgpa: '6.50', cgpa: '6.37' },
  { sem: 'Semester 3', semCode: 'S3', code: 'CST203', name: 'LOGIC SYSTEM DESIGN', internals: '41.0', grade: 'P', credits: '4.0', sgpa: '6.50', cgpa: '6.37' },
  { sem: 'Semester 3', semCode: 'S3', code: 'CSL203', name: 'OBJECT ORIENTED PROGRAMMING LAB (IN JAVA)', internals: '63.0', grade: 'A+', credits: '2.0', sgpa: '6.50', cgpa: '6.37' },
  { sem: 'Semester 3', semCode: 'S3', code: 'CST205', name: 'OBJECT ORIENTED PROGRAMMING USING JAVA', internals: '39.0', grade: 'C', credits: '4.0', sgpa: '6.50', cgpa: '6.37' },
  { sem: 'Semester 3', semCode: 'S3', code: 'MCN201', name: 'SUSTAINABLE ENGINEERING', internals: '39.0', grade: 'P', credits: '0.0', sgpa: '6.50', cgpa: '6.37' },

  // S4 (SGPA: 7.68, Credits: 22)
  { sem: 'Semester 4', semCode: 'S4', code: 'CST202', name: 'COMPUTER ORGANISATION AND ARCHITECTURE', internals: '42.0', grade: 'C+', credits: '4.0', sgpa: '7.68', cgpa: '6.72' },
  { sem: 'Semester 4', semCode: 'S4', code: 'MCN202', name: 'CONSTITUTION OF INDIA', internals: '42.0', grade: 'P', credits: '0.0', sgpa: '7.68', cgpa: '6.72' },
  { sem: 'Semester 4', semCode: 'S4', code: 'CST204', name: 'DATABASE MANAGEMENT SYSTEMS', internals: '39.0', grade: 'C', credits: '4.0', sgpa: '7.68', cgpa: '6.72' },
  { sem: 'Semester 4', semCode: 'S4', code: 'CSL202', name: 'DIGITAL LAB', internals: '73.0', grade: 'A+', credits: '2.0', sgpa: '7.68', cgpa: '6.72' },
  { sem: 'Semester 4', semCode: 'S4', code: 'MAT206', name: 'GRAPH THEORY', internals: '43.0', grade: 'A+', credits: '4.0', sgpa: '7.68', cgpa: '6.72' },
  { sem: 'Semester 4', semCode: 'S4', code: 'CST206', name: 'OPERATING SYSTEMS', internals: '40.0', grade: 'B', credits: '4.0', sgpa: '7.68', cgpa: '6.72' },
  { sem: 'Semester 4', semCode: 'S4', code: 'CSL204', name: 'OPERATING SYSTEMS LAB', internals: '71.0', grade: 'S', credits: '2.0', sgpa: '7.68', cgpa: '6.72' },
  { sem: 'Semester 4', semCode: 'S4', code: 'HUT200', name: 'PROFESSIONAL ETHICS', internals: '43.0', grade: 'P', credits: '2.0', sgpa: '7.68', cgpa: '6.72' },

  // S5 (SGPA: 7.26, Credits: 23)
  { sem: 'Semester 5', semCode: 'S5', code: 'MCN301', name: 'DISASTER MANAGEMENT', internals: '43.0', grade: 'B', credits: '0.0', sgpa: '7.26', cgpa: '6.84' },
  { sem: 'Semester 5', semCode: 'S5', code: 'CST301', name: 'FORMAL LANGUAGES AND AUTOMATA THEORY', internals: '42.0', grade: 'D', credits: '4.0', sgpa: '7.26', cgpa: '6.84' },
  { sem: 'Semester 5', semCode: 'S5', code: 'CST303', name: 'COMPUTER NETWORKS', internals: '43.0', grade: 'C', credits: '4.0', sgpa: '7.26', cgpa: '6.84' },
  { sem: 'Semester 5', semCode: 'S5', code: 'CST305', name: 'SYSTEM SOFTWARE', internals: '48.0', grade: 'A', credits: '4.0', sgpa: '7.26', cgpa: '6.84' },
  { sem: 'Semester 5', semCode: 'S5', code: 'CST307', name: 'MICROPROCESSORS AND MICROCONTROLLERS', internals: '42.0', grade: 'B', credits: '4.0', sgpa: '7.26', cgpa: '6.84' },
  { sem: 'Semester 5', semCode: 'S5', code: 'CST309', name: 'MANAGEMENT OF SOFTWARE SYSTEMS', internals: '39.0', grade: 'C+', credits: '3.0', sgpa: '7.26', cgpa: '6.84' },
  { sem: 'Semester 5', semCode: 'S5', code: 'CSL331', name: 'SYSTEM SOFTWARE & MICROPROCESSORS LAB', internals: '65.0', grade: 'B+', credits: '2.0', sgpa: '7.26', cgpa: '6.84' },
  { sem: 'Semester 5', semCode: 'S5', code: 'CSL333', name: 'DATABASE MANAGEMENT SYSTEMS LAB', internals: '67.0', grade: 'B+', credits: '2.0', sgpa: '7.26', cgpa: '6.84' },

  // S6 (SGPA: 7.28, Credits: 23)
  { sem: 'Semester 6', semCode: 'S6', code: 'HUT300', name: 'INDUSTRIAL ECONOMICS AND FOREIGN TRADE', internals: '37.0', grade: 'C+', credits: '3.0', sgpa: '7.28', cgpa: '6.92' },
  { sem: 'Semester 6', semCode: 'S6', code: 'CST302', name: 'COMPILER DESIGN', internals: '49.0', grade: 'B+', credits: '4.0', sgpa: '7.28', cgpa: '6.92' },
  { sem: 'Semester 6', semCode: 'S6', code: 'CST304', name: 'COMPUTER GRAPHICS AND IMAGE PROCESSING', internals: '46.0', grade: 'C', credits: '4.0', sgpa: '7.28', cgpa: '6.92' },
  { sem: 'Semester 6', semCode: 'S6', code: 'CST306', name: 'ALGORITHM ANALYSIS AND DESIGN', internals: '41.0', grade: 'P', credits: '4.0', sgpa: '7.28', cgpa: '6.92' },
  { sem: 'Semester 6', semCode: 'S6', code: 'CST308', name: 'COMPREHENSIVE COURSE WORK', internals: 'NA', grade: 'D', credits: '1.0', sgpa: '7.28', cgpa: '6.92' },
  { sem: 'Semester 6', semCode: 'S6', code: 'CSL332', name: 'NETWORKING LAB', internals: '66.0', grade: 'S', credits: '2.0', sgpa: '7.28', cgpa: '6.92' },
  { sem: 'Semester 6', semCode: 'S6', code: 'CSD334', name: 'MINIPROJECT', internals: '64.0', grade: 'A+', credits: '2.0', sgpa: '7.28', cgpa: '6.92' },
  { sem: 'Semester 6', semCode: 'S6', code: 'CST362', name: 'PROGRAMMING IN PYTHON', internals: '43.0', grade: 'B', credits: '3.0', sgpa: '7.28', cgpa: '6.92' }
];

// Document Initialization
document.addEventListener('DOMContentLoaded', () => {
  populateInitialForm();
  setupLiveValidationListeners();
});

/**
 * 1. Setup Live Error Clearance Listeners
 */
function setupLiveValidationListeners() {
  const inputs = document.querySelectorAll('#studentRegistrationForm input, #studentRegistrationForm select, #studentRegistrationForm textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const parentGroup = input.closest('.form-group');
      if (parentGroup && parentGroup.classList.contains('has-error')) {
        parentGroup.classList.remove('has-error');
      }
    });
  });
}

/**
 * 2. Photo Upload & Preview Handler
 */
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file (.jpg, .png, .webp).', 'error');
    return;
  }

  if (file.size > 3 * 1024 * 1024) {
    showToast('Image size should be less than 3MB.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    currentPhotoDataUrl = e.target.result;
    document.getElementById('avatarPreview').src = currentPhotoDataUrl;
    document.getElementById('cardAvatar').src = currentPhotoDataUrl;
    showToast('Profile photo updated successfully!', 'success');
  };
  reader.readAsDataURL(file);
}

function removeCustomPhoto() {
  currentPhotoDataUrl = DEFAULT_AVATAR;
  document.getElementById('avatarPreview').src = DEFAULT_AVATAR;
  document.getElementById('cardAvatar').src = DEFAULT_AVATAR;
  document.getElementById('studentPhotoInput').value = '';
  showToast('Profile photo reset to default avatar.', 'info');
}

/**
 * 3. Render Academic Table in Form
 */
function populateAcademicFormTable(records) {
  const tbody = document.getElementById('academicTableBody');
  tbody.innerHTML = '';

  records.forEach(item => {
    const row = document.createElement('tr');
    row.dataset.sem = item.semCode;
    row.innerHTML = `
      <td>
        <select class="tbl-input sem-select" required>
          <option value="Semester 1" ${item.sem === 'Semester 1' ? 'selected' : ''}>Semester 1</option>
          <option value="Semester 2" ${item.sem === 'Semester 2' ? 'selected' : ''}>Semester 2</option>
          <option value="Semester 3" ${item.sem === 'Semester 3' ? 'selected' : ''}>Semester 3</option>
          <option value="Semester 4" ${item.sem === 'Semester 4' ? 'selected' : ''}>Semester 4</option>
          <option value="Semester 5" ${item.sem === 'Semester 5' ? 'selected' : ''}>Semester 5</option>
          <option value="Semester 6" ${item.sem === 'Semester 6' ? 'selected' : ''}>Semester 6</option>
          <option value="Semester 7" ${item.sem === 'Semester 7' ? 'selected' : ''}>Semester 7</option>
          <option value="Semester 8" ${item.sem === 'Semester 8' ? 'selected' : ''}>Semester 8</option>
        </select>
      </td>
      <td>
        <input type="text" class="tbl-input sub-input" value="${item.code ? item.code + ': ' : ''}${item.name}" placeholder="Course Code: Course Name" required />
      </td>
      <td>
        <input type="text" class="tbl-input marks-input" value="${item.internals}" placeholder="Marks (e.g. 42.0)" required />
      </td>
      <td>
        <select class="tbl-input grade-select">
          <option value="S" ${item.grade === 'S' ? 'selected' : ''}>S</option>
          <option value="A+" ${item.grade === 'A+' ? 'selected' : ''}>A+</option>
          <option value="A" ${item.grade === 'A' ? 'selected' : ''}>A</option>
          <option value="B+" ${item.grade === 'B+' ? 'selected' : ''}>B+</option>
          <option value="B" ${item.grade === 'B' ? 'selected' : ''}>B</option>
          <option value="C+" ${item.grade === 'C+' ? 'selected' : ''}>C+</option>
          <option value="C" ${item.grade === 'C' ? 'selected' : ''}>C</option>
          <option value="D" ${item.grade === 'D' ? 'selected' : ''}>D</option>
          <option value="P" ${item.grade === 'P' ? 'selected' : ''}>P</option>
          <option value="F" ${item.grade === 'F' ? 'selected' : ''}>F</option>
        </select>
      </td>
      <td>
        <input type="number" step="0.01" min="0" max="10" class="tbl-input sgpa-input" value="${item.sgpa}" placeholder="SGPA" required />
      </td>
      <td>
        <input type="number" step="0.01" min="0" max="10" class="tbl-input cgpa-input" value="${item.cgpa}" placeholder="CGPA" required />
      </td>
      <td class="text-center">
        <button type="button" class="btn-del-row" onclick="removeSemesterRow(this)" title="Delete Row">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

/**
 * Filter Form Table by Semester
 */
function filterAcademicInputTable(semFilter) {
  document.querySelectorAll('.semester-filter-chips .filter-chip').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.includes(semFilter) || (semFilter === 'ALL' && btn.textContent.includes('All'))) {
      btn.classList.add('active');
    }
  });

  const rows = document.querySelectorAll('#academicTableBody tr');
  rows.forEach(row => {
    const semSelect = row.querySelector('.sem-select').value;
    if (semFilter === 'ALL') {
      row.style.display = '';
    } else {
      const targetSemName = `Semester ${semFilter.replace('S', '')}`;
      row.style.display = semSelect === targetSemName ? '' : 'none';
    }
  });
}

/**
 * Add / Remove Form Table Rows
 */
function addNewSemesterRow() {
  const tbody = document.getElementById('academicTableBody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>
      <select class="tbl-input sem-select" required>
        <option value="Semester 1">Semester 1</option>
        <option value="Semester 2">Semester 2</option>
        <option value="Semester 3">Semester 3</option>
        <option value="Semester 4">Semester 4</option>
        <option value="Semester 5">Semester 5</option>
        <option value="Semester 6" selected>Semester 6</option>
        <option value="Semester 7">Semester 7</option>
        <option value="Semester 8">Semester 8</option>
      </select>
    </td>
    <td>
      <input type="text" class="tbl-input sub-input" placeholder="e.g. CST401: Cloud Computing" required />
    </td>
    <td>
      <input type="text" class="tbl-input marks-input" placeholder="e.g. 45.0" required />
    </td>
    <td>
      <select class="tbl-input grade-select">
        <option value="S">S</option>
        <option value="A+">A+</option>
        <option value="A">A</option>
        <option value="B+" selected>B+</option>
        <option value="B">B</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="P">P</option>
        <option value="F">F</option>
      </select>
    </td>
    <td>
      <input type="number" step="0.01" min="0" max="10" class="tbl-input sgpa-input" value="7.28" placeholder="SGPA" required />
    </td>
    <td>
      <input type="number" step="0.01" min="0" max="10" class="tbl-input cgpa-input" value="6.92" placeholder="CGPA" required />
    </td>
    <td class="text-center">
      <button type="button" class="btn-del-row" onclick="removeSemesterRow(this)" title="Delete Row">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;
  tbody.appendChild(newRow);
  showToast('New course row added.', 'info');
}

function removeSemesterRow(buttonEl) {
  const tbody = document.getElementById('academicTableBody');
  const rows = tbody.querySelectorAll('tr');
  if (rows.length <= 1) {
    showToast('At least one academic course record is required.', 'error');
    return;
  }
  const row = buttonEl.closest('tr');
  if (row) {
    row.remove();
    showToast('Course record row removed.', 'info');
  }
}

/**
 * 4. Form Submission & Validation
 */
function handleFormSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();

  let isValid = true;
  let firstErrorElement = null;

  function markError(id, condition) {
    const el = document.getElementById(id);
    const parent = el ? el.closest('.form-group') : null;
    if (!condition) {
      if (parent) parent.classList.add('has-error');
      if (!firstErrorElement && el) firstErrorElement = el;
      isValid = false;
    } else {
      if (parent) parent.classList.remove('has-error');
    }
  }

  const fullName = document.getElementById('fullName').value.trim();
  markError('fullName', fullName.length >= 2);

  const admissionNo = document.getElementById('admissionNo').value.trim();
  markError('admissionNo', admissionNo.length >= 1);

  const universityRegNo = document.getElementById('universityRegNo').value.trim();
  markError('universityRegNo', universityRegNo.length >= 2);

  const dob = document.getElementById('dob').value;
  markError('dob', dob !== '');

  const bloodGroup = document.getElementById('bloodGroup').value;
  markError('bloodGroup', bloodGroup !== '');

  const email = document.getElementById('email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  markError('email', emailRegex.test(email));

  const phone = document.getElementById('phone').value.trim();
  const phoneRegex = /^[0-9]{10}$/;
  markError('phone', phoneRegex.test(phone));

  const address = document.getElementById('address').value.trim();
  markError('address', address.length >= 4);

  const collegeName = document.getElementById('collegeName').value.trim();
  markError('collegeName', collegeName.length >= 3);

  const branch = document.getElementById('branch').value;
  markError('branch', branch !== '');

  const currentSemester = document.getElementById('currentSemester').value;
  markError('currentSemester', currentSemester !== '');

  const overallCgpaVal = parseFloat(document.getElementById('overallCgpa').value);
  const isValidCgpa = !isNaN(overallCgpaVal) && overallCgpaVal >= 0 && overallCgpaVal <= 10;
  markError('overallCgpa', isValidCgpa);

  const careerRole = document.getElementById('careerRole').value;
  markError('careerRole', careerRole !== '');

  const selectedCompanies = Array.from(document.querySelectorAll('input[name="companies"]:checked')).map(cb => cb.value);
  const errCompanies = document.getElementById('err-companies');
  if (selectedCompanies.length === 0) {
    if (errCompanies) errCompanies.style.display = 'block';
    isValid = false;
  } else {
    if (errCompanies) errCompanies.style.display = 'none';
  }

  const selectedSkills = Array.from(document.querySelectorAll('input[name="technicalSkills"]:checked')).map(cb => cb.value);
  const errSkills = document.getElementById('err-technicalSkills');
  if (selectedSkills.length === 0) {
    if (errSkills) errSkills.style.display = 'block';
    isValid = false;
  } else {
    if (errSkills) errSkills.style.display = 'none';
  }

  if (!isValid) {
    showToast('Please correct the highlighted errors.', 'error');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorElement.focus();
    }
    return;
  }

  // Extract all courses from table
  const courses = [];
  document.querySelectorAll('#academicTableBody tr').forEach(row => {
    courses.push({
      sem: row.querySelector('.sem-select').value,
      name: row.querySelector('.sub-input').value.trim(),
      internals: row.querySelector('.marks-input').value.trim(),
      grade: row.querySelector('.grade-select') ? row.querySelector('.grade-select').value : 'P',
      sgpa: parseFloat(row.querySelector('.sgpa-input').value || 0).toFixed(2),
      cgpa: parseFloat(row.querySelector('.cgpa-input').value || 0).toFixed(2)
    });
  });

  renderProfileDossier({
    fullName,
    admissionNo,
    universityRegNo,
    dob,
    gender: document.querySelector('input[name="gender"]:checked').value,
    bloodGroup,
    email,
    phone,
    address,
    collegeName,
    branch,
    currentSemester,
    overallCgpa: overallCgpaVal.toFixed(2),
    careerRole,
    companies: selectedCompanies,
    skills: selectedSkills,
    activities: Array.from(document.querySelectorAll('input[name="activities"]:checked')).map(cb => cb.value),
    photo: currentPhotoDataUrl,
    courses: courses
  });

  switchView('profile');
  showToast('Profile dossier updated & verified!', 'success');
}

/**
 * 5. Render Student Profile Dossier Elements
 */
let currentRenderedCourses = [];
function renderProfileDossier(data) {
  currentRenderedCourses = data.courses || [];

  document.getElementById('cardAvatar').src = data.photo;
  document.getElementById('cardFullName').textContent = data.fullName;
  document.getElementById('cardBranchTag').textContent = `B.Tech - ${data.branch}`;
  document.getElementById('cardAdmissionNo').textContent = data.admissionNo;
  document.getElementById('cardUniversityRegNo').textContent = data.universityRegNo;
  document.getElementById('cardSemester').textContent = data.currentSemester;
  document.getElementById('cardCollegeName').innerHTML = `<i class="fa-solid fa-building-columns"></i> ${data.collegeName}`;

  document.getElementById('cardOverallCgpa').innerHTML = `${data.overallCgpa} <span>/ 10.0</span>`;
  document.getElementById('cardCareerRole').textContent = data.careerRole;
  document.getElementById('cardBloodGroup').textContent = data.bloodGroup;

  document.getElementById('cardEmail').textContent = data.email;
  document.getElementById('cardPhone').textContent = `+91 ${data.phone}`;

  if (data.dob) {
    const dobDate = new Date(data.dob);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    document.getElementById('cardDob').textContent = dobDate.toLocaleDateString('en-GB', options).replace(/ /g, '-');
  } else {
    document.getElementById('cardDob').textContent = 'N/A';
  }

  document.getElementById('cardGender').textContent = data.gender;
  document.getElementById('cardAddress').textContent = data.address;

  // Companies
  const companiesContainer = document.getElementById('cardCompaniesContainer');
  companiesContainer.innerHTML = '';
  data.companies.forEach(company => {
    const tag = document.createElement('span');
    tag.className = 'pill-tag company';
    tag.innerHTML = `<i class="fa-solid fa-building"></i> ${company}`;
    companiesContainer.appendChild(tag);
  });

  // Skills
  const skillsContainer = document.getElementById('cardSkillsContainer');
  skillsContainer.innerHTML = '';
  data.skills.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'pill-tag skill';
    tag.innerHTML = `<i class="fa-solid fa-code"></i> ${skill}`;
    skillsContainer.appendChild(tag);
  });

  // Activities
  const activitiesContainer = document.getElementById('cardActivitiesContainer');
  activitiesContainer.innerHTML = '';
  data.activities.forEach(act => {
    const tag = document.createElement('span');
    tag.className = 'pill-tag activity';
    tag.innerHTML = `<i class="fa-solid fa-medal"></i> ${act}`;
    activitiesContainer.appendChild(tag);
  });

  // Populate Display Table
  filterProfileAcademicTable('ALL');

  const now = new Date();
  document.getElementById('displayUpdatedTime').textContent = `Last Synchronized: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
}

/**
 * Filter Profile Dossier Academic Table
 */
function filterProfileAcademicTable(semFilter) {
  const tbody = document.getElementById('cardAcademicTableBody');
  tbody.innerHTML = '';

  const filtered = semFilter === 'ALL'
    ? currentRenderedCourses
    : currentRenderedCourses.filter(c => c.sem === semFilter);

  filtered.forEach(course => {
    const gradeClass = ['S', 'A+', 'A'].includes(course.grade) ? 'grade-high' : (['B+', 'B'].includes(course.grade) ? 'grade-mid' : 'grade-pass');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${course.sem}</strong></td>
      <td>${course.name}</td>
      <td><strong>${course.internals}</strong></td>
      <td><span class="grade-badge ${gradeClass}">${course.grade}</span></td>
      <td><span class="badge-score score-high">${course.sgpa}</span></td>
      <td><strong>${course.cgpa}</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * 6. View Switcher
 */
function switchView(viewName) {
  const formSection = document.getElementById('formSection');
  const profileSection = document.getElementById('profileSection');
  const btnNavForm = document.getElementById('btnNavForm');
  const btnNavProfile = document.getElementById('btnNavProfile');

  if (viewName === 'form') {
    formSection.classList.add('active-panel');
    profileSection.classList.remove('active-panel');
    btnNavForm.classList.add('active');
    btnNavProfile.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    formSection.classList.remove('active-panel');
    profileSection.classList.add('active-panel');
    btnNavForm.classList.remove('active');
    btnNavProfile.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * 7. Pre-fill Authentic Sayanand M P Data
 */
function loadSampleData() {
  document.getElementById('fullName').value = 'SAYANAND M P';
  document.getElementById('admissionNo').value = '41';
  document.getElementById('universityRegNo').value = 'STM23CS042';
  document.getElementById('dob').value = '2004-11-24';
  
  const maleRadio = document.querySelector('input[name="gender"][value="Male"]');
  if (maleRadio) maleRadio.checked = true;

  document.getElementById('bloodGroup').value = 'A+';
  document.getElementById('email').value = 'sayanandmp@gmail.com';
  document.getElementById('phone').value = '6238798913';
  document.getElementById('address').value = 'Madappurakkal(H), Aduvappuram, Malappattam(P.O), 670631, Kannur, Kerala';
  document.getElementById('collegeName').value = 'ST. THOMAS COLLEGE OF ENGINEERING AND TECHNOLOGY, MATTANUR';
  document.getElementById('branch').value = 'Computer Science & Engineering';
  document.getElementById('currentSemester').value = 'Semester 7';
  document.getElementById('overallCgpa').value = '6.92';
  document.getElementById('careerRole').value = 'Software Developer';

  // Checkboxes
  const companies = ['Infosys', 'TCS', 'Wipro', 'Accenture', 'Cognizant', 'IBM', 'Zoho'];
  document.querySelectorAll('input[name="companies"]').forEach(cb => {
    cb.checked = companies.includes(cb.value);
  });

  const skills = ['C', 'Java', 'Python', 'HTML, CSS, and JavaScript', 'React', 'SQL'];
  document.querySelectorAll('input[name="technicalSkills"]').forEach(cb => {
    cb.checked = skills.includes(cb.value);
  });

  // Activities (Excluding NSS and NCC)
  const activities = ['Sports', 'Arts and Cultural Activities', 'Technical Club', 'Hackathons', 'Coding Competitions'];
  document.querySelectorAll('input[name="activities"]').forEach(cb => {
    cb.checked = activities.includes(cb.value);
  });

  currentPhotoDataUrl = DEFAULT_AVATAR;
  document.getElementById('avatarPreview').src = DEFAULT_AVATAR;
  document.getElementById('cardAvatar').src = DEFAULT_AVATAR;

  // Load complete S1-S6 dataset
  populateAcademicFormTable(SAYANAND_ACADEMIC_RECORDS);

  document.querySelectorAll('.form-group.has-error').forEach(el => el.classList.remove('has-error'));
  showToast('Loaded Sayanand M P (STM23CS042) records successfully!', 'success');
}

/**
 * 8. Initial Population on Page Load
 */
function populateInitialForm() {
  loadSampleData();
  const fakeEvent = { preventDefault: () => {} };
  handleFormSubmit(fakeEvent);
  switchView('form');
}

/**
 * 9. Reset Form
 */
function confirmResetForm() {
  if (confirm('Are you sure you want to reset all profile form fields?')) {
    document.getElementById('studentRegistrationForm').reset();
    removeCustomPhoto();
    document.querySelectorAll('.form-group.has-error').forEach(el => el.classList.remove('has-error'));
    populateAcademicFormTable([SAYANAND_ACADEMIC_RECORDS[0]]);
    showToast('Form cleared. Please enter student details.', 'info');
  }
}

/**
 * 10. Toast Notification System
 */
let toastTimeout = null;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  if (type === 'error') {
    toastIcon.className = 'fa-solid fa-circle-exclamation';
    toast.style.borderLeftColor = '#ef4444';
  } else if (type === 'info') {
    toastIcon.className = 'fa-solid fa-circle-info';
    toast.style.borderLeftColor = '#3b82f6';
  } else {
    toastIcon.className = 'fa-solid fa-circle-check';
    toast.style.borderLeftColor = '#10b981';
  }

  toast.classList.remove('hidden');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}
