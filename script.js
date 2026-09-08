const form = document.querySelector('#applicationForm');
const panels = [...document.querySelectorAll('.form-step')];
const steps = [...document.querySelectorAll('.step')];
const nextButton = document.querySelector('#nextButton');
const backButton = document.querySelector('#backButton');
const reviewCard = document.querySelector('#reviewCard');
const successMessage = document.querySelector('#successMessage');
const statement = document.querySelector('#statement');
let currentStep = 1;

function showStep(stepNumber) {
  currentStep = stepNumber;
  panels.forEach((panel) => panel.classList.toggle('active', Number(panel.dataset.panel) === currentStep));
  steps.forEach((step, index) => {
    step.classList.toggle('active', index + 1 === currentStep);
    step.classList.toggle('complete', index + 1 < currentStep);
  });
  backButton.hidden = currentStep === 1;
  nextButton.innerHTML = currentStep === panels.length ? 'Submit application <span>→</span>' : 'Continue <span>→</span>';
  if (currentStep === 4) buildReview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep() {
  const activePanel = panels[currentStep - 1];
  let valid = true;
  activePanel.querySelectorAll('[required]').forEach((input) => {
    const field = input.closest('.field');
    const message = field?.querySelector('.error-message');
    const groupMissing = input.type === 'radio' && !activePanel.querySelector(`input[name="${input.name}"]:checked`);
    if (!input.checkValidity() || groupMissing) {
      valid = false;
      field?.classList.add('invalid');
      if (message) message.textContent = input.type === 'radio' ? 'Please choose an option.' : 'This field is required.';
    } else if (field) {
      field.classList.remove('invalid');
      if (message) message.textContent = '';
    }
  });
  return valid;
}

function valueOf(id) { return document.querySelector(`#${id}`)?.value || 'Not provided'; }
function buildReview() {
  const selectedMode = document.querySelector('input[name="mode"]:checked')?.value || 'Not provided';
  reviewCard.innerHTML = `<div class="review-item"><span>Applicant</span><strong>${valueOf('firstName')} ${valueOf('lastName')}</strong></div><div class="review-item"><span>Email</span><strong>${valueOf('email')}</strong></div><div class="review-item"><span>Programme</span><strong>${valueOf('course')}</strong></div><div class="review-item"><span>Study mode</span><strong>${selectedMode}</strong></div><div class="review-item"><span>Institution</span><strong>${valueOf('institution')}</strong></div><div class="review-item"><span>Qualification</span><strong>${valueOf('qualification')}</strong></div>`;
}

nextButton.addEventListener('click', () => {
  if (!validateStep()) return;
  if (currentStep < panels.length) { showStep(currentStep + 1); return; }
  const consent = document.querySelector('#consent');
  if (!consent.checked) { document.querySelector('.consent-error').textContent = 'Please confirm the information is accurate.'; consent.focus(); return; }
  successMessage.classList.add('visible');
  nextButton.disabled = true;
  nextButton.textContent = 'Submitted';
  successMessage.focus();
});

backButton.addEventListener('click', () => showStep(currentStep - 1));
statement.addEventListener('input', () => { statement.nextElementSibling.textContent = `${statement.value.length} / 500`; });
form.addEventListener('input', (event) => { const field = event.target.closest('.field'); if (field) field.classList.remove('invalid'); });
