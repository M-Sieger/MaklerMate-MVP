// 📄 src/utils/pdfExportExpose.js

import jsPDF from 'jspdf';

// 📥 Exportfunktion mit Bildern + Captions
export const exportExposeWithImages = async (gptText, images = [], captions = []) => {
  const pdf = new jsPDF();

  // ✍️ GPT-Text auf PDF einfügen
  pdf.setFont('courier');
  pdf.setFontSize(10);
  const lines = pdf.splitTextToSize(gptText, 180); // Text auf max. Breite umbrechen
  pdf.text(lines, 15, 20);

  let currentY = 30 + lines.length * 5; // ⬇️ Startpunkt unter GPT-Text

  // 📸 Bilder + Unterschriften durchgehen
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const caption = captions[i] || '';

    try {
      const imgProps = pdf.getImageProperties(img);
      const aspectRatio = imgProps.width / imgProps.height;

      const imgWidth = 120;
      const imgHeight = imgWidth / aspectRatio;

      // 📌 Seitenumbruch falls nötig
      if (currentY + imgHeight + 20 > 280) {
        pdf.addPage();
        currentY = 20;
      }

      // 🖼️ Bild
      pdf.addImage(img, 'JPEG', 45, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 5;

      // 🏷️ Unterschrift
      if (caption.trim() !== '') {
        pdf.setFontSize(10);
        pdf.text(caption, 15, currentY);
        currentY += 10;
      }
    } catch (err) {
      console.error(`Fehler beim Einfügen von Bild ${i + 1}:`, err);
    }
  }

  // 💾 Speichern
  pdf.save('expose.pdf');
};
