'use strict';

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
const stackedNav = matchMedia('(max-width: 62rem)');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
}

document.body.classList.add('nav-ready');
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
stackedNav.addEventListener('change', () => {
  if (!stackedNav.matches && document.activeElement === menu) nav.querySelector('a').focus();
  if (stackedNav.matches && nav.contains(document.activeElement)) menu.focus();
  setMenu(false);
});

nav.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || menu.getAttribute('aria-expanded') !== 'true' ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const section = document.getElementById(link.hash.slice(1));
  if (section) {
    section.tabIndex = -1;
    section.focus({ preventScroll: true });
  }
  setMenu(false);
});

const buildControls = document.querySelectorAll('[data-build-toggle]');
const buildFeedback = document.querySelector('#build-feedback');
const buildIndicators = document.querySelectorAll('[data-build-state]');

function toggleBuildMode() {
  const lit = document.body.classList.toggle('build-on');
  buildControls.forEach(control => control.setAttribute('aria-pressed', String(lit)));
  buildIndicators.forEach(indicator => { indicator.textContent = lit ? 'On' : 'Off'; });
  buildFeedback.textContent = lit ? 'Build mode on.' : 'Build mode off.';
}

buildControls.forEach(control => control.addEventListener('click', toggleBuildMode));

const modal = document.querySelector('#modal');
const modalTitle = document.querySelector('#mTitle');
const modalDescription = document.querySelector('#mSub');
const modalBody = document.querySelector('#mBody');
const modalFeedback = document.querySelector('#mFeedback');
const closeModal = document.querySelector('#mClose');

document.addEventListener('keydown', event => {
  if (modal.open || event.defaultPrevented) return;

  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }

  if (event.key.toLowerCase() === 'b' && event.ctrlKey &&
      !event.metaKey && !event.altKey && !event.shiftKey && !event.isComposing &&
      !(event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'))) {
    event.preventDefault();
    if (!event.repeat) toggleBuildMode();
  }
});

const packages = {
  Title: 'Title, $10,000',
  Gold: 'Gold, $5,000',
  Silver: 'Silver, $2,500',
  Community: 'Community, $1,000',
  'In-kind': 'In-kind'
};

function inputField(name, label, type, autocomplete, required = true) {
  return `<div class="field">
    <label for="form-${name}">${label}</label>
    <input id="form-${name}" name="${name}" type="${type}" autocomplete="${autocomplete}" ${type === 'email' ? 'spellcheck="false"' : ''} ${required ? 'required' : ''} aria-describedby="form-${name}-error">
    <span class="field-error" id="form-${name}-error"></span>
  </div>`;
}

function selectField(name, label, options, autocomplete = 'off') {
  return `<div class="field">
    <label for="form-${name}">${label}</label>
    <select id="form-${name}" name="${name}" autocomplete="${autocomplete}">
      ${options.map(option => `<option>${option}</option>`).join('')}
    </select>
  </div>`;
}

