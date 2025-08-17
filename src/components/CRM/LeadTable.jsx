// 📄 LeadTable.jsx — Sticky-Header, Empty-State, Delete-Loader & A11y
// Wirkung:
// - Loader-State pro Zeile beim Löschen (visual & disabled)
// - Empty-State mit Icon/Text (passt zu LeadTable.module.css)
// - A11y: <th scope="col">, <time dateTime="...">

import React, { useState } from 'react';

import IvyBadge from './IvyBadge';
import styles from './LeadTable.module.css';

const statusRank = { vip: 3, warm: 2, neu: 1, cold: 0 };

export default function LeadTable({ leads = [], onDeleteLead }) {
  // 🧠 UI-State: welche Zeile gerade "lädt" (Delete)
  const [loadingId, setLoadingId] = useState(null);

  // 🔄 Sortierung nach Status (VIP → Warm → Neu → Cold)
  const sorted = [...leads].sort((a, b) => {
    const ra = statusRank[(a.status || '').toLowerCase()] ?? -1;
    const rb = statusRank[(b.status || '').toLowerCase()] ?? -1;
    return rb - ra;
  });

  // 🗑️ Delete mit kurzem Loader-Feedback (UX)
  const handleDelete = async (id) => {
    setLoadingId(id);
    // kleine künstliche Verzögerung für spürbares Feedback
    await new Promise((r) => setTimeout(r, 400));
    onDeleteLead && onDeleteLead(id);
    setLoadingId(null);
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.leadTable} aria-label="Leads Tabelle">
        <thead className={styles.stickyHeader}>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Kontakt</th>
            <th scope="col">Ort</th>
            <th scope="col">Typ</th>
            <th scope="col">Status</th>
            <th scope="col">Notiz</th>
            <th scope="col" className={styles.createdAtCell}>Erstellt</th>
            <th scope="col" className={styles.actionsCell}>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            // 🚫 Empty-State
            <tr className={styles.tableRow}>
              <td colSpan={8} className={styles.emptyCell}>
                <div className={styles.emptyWrapper}>
                  <span className={styles.emptyIcon}>📭</span>
                  <span className={styles.emptyText}>Keine Leads gefunden</span>
                </div>
              </td>
            </tr>
          ) : (
            sorted.map((lead) => {
              const createdISO = lead.createdAt
                ? new Date(lead.createdAt).toISOString()
                : null;

              const isDeleting = loadingId === lead.id;

              return (
                <tr key={lead.id} className={styles.tableRow}>
                  <td>{lead.name || '—'}</td>
                  <td>{lead.contact || '—'}</td>
                  <td>{lead.location || '—'}</td>
                  <td>{lead.type || '—'}</td>

                  {/* 🏷️ Status */}
                  <td className={styles.statusCell}>
                    <IvyBadge status={(lead.status || 'neu').toLowerCase()} />
                  </td>

                  <td>{lead.note || '—'}</td>

                  <td className={styles.createdAtCell}>
                    {lead.createdAt ? (
                      <time dateTime={createdISO}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </time>
                    ) : (
                      '—'
                    )}
                  </td>

                  <td className={styles.actionsCell}>
                    <button
                      className={
                        isDeleting
                          ? `${styles.rowDeleteButton} ${styles.rowDeleteButtonLoading}`
                          : styles.rowDeleteButton
                      }
                      onClick={() => handleDelete(lead.id)}
                      title={isDeleting ? 'Löschen…' : 'Lead löschen'}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Löschen…' : 'Löschen'}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
