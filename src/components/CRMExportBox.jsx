// 📄 src/components/CRMExportBox.jsx
// ✅ Exportbereich für gespeicherte Leads – in mehreren Formaten: TXT, CSV, JSON, PDF, Copy

import React from 'react';

import styles from '../styles/ExportBox.module.css'; // 🎨 Modularer CSS-Style
// 🔄 Technische Exportfunktionen (Rohformate)
import {
  exportLeadsAsCSV,
  exportLeadsAsTXT,
} from '../utils/crmExport';
// 📄 PDF-Exportfunktion (Leads als Tabelle)
import { exportLeadsAsPDF } from '../utils/pdfExportLeads';

export default function CRMExportBox({ leads = [] }) {
  // ⛔ Wenn keine Leads vorhanden sind → Hinweis anzeigen
  if (!leads || leads.length === 0) {
    return <p style={{ color: '#aaa', marginTop: '2rem' }}>⚠️ Keine Leads zum Exportieren vorhanden.</p>;
  }

  return (
    <div className={styles.exportBox}>
      <h3>📤 Leads exportieren</h3>
      <p>{leads.length} gespeicherte Leads</p>

      <div className={styles.buttonGroup}>
        
        {/* 📄 TXT-Export */}
        <button onClick={() => exportLeadsAsTXT(leads)} className={styles.exportButton}>
          📄 TXT-Datei
        </button>

        {/* 📊 CSV-Export */}
        <button onClick={() => exportLeadsAsCSV(leads)} className={styles.exportButton}>
          📊 CSV-Datei
        </button>

        {/* 🧠 JSON-Download (manuell) */}
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'leads-export.json';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className={styles.exportButton}
        >
          🧠 JSON-Datei
        </button>

        {/* 📄 PDF-Export */}
        <button onClick={() => exportLeadsAsPDF(leads)} className={styles.exportButton}>
          📄 PDF exportieren
        </button>

        {/* 📋 In Zwischenablage kopieren */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(leads, null, 2))
              .then(() => alert("✅ Leads wurden in die Zwischenablage kopiert"))
              .catch(err => console.error("❌ Fehler beim Kopieren:", err));
          }}
          className={styles.exportButton}
        >
          📋 In Zwischenablage kopieren
        </button>
      </div>
    </div>
  );
}
// 📄 CRMExportBox.jsx