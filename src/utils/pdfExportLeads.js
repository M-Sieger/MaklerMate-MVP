// 📄 src/utils/pdfExportLeads.js
// ✅ Exportiert gespeicherte Leads als saubere PDF-Tabelle

import 'jspdf-autotable';                    // � Tabellen-Addon

import jsPDF
  from 'jspdf';                   // � Hauptbibliothek für PDF-Erzeugung

// 🧾 Exportfunktion: erzeugt PDF mit allen Leads
export function exportLeadsAsPDF(leads) {
  const doc = new jsPDF();                   // ➕ Neues A4-Dokument
  doc.setFontSize(16);
  doc.text('MaklerMate – Lead-Export', 14, 20); // 📌 Titel setzen

  // 📊 Tabelleninhalt vorbereiten (Index + Felder)
  const tableData = leads.map((lead, i) => [
    i + 1,
    lead.name || '',
    lead.notiz || '',
    lead.status || ''
  ]);

  // 📋 Tabelle einfügen mit Kopfzeile
  doc.autoTable({
    startY: 30,
    head: [['#', 'Name', 'Notiz', 'Status']],
    body: tableData,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] } // 🎨 Tailwind-Blau
  });

  // 💾 PDF speichern
  doc.save('leads-export.pdf');
}
