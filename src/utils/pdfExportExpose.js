// 📄 src/utils/pdfExportExpose.js

import jsPDF from 'jspdf';

// 📥 Hauptfunktion: Exportiert GPT-Text + Bilder + Captions als PDF
export const exportExposeWithImages = async (gptText, images = [], captions = []) => {
  // 🧾 Neues PDF-Dokument erzeugen
  const pdf = new jsPDF();

  // ✍️ GPT-Text einfügen (oben auf Seite 1)
  pdf.setFont('courier');          // Schlichtes Monospace-Layout
  pdf.setFontSize(10);             // Lesbare Schriftgröße

  // 🧠 Falls kein Text: leerer String – vermeidet "object Object"-Bug
  const safeText = String(gptText || '');

  // 🔠 Zeilen umbrechen auf max. 180px Breite
  const lines = pdf.splitTextToSize(safeText, 180);

  // 📝 Text auf Seite 1 schreiben (Startkoordinaten: x=15, y=20)
  pdf.text(lines, 15, 20);

  // 📍 Y-Position unter dem letzten Textblock vorbereiten
  let currentY = 30 + lines.length * 5;

  // 📸 Bilder + Captions (sofern vorhanden) einfügen
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const caption = captions[i] || '';

    try {
      // 📐 Seitenverhältnis ermitteln
      const imgProps = pdf.getImageProperties(img);
     const aspectRatio = (imgProps.width || 1) / (imgProps.height || 1);

      // 📏 Bildgrößen definieren
     const imgWidth = 120;
const imgHeight = Math.min(imgWidth / aspectRatio, 100); // 🔒 Maximalhöhe
      // 📄 Wenn zu weit unten → neue Seite einfügen
      if (currentY + imgHeight + 20 > 280) {
        pdf.addPage();
        currentY = 20;
      }

      // 🖼️ Bild mittig einfügen
      pdf.addImage(img, 'JPEG', 45, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 5;

      // 🏷️ Caption unter Bild (nur wenn nicht leer)
      if (caption.trim() !== '') {
        pdf.setFontSize(10);
        pdf.text(caption, 15, currentY); // linksbündig
        currentY += 10;
      }
    } catch (err) {
      console.error(`❌ Fehler beim Einfügen von Bild ${i + 1}:`, err);
        throw err; // ← temporär wieder werfen!
    }
  }

  // 💾 PDF speichern
  pdf.save('expose.pdf');
};
