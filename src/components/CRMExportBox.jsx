// 📦 CRMExportBox.jsx – Apple-inspirierter Exportbereich mit Hover-Cards

import React from 'react';

import styles from '../styles/ExportBox.module.css';
import {
  exportLeadsAsCSV,
  exportLeadsAsTXT,
} from '../utils/crmExport';
import { exportLeadsAsPDF } from '../utils/pdfExportLeads';

export default function CRMExportBox({ leads = [] }) {
  if (!leads || leads.length === 0) {
    return <p className={styles.exportEmpty}>⚠️ Keine Leads zum Exportieren vorhanden.</p>;
  }

  return (
    <div className={styles.exportBox}>
      <h3 className={styles.exportTitle}>📤 Leads exportieren</h3>
      <p className={styles.exportInfo}>{leads.length} gespeicherte Leads</p>

      <div className={styles.exportGrid}>
        <ExportCard
          icon="📄"
          title="TXT-Datei"
          description="Einfaches Textformat"
          onClick={() => exportLeadsAsTXT(leads)}
        />
        <ExportCard
          icon="📊"
          title="CSV-Datei"
          description="Tabellenformat für Excel & Co."
          onClick={() => exportLeadsAsCSV(leads)}
        />
        <ExportCard
          icon="📄"
          title="PDF-Datei"
          description="Schön formatiertes PDF"
          onClick={() => exportLeadsAsPDF(leads)}
        />
        <ExportCard
          icon="🧠"
          title="JSON-Datei"
          description="Für Entwickler & Import"
          onClick={() => {
            const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'leads-export.json';
            a.click();
            URL.revokeObjectURL(url);
          }}
        />
        <ExportCard
          icon="📋"
          title="Kopieren"
          description="Leads in Zwischenablage"
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(leads, null, 2))
              .then(() => alert("✅ Leads kopiert"))
              .catch(err => console.error("Fehler:", err));
          }}
        />
      </div>
    </div>
  );
}

// 💎 Reusable ExportCard
function ExportCard({ icon, title, description, onClick }) {
  return (
    <div className={styles.exportCard} onClick={onClick}>
      <div className={styles.icon}>{icon}</div>
      <h4 className={styles.cardTitle}>{title}</h4>
      <p className={styles.cardDesc}>{description}</p>
    </div>
  );
}
