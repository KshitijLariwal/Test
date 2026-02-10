// Basic calculator logic
const previousEl = document.getElementById('previous');
const currentEl = document.getElementById('current');
const numButtons = document.querySelectorAll('.btn.num');
const opButtons = document.querySelectorAll('.btn.op');
const clearBtn = document.getElementById('clear');
const deleteBtn = document.getElementById('delete');
const equalsBtn = document.getElementById('equals');

let current = '';
let previous = '';
let operation = null;

function updateDisplay() {
  currentEl.textContent = current === '' ? '0' : current;
  previousEl.textContent = previous && operation ? `${previous} ${formatOp(operation)}` : '';
}

function appendNumber(n) {
  if (current === 'Error') current = '';
  if (n === '.' && current.includes('.')) return;
  if (n === '.' && current === '') current = '0';
  current = current + n;
}

function chooseOperation(op) {
  if (current === '' && previous === '') return;
  if (previous !== '' && current !== '') {
    compute();
  }
  if (current !== '') {
    previous = current;
    current = '';
  }
  operation = op;
}

function clearAll() {
  current = '';
  previous = '';
  operation = null;
}

function deleteDigit() {
  if (current !== '') {
    current = current.slice(0, -1);
  }
}

function compute() {
  const prev = parseFloat(previous);
  const curr = parseFloat(current);
  if (isNaN(prev) || isNaN(curr)) return;
  let result = 0;
  switch (operation) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/': result = curr === 0 ? 'Error' : prev / curr; break;
    default: return;
  }
  current = String(result === 'Error' ? 'Error' : roundResult(result));
  previous = '';
  operation = null;
}

function roundResult(v) {
  // avoid long floating results
  return Math.round((v + Number.EPSILON) * 1e10) / 1e10;
}

function formatOp(op) {
  if (op === '*') return '×';
  if (op === '/') return '÷';
  if (op === '-') return '−';
  return op;
}

// wire buttons
numButtons.forEach(b => b.addEventListener('click', () => {
  appendNumber(b.dataset.num);
  updateDisplay();
}));

opButtons.forEach(b => b.addEventListener('click', () => {
  chooseOperation(b.dataset.op);
  updateDisplay();
}));

clearBtn.addEventListener('click', () => {
  clearAll();
  updateDisplay();
});

deleteBtn.addEventListener('click', () => {
  deleteDigit();
  updateDisplay();
});

equalsBtn.addEventListener('click', () => {
  if (previous !== '' && current !== '') {
    compute();
    updateDisplay();
  }
});

// keyboard support
window.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    appendNumber(e.key);
    updateDisplay();
    return;
  }
  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    chooseOperation(e.key);
    updateDisplay();
    return;
  }
  if (e.key === 'Enter' || e.key === '=') {
    if (previous !== '' && current !== '') {
      compute(); updateDisplay();
    }
    return;
  }
  if (e.key === 'Backspace') { deleteDigit(); updateDisplay(); return; }
  if (e.key === 'Escape') { clearAll(); updateDisplay(); return; }
});

// init
updateDisplay();
