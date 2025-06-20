// 📄 src/utils/pdfExportExpose.js
// ✅ Exportiert den sichtbaren Bereich eines Exposés (HTML-Inhalt) als PDF via Screenshot

import html2canvas from 'html2canvas';        // � HTML-zu-Bild-Konverter
import jsPDF from 'jspdf';                    // � PDF-Generator

// 📤 Funktion: HTML-Block mit GPT-Text + Form in PDF umwandeln
export async function exportExposeAsPDF(formData, gptText) {
  const input = document.getElementById('pdf-export-section'); // 🔍 Zielbereich
  if (!input) {
    console.error("❌ PDF-Export-Element nicht gefunden");
    return;
  }

  // 🖼️ Screenshot vom HTML erzeugen
  const canvas = await html2canvas(input, { scale: 2 }); // gute Qualität
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // 🖼️ Optional: Logo oben einfügen
  const logoElement = document.getElementById('pdf-logo');
  if (logoElement) {
    const logoCanvas = await html2canvas(logoElement, { scale: 2 });
    const logoData = logoCanvas.toDataURL('image/png');
    pdf.addImage(logoData, 'PNG', 15, 10, 50, 20); // 🔝 Logo-Position
  }

  // 📄 Exposé-Inhalt einfügen
  pdf.addImage(imgData, 'PNG', 10, 35, 190, 0);

  // 💾 Speichern
  pdf.save('Expose.pdf');
}
