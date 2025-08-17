// 📄 LeadTable.jsx — Tabellen-Layout (Header, Zeilen, Badges, Aktionen)
// ✅ Alte Klassen aus LeadTable.module.css wieder genutzt.

import React from 'react';

import IvyBadge from './IvyBadge';
import styles from './LeadTable.module.css';

const statusRank = { vip: 3, warm: 2, neu: 1, cold: 0 };

export default function LeadTable({ leads = [], onDeleteLead }) {
  // 🔄 Leads sortieren nach Status-Priorität (VIP > Warm > Neu > Cold)
  const sorted = [...leads].sort((a, b) => {
    const ra = statusRank[(a.status || '').toLowerCase()] ?? -1;
    const rb = statusRank[(b.status || '').toLowerCase()] ?? -1;
    return rb - ra;
  });

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.leadTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Kontakt</th>
            <th>Ort</th>
            <th>Typ</th>
            <th>Status</th>
            <th>Notiz</th>
            <th className={styles.createdAtCell}>Erstellt</th>
            <th className={styles.actionsCell}>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            // 🚫 Keine Leads vorhanden → leere Zeile anzeigen
            <tr className={styles.tableRow}>
              <td colSpan={8} className={styles.emptyCell}>
                Keine Leads gefunden.
              </td>
            </tr>
          ) : (
            sorted.map((lead) => (
              <tr key={lead.id} className={styles.tableRow}>
                <td>{lead.name || '—'}</td>
                <td>{lead.contact || '—'}</td>
                <td>{lead.location || '—'}</td>
                <td>{lead.type || '—'}</td>
                {/* 🏷️ Status mit IvyBadge */}
                <td className={styles.statusCell}>
                  <IvyBadge status={(lead.status || 'neu').toLowerCase()} />
                </td>
                <td>{lead.note || '—'}</td>
                <td className={styles.createdAtCell}>
                  {lead.createdAt
                    ? new Date(lead.createdAt).toLocaleDateString()
                    : '—'}
                </td>
                <td className={styles.actionsCell}>
                  <button
                    className={styles.rowDeleteButton}
                    onClick={() => onDeleteLead && onDeleteLead(lead.id)}
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
