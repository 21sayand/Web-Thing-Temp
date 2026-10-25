/**
 * ==========================================================================
 * STUDENT PROFILE WEB APPLICATION - INTERACTIVE LOGIC & VALIDATION
 * Candidate: Jerome Jimmy (STM23CS023)
 * Affiliation: APJ Abdul Kalam Technological University (KTU)
 * College: St. Thomas College of Engineering and Technology, Mattanur
 * ==========================================================================
 */

// KTU Course Grade Points Mapping
const KTU_GRADE_POINTS = {
  'S': 10.0,
  'A+': 9.0,
  'A': 8.5,
  'B+': 8.0,
  'B': 7.5,
  'C+': 7.0,
  'C': 6.5,
  'D': 6.0,
  'P': 5.5,
  'F': 0.0,
  'FE': 0.0,
  'I': 0.0
};

// Complete Academic Course Database from KTU Semester Grade Sheets S1 to S6
const ACADEMIC_COURSES = [
  // Semester 1 (Dec 2023) - GC/2023/01/S1/7283
  { sem: 'S1', code: 'MAT101', name: 'Linear Algebra and Calculus', type: 'Theory', credits: 4.0, grade: 'C', session: 'Dec 2023', certNo: 'GC/2023/01/S1/7283' },
  { sem: 'S1', code: 'CYT100', name: 'Engineering Chemistry', type: 'Theory', credits: 4.0, grade: 'D', session: 'Dec 2023', certNo: 'GC/2023/01/S1/7283' },
  { sem: 'S1', code: 'EST100', name: 'Engineering Mechanics', type: 'Theory', credits: 3.0, grade: 'C+', session: 'Dec 2023', certNo: 'GC/2023/01/S1/7283' },
  { sem: 'S1', code: 'EST120', name: 'Basics of Civil and Mechanical Engineering', type: 'Theory', credits: 4.0, grade: 'B', session: 'Dec 2023', certNo: 'GC/2023/01/S1/7283' },
  { sem: 'S1', code: 'HUN101', name: 'Life Skills', type: 'Theory', credits: 0.0, grade: 'P', session: 'Dec 2023', certNo: 'GC/2023/01/S1/7283' },
  { sem: 'S1', code: 'CYL120', name: 'Engineering Chemistry Lab', type: 'Lab', credits: 1.0, grade: 'A+', session: 'Dec 2023', certNo: 'GC/2023/01/S1/7283' },
  { sem: 'S1', code: 'ESL120', name: 'Civil and Mechanical Workshop', type: 'Practical', credits: 1.0, grade: 'S', session: 'Dec 2023', certNo: 'GC/2023/01/S1/7283' },

  // Semester 2 (May 2024) - GC/2024/02/S2/17773
  { sem: 'S2', code: 'MAT102', name: 'Vector Calculus, Differential Equations and Transforms', type: 'Theory', credits: 4.0, grade: 'P', session: 'May 2024', certNo: 'GC/2024/02/S2/17773' },
  { sem: 'S2', code: 'PHT100', name: 'Engineering Physics A', type: 'Theory', credits: 4.0, grade: 'D', session: 'May 2024', certNo: 'GC/2024/02/S2/17773' },
  { sem: 'S2', code: 'EST110', name: 'Engineering Graphics', type: 'Theory', credits: 3.0, grade: 'A', session: 'May 2024', certNo: 'GC/2024/02/S2/17773' },
  { sem: 'S2', code: 'EST130', name: 'Basics of Electrical and Electronics Engineering', type: 'Theory', credits: 4.0, grade: 'P', session: 'May 2024', certNo: 'GC/2024/02/S2/17773' },
  { sem: 'S2', code: 'HUN102', name: 'Professional Communication', type: 'Theory', credits: 0.0, grade: 'P', session: 'May 2024', certNo: 'GC/2024/02/S2/17773' },
  { sem: 'S2', code: 'EST102', name: 'Programming in C', type: 'Theory', credits: 4.0, grade: 'P', session: 'May 2024', certNo: 'GC/2024/02/S2/17773' },
  { sem: 'S2', code: 'PHL120', name: 'Engineering Physics Lab', type: 'Lab', credits: 1.0, grade: 'B+', session: 'May 2024', certNo: 'GC/2024/02/S2/17773' },
  { sem: 'S2', code: 'ESL130', name: 'Electrical and Electronics Workshop', type: 'Practical', credits: 1.0, grade: 'A', session: 'May 2024', certNo: 'GC/2024/02/S2/17773' },

  // Semester 3 (Nov 2024) - GC/2024/03/S3/3146
  { sem: 'S3', code: 'MAT203', name: 'Discrete Mathematical Structures', type: 'Theory', credits: 4.0, grade: 'C', session: 'Nov 2024', certNo: 'GC/2024/03/S3/3146' },
  { sem: 'S3', code: 'CST201', name: 'Data Structures', type: 'Theory', credits: 4.0, grade: 'P', session: 'Nov 2024', certNo: 'GC/2024/03/S3/3146' },
  { sem: 'S3', code: 'CST203', name: 'Logic System Design', type: 'Theory', credits: 4.0, grade: 'D', session: 'Nov 2024', certNo: 'GC/2024/03/S3/3146' },
  { sem: 'S3', code: 'CST205', name: 'Object Oriented Programming Using Java', type: 'Theory', credits: 4.0, grade: 'P', session: 'Nov 2024', certNo: 'GC/2024/03/S3/3146' },
  { sem: 'S3', code: 'EST200', name: 'Design and Engineering', type: 'Theory', credits: 2.0, grade: 'A+', session: 'Nov 2024', certNo: 'GC/2024/03/S3/3146' },
  { sem: 'S3', code: 'MCN201', name: 'Sustainable Engineering', type: 'Audit', credits: 0.0, grade: 'C', session: 'Nov 2024', certNo: 'GC/2024/03/S3/3146' },
  { sem: 'S3', code: 'CSL201', name: 'Data Structures Lab', type: 'Lab', credits: 2.0, grade: 'C', session: 'Nov 2024', certNo: 'GC/2024/03/S3/3146' },
  { sem: 'S3', code: 'CSL203', name: 'Object Oriented Programming Lab (in Java)', type: 'Lab', credits: 2.0, grade: 'B+', session: 'Nov 2024', certNo: 'GC/2024/03/S3/3146' },

  // Semester 4 (Apr 2025) - GC/2025/04/S4/6126
  { sem: 'S4', code: 'MAT206', name: 'Graph Theory', type: 'Theory', credits: 4.0, grade: 'B', session: 'Apr 2025', certNo: 'GC/2025/04/S4/6126' },
  { sem: 'S4', code: 'CST202', name: 'Computer Organisation and Architecture', type: 'Theory', credits: 4.0, grade: 'P', session: 'Apr 2025', certNo: 'GC/2025/04/S4/6126' },
  { sem: 'S4', code: 'CST204', name: 'Database Management Systems', type: 'Theory', credits: 4.0, grade: 'D', session: 'Apr 2025', certNo: 'GC/2025/04/S4/6126' },
  { sem: 'S4', code: 'CST206', name: 'Operating Systems', type: 'Theory', credits: 4.0, grade: 'C+', session: 'Apr 2025', certNo: 'GC/2025/04/S4/6126' },
  { sem: 'S4', code: 'HUT200', name: 'Professional Ethics', type: 'Theory', credits: 2.0, grade: 'B', session: 'Apr 2025', certNo: 'GC/2025/04/S4/6126' },
  { sem: 'S4', code: 'MCN202', name: 'Constitution of India', type: 'Audit', credits: 0.0, grade: 'B', session: 'Apr 2025', certNo: 'GC/2025/04/S4/6126' },
  { sem: 'S4', code: 'CSL202', name: 'Digital Lab', type: 'Lab', credits: 2.0, grade: 'B+', session: 'Apr 2025', certNo: 'GC/2025/04/S4/6126' },
  { sem: 'S4', code: 'CSL204', name: 'Operating Systems Lab', type: 'Lab', credits: 2.0, grade: 'B', session: 'Apr 2025', certNo: 'GC/2025/04/S4/6126' },

  // Semester 5 (Nov 2025) - GC/2025/05/S5/13821
  { sem: 'S5', code: 'CST301', name: 'Formal Languages and Automata Theory', type: 'Theory', credits: 4.0, grade: 'P', session: 'Nov 2025', certNo: 'GC/2025/05/S5/13821' },
  { sem: 'S5', code: 'CST303', name: 'Computer Networks', type: 'Theory', credits: 4.0, grade: 'P', session: 'Nov 2025', certNo: 'GC/2025/05/S5/13821' },
  { sem: 'S5', code: 'CST305', name: 'System Software', type: 'Theory', credits: 4.0, grade: 'B', session: 'Nov 2025', certNo: 'GC/2025/05/S5/13821' },
  { sem: 'S5', code: 'CST307', name: 'Microprocessors and Microcontrollers', type: 'Theory', credits: 4.0, grade: 'P', session: 'Nov 2025', certNo: 'GC/2025/05/S5/13821' },
  { sem: 'S5', code: 'CST309', name: 'Management of Software Systems', type: 'Theory', credits: 3.0, grade: 'D', session: 'Nov 2025', certNo: 'GC/2025/05/S5/13821' },
  { sem: 'S5', code: 'MCN301', name: 'Disaster Management', type: 'Audit', credits: 0.0, grade: 'B', session: 'Nov 2025', certNo: 'GC/2025/05/S5/13821' },
  { sem: 'S5', code: 'CSL331', name: 'System Software and Microprocessors Lab', type: 'Lab', credits: 2.0, grade: 'A+', session: 'Nov 2025', certNo: 'GC/2025/05/S5/13821' },
  { sem: 'S5', code: 'CSL333', name: 'Database Management Systems Lab', type: 'Lab', credits: 2.0, grade: 'B', session: 'Nov 2025', certNo: 'GC/2025/05/S5/13821' },

  // Semester 6 (Apr 2026) - GC/2026/06/S6/3189
  { sem: 'S6', code: 'CST302', name: 'Compiler Design', type: 'Theory', credits: 4.0, grade: 'D', session: 'Apr 2026', certNo: 'GC/2026/06/S6/3189' },
  { sem: 'S6', code: 'CST304', name: 'Computer Graphics and Image Processing', type: 'Theory', credits: 4.0, grade: 'D', session: 'Apr 2026', certNo: 'GC/2026/06/S6/3189' },
  { sem: 'S6', code: 'CST306', name: 'Algorithm Analysis and Design', type: 'Theory', credits: 4.0, grade: 'D', session: 'Apr 2026', certNo: 'GC/2026/06/S6/3189' },
  { sem: 'S6', code: 'CST362', name: 'Programming in Python', type: 'Theory', credits: 3.0, grade: 'C', session: 'Apr 2026', certNo: 'GC/2026/06/S6/3189' },
  { sem: 'S6', code: 'HUT300', name: 'Industrial Economics and Foreign Trade', type: 'Theory', credits: 3.0, grade: 'C+', session: 'Apr 2026', certNo: 'GC/2026/06/S6/3189' },
  { sem: 'S6', code: 'CST308', name: 'Comprehensive Course Work', type: 'Theory', credits: 1.0, grade: 'B', session: 'Apr 2026', certNo: 'GC/2026/06/S6/3189' },
  { sem: 'S6', code: 'CSL332', name: 'Networking Lab', type: 'Lab', credits: 2.0, grade: 'B', session: 'Apr 2026', certNo: 'GC/2026/06/S6/3189' },
  { sem: 'S6', code: 'CSD334', name: 'Miniproject', type: 'Project', credits: 2.0, grade: 'S', session: 'Apr 2026', certNo: 'GC/2026/06/S6/3189' }
];

