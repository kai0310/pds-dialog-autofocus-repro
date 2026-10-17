import './style.css';

const modal = document.querySelector('#modal');
const input = document.querySelector('#email');
const SAMPLES = [0, 50, 100, 300, 1000];

const label = (el) => `${el.localName}${el.id ? `#${el.id}` : ''}`;

// The focused element, followed through open shadow roots, e.g. "p-input-text#email > input"
const focusPath = () => {
  const path = [];
  let el = document.activeElement;
  while (el) {
    path.push(label(el));
    el = el.shadowRoot?.activeElement ?? null;
  }
  return path.join(' > ');
};

const strategies = {
  'focus() right after open': () => {
    modal.open = true;
    input.focus();
  },
  'focus() in requestAnimationFrame': () => {
    modal.open = true;
    requestAnimationFrame(() => input.focus());
  },
  'focus() in setTimeout(…, 0)': () => {
    modal.open = true;
    setTimeout(() => input.focus(), 0);
  },
  'focus() on motionVisibleEnd': () => {
    modal.addEventListener('motionVisibleEnd', () => input.focus(), { once: true });
    modal.open = true;
  },
  'autofocus attribute on the input': () => {
    input.setAttribute('autofocus', '');
    modal.open = true;
  },
};

const close = () =>
  new Promise((resolve) => {
    if (!modal.open) return resolve();
    modal.addEventListener('motionHiddenEnd', resolve, { once: true });
    modal.open = false;
  });

const results = document.querySelector('#results');
const rows = {};
const buttons = document.querySelector('#strategies');

for (const [name, open] of Object.entries(strategies)) {
  const row = document.createElement('tr');
  row.innerHTML = `<th scope="row">${name}</th>${SAMPLES.map(() => '<td>–</td>').join('')}`;
  results.append(row);
  rows[name] = row;

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = name;
  button.addEventListener('click', async () => {
    await close();
    input.removeAttribute('autofocus');
    document.activeElement?.blur();
    const cells = row.querySelectorAll('td');
    cells.forEach((cell) => (cell.textContent = '…'));
    const start = performance.now();
    open();
    SAMPLES.forEach((ms, i) =>
      setTimeout(() => {
        const path = focusPath();
        cells[i].textContent = path;
        cells[i].className = path.includes('#email') ? 'good' : 'bad';
        if (i === SAMPLES.length - 1) close();
      }, Math.max(0, ms - (performance.now() - start))),
    );
  });
  buttons.append(button);
}

modal.addEventListener('dismiss', () => (modal.open = false));
