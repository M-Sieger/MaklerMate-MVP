// 📄 CRMExportLeads.tsx – minimalistischer Exportbereich mit Dropdown

import React, { useState } from 'react';

import type { Lead } from '../../utils/leadHelpers';
import exportService from '../../services/exportService';
import pdfService from '../../services/pdfService';
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
    if (type === 'pdf') pdfService.exportLeadsAsPDF(leads);
    if (type === 'csv') exportService.exportLeadsAsCSV(leads);
    if (type === 'txt') exportService.exportLeadsAsTXT(leads);
    if (type === 'json') exportService.exportLeadsAsJSON(leads);
    if (type === 'copy') exportService.copyLeadsToClipboard(leads);
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