// Initial State and Form Management
let isEditMode = false;
let currentTheme = localStorage.getItem('theme') || 'light';

// DOM Elements
const docRoot = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggleBtn');
const liveClockEl = document.getElementById('liveClock');
const quickEditBtn = document.getElementById('quickEditBtn');
const editBtnText = document.getElementById('editBtnText');
const printProfileBtn = document.getElementById('printProfileBtn');
const studentProfileForm = document.getElementById('studentProfileForm');
const formStatusBadge = document.getElementById('formStatusBadge');
const submitFormBtn = document.getElementById('submitFormBtn');
const resetFormBtn = document.getElementById('resetFormBtn');
const downloadSummaryBtn = document.getElementById('downloadSummaryBtn');
const photoUploadInput = document.getElementById('photoUploadInput');
const profileImageDisplay = document.getElementById('profileImageDisplay');
const alertBanner = document.getElementById('alertBanner');
const alertMessage = document.getElementById('alertMessage');
const alertCloseBtn = document.getElementById('alertCloseBtn');

// Table DOM elements
const courseTableBody = document.getElementById('courseTableBody');
const semesterFilterSelect = document.getElementById('semesterFilterSelect');
const courseSearchInput = document.getElementById('courseSearchInput');
const tableRecordCount = document.getElementById('tableRecordCount');

