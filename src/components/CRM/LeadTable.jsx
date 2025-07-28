// 📄 LeadTable.jsx – Tabelle mit allen Leads
import React from 'react';

import styles from './CRM.module.css';
import LeadRow from './LeadRow';

export default function LeadTable({ leads, onDelete, onUpdate }) {
  return (
    <table className={styles.leadTable}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Kontakt</th>
          <th>Ort</th>
          <th>Typ</th>
          <th>Status</th>
          <th>Notiz</th>
          <th>Erstellt am</th>
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
  );
}
