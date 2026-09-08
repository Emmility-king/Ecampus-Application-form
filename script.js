const form = document.querySelector('#applicationForm');
const statement = document.querySelector('#statement');
const characterCount = document.querySelector('#characterCount');
const successMessage = document.querySelector('#successMessage');
const formError = document.querySelector('#formError');

function setError(field, message) {
  const container = field.closest('.field');
  const error = container?.querySelector('.error');
  container?.classList.toggle('invalid', Boolean(message));
  if (error) error.textContent = message;
}

function validateForm() {
  let valid = true;
  form.querySelectorAll('[required]').forEach((field) => {
    if (field.type === 'radio') return;
    if (!field.checkValidity()) {
      setError(field, field.value ? 'Please enter a valid value.' : 'This field is required.');
      valid = false;
    } else {
      setError(field, '');
    }
  });

  const mode = form.querySelector('input[name="mode"]:checked');
  const modeError = form.querySelector('.mode-error');
  modeError.textContent = mode ? '' : 'Please choose a study mode.';
  if (!mode) valid = false;
  return valid;
}

statement.addEventListener('input', () => {
  characterCount.textContent = `${statement.value.length} / 600`;
});

form.addEventListener('input', (event) => {
  if (event.target.matches('input, select, textarea')) {
    setError(event.target, '');
    formError.textContent = '';
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  formError.textContent = '';
  if (!validateForm()) {
    formError.textContent = 'Please complete the highlighted fields before submitting.';
    form.querySelector('.invalid input, .invalid select, .invalid textarea')?.focus();
    return;
  }
  successMessage.classList.add('show');
  successMessage.focus();
  form.querySelector('.submit-button').disabled = true;
  form.querySelector('.submit-button').textContent = 'Application submitted';
});
