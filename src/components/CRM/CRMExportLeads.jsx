// 📄 CRMExportLeads.jsx – Exportbereich mit Reset-Funktion & ExportCards

import React from 'react';

import styles from './CRM.module.css';
import CRMExportBox from './CRMExportBox'; // 🎨 Fancy ExportCards

export default function CRMExportLeads({ leads, onReset }) {
  return (
    <div className={styles.crmSection}>
      {/* 🧾 Hinweis */}
      <h2 style={{ marginBottom: '0.75rem', color: '#e2e8f0' }}>
        📁 Leads exportieren
      </h2>

      <p style={{ color: '#94a3b8', marginBottom: '1.2rem' }}>
        📤 Exportiere die aktuell gefilterten Leads.
      </p>

      {/* ♻️ Reset-Button */}
      {leads.length > 0 && (
        <button
          onClick={onReset}
          className={styles.modalCancel}
          style={{ marginBottom: '2rem' }}
        >
          ♻️ Alle Leads löschen
        </button>
      )}

      {/* 🧲 Exportkarten (PDF, CSV, JSON, Copy) */}
      <CRMExportBox leads={leads} />
    </div>
  );
}
