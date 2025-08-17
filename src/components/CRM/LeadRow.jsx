// 📄 LeadRow.jsx — Einzelzeile für Lead-Daten (mit Loader-State)
// ✅ Integriert Loader-UX über .loading-Klasse aus LeadRow.module.css
// ✅ Status-Cycling + Delete-Button mit Ladeindikator

import React, { useState } from 'react';

import { STATUS_ENUM } from '../../hooks/useLocalStorageLeads';
import IvyBadge from './IvyBadge';
import styles from './LeadRow.module.css';

// 🔄 Hilfsfunktion: Nächsten Status im Zyklus ermitteln
function getNextStatus(current) {
  const idx = STATUS_ENUM.indexOf(current);
  return STATUS_ENUM[(idx + 1) % STATUS_ENUM.length];
}

/**
 * 📌 LeadRow rendert eine einzelne Tabellenzeile mit allen Lead-Daten.
 * - Nutzt IvyBadge für Statusanzeige.
 * - Enthält Buttons für Status-Wechsel und Löschen.
 * - Verwendet Loader-State für asynchrone Aktionen.
 */
export default function LeadRow({ lead, onUpdateLead, onDelete }) {
  if (!lead) return null;
  const { id, name, contact, location, type, status, note, createdAt } = lead;

  // ⏳ Lokaler Loader-State für Button-Feedback
  const [loadingAction, setLoadingAction] = useState(null); // "cycle" | "delete" | null

  // 🔄 Status per Button durchwechseln
  async function handleCycle() {
    if (typeof onUpdateLead === 'function') {
      setLoadingAction('cycle');
      await onUpdateLead(id, { status: getNextStatus(status) });
      setLoadingAction(null);
    }
  }

  // 🗑️ Lead löschen
  async function handleDelete() {
    if (typeof onDelete === 'function') {
      setLoadingAction('delete');
      await onDelete(id);
      setLoadingAction(null);
    }
  }

  return (
    <tr className={styles.tableRow}>
      <td><strong>{name || '—'}</strong></td>
      <td>{contact || '—'}</td>
      <td>{location || '—'}</td>
      <td>{type || '—'}</td>
      <td><IvyBadge status={(status || 'neu').toLowerCase()} /></td>
      <td>{note || '—'}</td>
      <td>{createdAt ? new Date(createdAt).toLocaleDateString() : '—'}</td>
      <td className={styles.actionsCell}>
        {/* 🔄 Status ändern */}
        <button
          type="button"
          onClick={handleCycle}
          className={`${styles.actionButton} ${loadingAction === 'cycle' ? styles.loading : ''}`}
          title="Status ändern"
        >
          ↻
        </button>
        {/* 🗑️ Löschen */}
        <button
          type="button"
          onClick={handleDelete}
          className={`${styles.deleteButton} ${loadingAction === 'delete' ? styles.loading : ''}`}
          title="Lead löschen"
        >
          🗑
        </button>
      </td>
    </tr>
  );
}