// Modal Elements
const calculatorModal = document.getElementById('calculatorModal');
const openCalculatorBtn = document.getElementById('openCalculatorBtn');
const closeCalculatorModalBtn = document.getElementById('closeCalculatorModalBtn');
const calcCoursesList = document.getElementById('calcCoursesList');
const addCalcRowBtn = document.getElementById('addCalcRowBtn');
const resetCalcBtn = document.getElementById('resetCalcBtn');
const applyCalcBtn = document.getElementById('applyCalcBtn');
const calcTotalCredits = document.getElementById('calcTotalCredits');
const calcEstimatedSgpa = document.getElementById('calcEstimatedSgpa');
const calcForecastCgpa = document.getElementById('calcForecastCgpa');

const successModal = document.getElementById('successModal');
const closeSuccessModalBtn = document.getElementById('successModal') ? document.getElementById('closeSuccessModalBtn') : null;
const modalSummaryPreview = document.getElementById('modalSummaryPreview');

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLiveClock();
  renderCourseTable(ACADEMIC_COURSES);
  attachEventListeners();
  initCalculatorModal();
});

// ==========================================================================
// THEME MANAGEMENT (DARK / LIGHT)
// ==========================================================================
function initTheme() {
  docRoot.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = themeToggleBtn.querySelector('i');
  if (currentTheme === 'dark') {
    icon.className = 'fa-solid fa-sun';
    themeToggleBtn.title = 'Switch to Light Theme';
  } else {
    icon.className = 'fa-solid fa-moon';
    themeToggleBtn.title = 'Switch to Dark Theme';
  }
}

themeToggleBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  docRoot.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateThemeIcon();
  showAlert(`Switched to ${currentTheme} theme`, 'success');
});

// ==========================================================================
// LIVE SYSTEM CLOCK
// ==========================================================================
function initLiveClock() {
  function updateTime() {
    const now = new Date();
    const options = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    };
    liveClockEl.querySelector('span').textContent = now.toLocaleString('en-IN', options);
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// ==========================================================================
// ALERT BANNER HELPER
// ==========================================================================
function showAlert(message, type = 'success') {
  alertMessage.textContent = message;
  alertBanner.className = `alert-banner ${type === 'error' ? 'error' : ''}`;
  alertBanner.classList.remove('hidden');

  const icon = alertBanner.querySelector('.alert-icon i');
  icon.className = type === 'error' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';

  setTimeout(() => {
    alertBanner.classList.add('hidden');
  }, 4500);
}

alertCloseBtn.addEventListener('click', () => {
  alertBanner.classList.add('hidden');
});

// ==========================================================================
// EDIT MODE TOGGLE & FORM ACCESSIBILITY
// ==========================================================================
quickEditBtn.addEventListener('click', () => {
  toggleEditMode();
});

function toggleEditMode(forceState = null) {
  isEditMode = forceState !== null ? forceState : !isEditMode;

  const textInputs = studentProfileForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], textarea');
  const selects = studentProfileForm.querySelectorAll('select');
  const radioInputs = studentProfileForm.querySelectorAll('input[type="radio"]');
  const checkInputs = studentProfileForm.querySelectorAll('input[type="checkbox"]');

  if (isEditMode) {
    // Enable fields for editing
    textInputs.forEach(input => input.removeAttribute('readonly'));
    selects.forEach(select => select.removeAttribute('disabled'));
    radioInputs.forEach(radio => radio.removeAttribute('disabled'));
    checkInputs.forEach(chk => chk.removeAttribute('disabled'));

    submitFormBtn.removeAttribute('disabled');
    resetFormBtn.removeAttribute('disabled');

    editBtnText.textContent = 'Lock Profile';
    quickEditBtn.querySelector('i').className = 'fa-solid fa-lock';
    formStatusBadge.innerHTML = '<i class="fa-solid fa-pen-nib"></i> Edit Mode Active';
    formStatusBadge.classList.add('editing');

    showAlert('Edit mode enabled. You can now modify profile details and skills.', 'success');
  } else {
    // Lock fields
    textInputs.forEach(input => input.setAttribute('readonly', 'true'));
    selects.forEach(select => select.setAttribute('disabled', 'true'));
    radioInputs.forEach(radio => radio.setAttribute('disabled', 'true'));
    checkInputs.forEach(chk => chk.setAttribute('disabled', 'true'));

    submitFormBtn.setAttribute('disabled', 'true');
    resetFormBtn.setAttribute('disabled', 'true');

    editBtnText.textContent = 'Edit Profile';
    quickEditBtn.querySelector('i').className = 'fa-solid fa-pen-to-square';
    formStatusBadge.innerHTML = '<i class="fa-solid fa-lock"></i> Locked View';
    formStatusBadge.classList.remove('editing');
  }
}

