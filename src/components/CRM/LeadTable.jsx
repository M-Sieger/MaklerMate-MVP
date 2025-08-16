// ✅ Tabelle für alle gespeicherten Leads
// - Keine Filterung → zeigt ALLE Leads
// - Status wird mit IvyBadge dargestellt
// - Sortierung: VIP > Warm > Neu > Cold

import React from 'react';

import IvyBadge from './IvyBadge';
import styles from './LeadTable.module.css';

// Definieren, wie Status sortiert werden soll
const STATUS_ORDER = { vip: 0, warm: 1, neu: 2, cold: 3 };

export default function LeadTable({ leads }) {
  // 🛠 Sortierte Liste erstellen
  const sortedLeads = [...leads].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
  );

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
        </tr>
      </thead>
      <tbody>
        {sortedLeads.map((lead) => (
          <tr key={lead.id}>
            <td><strong>{lead.name}</strong></td>
            <td>{lead.contact}</td>
            <td>{lead.location}</td>
            <td>{lead.type}</td>
            {/* ✅ Status-Badge */}
            <td><IvyBadge status={lead.status} /></td>
            <td>{lead.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
