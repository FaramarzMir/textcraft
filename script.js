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

// Export PDF File (Pure Native jsPDF Solution - Unlimited Pages & Zero Top Gap)
function downloadAsPDF() {
    if (!textInput.value) {
        alert('Please enter some text first!');
        return;
    }

    // Access jsPDF from window namespace
    const { jsPDF } = window.jspdf || {};
    
    // Fallback if jsPDF direct library is used
    const doc = jsPDF ? new jsPDF({ unit: 'mm', format: 'a4' }) : new jspdf.jsPDF({ unit: 'mm', format: 'a4' });

    // Page & Margin Settings
    const pageHeight = doc.internal.pageSize.getHeight(); // ~297mm
    const pageWidth = doc.internal.pageSize.getWidth();   // ~210mm
    const marginTop = 15;
    const marginBottom = 15;
    const marginLeft = 15;
    const marginRight = 15;
    const printableWidth = pageWidth - marginLeft - marginRight; // 180mm

    // Font Configuration
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);

    // Split raw text into wrapped lines that fit within printable width
    const lines = doc.splitTextToSize(textInput.value, printableWidth);

    let cursorY = marginTop;
    const lineHeight = 6.5; // Distance between lines in mm

    // Render line by line with auto page creation
    lines.forEach(line => {
        if (cursorY + lineHeight > pageHeight - marginBottom) {
            doc.addPage();
            cursorY = marginTop; // Reset cursor to top for new page
        }
        doc.text(line, marginLeft, cursorY);
        cursorY += lineHeight;
    });

    // Save generated PDF
    doc.save('TextCraft-Document.pdf');
}
function downloadAsPDF() {
    if (!textInput.value) {
        alert('Please enter some text first!');
        return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('PDF library failed to load. Check your internet connection.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginTop = 15, marginBottom = 15, marginLeft = 15, marginRight = 15;
    const printableWidth = pageWidth - marginLeft - marginRight;
    const lineHeight = 6.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    // هر پاراگراف جدا wrap میشه تا خطوط خالی حفظ بشن
    const paragraphs = textInput.value.split(/\r?\n/);
    let cursorY = marginTop + 4; // jsPDF متن رو از baseline می‌نویسه

    paragraphs.forEach(par => {
        const lines = par === '' ? [''] : doc.splitTextToSize(par, printableWidth);
        lines.forEach(line => {
            if (cursorY > pageHeight - marginBottom) {
                doc.addPage();
                cursorY = marginTop + 4;
            }
            if (line) doc.text(line, marginLeft, cursorY);
            cursorY += lineHeight;
        });
    });

    doc.save('TextCraft-Document.pdf');
}