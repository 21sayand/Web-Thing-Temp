/**
 * St Thomas College of Engineering and Technology, Kannur
 * Student Academic & Placement Portal - Core JavaScript
 *
 * Features:
 * - Real-time form validation with accessible error messaging
 * - Photo upload, crop & live preview across form, banner and dossier
 * - Live sync between form controls and the academic dossier
 * - Dynamic skill / activity tags
 * - Internal marks table with automatic totals & averages
 * - Reset confirmation modal, toast notifications, print export
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Default Student Data ---
  const defaultStudentData = {
    fullName: "Fathimath Sahdiya C",
    registerNo: "STM23CS015",
    rollNo: "14",
    dob: "2006-03-01",
    email: "fathimathsahdiyac11@gmail.com",
    phone: "9744931493",
    degree: "BTech in Computer Science and Engineering",
    branch: "CSE",
    gender: "Female",
    bloodGroup: "B+",
    primaryCompany: "Oracle",
    secondaryCompany: "Infosys",
    skills: [
      "Python", "Java", "C / C++", "Web Development",
      "SQL & Databases", "Data Structures & Algorithms",
    ],
    activities: ["Sports & Athletics", "Cultural & Arts Club"]
  };

  const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23E2E8F0'/%3E%3Ccircle cx='60' cy='46' r='24' fill='%2394A3B8'/%3E%3Cpath d='M24 104 C24 78, 40 70, 60 70 C80 70, 96 78, 96 104 Z' fill='%2394A3B8'/%3E%3C/svg%3E";

  // --- 2. DOM Elements ---
  const form = document.getElementById('studentProfileForm');
  const photoInput = document.getElementById('studentPhoto');
  const resetPhotoBtn = document.getElementById('resetPhotoBtn');
  const formPhotoPreview = document.getElementById('formPhotoPreview');
  const bannerPhoto = document.getElementById('bannerPhoto');
  const dossierPhoto = document.getElementById('dossierPhoto');

  const fullNameInput = document.getElementById('fullName');
  const registerNoInput = document.getElementById('registerNo');
  const rollNoInput = document.getElementById('rollNo');
  const dobInput = document.getElementById('dob');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const degreeInput = document.getElementById('degree');
  const branchInput = document.getElementById('branch');
  const bloodGroupSelect = document.getElementById('bloodGroup');
  const primaryCompanySelect = document.getElementById('primaryCompany');
  const secondaryCompanySelect = document.getElementById('secondaryCompany');

  const bannerName = document.getElementById('bannerName');
  const bannerRegNo = document.getElementById('bannerRegNo');
  const bannerRollNo = document.getElementById('bannerRollNo');
  const bannerDegree = document.getElementById('bannerDegree');
  const bannerBranch = document.getElementById('bannerBranch');

  const dossierName = document.getElementById('dossierName');
  const dossierRegNo = document.getElementById('dossierRegNo');
  const dossierRollNo = document.getElementById('dossierRollNo');
  const dossierDegree = document.getElementById('dossierDegree');
  const dossierBranch = document.getElementById('dossierBranch');
  const dossierDob = document.getElementById('dossierDob');
  const dossierGender = document.getElementById('dossierGender');
  const dossierBloodGroup = document.getElementById('dossierBloodGroup');
  const dossierBloodBadge = document.getElementById('dossierBloodBadge');
  const dossierEmail = document.getElementById('dossierEmail');
  const dossierPhone = document.getElementById('dossierPhone');
  const dossierTargetCompany = document.getElementById('dossierTargetCompany');
  const dossierAltCompany = document.getElementById('dossierAltCompany');
  const dossierSkillsList = document.getElementById('dossierSkillsList');
  const dossierActivitiesList = document.getElementById('dossierActivitiesList');

  const nameError = document.getElementById('nameError');
  const regError = document.getElementById('regError');
  const rollError = document.getElementById('rollError');
  const dobError = document.getElementById('dobError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');

  const printBtn = document.getElementById('printBtn');
  const loadDefaultsBtn = document.getElementById('loadDefaultsBtn');
  const resetConfirmModal = document.getElementById('resetConfirmModal');
  const confirmResetBtn = document.getElementById('confirmResetBtn');
  const cancelResetBtn = document.getElementById('cancelResetBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');

  // Crop modal
  const cropCurrentPhotoBtn = document.getElementById('cropCurrentPhotoBtn');
  const photoCropModal = document.getElementById('photoCropModal');
  const closeCropModalBtn = document.getElementById('closeCropModalBtn');
  const cancelCropBtn = document.getElementById('cancelCropBtn');
  const applyCropBtn = document.getElementById('applyCropBtn');
  const cropCanvas = document.getElementById('cropCanvas');
  const cropCanvasCtx = cropCanvas ? cropCanvas.getContext('2d') : null;
  const cropZoomRange = document.getElementById('cropZoomRange');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const rotateLeftBtn = document.getElementById('rotateLeftBtn');
  const rotateRightBtn = document.getElementById('rotateRightBtn');
  const centerCropBtn = document.getElementById('centerCropBtn');
  const livePreviewSquare = document.getElementById('livePreviewSquare');
  const sqPreviewCtx = livePreviewSquare ? livePreviewSquare.getContext('2d') : null;
  const livePreviewCircle = document.getElementById('livePreviewCircle');
  const circPreviewCtx = livePreviewCircle ? livePreviewCircle.getContext('2d') : null;

  let currentPhotoData = DEFAULT_AVATAR;
  let rawUploadedPhoto = null;
  const cropImage = new Image();
  let baseScale = 1;

  const cropState = {
    zoom: 1, minZoom: 0.5, maxZoom: 3, panX: 0, panY: 0, rotation: 0,
    isDragging: false, startX: 0, startY: 0
  };

  // --- 3. Toast ---
  let toastTimer = null;
  function showToast(message, isSuccess = true) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMsg.textContent = message;
    toastNotification.className = 'toast show';
    const toastIcon = document.getElementById('toastIcon');
    if (toastIcon) {
      toastIcon.textContent = isSuccess ? '✓' : '!';
      toastIcon.style.backgroundColor = isSuccess ? '#22c55e' : '#eab308';
    }
    toastTimer = setTimeout(() => { toastNotification.className = 'toast'; }, 3500);
  }

  // --- 4. Photo Upload, Crop & Preview ---
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Selected photograph exceeds 2 MB. Please select a smaller photo.");
      photoInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      rawUploadedPhoto = event.target.result;
      openCropModal(rawUploadedPhoto);
    };
    reader.readAsDataURL(file);
  });

  if (cropCurrentPhotoBtn) {
    cropCurrentPhotoBtn.addEventListener('click', () => {
      const srcToCrop = rawUploadedPhoto || (currentPhotoData !== DEFAULT_AVATAR ? currentPhotoData : null);
      if (srcToCrop) openCropModal(srcToCrop);
    });
  }

  function openCropModal(imageSrc) {
    cropImage.onload = () => {
      const canvasDim = 320;
      baseScale = Math.max(canvasDim / cropImage.width, canvasDim / cropImage.height);
      cropState.zoom = baseScale;
      cropState.minZoom = baseScale * 0.7;
      cropState.maxZoom = baseScale * 3.5;
      cropState.panX = 0;
      cropState.panY = 0;
      cropState.rotation = 0;

      if (cropZoomRange) {
        cropZoomRange.min = cropState.minZoom.toFixed(3);
        cropZoomRange.max = cropState.maxZoom.toFixed(3);
        cropZoomRange.step = ((cropState.maxZoom - cropState.minZoom) / 100).toFixed(4);
        cropZoomRange.value = cropState.zoom.toFixed(3);
      }

      renderCropCanvas();
      if (photoCropModal && typeof photoCropModal.showModal === 'function') {
        photoCropModal.showModal();
      }
    };
    cropImage.src = imageSrc;
  }

  function renderCropCanvas() {
    if (!cropCanvasCtx || !cropImage.complete) return;
    const w = cropCanvas.width;
    const h = cropCanvas.height;

    cropCanvasCtx.clearRect(0, 0, w, h);
    cropCanvasCtx.save();
    cropCanvasCtx.translate(w / 2, h / 2);
    cropCanvasCtx.rotate((cropState.rotation * Math.PI) / 180);
    cropCanvasCtx.translate(cropState.panX, cropState.panY);
    cropCanvasCtx.scale(cropState.zoom, cropState.zoom);
    cropCanvasCtx.drawImage(cropImage, -cropImage.width / 2, -cropImage.height / 2, cropImage.width, cropImage.height);
    cropCanvasCtx.restore();

    updateLivePreviews();
  }

  function updateLivePreviews() {
    if (!cropCanvas) return;

    if (sqPreviewCtx && livePreviewSquare) {
      sqPreviewCtx.clearRect(0, 0, livePreviewSquare.width, livePreviewSquare.height);
      sqPreviewCtx.drawImage(cropCanvas, 0, 0, livePreviewSquare.width, livePreviewSquare.height);
    }

    if (circPreviewCtx && livePreviewCircle) {
      const w = livePreviewCircle.width;
      const h = livePreviewCircle.height;
      circPreviewCtx.clearRect(0, 0, w, h);
      circPreviewCtx.save();
      circPreviewCtx.beginPath();
      circPreviewCtx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
      circPreviewCtx.clip();
      circPreviewCtx.drawImage(cropCanvas, 0, 0, w, h);
      circPreviewCtx.restore();
    }
  }

  function setZoom(newZoom) {
    cropState.zoom = Math.max(cropState.minZoom, Math.min(cropState.maxZoom, newZoom));
    if (cropZoomRange) cropZoomRange.value = cropState.zoom;
    renderCropCanvas();
  }

  if (cropCanvas) {
    cropCanvas.addEventListener('mousedown', (e) => {
      cropState.isDragging = true;
      cropState.startX = e.clientX - cropState.panX;
      cropState.startY = e.clientY - cropState.panY;
    });
    window.addEventListener('mousemove', (e) => {
      if (!cropState.isDragging) return;
      cropState.panX = e.clientX - cropState.startX;
      cropState.panY = e.clientY - cropState.startY;
      renderCropCanvas();
    });
    window.addEventListener('mouseup', () => { cropState.isDragging = false; });

    cropCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        cropState.isDragging = true;
        cropState.startX = e.touches[0].clientX - cropState.panX;
        cropState.startY = e.touches[0].clientY - cropState.panY;
      }
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (!cropState.isDragging || e.touches.length !== 1) return;
      cropState.panX = e.touches[0].clientX - cropState.startX;
      cropState.panY = e.touches[0].clientY - cropState.startY;
      renderCropCanvas();
    }, { passive: true });
    window.addEventListener('touchend', () => { cropState.isDragging = false; });

    cropCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      setZoom(cropState.zoom * (e.deltaY < 0 ? 1.08 : 0.92));
    }, { passive: false });
  }

  if (cropZoomRange) cropZoomRange.addEventListener('input', (e) => setZoom(parseFloat(e.target.value)));
  if (zoomInBtn) zoomInBtn.addEventListener('click', () => setZoom(cropState.zoom * 1.15));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setZoom(cropState.zoom * 0.85));
  if (rotateLeftBtn) rotateLeftBtn.addEventListener('click', () => {
    cropState.rotation = (cropState.rotation - 90 + 360) % 360;
    renderCropCanvas();
  });
  if (rotateRightBtn) rotateRightBtn.addEventListener('click', () => {
    cropState.rotation = (cropState.rotation + 90) % 360;
    renderCropCanvas();
  });
  if (centerCropBtn) centerCropBtn.addEventListener('click', () => {
    cropState.panX = 0;
    cropState.panY = 0;
    cropState.rotation = 0;
    setZoom(baseScale);
  });

  if (applyCropBtn) {
    applyCropBtn.addEventListener('click', () => {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 400;
      exportCanvas.height = 400;
      const expCtx = exportCanvas.getContext('2d');

      const scaleFactor = 400 / 320;
      expCtx.translate(200, 200);
      expCtx.rotate((cropState.rotation * Math.PI) / 180);
      expCtx.translate(cropState.panX * scaleFactor, cropState.panY * scaleFactor);
      expCtx.scale(cropState.zoom * scaleFactor, cropState.zoom * scaleFactor);
      expCtx.drawImage(cropImage, -cropImage.width / 2, -cropImage.height / 2, cropImage.width, cropImage.height);

      currentPhotoData = exportCanvas.toDataURL('image/jpeg', 0.94);
      updatePhotoDisplays(currentPhotoData);

      if (resetPhotoBtn) resetPhotoBtn.style.display = 'inline-block';
      if (cropCurrentPhotoBtn) cropCurrentPhotoBtn.style.display = 'inline-block';

      if (photoCropModal) photoCropModal.close();
      showToast("Cropped photograph applied to your student profile!");
    });
  }

  function cancelCrop() {
    if (photoCropModal) photoCropModal.close();
    if (currentPhotoData === DEFAULT_AVATAR) {
      rawUploadedPhoto = null;
      photoInput.value = "";
    }
  }
  if (cancelCropBtn) cancelCropBtn.addEventListener('click', cancelCrop);
  if (closeCropModalBtn) closeCropModalBtn.addEventListener('click', cancelCrop);

  resetPhotoBtn.addEventListener('click', () => {
    currentPhotoData = DEFAULT_AVATAR;
    rawUploadedPhoto = null;
    photoInput.value = "";
    updatePhotoDisplays(currentPhotoData);
    resetPhotoBtn.style.display = 'none';
    if (cropCurrentPhotoBtn) cropCurrentPhotoBtn.style.display = 'none';
    showToast("Profile photo reset to default placeholder.");
  });

  function updatePhotoDisplays(src) {
    if (src === DEFAULT_AVATAR) src = 'myphoto.jpeg';
    formPhotoPreview.src = src;
    bannerPhoto.src = src;
    dossierPhoto.src = src;
  }

  // --- 5. Validation ---
  function setError(inputElem, errorElem, message) {
    inputElem.classList.add('input-error');
    if (errorElem) errorElem.textContent = message;
  }
  function clearError(inputElem, errorElem) {
    inputElem.classList.remove('input-error');
    if (errorElem) errorElem.textContent = "";
  }

  function validateName() {
    const val = fullNameInput.value.trim();
    if (!val) { setError(fullNameInput, nameError, "Student full name is required."); return false; }
    if (val.length < 3) { setError(fullNameInput, nameError, "Name must contain at least 3 characters."); return false; }
    if (!/^[A-Za-z\s.'-]+$/.test(val)) { setError(fullNameInput, nameError, "Name should only contain letters and standard punctuation."); return false; }
    clearError(fullNameInput, nameError);
    return true;
  }

  function validateRegNo() {
    const val = registerNoInput.value.trim();
    if (!val) { setError(registerNoInput, regError, "Register Number is required."); return false; }
    if (!/^[A-Za-z0-9]{6,15}$/.test(val)) { setError(registerNoInput, regError, "Register Number should be 6-15 alphanumeric characters (e.g. STM23CS015)."); return false; }
    clearError(registerNoInput, regError);
    return true;
  }

  function validateRollNo() {
    const val = parseInt(rollNoInput.value, 10);
    if (isNaN(val) || val < 1 || val > 150) { setError(rollNoInput, rollError, "Enter a valid class roll number between 1 and 150."); return false; }
    clearError(rollNoInput, rollError);
    return true;
  }

  function validateDob() {
    const val = dobInput.value;
    if (!val) { setError(dobInput, dobError, "Date of birth is required."); return false; }
    if (new Date(val) >= new Date()) { setError(dobInput, dobError, "Date of birth must be a past date."); return false; }
    clearError(dobInput, dobError);
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) { setError(emailInput, emailError, "Email address is required."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setError(emailInput, emailError, "Please enter a valid email format (e.g. student@stthomas.ac.in)."); return false; }
    clearError(emailInput, emailError);
    return true;
  }

  function validatePhone() {
    const val = phoneInput.value.trim().replace(/\s+/g, '');
    if (!val) { setError(phoneInput, phoneError, "Contact mobile number is required."); return false; }
    if (!/^[6-9]\d{9}$/.test(val)) { setError(phoneInput, phoneError, "Please enter a valid 10-digit Indian mobile number starting with 6-9."); return false; }
    clearError(phoneInput, phoneError);
    return true;
  }

  fullNameInput.addEventListener('input', validateName);
  registerNoInput.addEventListener('input', () => {
    registerNoInput.value = registerNoInput.value.toUpperCase();
    validateRegNo();
  });
  rollNoInput.addEventListener('input', validateRollNo);
  dobInput.addEventListener('change', validateDob);
  emailInput.addEventListener('input', validateEmail);
  phoneInput.addEventListener('input', validatePhone);

  // --- 6. Live Sync to Dossier & Banner ---
  function syncFormToDossier() {
    const name = fullNameInput.value.trim() || "Student Name";
    const regNo = registerNoInput.value.trim().toUpperCase() || "STM23CS000";
    const rollNo = rollNoInput.value.trim() || "-";
    const deg = degreeInput.value.trim() || "BTech";
    const brn = branchInput.value.trim() || "CSE";
    const email = emailInput.value.trim() || "student@stthomas.ac.in";
    const phone = phoneInput.value.trim() || "-";

    const genderRadio = document.querySelector('input[name="gender"]:checked');
    const gender = genderRadio ? genderRadio.value : "-";
    const bloodGroup = bloodGroupSelect.value || "-";
    const primaryCo = primaryCompanySelect.value || "-";
    const secCo = secondaryCompanySelect.value;

    bannerName.textContent = name;
    bannerRegNo.textContent = regNo;
    bannerRollNo.textContent = rollNo;
    bannerDegree.textContent = deg;
    bannerBranch.textContent = brn;

    dossierName.textContent = name;
    dossierRegNo.textContent = regNo;
    dossierRollNo.textContent = rollNo;
    dossierDegree.textContent = deg;
    dossierBranch.textContent = brn;

    if (dobInput.value) {
      const parts = dobInput.value.split('-');
      dossierDob.textContent = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dobInput.value;
    } else {
      dossierDob.textContent = "-";
    }

    dossierGender.textContent = gender;
    dossierBloodGroup.textContent = bloodGroup;
    dossierBloodBadge.textContent = `Blood: ${bloodGroup}`;
    dossierEmail.textContent = email;
    dossierPhone.textContent = `+91 ${phone}`;
    dossierTargetCompany.textContent = primaryCo;
    dossierAltCompany.textContent = secCo || "None Specified";

    renderTags('skills', dossierSkillsList, 'skill-tag', 'No skills selected');
    renderTags('activities', dossierActivitiesList, 'activity-tag', 'No extracurricular activities specified');
  }

  function renderTags(inputName, container, tagClass, emptyText) {
    const checked = Array.from(document.querySelectorAll(`input[name="${inputName}"]:checked`)).map(cb => cb.value);
    container.innerHTML = "";
    if (checked.length === 0) {
      const span = document.createElement('span');
      span.className = 'text-muted';
      span.style.fontSize = '0.8rem';
      span.textContent = emptyText;
      container.appendChild(span);
      return;
    }
    checked.forEach(value => {
      const span = document.createElement('span');
      span.className = tagClass;
      span.textContent = value;
      container.appendChild(span);
    });
  }

  [fullNameInput, registerNoInput, rollNoInput, dobInput, degreeInput, branchInput,
   emailInput, phoneInput, bloodGroupSelect, primaryCompanySelect, secondaryCompanySelect]
    .forEach(elem => elem.addEventListener('input', syncFormToDossier));

  document.querySelectorAll('input[name="gender"], input[name="skills"], input[name="activities"]')
    .forEach(el => el.addEventListener('change', syncFormToDossier));

  // --- 7. Internal Marks Table ---
  

  // --- 8. Form Submission ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = [validateName(), validateRegNo(), validateRollNo(), validateDob(), validateEmail(), validatePhone()];

    if (results.every(Boolean)) {
      syncFormToDossier();
      showToast("Student profile successfully saved and verified!", true);
      const dossierCard = document.querySelector('.dossier-section');
      if (dossierCard) {
        dossierCard.style.outline = "2px solid #2563eb";
        setTimeout(() => { dossierCard.style.outline = "none"; }, 1000);
      }
    } else {
      showToast("Please correct the highlighted errors before saving.", false);
    }
  });

  // --- 9. Reset Handling ---
  form.addEventListener('reset', (e) => {
    e.preventDefault();
    if (resetConfirmModal && typeof resetConfirmModal.showModal === 'function') {
      resetConfirmModal.showModal();
    } else if (confirm("Reset profile details back to the original college records?")) {
      loadCollegeDefaults();
    }
  });

  if (cancelResetBtn) cancelResetBtn.addEventListener('click', () => resetConfirmModal.close());

  if (confirmResetBtn) {
    confirmResetBtn.addEventListener('click', () => {
      resetConfirmModal.close();
      loadCollegeDefaults();
      showToast("Restored original verified college data.");
    });
  }

  if (loadDefaultsBtn) {
    loadDefaultsBtn.addEventListener('click', () => {
      loadCollegeDefaults();
      showToast("Fathimath Sahdiya C's verified records loaded.");
    });
  }

  function loadCollegeDefaults() {
    fullNameInput.value = defaultStudentData.fullName;
    registerNoInput.value = defaultStudentData.registerNo;
    rollNoInput.value = defaultStudentData.rollNo;
    dobInput.value = defaultStudentData.dob;
    emailInput.value = defaultStudentData.email;
    phoneInput.value = defaultStudentData.phone;
    degreeInput.value = defaultStudentData.degree;
    branchInput.value = defaultStudentData.branch;
    bloodGroupSelect.value = defaultStudentData.bloodGroup;
    primaryCompanySelect.value = defaultStudentData.primaryCompany;
    secondaryCompanySelect.value = defaultStudentData.secondaryCompany;

    const genderRadio = document.querySelector(`input[name="gender"][value="${defaultStudentData.gender}"]`);
    if (genderRadio) genderRadio.checked = true;

    document.querySelectorAll('input[name="skills"]').forEach(cb => {
      cb.checked = defaultStudentData.skills.includes(cb.value);
    });
    document.querySelectorAll('input[name="activities"]').forEach(cb => {
      cb.checked = defaultStudentData.activities.includes(cb.value);
    });

    currentPhotoData = DEFAULT_AVATAR;
    rawUploadedPhoto = null;
    photoInput.value = "";
    updatePhotoDisplays(currentPhotoData);
    resetPhotoBtn.style.display = 'none';
    if (cropCurrentPhotoBtn) cropCurrentPhotoBtn.style.display = 'none';

    [fullNameInput, registerNoInput, rollNoInput, dobInput, emailInput, phoneInput].forEach(inp => inp.classList.remove('input-error'));
    [nameError, regError, rollError, dobError, emailError, phoneError].forEach(err => { if (err) err.textContent = ""; });

    syncFormToDossier();
  }

  // --- 10. Print ---
  printBtn.addEventListener('click', () => window.print());

  // --- Initial render ---
  syncFormToDossier();
});
