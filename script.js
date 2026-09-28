const textInput = document.getElementById('text-input');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const lineCount = document.getElementById('line-count');
const readingTime = document.getElementById('reading-time');

// Update statistics dynamically as user types
textInput.addEventListener('input', updateStats);

function updateStats() {
    const text = textInput.value;
    
    // Character count
    charCount.innerText = text.length;

    // Word count (filters out extra spaces)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount.innerText = words.length;

    // Line count
    const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;
    lineCount.innerText = lines;

    // Estimated Reading time (average 200 words per minute)
    const time = Math.ceil(words.length / 200);
    readingTime.innerText = words.length === 0 ? '0 min' : `${time} min`;
}

// Text Formatting Actions
function cleanSpaces() {
    textInput.value = textInput.value.replace(/\s+/g, ' ').trim();
    updateStats();
}

function toUpperCase() {
    textInput.value = textInput.value.toUpperCase();
    updateStats();
}

function toLowerCase() {
    textInput.value = textInput.value.toLowerCase();
    updateStats();
}

function toTitleCase() {
    textInput.value = textInput.value.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    updateStats();
}

function removeEmptyLines() {
    textInput.value = textInput.value.split(/\r?\n/).filter(line => line.trim() !== '').join('\n');
    updateStats();
}

function copyText() {
    if(!textInput.value) return;
    navigator.clipboard.writeText(textInput.value);
    alert('Text copied to clipboard!');
}

function clearText() {
    textInput.value = '';
    updateStats();
}

// Export TXT File
function downloadAsTXT() {
    if(!textInput.value) return;
    const blob = new Blob([textInput.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TextCraft-Document.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Export PDF File (Clean & Direct Text Rendering)
function downloadAsPDF() {
    if (!textInput.value) {
        alert('Please enter some text first!');
        return;
    }

    // Create container
    const element = document.createElement('div');
    element.style.padding = '10mm';
    element.style.fontSize = '12pt';
    element.style.lineHeight = '1.6';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.color = '#000000';
    element.style.whiteSpace = 'pre-wrap';
    element.style.wordBreak = 'break-word';
    element.innerText = textInput.value;

    const opt = {
        margin:       [15, 15, 15, 15],
        filename:     'TextCraft-Document.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true,
            windowWidth: 800, // Fixed render width prevents top whitespace
            scrollY: 0
        },
        pagebreak:    { mode: ['css', 'legacy'] },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}