// ASCII Art Generator (figlet.js client-side)
const textInput = document.getElementById('textInput');
const fontSelect = document.getElementById('fontSelect');
const preview = document.getElementById('preview');
const copyBtn = document.getElementById('copyBtn');
const downloadTxtBtn = document.getElementById('downloadTxtBtn');
const downloadPngBtn = document.getElementById('downloadPngBtn');
const sizeRange = document.getElementById('sizeRange');

let currentArt = '';
let fontsList = [];

function renderPreview() {
  const size = Number(sizeRange.value) || 14;
  preview.style.fontSize = size + 'px';
  preview.textContent = currentArt;
}

// generate using figlet
function generateArt() {
  const text = textInput.value || '';
  if (!text.trim()) {
    currentArt = '';
    renderPreview();
    return;
  }
  
  const font = fontSelect.value || 'Standard';
  preview.textContent = 'Generating...';

  // Figlet generation
  figlet.text(text, { font: font }, (err, data) => {
    if (err) {
      console.error('Figlet error:', err); // Debugging info
      currentArt = 'Could not generate ASCII art.\n(Check console for details)';
    } else {
      // Remove carriage returns for cleaner display
      currentArt = data; 
    }
    renderPreview();
  });
}

// debounce (prevents generating on every single keystroke instantly)
let debounceTimer;
function scheduleGenerate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(generateArt, 200);
}

// --- BUTTON EVENT LISTENERS ---

copyBtn.addEventListener('click', async () => {
  if (!currentArt) return;
  try {
    await navigator.clipboard.writeText(currentArt);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied ✓';
    setTimeout(() => copyBtn.textContent = originalText, 1400);
  } catch (e) {
    copyBtn.textContent = 'Failed';
    setTimeout(() => copyBtn.textContent = 'Copy Text', 1400);
  }
});

downloadTxtBtn.addEventListener('click', () => {
  if (!currentArt) return;
  const blob = new Blob([currentArt], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ascii-art.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

downloadPngBtn.addEventListener('click', () => {
  if (!currentArt) return;
  const lines = currentArt.split('\n');
  const fontSize = Number(sizeRange.value) || 14;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Measure width
  ctx.font = `${fontSize}px monospace`;
  const width = Math.max(...lines.map(l => ctx.measureText(l).width)) + 20;
  // Calculate height roughly based on font size
  const lineHeight = fontSize * 1.2;
  const height = (lines.length * lineHeight) + 20;
  
  canvas.width = Math.ceil(width);
  canvas.height = Math.ceil(height);
  
  // Background
  ctx.fillStyle = '#031426';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Text
  ctx.fillStyle = '#dff6ff';
  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = 'top';
  
  let y = 10;
  for (const line of lines) {
    ctx.fillText(line, 10, y);
    y += lineHeight;
  }
  
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'ascii-art.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// --- INITIALIZATION ---

textInput.addEventListener('input', scheduleGenerate);
fontSelect.addEventListener('change', scheduleGenerate);
sizeRange.addEventListener('input', renderPreview);

// Configure Figlet
figlet.defaults({ fontPath: 'https://cdnjs.cloudflare.com/ajax/libs/figlet/1.2.4/fonts/' });

// Try to load fonts list, but provide a manual fallback because 
// CDNs usually block directory listing (which figlet.fonts uses).
const fallbackFonts = ['Standard', 'Slant', 'Doom', 'Big', 'Ogre', 'Shadow', 'Script', 'Banner', 'Block', 'Bubble', 'Lean', 'Mini', 'Small'];

figlet.fonts((err, list) => {
  // If the CDN fetch works, use it. If not, use our manual list.
  fontsList = (list && list.length > 0) ? list : fallbackFonts;
  
  fontSelect.innerHTML = '';
  fontsList.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f;
    fontSelect.appendChild(opt);
  });

  // Set default
  if (fontsList.includes('Standard')) fontSelect.value = 'Standard';
  else fontSelect.value = fontsList[0];

  scheduleGenerate();
});