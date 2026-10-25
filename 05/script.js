document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentProfileForm");
  const loadDefaultsBtn = document.getElementById("loadDefaultsBtn");
  const printBtn = document.getElementById("printBtn");
  const studentPhotoInput = document.getElementById("studentPhoto");
  const mouseGlow = document.getElementById("mouseGlow");

  // Interactive mouse tracking glow effect
  document.addEventListener("mousemove", (e) => {
    mouseGlow.style.left = e.clientX + "px";
    mouseGlow.style.top = e.clientY + "px";
  });

  // Initial sync on load
  syncDossierWithForm();

  // Handle student photo upload
  studentPhotoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const base64Img = event.target.result;
        document.getElementById("formPhotoPreview").src = base64Img;
        document.getElementById("bannerPhoto").src = base64Img;
        document.getElementById("dossierPhoto").src = base64Img;
        showToast("Avatar updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  });

  // Real-time updates as user types or changes fields
  form.addEventListener("input", syncDossierWithForm);
  form.addEventListener("change", syncDossierWithForm);

  // Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) {
      syncDossierWithForm();
      showToast("Profile and dossier updated successfully!");
    } else {
      showToast("Please correct the highlighted errors.", true);
    }
  });

  // Reset Defaults Button
  loadDefaultsBtn.addEventListener("click", () => {
    setFormData({
      fullName: "Anandu M",
      registerNo: "STM23CS006",
      rollNo: "5",
      dob: "2006-01-31",
      email: "anandumukundan2006@gmail.com",
      phone: "8547631598",
      gender: "Male",
      bloodGroup: "O+",
      primaryCompany: "Infosys",
      secondaryCompany: "TCS",
      skills: ["Python", "Java", "C / C++", "Web Development", "SQL & Databases", "Data Structures"],
      activities: ["NSS Volunteer", "College Coding Club", "Sports & Athletics"]
    });
    syncDossierWithForm();
    showToast("Restored profile defaults.");
  });

  printBtn.addEventListener("click", () => {
    window.print();
  });
});

function syncDossierWithForm() {
  const getVal = (id) => document.getElementById(id).value;

  document.getElementById("bannerName").textContent = getVal("fullName") || "Anandu M";
  document.getElementById("dossierName").textContent = getVal("fullName") || "Anandu M";
  document.getElementById("bannerRegNo").textContent = getVal("registerNo") || "STM23CS006";
  document.getElementById("dossierRegNo").textContent = getVal("registerNo") || "STM23CS006";
  document.getElementById("bannerRollNo").textContent = getVal("rollNo") || "5";
  document.getElementById("dossierRollNo").textContent = getVal("rollNo") || "5";
  document.getElementById("dossierPhone").textContent = "+91 " + (getVal("phone") || "8547631598");
  document.getElementById("dossierEmail").textContent = getVal("email") || "anandumukundan2006@gmail.com";

  const genderElem = document.querySelector('input[name="gender"]:checked');
  document.getElementById("dossierGender").textContent = genderElem ? genderElem.value : "Male";

  const bloodGroup = document.getElementById("bloodGroup").value;
  document.getElementById("dossierBloodBadge").textContent = "Blood: " + bloodGroup;

  document.getElementById("dossierTargetCompany").textContent = document.getElementById("primaryCompany").value;

  // Sync Technical Skills dynamically
  const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
  const skillsListContainer = document.getElementById("dossierSkillsList");
  skillsListContainer.innerHTML = "";
  skillCheckboxes.forEach(cb => {
    const tag = document.createElement("span");
    tag.className = "skill-tag";
    tag.textContent = cb.value;
    skillsListContainer.appendChild(tag);
  });

  // Sync NSS & Activities dynamically (fully respects un-ticks)
  const activityCheckboxes = document.querySelectorAll('input[name="activities"]:checked');
  const activitiesListContainer = document.getElementById("dossierActivitiesList");
  activitiesListContainer.innerHTML = "";
  activityCheckboxes.forEach(cb => {
    const tag = document.createElement("span");
    tag.className = "activity-tag";
    tag.textContent = cb.value;
    activitiesListContainer.appendChild(tag);
  });
}

function setFormData(data) {
  document.getElementById("fullName").value = data.fullName;
  document.getElementById("registerNo").value = data.registerNo;
  document.getElementById("rollNo").value = data.rollNo;
  document.getElementById("dob").value = data.dob;
  document.getElementById("email").value = data.email;
  document.getElementById("phone").value = data.phone;
  document.getElementById("bloodGroup").value = data.bloodGroup;
  document.getElementById("primaryCompany").value = data.primaryCompany;
  document.getElementById("secondaryCompany").value = data.secondaryCompany;

  document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.checked = (radio.value === data.gender);
  });

  document.querySelectorAll('input[name="skills"]').forEach(cb => {
    cb.checked = data.skills.includes(cb.value);
  });

  document.querySelectorAll('input[name="activities"]').forEach(cb => {
    cb.checked = data.activities.includes(cb.value);
  });
}

function validateForm() {
  let isValid = true;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const regNo = document.getElementById("registerNo").value;

  document.getElementById("emailError").textContent = "";
  document.getElementById("phoneError").textContent = "";
  document.getElementById("regError").textContent = "";

  if (!email.includes("@")) {
    document.getElementById("emailError").textContent = "Please enter a valid email address.";
    isValid = false;
  }
  if (phone.length < 10) {
    document.getElementById("phoneError").textContent = "Enter a valid 10-digit mobile number.";
    isValid = false;
  }
  if (regNo.trim() === "") {
    document.getElementById("regError").textContent = "Register number is required.";
    isValid = false;
  }
  return isValid;
}

function showToast(message, isError = false) {
  const toast = document.getElementById("toastNotification");
  document.getElementById("toastMsg").textContent = message;
  toast.style.borderColor = isError ? "var(--danger-text)" : "var(--brand-cyan)";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}