// ==========================================================================
// PHOTO UPLOAD WITH INSTANT LIVE PREVIEW
// ==========================================================================
photoUploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showAlert('Please upload a valid image file (PNG, JPG, JPEG, WEBP)', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    profileImageDisplay.src = event.target.result;
    showAlert('Student photo updated successfully!', 'success');
  };
  reader.readAsDataURL(file);
});

// ==========================================================================
// FORM VALIDATION & SUBMISSION
// ==========================================================================
studentProfileForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) {
    showAlert('Please correct the validation errors in the form before submitting.', 'error');
    return;
  }

  // Update Hero values live
  const fullName = document.getElementById('fullNameInput').value.trim();
  const regNo = document.getElementById('regNoInput').value.trim();
  const bloodGroup = document.getElementById('bloodGroupSelect').value;
  const selectedGenderRadio = document.querySelector('input[name="gender"]:checked');
  const gender = selectedGenderRadio ? selectedGenderRadio.value : 'Male';

  document.getElementById('heroStudentName').textContent = fullName;
  document.getElementById('heroRegNo').textContent = regNo;
  document.getElementById('heroBloodGroup').textContent = bloodGroup || 'O+';
  document.getElementById('heroGender').textContent = gender;

  // Build Summary preview
  const primaryCompany = document.getElementById('primaryCompanySelect').value;
  const selectedCompanies = Array.from(document.querySelectorAll('input[name="interestedCompanies"]:checked')).map(c => c.value);
  const selectedSkills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(s => s.value);
  const selectedActivities = Array.from(document.querySelectorAll('input[name="activities"]:checked')).map(a => a.value);

  if (modalSummaryPreview) {
    modalSummaryPreview.innerHTML = `
      <p><strong>Student Name:</strong> ${fullName} (${regNo})</p>
      <p><strong>Gender / Blood:</strong> ${gender} | ${bloodGroup}</p>
      <p><strong>Target Recruiter:</strong> ${primaryCompany}</p>
      <p><strong>Interested Companies:</strong> ${selectedCompanies.join(', ') || 'None selected'}</p>
      <p><strong>Selected Skills Count:</strong> ${selectedSkills.length} competencies selected</p>
      <p><strong>Extracurriculars:</strong> ${selectedActivities.length} activities active</p>
      <p><strong>Academic CGPA:</strong> 6.60 (128 Credits Earned &bull; KTU S1-S6)</p>
    `;
  }

  // Lock back to view mode
  toggleEditMode(false);

  // Show Success Modal
  if (successModal) {
    successModal.classList.remove('hidden');
  } else {
    showAlert('Profile details saved and updated successfully!', 'success');
  }
});

