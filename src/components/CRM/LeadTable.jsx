// 📄 LeadTable.jsx – Stylische Tabelle für gefilterte Leads

import React from 'react';

import styles from './CRM.module.css';
import LeadRow from './LeadRow';

export default function LeadTable({ leads, onDelete, onUpdate }) {
  if (!leads || leads.length === 0) {
    return <p style={{ color: '#94a3b8' }}>⚠️ Keine Leads im aktuellen Filter.</p>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.leadTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Interesse</th>
            <th>Gespeichert</th>
            <th>Status</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
           <LeadRow
            key={lead.id}
            lead={lead}
            onDelete={onDelete}
            onUpdate={onUpdate}
            />

          ))}
        </tbody>
      </table>
    </div>
  );
}
