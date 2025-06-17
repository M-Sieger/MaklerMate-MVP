import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportExposeAsPDF(formData, gptText) {
  const input = document.getElementById('pdf-export-section');
  if (!input) {
    console.error("❌ PDF-Export-Element nicht gefunden");
    return;
  }

  const canvas = await html2canvas(input, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Optional: Logo oben links hinzufügen
  const logoElement = document.getElementById('pdf-logo');
  if (logoElement) {
    const logoCanvas = await html2canvas(logoElement, { scale: 2 });
    const logoData = logoCanvas.toDataURL('image/png');
    pdf.addImage(logoData, 'PNG', 15, 10, 50, 20);
  }

  pdf.addImage(imgData, 'PNG', 10, 35, 190, 0); // Bild vom Inhalt einfügen
  pdf.save('Expose.pdf');
}