function validateForm() {
  let isValid = true;

  // Name Validation
  const fullNameInput = document.getElementById('fullNameInput');
  const fullNameError = document.getElementById('fullNameError');
  if (!fullNameInput.value.trim() || fullNameInput.value.trim().length < 3) {
    fullNameError.textContent = 'Name must be at least 3 characters.';
    fullNameInput.classList.add('invalid');
    isValid = false;
  } else {
    fullNameError.textContent = '';
    fullNameInput.classList.remove('invalid');
  }

  // Register Number Validation
  const regNoInput = document.getElementById('regNoInput');
  const regNoError = document.getElementById('regNoError');
  const regRegex = /^[A-Z0-9]{8,15}$/i;
  if (!regNoInput.value.trim() || !regRegex.test(regNoInput.value.trim())) {
    regNoError.textContent = 'Enter a valid KTU Register Number (e.g. STM23CS023).';
    regNoInput.classList.add('invalid');
    isValid = false;
  } else {
    regNoError.textContent = '';
    regNoInput.classList.remove('invalid');
  }

  // Email Validation
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
    emailError.textContent = 'Please enter a valid email address.';
    emailInput.classList.add('invalid');
    isValid = false;
  } else {
    emailError.textContent = '';
    emailInput.classList.remove('invalid');
  }

  // Phone Validation
  const phoneInput = document.getElementById('phoneInput');
  const phoneError = document.getElementById('phoneError');
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.replace(/\s+/g, ''))) {
    phoneError.textContent = 'Enter a valid 10-digit phone number.';
    phoneInput.classList.add('invalid');
    isValid = false;
  } else {
    phoneError.textContent = '';
    phoneInput.classList.remove('invalid');
  }

  // Blood Group Validation
  const bloodGroupSelect = document.getElementById('bloodGroupSelect');
  const bloodGroupError = document.getElementById('bloodGroupError');
  if (!bloodGroupSelect.value) {
    bloodGroupError.textContent = 'Please select a blood group.';
    bloodGroupSelect.classList.add('invalid');
    isValid = false;
  } else {
    bloodGroupError.textContent = '';
    bloodGroupSelect.classList.remove('invalid');
  }

  // Primary Company Validation
  const primaryCompanySelect = document.getElementById('primaryCompanySelect');
  const primaryCompanyError = document.getElementById('primaryCompanyError');
  if (!primaryCompanySelect.value) {
    primaryCompanyError.textContent = 'Please select your dream / target company.';
    primaryCompanySelect.classList.add('invalid');
    isValid = false;
  } else {
    primaryCompanyError.textContent = '';
    primaryCompanySelect.classList.remove('invalid');
  }

  return isValid;
}

if (closeSuccessModalBtn) {
  closeSuccessModalBtn.addEventListener('click', () => {
    successModal.classList.add('hidden');
    showAlert('Student Profile updated successfully!', 'success');
  });
}

// Reset Form Event
resetFormBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset all form entries to Jerome Jimmy\'s authenticated default record?')) {
    studentProfileForm.reset();
    profileImageDisplay.src = 'assets/jerome_photo.jpg';
    showAlert('Profile data has been reset to default.', 'success');
  }
});

// ==========================================================================
// EXPORT & PRINT HANDLERS
// ==========================================================================
printProfileBtn.addEventListener('click', () => {
  window.print();
});

