const form = document.querySelector('#applicationForm');
const statement = document.querySelector('#statement');
const characterCount = document.querySelector('#characterCount');
const successMessage = document.querySelector('#successMessage');
const formError = document.querySelector('#formError');
const examTable = document.querySelector('#examTable');
const subjectTable = document.querySelector('#subjectTable');

function createGradeOptions() {
  return `
    <option value="">Select grade</option>
    <option>A*</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
    <option>D</option>
    <option>E</option>
    <option>F</option>
  `;
}

function createExamRow() {
  const row = document.createElement('div');
  row.className = 'table-row exam-row';
  row.innerHTML = `
    <input type="text" placeholder="Year" aria-label="Exam year">
    <select aria-label="English grade">
      ${createGradeOptions()}
    </select>
    <input type="text" placeholder="Year" aria-label="Math year">
    <select aria-label="Math grade">
      ${createGradeOptions()}
    </select>
    <button type="button" class="remove-row">Remove</button>
  `;

  row.querySelector('.remove-row').addEventListener('click', () => row.remove());
  return row;
}

function createSubjectRow() {
  const row = document.createElement('div');
  row.className = 'table-row subject-row';
  row.innerHTML = `
    <input type="text" placeholder="Subject" aria-label="Subject name">
    <select aria-label="Subject grade">
      ${createGradeOptions()}
    </select>
    <button type="button" class="remove-row">Remove</button>
  `;

  row.querySelector('.remove-row').addEventListener('click', () => row.remove());
  return row;
}

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

document.querySelector('.add-exam-btn').addEventListener('click', () => {
  examTable.appendChild(createExamRow());
});

document.querySelector('.add-subject-btn').addEventListener('click', () => {
  subjectTable.appendChild(createSubjectRow());
});

document.querySelectorAll('.remove-row').forEach((button) => {
  button.addEventListener('click', () => button.closest('.table-row')?.remove());
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
