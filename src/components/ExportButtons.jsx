// 📦 React importieren
import React from 'react';

// 🧠 Wiederverwendbare Export-Button-Komponente
// Props: Funktionen für verschiedene Exportvarianten
// 📤 Export-Komponente für PDF, TXT, JSON, CRM
export default function ExportButtons({
  exportPDF,
  handleCRMExport,
  exportTXT,
  exportJSON
}) {
  return (
    // 📦 Gruppierung für sauberes Layout
    <div className="button-group">

      {/* 📄 PDF exportieren */}
      <button className="btn btn-primary" onClick={exportPDF}>
        📄 Exposé als PDF speichern
      </button>

      {/* 💼 CRM Export (nur kopieren) */}
      <button className="btn btn-outline" onClick={handleCRMExport}>
        💼 Für CRM kopieren
      </button>

      {/* 📄 .txt Datei exportieren */}
      <button className="btn btn-outline" onClick={exportTXT}>
        📄 Als .txt exportieren
      </button>

      {/* 📁 .json Datei exportieren */}
      <button className="btn btn-outline" onClick={exportJSON}>
        📁 Als .json exportieren
      </button>
    </div>
  );
}