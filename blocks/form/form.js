import siteConfig from '../../scripts/site-config.js';

/**
 * form — an inquiry form authored as a table, submitted to Formspree (site-config.js).
 * Reconstructive: one row per field. Cells:
 *   1 label (the field's name in the submission) | 2 type | 3 placeholder, or a list of options
 *   for `select` | 4 flags: required, full (spans both columns)
 * Special types: `submit` (cell 1 = button label, cell 3 = note beside it),
 * `success` (cell 1 = content shown after a successful submit).
 * Authored label, note and success elements are MOVED into the form (EW1); inputs and the
 * submit <button> are generated controls.
 * @variants block: compact (single column, home closing section)
 * @ew-exempt cells 2 and 4 (type keyword and flags are configuration)
 * Schema: stardust/eds-schema/contact.json (section contact)
 */
const TYPES = ['text', 'email', 'tel', 'date', 'number', 'select', 'textarea'];

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildControl(type, id, name, placeholderCell) {
  if (type === 'select') {
    const select = document.createElement('select');
    const prompt = document.createElement('option');
    prompt.value = '';
    prompt.disabled = true;
    prompt.selected = true;
    prompt.textContent = 'Select one';
    select.append(prompt);
    placeholderCell?.querySelectorAll('li').forEach((li) => {
      const option = document.createElement('option');
      option.value = li.textContent.trim();
      option.textContent = li.textContent.trim();
      select.append(option);
    });
    Object.assign(select, { id, name });
    return select;
  }
  const control = document.createElement(type === 'textarea' ? 'textarea' : 'input');
  if (type !== 'textarea') control.type = type;
  Object.assign(control, { id, name });
  const placeholder = placeholderCell?.textContent.trim();
  if (placeholder) control.placeholder = placeholder;
  return control;
}

function buildField(cells, index) {
  const [labelCell, , placeholderCell, flagCell] = cells;
  const type = cells[1].textContent.trim().toLowerCase();
  const flags = (flagCell?.textContent || '').toLowerCase();
  const name = labelCell.textContent.trim();
  const id = `form-${slug(name) || index}`;
  const field = document.createElement('div');
  field.className = `form-field${flags.includes('full') || type === 'textarea' ? ' form-field-full' : ''}`;
  const label = document.createElement('label');
  label.htmlFor = id;
  label.append(...labelCell.childNodes);
  const control = buildControl(type, id, name, placeholderCell);
  if (flags.includes('required')) control.required = true;
  if (type === 'email') control.autocomplete = 'email';
  if (type === 'tel') control.autocomplete = 'tel';
  field.append(label, control);
  return field;
}

async function submit(form, block) {
  const status = block.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  status.textContent = '';
  button.disabled = true;
  try {
    const resp = await fetch(`https://formspree.io/f/${siteConfig.formspree}`, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      throw new Error(data.errors?.map((e) => e.message).join(' ') || `Error ${resp.status}`);
    }
    block.classList.add('form-sent');
    block.querySelector('.form-success')?.focus();
  } catch (e) {
    status.textContent = e.message;
  } finally {
    button.disabled = false;
  }
}

export default function decorate(block) {
  const form = document.createElement('form');
  const grid = document.createElement('div');
  grid.className = 'form-fields';
  const footer = document.createElement('div');
  footer.className = 'form-submit';
  const success = document.createElement('div');
  success.className = 'form-success';
  success.tabIndex = -1;
  const status = document.createElement('div');
  status.className = 'form-status';
  status.setAttribute('role', 'alert');

  const subject = document.createElement('input');
  Object.assign(subject, { type: 'hidden', name: '_subject', value: siteConfig.formSubject });
  form.append(subject);
  if (block.classList.contains('compact') && siteConfig.compactCc) {
    const cc = document.createElement('input');
    Object.assign(cc, { type: 'hidden', name: '_cc', value: siteConfig.compactCc });
    form.append(cc);
  }

  [...block.children].forEach((row, i) => {
    const cells = [...row.children];
    const type = (cells[1]?.textContent || '').trim().toLowerCase();
    if (type === 'submit') {
      const note = document.createElement('div');
      note.className = 'form-submit-note';
      if (cells[2]) note.append(...cells[2].childNodes);
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'button primary';
      button.append(...cells[0].childNodes);
      footer.append(note, button);
    } else if (type === 'success') {
      success.append(...cells[0].childNodes);
    } else if (TYPES.includes(type)) {
      grid.append(buildField(cells, i));
    }
  });

  form.append(grid, footer);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submit(form, block);
  });
  block.replaceChildren(status, form, success);
}
