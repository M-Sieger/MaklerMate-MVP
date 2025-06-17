// 📦 React importieren
import React from 'react';

// 🧠 Wiederverwendbare Export-Button-Komponente
// Props: Funktionen für verschiedene Exportvarianten
export default function ExportButtons({
  exportPDF,         // 🖨 PDF-Exportfunktion (z. B. via jsPDF)
  handleCRMExport,   // 📋 CRM-Zwischenablage-Logik
  exportTXT,         // 📝 Export als .txt-Datei
  exportJSON         // 🧾 Export als .json-Datei
}) {
  return (
    <div className="export-buttons">
      {/* 📄 PDF exportieren */}
      <button onClick={exportPDF}>📄 Exposé als PDF speichern</button>

      {/* 💼 CRM-Text in Zwischenablage kopieren */}
      <button onClick={handleCRMExport}>💼 Für CRM kopieren</button>

      {/* 📝 Export als .txt-Datei */}
      <button onClick={exportTXT}>📄 Als .txt exportieren</button>

      {/* 🧾 Export als .json-Datei */}
      <button onClick={exportJSON}>📁 Als .json exportieren</button>
    </div>
  );
}