const forms = {
  notify: {
    title: 'Get notified',
    description: 'One email when applications open in January.',
    button: 'Get notified',
    fields: `
      ${inputField('name', 'Full name', 'text', 'name')}
      ${inputField('email', 'Email', 'email', 'email')}
      <div class="form-row">
        ${selectField('school', 'School', ['University of Toronto', 'University of Waterloo', 'Toronto Metropolitan University', 'York University', 'Another school'])}
        ${selectField('year', 'Year', ['First', 'Second', 'Third', 'Fourth or later', 'Graduate'])}
      </div>
      <div>
        <label class="check-field" for="form-consent">
          <input type="checkbox" name="consent" id="form-consent" required aria-describedby="form-consent-error">
          <span>Email me about CTRL Build. I can unsubscribe any time.</span>
        </label>
        <span class="field-error" id="form-consent-error"></span>
      </div>`
  },
  sponsor: {
    title: 'Sponsor a challenge',
    description: 'Tell us a little about your company and the problem you would bring.',
    button: 'Send to the team',
    fields: `
      ${inputField('name', 'Your name', 'text', 'name')}
      <div class="form-row">
        ${inputField('company', 'Company', 'text', 'organization')}
        ${inputField('email', 'Work email', 'email', 'email')}
      </div>
      ${selectField('package', 'Package', ['Not sure yet', ...Object.values(packages)])}
      <div class="field">
        <label for="form-problem">What problem would you bring? (optional)</label>
        <textarea id="form-problem" name="problem" autocomplete="off"></textarea>
      </div>
      <label class="check-field" for="form-call">
        <input type="checkbox" name="call" id="form-call">
        <span>I’d like a 20-minute call</span>
      </label>
      <div id="form-call-time" hidden>
        ${selectField('time', 'Best time for a call', ['Weekday mornings', 'Weekday afternoons', 'Weekday evenings'])}
      </div>`
  },
  prospectus: {
    title: 'Get the prospectus',
    description: 'Sponsorship packages, audience and how challenges work.',
    button: 'Email me the prospectus',
    fields: `
      ${inputField('name', 'Your name', 'text', 'name')}
      ${inputField('email', 'Work email', 'email', 'email')}
      ${inputField('company', 'Company (optional)', 'text', 'organization', false)}`
  }
};

function validateField(field) {
  const value = field.value.trim();
  let message = '';

  if (field.type === 'checkbox' && !field.checked) {
    message = 'Check this box so we can email you.';
  } else if (!value) {
    message = `Enter your ${field.labels[0].textContent.toLowerCase().replace(/^your\s+/, '')}.`;
  } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    message = 'Enter an email like name@mail.utoronto.ca.';
  }

  document.getElementById(field.getAttribute('aria-describedby')).textContent = message;
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
  return message;
}

let modalTrigger;

function openModal(trigger) {
  const kind = trigger.dataset.open;
  const isCall = kind === 'call';
  const formKind = isCall ? 'sponsor' : kind;
  if (!Object.hasOwn(forms, formKind) || modal.open) return;
  const view = forms[formKind];

  modalTrigger = trigger;
  modalTitle.textContent = isCall ? 'Book a call' : view.title;
  modalDescription.textContent = isCall ? 'Pick a time for a 20-minute call with the sponsorship team.' : view.description;
  modalFeedback.textContent = '';
  modalBody.innerHTML = `<p class="form-note">Preview form. Entries stay on this page.</p>
    <form novalidate>${view.fields}<button class="button button-primary" type="submit">${isCall ? 'Request a call' : view.button}</button></form>`;

  const form = modalBody.querySelector('form');
  const packageSelect = form.elements.namedItem('package');
  if (packageSelect && Object.hasOwn(packages, trigger.dataset.pkg)) {
    packageSelect.value = packages[trigger.dataset.pkg];
  }

  const call = form.elements.namedItem('call');
  if (call) {
    const callTime = form.querySelector('#form-call-time');
    call.checked = isCall;
    callTime.hidden = !call.checked;
    call.addEventListener('change', () => { callTime.hidden = !call.checked; });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const errors = Array.from(form.querySelectorAll('[required]'), field => ({ field, message: validateField(field) }))
      .filter(error => error.message);

    if (errors.length) {
      modalFeedback.textContent = `Check ${errors.length} ${errors.length === 1 ? 'field' : 'fields'} below the heading.`;
      errors[0].field.focus();
      return;
    }

    modalBody.textContent = '';
    modalFeedback.textContent = 'Form checked. This preview sends no information.';
    closeModal.focus();
  });

  form.addEventListener('input', event => {
    if (event.target.getAttribute('aria-invalid') === 'true') validateField(event.target);
  });

  modal.showModal();
  (form.querySelector('input, select, textarea') || closeModal).focus();
}

document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-open]');
  if (trigger) openModal(trigger);
});

closeModal.addEventListener('click', () => modal.close());
modal.addEventListener('click', event => {
  if (event.target === modal) modal.close();
});
modal.addEventListener('close', () => {
  modalTrigger?.focus();
  modalTrigger = undefined;
});
