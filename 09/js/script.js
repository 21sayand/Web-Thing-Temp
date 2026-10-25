/**
 * Student Profile System - Main JavaScript Logic & Interactivity
 * Handles: Validation, Dynamic CGPA/SGPA Math, Internal Marks Table,
 * Photo Replacement Guide & Instant Local Photo Upload, Print Export.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM References ---
  const profileForm = document.getElementById('profileForm');
  const marksForm = document.getElementById('marksForm');
  const internalMarksBody = document.getElementById('internalMarksBody');
  const addSubjectBtn = document.getElementById('addSubjectBtn');
  
  // Modals & Overlays
  const photoGuideModal = document.getElementById('photoGuideModal');
  const addMarksModal = document.getElementById('addMarksModal');
  const btnOpenPhotoGuide = document.getElementById('btnOpenPhotoGuide');
  const photoFileInput = document.getElementById('photoFileInput');
  const profileAvatarImg = document.getElementById('profileAvatarImg');
  
  // CGPA / SGPA Dynamic Display Elements
  const displayCgpa = document.getElementById('displayCgpa');
  const sgpaInputs = document.querySelectorAll('.sgpa-input');

  // Interactive Action Buttons
  const btnToggleEdit = document.getElementById('btnToggleEdit');
  const btnPrintProfile = document.getElementById('btnPrintProfile');
  const btnResetProfile = document.getElementById('btnResetProfile');
  
  let isEditMode = true;

  // --- Initial Setup & CGPA Calculation ---
  function calculateCGPA() {
    let total = 0;
    let count = 0;
    sgpaInputs.forEach(input => {
      const val = parseFloat(input.value);
      if (!isNaN(val) && val >= 0 && val <= 10) {
        total += val;
        count++;
      }
    });

    if (count > 0) {
      const cgpa = (total / count).toFixed(2);
      if (displayCgpa) {
        displayCgpa.textContent = cgpa;
      }
      return cgpa;
    }
    return '0.00';
  }

  // Recalculate CGPA when any SGPA input changes
  sgpaInputs.forEach(input => {
    input.addEventListener('input', calculateCGPA);
  });

  // --- Form Interactivity & Validation ---
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect values
      const fullName = document.getElementById('studentName').value.trim();
      const email = document.getElementById('studentEmail').value.trim();
      const phone = document.getElementById('studentPhone').value.trim();
      const bloodGroup = document.getElementById('bloodGroup').value;

      // Basic validations
      if (!fullName) {
        showToast('Please enter your full name.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      if (phone && !/^\+?[0-9\s\-]{10,15}$/.test(phone)) {
        showToast('Please enter a valid 10-digit phone number.', 'error');
        return;
      }

      if (!bloodGroup) {
        showToast('Please select your blood group.', 'error');
        return;
      }

      // Interested Companies check
      const selectedCompanies = Array.from(document.getElementById('companySelect').selectedOptions).map(opt => opt.value);
      if (selectedCompanies.length === 0) {
        showToast('Please select at least one interested company.', 'error');
        return;
      }

      const currentCgpa = calculateCGPA();
      
      // Update display tags
      const headerName = document.getElementById('sidebarStudentName');
      if (headerName) headerName.textContent = fullName;

      const quickEmail = document.getElementById('quickEmail');
      if (quickEmail) quickEmail.textContent = email;

      const quickPhone = document.getElementById('quickPhone');
      if (quickPhone && phone) quickPhone.textContent = phone;

      showToast(`Profile updated successfully! Current CGPA: ${currentCgpa}`, 'success');
    });
  }

  // --- Toggle Edit / Read-only Mode ---
  if (btnToggleEdit) {
    btnToggleEdit.addEventListener('click', () => {
      isEditMode = !isEditMode;
      const inputs = profileForm.querySelectorAll('input, select, textarea');

      inputs.forEach(el => {
        if (isEditMode) {
          el.removeAttribute('disabled');
        } else {
          el.setAttribute('disabled', 'disabled');
        }
      });

      btnToggleEdit.innerHTML = isEditMode
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg> Read-Only View`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg> Enable Editing`;

      showToast(isEditMode ? 'Form is now editable.' : 'Form locked to read-only view.', 'info');
    });
  }

  // --- Reset Form Handler ---
  if (btnResetProfile) {
    btnResetProfile.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset the form fields to defaults?')) {
        profileForm.reset();
        calculateCGPA();
        showToast('Form fields reset to default.', 'info');
      }
    });
  }

  // --- Print / Export Handler ---
  if (btnPrintProfile) {
    btnPrintProfile.addEventListener('click', () => {
      window.print();
    });
  }

  // --- Modal Logic for Photo Replacement Guide ---
  window.openModal = function(modalId) {
    const target = document.getElementById(modalId);
    if (target) target.classList.add('active');
  };

  window.closeModal = function(modalId) {
    const target = document.getElementById(modalId);
    if (target) target.classList.remove('active');
  };

  if (btnOpenPhotoGuide) {
    btnOpenPhotoGuide.addEventListener('click', () => {
      openModal('photoGuideModal');
    });
  }

  // Quick Photo Selection Preview using FileReader
  if (photoFileInput) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showToast('Please select a valid image file.', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = function(evt) {
          if (profileAvatarImg) {
            profileAvatarImg.src = evt.target.result;
            showToast('Photo updated successfully!', 'success');
            closeModal('photoGuideModal');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // --- Internal Marks Dynamic Table Management ---
  if (addSubjectBtn) {
    addSubjectBtn.addEventListener('click', () => {
      openModal('addMarksModal');
    });
  }

  if (marksForm) {
    marksForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const code = document.getElementById('newSubCode').value.trim().toUpperCase();
      const name = document.getElementById('newSubName').value.trim();
      const test1 = parseFloat(document.getElementById('newTest1').value) || 0;
      const test2 = parseFloat(document.getElementById('newTest2').value) || 0;
      const assignment = parseFloat(document.getElementById('newAssignment').value) || 0;

      if (!code || !name) {
        showToast('Subject Code and Name are required.', 'error');
        return;
      }

      if (test1 > 50 || test2 > 50 || assignment > 10) {
        showToast('Marks exceed maximum limits (Series 1 & 2: max 50, Assignment: max 10)', 'error');
        return;
      }

      // Convert Series 1 (50) and Series 2 (50) to Internal components out of 25 each
      const internalTest1 = test1 / 2;
      const internalTest2 = test2 / 2;
      const totalInternal = (internalTest1 + internalTest2 + assignment).toFixed(2);
      
      // Calculate grade badge
      let grade = 'A';
      let gradeClass = 'grade-a';
      if (totalInternal >= 54) {
        grade = 'O (Outstanding)';
        gradeClass = 'grade-o';
      } else if (totalInternal >= 45) {
        grade = 'A+ (Excellent)';
        gradeClass = 'grade-aplus';
      }

      // Create new row matching table format
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><strong>${code}</strong></td>
        <td>${name}</td>
        <td><span class="mark-pill">${test1.toFixed(1)} / 50</span></td>
        <td><span class="mark-pill">${test2.toFixed(1)} / 50</span></td>
        <td><span class="mark-pill">${assignment.toFixed(1)} / 10</span></td>
        <td><strong><span class="mark-pill">${totalInternal} / 60</span></strong></td>
        <td><span class="grade-badge ${gradeClass}">${grade}</span></td>
        <td class="no-print">
          <button class="btn btn-sm btn-outline-danger" onclick="deleteMarksRow(this)">Remove</button>
        </td>
      `;

      internalMarksBody.appendChild(newRow);
      marksForm.reset();
      closeModal('addMarksModal');
      showToast(`Added ${name} internal marks successfully!`, 'success');
    });
  }

  window.deleteMarksRow = function(btn) {
    if (confirm('Remove this subject from internal marks table?')) {
      const row = btn.closest('tr');
      row.remove();
      showToast('Subject removed.', 'info');
    }
  };

  // --- Global Toast Notification Helper ---
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