downloadSummaryBtn.addEventListener('click', () => {
  const profileData = {
    candidate: {
      fullName: document.getElementById('fullNameInput').value.trim(),
      registerNumber: document.getElementById('regNoInput').value.trim(),
      dateOfBirth: document.getElementById('dobInput').value,
      gender: document.querySelector('input[name="gender"]:checked')?.value || 'Male',
      bloodGroup: document.getElementById('bloodGroupSelect').value,
      email: document.getElementById('emailInput').value.trim(),
      phone: document.getElementById('phoneInput').value.trim(),
      college: document.getElementById('collegeNameInput').value.trim(),
      address: document.getElementById('addressInput').value.trim()
    },
    careerPreferences: {
      targetCompany: document.getElementById('primaryCompanySelect').value,
      interestedCompanies: Array.from(document.querySelectorAll('input[name="interestedCompanies"]:checked')).map(c => c.value)
    },
    skills: Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(s => s.value),
    extracurriculars: Array.from(document.querySelectorAll('input[name="activities"]:checked')).map(a => a.value),
    academicPerformance: {
      totalCreditsEarned: 128,
      cumulativeCGPA: 6.60,
      classification: "First Class",
      semesterSummary: [
        { sem: 'S1', credits: 17, sgpa: 7.06, certNo: 'GC/2023/01/S1/7283' },
        { sem: 'S2', credits: 21, sgpa: 6.29, certNo: 'GC/2024/02/S2/17773' },
        { sem: 'S3', credits: 22, sgpa: 6.41, certNo: 'GC/2024/03/S3/3146' },
        { sem: 'S4', credits: 22, sgpa: 6.82, certNo: 'GC/2025/04/S4/6126' },
        { sem: 'S5', credits: 23, sgpa: 6.39, certNo: 'GC/2025/05/S5/13821' },
        { sem: 'S6', credits: 23, sgpa: 6.74, certNo: 'GC/2026/06/S6/3189' }
      ],
      courses: ACADEMIC_COURSES
    },
    exportTimestamp: new Date().toISOString()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profileData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `KTU_Student_Profile_${profileData.candidate.registerNumber}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showAlert('Student Academic Dossier downloaded as JSON.', 'success');
});

// ==========================================================================
// ACADEMIC COURSE TABLE RENDERING & FILTERING
// ==========================================================================
function renderCourseTable(courses) {
  courseTableBody.innerHTML = '';

  if (courses.length === 0) {
    courseTableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
          No courses matching your filter criteria.
        </td>
      </tr>
    `;
    tableRecordCount.textContent = 'Showing 0 courses';
    return;
  }

  courses.forEach(course => {
    const tr = document.createElement('tr');
    const gradePoint = KTU_GRADE_POINTS[course.grade] || 0.0;
    const gradeClass = `grade-${course.grade.replace('+', '-plus')}`;

    tr.innerHTML = `
      <td><span class="sem-tag">${course.sem}</span></td>
      <td><code>${course.code}</code></td>
      <td><strong>${course.name}</strong></td>
      <td><span class="badge-mini">${course.type}</span></td>
      <td>${course.credits.toFixed(1)}</td>
      <td><span class="grade-badge ${gradeClass}">${course.grade}</span></td>
      <td>${gradePoint.toFixed(1)}</td>
      <td><span class="cert-code">${course.session}</span></td>
      <td><span class="status-pass"><i class="fa-solid fa-check"></i> Pass</span></td>
    `;
    courseTableBody.appendChild(tr);
  });

  tableRecordCount.textContent = `Showing ${courses.length} of ${ACADEMIC_COURSES.length} courses`;
}

function filterCourses() {
  const selectedSem = semesterFilterSelect.value;
  const searchQuery = courseSearchInput.value.toLowerCase().trim();

  let filtered = ACADEMIC_COURSES;

  if (selectedSem !== 'ALL') {
    filtered = filtered.filter(c => c.sem === selectedSem);
  }

  if (searchQuery) {
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(searchQuery) ||
      c.code.toLowerCase().includes(searchQuery) ||
      c.grade.toLowerCase().includes(searchQuery) ||
      c.type.toLowerCase().includes(searchQuery)
    );
  }

  renderCourseTable(filtered);
}

semesterFilterSelect.addEventListener('change', filterCourses);
courseSearchInput.addEventListener('input', filterCourses);

// ==========================================================================
// INTERACTIVE GPA ESTIMATOR & MODAL
// ==========================================================================
function initCalculatorModal() {
  openCalculatorBtn.addEventListener('click', () => {
    calculatorModal.classList.remove('hidden');
    renderSampleCalcRows();
    calculateEstimatedGpa();
  });

  closeCalculatorModalBtn.addEventListener('click', () => {
    calculatorModal.classList.add('hidden');
  });

  calculatorModal.addEventListener('click', (e) => {
    if (e.target === calculatorModal) {
      calculatorModal.classList.add('hidden');
    }
  });

  addCalcRowBtn.addEventListener('click', () => {
    addCourseRowToCalc('Elective / New Subject', 3.0, 'B+');
    calculateEstimatedGpa();
  });

  resetCalcBtn.addEventListener('click', () => {
    renderSampleCalcRows();
    calculateEstimatedGpa();
  });

  applyCalcBtn.addEventListener('click', () => {
    calculateEstimatedGpa();
    showAlert('SGPA and Cumulative CGPA Forecast calculated successfully!', 'success');
  });
}

