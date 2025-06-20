// 📄 src/utils/pdfExportLeads.js
// ✅ Exportiert alle gespeicherten Leads als übersichtliche Tabelle im PDF-Format

import 'jspdf-autotable';                   // � Erweiterung für Tabellen in PDF

import jsPDF
  from 'jspdf';                  // � Hauptbibliothek zur PDF-Erzeugung

// 🧾 Exportfunktion für Leads (Name, Notiz, Status)
export function exportLeadsAsPDF(leads) {
  const doc = new jsPDF();                 // ➕ Neues PDF-Dokument
  doc.setFontSize(16);
  doc.text('MaklerMate – Lead-Export', 14, 20); // 📌 Titel setzen

  // 📊 Daten umwandeln für die Tabelle
  const tableData = leads.map((lead, i) => [
    i + 1,           // Laufende Nummer
    lead.name,
    lead.notiz,
    lead.status
  ]);

  // 📋 Tabelle mit Kopfzeile erzeugen
  doc.autoTable({
    startY: 30, // Abstand nach oben
    head: [['#', 'Name', 'Notiz', 'Status']],
    body: tableData,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] } // 🎨 Tailwind-Blau
  });

  // 💾 PDF speichern
  doc.save('leads-export.pdf');
}
