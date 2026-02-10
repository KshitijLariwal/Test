// QR Code Generator using qrserver.com API
const qrInput = document.getElementById('qrInput');
const generateBtn = document.getElementById('generateBtn');
const qrContainer = document.getElementById('qrContainer');
const qrImage = document.getElementById('qrImage');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const errorMsg = document.getElementById('errorMsg');
const loadingSpinner = document.getElementById('loadingSpinner');

const QR_API = 'https://api.qrserver.com/v1/create-qr-code/';

function hideError() {
  errorMsg.classList.remove('show');
  errorMsg.textContent = '';
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add('show');
  setTimeout(() => hideError(), 5000);
}

function showLoading(show = true) {
  loadingSpinner.classList.toggle('hidden', !show);
}

async function generateQRCode() {
  const text = qrInput.value.trim();

  if (!text) {
    showError('Please enter text or a URL');
    return;
  }

  hideError();
  showLoading(true);

  try {
    const encodedText = encodeURIComponent(text);
    const url = `${QR_API}?size=300x300&data=${encodedText}`;

    // Validate the URL works by attempting to load
    const img = new Image();
    img.onload = () => {
      qrImage.src = url;
      qrContainer.classList.remove('hidden');
      showLoading(false);
    };
    img.onerror = () => {
      showError('Failed to generate QR code. Please try again.');
      showLoading(false);
    };
    img.src = url;
  } catch (error) {
    showError('Error: ' + error.message);
    showLoading(false);
  }
}

function downloadQRCode() {
  const link = document.createElement('a');
  link.href = qrImage.src;
  link.download = 'qrcode.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function copyQRToClipboard() {
  try {
    const response = await fetch(qrImage.src);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    
    // Show temporary feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  } catch (error) {
    showError('Could not copy image to clipboard');
  }
}

// Event listeners
generateBtn.addEventListener('click', generateQRCode);
qrInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') generateQRCode();
});

downloadBtn.addEventListener('click', downloadQRCode);
copyBtn.addEventListener('click', copyQRToClipboard);

// Auto-generate on input change (optional, for real-time preview)
let typeTimeout;
qrInput.addEventListener('input', () => {
  clearTimeout(typeTimeout);
  // Debounce to avoid too many requests while typing
  typeTimeout = setTimeout(() => {
    if (qrInput.value.trim() && qrContainer.classList.contains('hidden') === false) {
      // Don't auto-generate, just allow manual generation
    }
  }, 1000);
});