function renderSampleCalcRows() {
  calcCoursesList.innerHTML = '';
  const sampleCourses = [
    { name: 'Machine Learning & AI', credits: 4.0, grade: 'A' },
    { name: 'Cloud Computing & DevOps', credits: 4.0, grade: 'A+' },
    { name: 'Cyber Security & Cryptography', credits: 3.0, grade: 'B+' },
    { name: 'Mobile App Development Lab', credits: 2.0, grade: 'S' },
    { name: 'Industrial Internship / Project', credits: 4.0, grade: 'A+' }
  ];

  sampleCourses.forEach(c => {
    addCourseRowToCalc(c.name, c.credits, c.grade);
  });
}

function addCourseRowToCalc(name, credits, grade) {
  const row = document.createElement('div');
  row.className = 'calc-course-row';
  row.innerHTML = `
    <input type="text" class="form-control calc-name" value="${name}" placeholder="Course title">
    <input type="number" step="0.5" min="0" max="6" class="form-control calc-credits" value="${credits}">
    <select class="form-control calc-grade">
      <option value="S" ${grade === 'S' ? 'selected' : ''}>S (10 pts)</option>
      <option value="A+" ${grade === 'A+' ? 'selected' : ''}>A+ (9 pts)</option>
      <option value="A" ${grade === 'A' ? 'selected' : ''}>A (8.5 pts)</option>
      <option value="B+" ${grade === 'B+' ? 'selected' : ''}>B+ (8 pts)</option>
      <option value="B" ${grade === 'B' ? 'selected' : ''}>B (7.5 pts)</option>
      <option value="C+" ${grade === 'C+' ? 'selected' : ''}>C+ (7 pts)</option>
      <option value="C" ${grade === 'C' ? 'selected' : ''}>C (6.5 pts)</option>
      <option value="D" ${grade === 'D' ? 'selected' : ''}>D (6 pts)</option>
      <option value="P" ${grade === 'P' ? 'selected' : ''}>P (5.5 pts)</option>
    </select>
    <button type="button" class="calc-delete-row-btn" title="Remove course row"><i class="fa-solid fa-trash-can"></i></button>
  `;

  row.querySelector('.calc-delete-row-btn').addEventListener('click', () => {
    row.remove();
    calculateEstimatedGpa();
  });

  row.querySelectorAll('input, select').forEach(elem => {
    elem.addEventListener('input', calculateEstimatedGpa);
    elem.addEventListener('change', calculateEstimatedGpa);
  });

  calcCoursesList.appendChild(row);
}

function calculateEstimatedGpa() {
  const rows = calcCoursesList.querySelectorAll('.calc-course-row');
  let totalCredits = 0;
  let totalPoints = 0;

  rows.forEach(row => {
    const credits = parseFloat(row.querySelector('.calc-credits').value) || 0;
    const grade = row.querySelector('.calc-grade').value;
    const gradePoint = KTU_GRADE_POINTS[grade] || 0;

    totalCredits += credits;
    totalPoints += (credits * gradePoint);
  });

  const estimatedSgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  calcTotalCredits.textContent = totalCredits.toFixed(1);
  calcEstimatedSgpa.textContent = estimatedSgpa;

  // Forecast New Cumulative CGPA incorporating previous 128 credits with 845.16 points
  const prevPoints = 845.16;
  const prevCredits = 128.0;
  const newCumulativeCredits = prevCredits + totalCredits;
  const newCumulativePoints = prevPoints + totalPoints;
  const forecastCgpa = newCumulativeCredits > 0 ? (newCumulativePoints / newCumulativeCredits).toFixed(2) : '6.60';

  calcForecastCgpa.textContent = forecastCgpa;
}

// ==========================================================================
// GENERAL EVENT ATTACHMENTS
// ==========================================================================
function attachEventListeners() {
  // Add interactive click to chart bars
  const barItems = document.querySelectorAll('.chart-bar-item');
  barItems.forEach(bar => {
    bar.addEventListener('click', () => {
      const sem = bar.getAttribute('data-sem');
      const sgpa = bar.getAttribute('data-sgpa');
      semesterFilterSelect.value = sem;
      filterCourses();
      showAlert(`Filtered view for ${sem} (SGPA: ${sgpa})`, 'success');
      
      // Scroll to course table smoothly
      document.querySelector('.courses-table').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}
