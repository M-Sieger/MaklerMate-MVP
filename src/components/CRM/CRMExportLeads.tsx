// 📄 CRMExportLeads.tsx – minimalistischer Exportbereich mit Dropdown

import React, { useState } from 'react';

import type { Lead } from '../../utils/leadHelpers';
import {
  exportLeadsAsCSV,
  exportLeadsAsTXT,
} from '../../utils/crmExport';
import { exportLeadsAsPDF } from '../../utils/pdfExportLeads';
import styles from './CRMExportLeads.module.css';

// ==================== TYPES ====================

interface CRMExportLeadsProps {
  /** Array of leads to export */
  leads?: Lead[];

  /** Callback to reset all leads */
  onReset?: () => void;
}

type ExportType = 'pdf' | 'csv' | 'txt' | 'json' | 'copy';

// ==================== COMPONENT ====================

export default function CRMExportLeads({ leads = [], onReset }: CRMExportLeadsProps) {
  const [open, setOpen] = useState<boolean>(false);

  if (!leads.length) return null;

  const handleExport = (type: ExportType): void => {
    if (type === 'pdf') exportLeadsAsPDF(leads);
    if (type === 'csv') exportLeadsAsCSV(leads);
    if (type === 'txt') exportLeadsAsTXT(leads);
    if (type === 'json') {
      const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads-export.json';
      a.click();
      URL.revokeObjectURL(url);
    }
    if (type === 'copy') {
      navigator.clipboard.writeText(JSON.stringify(leads, null, 2))
        .then(() => alert('✅ Leads kopiert'))
        .catch(err => console.error('Fehler:', err));
    }
    setOpen(false);
  };

  return (
    <div className={styles.exportWrapper}>
      {/* 📤 Export Trigger */}
      <div className={styles.dropdownContainer}>
        <button
          className={styles.triggerButton}
          onClick={() => setOpen(!open)}
        >
          📤 Export ▾
        </button>

        {open && (
          <div className={styles.dropdownMenu}>
            <button onClick={() => handleExport('pdf')}>📄 PDF</button>
            <button onClick={() => handleExport('csv')}>📊 CSV</button>
            <button onClick={() => handleExport('txt')}>📄 TXT</button>
            <button onClick={() => handleExport('json')}>🧠 JSON</button>
            <button onClick={() => handleExport('copy')}>📋 Kopieren</button>
          </div>
        )}
      </div>

      {/* 🗑️ Reset separat */}
      {onReset && (
        <button onClick={onReset} className={styles.resetButton}>
          ♻️ Alle Leads löschen
        </button>
      )}
    </div>
  );
}
