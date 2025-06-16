import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportExposeAsPDF({ beschreibung, lage, besonderheiten, stil }) {
  const doc = new jsPDF("p", "mm", "a4");
  const margin = 15;
  const maxWidth = 180;
  let y = margin;

  const title = "📄 Immobilien-Exposé";
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, y);
  y += 10;

  const section = (label, content) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(content || "–", maxWidth), margin, y);
    y += 12;
  };

  section("Beschreibung", beschreibung);
  section("Lage", lage);
  section("Besonderheiten", besonderheiten);
  section("Stil", stil);

  doc.save("Expose.pdf");
}
