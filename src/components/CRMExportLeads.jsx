// 📄 CRMExportLeads.jsx – Lead-Anzeige mit Modal-Delete & ExportCards im Ivy-Stil

import React from 'react';

import styles from '../styles/CRM.module.css';
import CRMExportBox from './CRMExportBox'; // 🎨 Fancy ExportCards
import LeadItem from './LeadItem';// ✅ Modal-fähiger LeadItem

export default function CRMExportLeads({ leads, onDelete, onReset }) {
  return (
    <div className={styles.crmSection}>
      <h2 style={{ marginBottom: '1rem', color: '#e2e8f0' }}>📇 Gespeicherte Leads</h2>

      {/* 🔁 Lead-Liste */}
      {(!leads || leads.length === 0) ? (
        <p style={{ color: '#94a3b8' }}>⚠️ Noch keine Leads gespeichert.</p>
      ) : (
        <ul className={styles.leadList}>
          {leads.map((lead) => (
            <LeadItem key={lead.id} lead={lead} onDelete={onDelete} />
          ))}
        </ul>
      )}

      {/* ♻️ Reset-Button */}
      {leads.length > 0 && (
        <button onClick={onReset} className={styles.modalCancel} style={{ marginBottom: '2rem' }}>
          ♻️ Alle Leads löschen
        </button>
      )}

      {/* 📤 Exportkarten */}
      <CRMExportBox leads={leads} />
    </div>
  );
}
