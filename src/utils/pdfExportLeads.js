// 📄 src/utils/pdfExportLeads.js
// ✅ Exportiert gespeicherte Leads als saubere PDF-Tabelle

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// 🧾 Exportfunktion: erzeugt PDF mit allen Leads
export function exportLeadsAsPDF(leads) {
  const doc = new jsPDF(); // ➕ Neues A4-Dokument
  doc.setFontSize(16);
  doc.text('MaklerMate – Lead-Export', 14, 20); // 📌 Titel setzen

  const tableData = leads.map((lead, i) => [
    i + 1,
    lead.name || '',
    lead.notiz || '',
    lead.status || '',
  ]);

  // ❗ FIX: Richtig aufrufen → autoTable(doc, { ... })
  autoTable(doc, {
    startY: 30,
    head: [['#', 'Name', 'Notiz', 'Status']],
    body: tableData,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] }, // 🎨 Tailwind-Blau
  });

  doc.save('leads-export.pdf');
}
// 📝 Hinweis: autoTable benötigt jsPDF und muss separat installiert werden