const textInput = document.getElementById('textInput');
const fontSelect = document.getElementById('fontSelect');
const preview = document.getElementById('preview');
const sizeRange = document.getElementById('sizeRange');

// FIXED: Using JS Delivr and removing trailing slash to prevent // errors
figlet.defaults({ fontPath: 'https://cdn.jsdelivr.net/npm/figlet@1.6.0/fonts' });

const fonts = ['Standard', 'Slant', 'Doom', 'Big', 'Small', 'Shadow', 'Script'];
let currentArt = '';

function updateUI() {
    preview.style.fontSize = `${sizeRange.value}px`;
    preview.textContent = currentArt;
}

function generate() {
    const text = textInput.value || ' ';
    const font = fontSelect.value || 'Standard';

    preview.textContent = 'Generating...';

    figlet.text(text, { font: font }, (err, data) => {
        if (err) {
            console.error(err);
            currentArt = 'Error: CORS or Network Issue';
        } else {
            currentArt = data;
        }
        updateUI();
    });
}

// Event Listeners
textInput.addEventListener('input', generate);
fontSelect.addEventListener('change', generate);
sizeRange.addEventListener('input', updateUI);

// Copy to Clipboard
document.getElementById('copyBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(currentArt);
    alert('Copied!');
});

// Download TXT
document.getElementById('downloadTxtBtn').addEventListener('click', () => {
    const blob = new Blob([currentArt], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ascii-art.txt';
    a.click();
});

// Download PNG
document.getElementById('downloadPngBtn').addEventListener('click', () => {
    const lines = currentArt.split('\n');
    const fontSize = parseInt(sizeRange.value);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.font = `${fontSize}px monospace`;
    const maxWidth = Math.max(...lines.map(l => ctx.measureText(l).width));
    
    canvas.width = maxWidth + 40;
    canvas.height = (lines.length * fontSize * 1.1) + 40;

    ctx.fillStyle = '#031426';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#dff6ff';
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    lines.forEach((line, i) => {
        ctx.fillText(line, 20, 20 + (i * fontSize * 1.1));
    });

    const link = document.createElement('a');
    link.download = 'ascii-art.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Initialize
fonts.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f;
    fontSelect.appendChild(opt);
});

generate();