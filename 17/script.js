/**
 * St Thomas College of Engineering and Technology, Kannur
 * Student Academic & Placement Portal - Core JavaScript
 * 
 * Features:
 * - Real-time form validation with accessible error messaging
 * - Live photo upload & preview across dossier, form, and header banner
 * - Dynamic synchronization between form controls and the official academic dossier
 * - Real-time badge generation for selected skills and extracurricular activities
 * - Reset confirmation modal & custom toast notifications
 * - Print handling for official placement biodata export
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Default Student Data Configuration ---
  const defaultStudentData = {
    fullName: "Fathima Ziya",
    registerNo: "STM23CS018",
    rollNo: "17",
    dob: "2005-01-18",
    email: "ziyaf1640@gmail.com",
    phone: "7736839954",
    degree: "BTech in Computer Science and Engineering",
    branch: "CSE",
    gender: "Female",
    bloodGroup: "O+",
    primaryCompany: "Oracle",
    secondaryCompany: "Infosys",
    cgpa: "7.41",
    sgpaList: [
      { sem: 1, sgpa: "6.59", session: "2023 - 2024 (Odd)", credits: "13 / 13" },
      { sem: 2, sgpa: "6.93", session: "2023 - 2024 (Even)", credits: "21 / 21" },
      { sem: 3, sgpa: "7.77", session: "2024 - 2025 (Odd)", credits: "22 / 22" },
      { sem: 4, sgpa: "7.77", session: "2024 - 2025 (Even)", credits: "22 / 22" },
      { sem: 5, sgpa: "7.00", session: "2025 - 2026 (Odd)", credits: "23 / 23" },
      { sem: 6, sgpa: "8.15", session: "2025 - 2026 (Even)", credits: "23 / 23" }
    ],
    skills: [],
    activities: []
  };

  const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23E2E8F0'/%3E%3Ccircle cx='60' cy='46' r='24' fill='%2394A3B8'/%3E%3Cpath d='M24 104 C24 78, 40 70, 60 70 C80 70, 96 78, 96 104 Z' fill='%2394A3B8'/%3E%3C/svg%3E";

  // --- 2. DOM Elements Selection ---
  const form = document.getElementById('studentProfileForm');
  const photoInput = document.getElementById('studentPhoto');
  const resetPhotoBtn = document.getElementById('resetPhotoBtn');
  const formPhotoPreview = document.getElementById('formPhotoPreview');
  const bannerPhoto = document.getElementById('bannerPhoto');
  const dossierPhoto = document.getElementById('dossierPhoto');

  // Input Fields
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

  // Dossier Display Targets
  const bannerName = document.getElementById('bannerName');
  const bannerRegNo = document.getElementById('bannerRegNo');
  const bannerRollNo = document.getElementById('bannerRollNo');
  const bannerDegree = document.getElementById('bannerDegree');
  const bannerBranch = document.getElementById('bannerBranch');
  const bannerCGPA = document.getElementById('bannerCGPA');

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
  const dossierCGPATag = document.getElementById('dossierCGPATag');

  const dossierSkillsList = document.getElementById('dossierSkillsList');
  const dossierActivitiesList = document.getElementById('dossierActivitiesList');

  // Error Containers
  const nameError = document.getElementById('nameError');
  const regError = document.getElementById('regError');
  const rollError = document.getElementById('rollError');
  const dobError = document.getElementById('dobError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');

  // Buttons & Dialogs
  const printBtn = document.getElementById('printBtn');
  const loadDefaultsBtn = document.getElementById('loadDefaultsBtn');
  const resetBtn = document.getElementById('resetBtn');
  const resetConfirmModal = document.getElementById('resetConfirmModal');
  const confirmResetBtn = document.getElementById('confirmResetBtn');
  const cancelResetBtn = document.getElementById('cancelResetBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');

  // Photo Crop Modal Elements
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
    zoom: 1,
    minZoom: 0.5,
    maxZoom: 3,
    panX: 0,
    panY: 0,
    rotation: 0,
    isDragging: false,
    startX: 0,
    startY: 0
  };

  // --- 3. Toast Notification Helper ---
  let toastTimer = null;
  function showToast(message, isSuccess = true) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMsg.textContent = message;
    toastNotification.className = 'toast show';
    const toastIcon = document.getElementById('toastIcon');
    if (toastIcon) {
      toastIcon.textContent = isSuccess ? '✓' : 'ℹ';
      toastIcon.style.backgroundColor = isSuccess ? '#22c55e' : '#eab308';
    }
    toastTimer = setTimeout(() => {
      toastNotification.className = 'toast';
    }, 3500);
  }

  // --- 4. Interactive Photo Upload, Crop & Preview System ---
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Selected photograph exceeds 3 MB. Please select a smaller photo for optimal performance.");
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
      if (srcToCrop) {
        openCropModal(srcToCrop);
      }
    });
  }

  function openCropModal(imageSrc) {
    cropImage.onload = () => {
      // Calculate fit scale so image fills the 320x320 viewport
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
    const canvasWidth = cropCanvas.width;
    const canvasHeight = cropCanvas.height;

    cropCanvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    cropCanvasCtx.save();

    // Center coordinate transformation
    cropCanvasCtx.translate(canvasWidth / 2, canvasHeight / 2);
    cropCanvasCtx.rotate((cropState.rotation * Math.PI) / 180);
    cropCanvasCtx.translate(cropState.panX, cropState.panY);
    cropCanvasCtx.scale(cropState.zoom, cropState.zoom);

    // Draw source image centered
    cropCanvasCtx.drawImage(
      cropImage,
      -cropImage.width / 2,
      -cropImage.height / 2,
      cropImage.width,
      cropImage.height
    );

    cropCanvasCtx.restore();

    updateLivePreviews();
  }

  function updateLivePreviews() {
    if (!cropCanvas) return;

    // 1. Placement Dossier Preview (Square 96x96)
    if (sqPreviewCtx && livePreviewSquare) {
      sqPreviewCtx.clearRect(0, 0, livePreviewSquare.width, livePreviewSquare.height);
      sqPreviewCtx.drawImage(cropCanvas, 0, 0, livePreviewSquare.width, livePreviewSquare.height);
    }

    // 2. Portal Header Avatar Preview (Circle 68x68)
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
    if (cropZoomRange) {
      cropZoomRange.value = cropState.zoom;
    }
    renderCropCanvas();
  }

  // Mouse & Touch Dragging Listeners on Crop Canvas
  if (cropCanvas) {
    // Mouse events
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

    window.addEventListener('mouseup', () => {
      cropState.isDragging = false;
    });

    // Touch events for mobile/tablet support
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

    window.addEventListener('touchend', () => {
      cropState.isDragging = false;
    });

    // Mouse wheel zoom over crop canvas
    cropCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom(cropState.zoom * zoomFactor);
    }, { passive: false });
  }

  // Zoom slider and toolbar buttons
  if (cropZoomRange) {
    cropZoomRange.addEventListener('input', (e) => {
      setZoom(parseFloat(e.target.value));
    });
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => setZoom(cropState.zoom * 1.15));
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => setZoom(cropState.zoom * 0.85));
  }

  if (rotateLeftBtn) {
    rotateLeftBtn.addEventListener('click', () => {
      cropState.rotation = (cropState.rotation - 90 + 360) % 360;
      renderCropCanvas();
    });
  }

  if (rotateRightBtn) {
    rotateRightBtn.addEventListener('click', () => {
      cropState.rotation = (cropState.rotation + 90) % 360;
      renderCropCanvas();
    });
  }

  if (centerCropBtn) {
    centerCropBtn.addEventListener('click', () => {
      cropState.panX = 0;
      cropState.panY = 0;
      setZoom(baseScale);
      cropState.rotation = 0;
      renderCropCanvas();
    });
  }

  // Apply Crop Action
  if (applyCropBtn) {
    applyCropBtn.addEventListener('click', () => {
      // Export high-resolution 400x400 output canvas
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 400;
      exportCanvas.height = 400;
      const expCtx = exportCanvas.getContext('2d');

      const scaleFactor = 400 / 320; // 1.25x scale for high crispness
      expCtx.translate(200, 200);
      expCtx.rotate((cropState.rotation * Math.PI) / 180);
      expCtx.translate(cropState.panX * scaleFactor, cropState.panY * scaleFactor);
      expCtx.scale(cropState.zoom * scaleFactor, cropState.zoom * scaleFactor);

      expCtx.drawImage(
        cropImage,
        -cropImage.width / 2,
        -cropImage.height / 2,
        cropImage.width,
        cropImage.height
      );

      currentPhotoData = exportCanvas.toDataURL('image/jpeg', 0.94);
      updatePhotoDisplays(currentPhotoData);

      if (resetPhotoBtn) resetPhotoBtn.style.display = 'inline-block';
      if (cropCurrentPhotoBtn) cropCurrentPhotoBtn.style.display = 'inline-block';

      if (photoCropModal) photoCropModal.close();
      showToast("Cropped photograph applied to your student profile!");
    });
  }

  // Close / Cancel Crop Modal
  if (cancelCropBtn) {
    cancelCropBtn.addEventListener('click', () => {
      if (photoCropModal) photoCropModal.close();
      if (!rawUploadedPhoto) {
        photoInput.value = "";
      }
    });
  }

  if (closeCropModalBtn) {
    closeCropModalBtn.addEventListener('click', () => {
      if (photoCropModal) photoCropModal.close();
      if (!rawUploadedPhoto) {
        photoInput.value = "";
      }
    });
  }

  // Reset Photo Handler
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
    formPhotoPreview.src = src;
    bannerPhoto.src = src;
    dossierPhoto.src = src;
  }

  // --- 5. Form Validation Functions ---
  function validateName() {
    const val = fullNameInput.value.trim();
    if (!val) {
      setError(fullNameInput, nameError, "Student full name is required.");
      return false;
    } else if (val.length < 3) {
      setError(fullNameInput, nameError, "Name must contain at least 3 characters.");
      return false;
    } else if (!/^[A-Za-z\s.'-]+$/.test(val)) {
      setError(fullNameInput, nameError, "Name should only contain letters and standard punctuation.");
      return false;
    }
    clearError(fullNameInput, nameError);
    return true;
  }

  function validateRegNo() {
    const val = registerNoInput.value.trim();
    if (!val) {
      setError(registerNoInput, regError, "Register Number is required.");
      return false;
    } else if (!/^[A-Za-z0-9]{6,15}$/.test(val)) {
      setError(registerNoInput, regError, "Register Number should be 6-15 alphanumeric characters (e.g. STM23CS018).");
      return false;
    }
    clearError(registerNoInput, regError);
    return true;
  }

  function validateRollNo() {
    const val = parseInt(rollNoInput.value, 10);
    if (isNaN(val) || val < 1 || val > 150) {
      setError(rollNoInput, rollError, "Enter a valid class roll number between 1 and 150.");
      return false;
    }
    clearError(rollNoInput, rollError);
    return true;
  }

  function validateDob() {
    const val = dobInput.value;
    if (!val) {
      setError(dobInput, dobError, "Date of birth is required.");
      return false;
    }
    const enteredDate = new Date(val);
    const today = new Date();
    if (enteredDate >= today) {
      setError(dobInput, dobError, "Date of birth must be a past date.");
      return false;
    }
    clearError(dobInput, dobError);
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setError(emailInput, emailError, "College email address is required.");
      return false;
    } else if (!emailRegex.test(val)) {
      setError(emailInput, emailError, "Please enter a valid email format (e.g. student@stthomas.ac.in).");
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  function validatePhone() {
    const val = phoneInput.value.trim().replace(/\s+/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!val) {
      setError(phoneInput, phoneError, "Contact mobile number is required.");
      return false;
    } else if (!phoneRegex.test(val)) {
      setError(phoneInput, phoneError, "Please enter a valid 10-digit Indian mobile number starting with 6-9.");
      return false;
    }
    clearError(phoneInput, phoneError);
    return true;
  }

  function setError(inputElem, errorElem, message) {
    inputElem.classList.add('input-error');
    if (errorElem) errorElem.textContent = message;
  }

  function clearError(inputElem, errorElem) {
    inputElem.classList.remove('input-error');
    if (errorElem) errorElem.textContent = "";
  }

  // Real-time input listeners to clear errors as user types
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
    const gender = genderRadio ? genderRadio.value : "Female";

    const bloodGroup = bloodGroupSelect.value || "O+";
    const primaryCo = primaryCompanySelect.value || "Oracle";
    const secCo = secondaryCompanySelect.value || "Infosys";

    // Update Quick Banner
    bannerName.textContent = name;
    bannerRegNo.textContent = regNo;
    bannerRollNo.textContent = rollNo;
    bannerDegree.textContent = deg;
    bannerBranch.textContent = brn;

    // Update Dossier Summary Table
    dossierName.textContent = name;
    dossierRegNo.textContent = regNo;
    dossierRollNo.textContent = rollNo;
    dossierDegree.textContent = deg;
    dossierBranch.textContent = brn;
    if (dossierDob) {
      if (dobInput.value) {
        const parts = dobInput.value.split('-');
        dossierDob.textContent = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dobInput.value;
      } else {
        dossierDob.textContent = "18/01/2005";
      }
    }
    dossierGender.textContent = gender;
    dossierBloodGroup.textContent = bloodGroup;
    dossierBloodBadge.textContent = `Blood: ${bloodGroup}`;
    dossierEmail.textContent = email;
    dossierPhone.textContent = `+91 ${phone}`;
    dossierTargetCompany.textContent = primaryCo;
    dossierAltCompany.textContent = secCo || "None Specified";

    // Update Skills Tag Cloud
    const checkedSkills = Array.from(document.querySelectorAll('input[name="skills"]:checked'))
      .map(cb => cb.value);

    dossierSkillsList.innerHTML = "";
    if (checkedSkills.length === 0) {
      dossierSkillsList.innerHTML = '<span class="text-muted" style="font-size:0.8rem;">No skills selected</span>';
    } else {
      checkedSkills.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'skill-tag';
        span.textContent = skill;
        dossierSkillsList.appendChild(span);
      });
    }

    // Update Activities Tag Cloud
    const checkedActivities = Array.from(document.querySelectorAll('input[name="activities"]:checked'))
      .map(cb => cb.value);

    dossierActivitiesList.innerHTML = "";
    if (checkedActivities.length === 0) {
      dossierActivitiesList.innerHTML = '<span class="text-muted" style="font-size:0.8rem;">No extracurricular activities specified</span>';
    } else {
      checkedActivities.forEach(act => {
        const span = document.createElement('span');
        span.className = 'activity-tag';
        span.textContent = act;
        dossierActivitiesList.appendChild(span);
      });
    }
  }

  // Listen to interactive form controls for instant reflection
  const reactiveElements = [
    fullNameInput, registerNoInput, rollNoInput, dobInput, degreeInput, branchInput,
    emailInput, phoneInput, bloodGroupSelect, primaryCompanySelect, secondaryCompanySelect
  ];
  reactiveElements.forEach(elem => elem.addEventListener('input', syncFormToDossier));

  document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', syncFormToDossier);
  });

  document.querySelectorAll('input[name="skills"]').forEach(cb => {
    cb.addEventListener('change', syncFormToDossier);
  });

  document.querySelectorAll('input[name="activities"]').forEach(cb => {
    cb.addEventListener('change', syncFormToDossier);
  });

  // --- 7. Form Submission Handler ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isRegValid = validateRegNo();
    const isRollValid = validateRollNo();
    const isDobValid = validateDob();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();

    if (isNameValid && isRegValid && isRollValid && isDobValid && isEmailValid && isPhoneValid) {
      syncFormToDossier();
      showToast("Student profile successfully saved and verified!", true);
      // Optional subtle highlight effect on the dossier
      const dossierCard = document.querySelector('.dossier-section');
      if (dossierCard) {
        dossierCard.style.outline = "2px solid #2563eb";
        setTimeout(() => { dossierCard.style.outline = "none"; }, 1000);
      }
    } else {
      showToast("Please correct the highlighted errors before saving.", false);
    }
  });

  // --- 8. Reset Handling ---
  form.addEventListener('reset', (e) => {
    e.preventDefault();
    if (resetConfirmModal && typeof resetConfirmModal.showModal === 'function') {
      resetConfirmModal.showModal();
    } else {
      if (confirm("Reset profile details back to Fathima Ziya's original college records?")) {
        loadCollegeDefaults();
      }
    }
  });

  if (cancelResetBtn) {
    cancelResetBtn.addEventListener('click', () => {
      resetConfirmModal.close();
    });
  }

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
      showToast("Fathima Ziya's verified records loaded.");
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

    // Gender radio
    const genderDefaultRadio = document.querySelector('input[name="gender"][value="Female"]');
    if (genderDefaultRadio) genderDefaultRadio.checked = true;

    // Checkboxes
    document.querySelectorAll('input[name="skills"]').forEach(cb => {
      cb.checked = defaultStudentData.skills.includes(cb.value);
    });

    document.querySelectorAll('input[name="activities"]').forEach(cb => {
      cb.checked = defaultStudentData.activities.includes(cb.value);
    });

    // Reset photo
    currentPhotoData = DEFAULT_AVATAR;
    rawUploadedPhoto = null;
    photoInput.value = "";
    updatePhotoDisplays(currentPhotoData);
    resetPhotoBtn.style.display = 'none';
    if (cropCurrentPhotoBtn) cropCurrentPhotoBtn.style.display = 'none';

    // Clear validation styling
    [fullNameInput, registerNoInput, rollNoInput, dobInput, emailInput, phoneInput].forEach(inp => {
      inp.classList.remove('input-error');
    });
    [nameError, regError, rollError, dobError, emailError, phoneError].forEach(err => {
      if (err) err.textContent = "";
    });

    syncFormToDossier();
  }

  // --- 9. Print Action ---
  printBtn.addEventListener('click', () => {
    window.print();
  });

  // Initial Sync on Page Load
  syncFormToDossier();
});
