// 📄 LeadTable.jsx – Tabelle mit allen Leads
import React from 'react';

import LeadRow from '../../components/CRM/LeadRow';
import styles from './CRM.module.css';

export default function LeadTable({ leads, onDelete, onUpdateLead }) {

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
  onUpdate={onUpdateLead}
/>

        ))}
      </tbody>
    </table>
  );
}
