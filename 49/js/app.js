const profileForm = document.querySelector('#profile-form');
const formMessage = document.querySelector('#form-message');

profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = profileForm.elements.name.value.trim();
  const genderSelected = profileForm.querySelector('input[name="gender"]:checked');
  const bloodGroup = profileForm.elements.bloodGroup.value;
  const company = profileForm.elements.company.value;

  if (!profileForm.checkValidity() || !name || !genderSelected || !bloodGroup || !company) {
    profileForm.reportValidity();
    formMessage.textContent = 'Please complete the required fields and correct any invalid values.';
    formMessage.classList.add('error');
    return;
  }

  formMessage.textContent = `Profile validated for ${name}. ${company} is your selected company.`;
  formMessage.classList.remove('error');
});

profileForm?.addEventListener('reset', () => {
  window.setTimeout(() => {
    formMessage.textContent = 'Form reset. Existing profile details have been restored.';
    formMessage.classList.remove('error');
  }, 0);
});
