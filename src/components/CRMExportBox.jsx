// 📄 src/components/CRMExportBox.jsx

import React from 'react';

import styles
  from '../styles/ExportBox.module.css'; // 🎨 Neues CSS-Modul für Buttons/Box
import {
  exportLeadsAsCSV,
  exportLeadsAsTXT,
} from '../utils/crmExport';

export default function CRMExportBox({ leads = [] }) {
  if (!leads || leads.length === 0) {
    return <p style={{ color: '#aaa', marginTop: '2rem' }}>⚠️ Keine Leads zum Exportieren vorhanden.</p>;
  }

  return (
    <div className={styles.exportBox}>
      <h3>📤 Leads exportieren</h3>
      <p>{leads.length} gespeicherte Leads</p>

      <div className={styles.buttonGroup}>
        <button onClick={() => exportLeadsAsTXT(leads)} className={styles.exportButton}>
          📄 TXT-Datei
        </button>

        <button onClick={() => exportLeadsAsCSV(leads)} className={styles.exportButton}>
          📊 CSV-Datei
        </button>

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
      </div>
    </div>
  );
}
