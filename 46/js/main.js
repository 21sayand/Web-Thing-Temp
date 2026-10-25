const profileForm = document.querySelector('#profile-form');
const formMessage = document.querySelector('#form-message');
const photo = document.querySelector('#profile-photo');

photo?.addEventListener('error', () => {
  photo.src = 'images/student-placeholder.svg';
  photo.alt = 'Sample student profile photo';
});

profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = profileForm.elements.name.value.trim();
  const bloodGroup = profileForm.elements.bloodGroup.value;
  const genderSelected = profileForm.querySelector('input[name="gender"]:checked');
  const company = profileForm.elements.company.value;

  if (!profileForm.checkValidity() || !name || !bloodGroup || !genderSelected || !company) {
    profileForm.reportValidity();
    formMessage.textContent = 'Please complete the required fields and check the highlighted values.';
    formMessage.classList.add('error');
    return;
  }

  formMessage.textContent = `Profile validated for ${name}. ${company} is your selected company.`;
  formMessage.classList.remove('error');
});

profileForm?.addEventListener('reset', () => {
  window.setTimeout(() => {
    formMessage.textContent = 'Form reset to the sample profile values.';
    formMessage.classList.remove('error');
  }, 0);
});
