// 📄 LeadRow.jsx — Einzelzeile für Lead-Daten (Name, Kontakt, Ort, Typ, Status, Notiz, Aktionen)
// ✅ Alte Klassen aus LeadRow.module.css wieder genutzt (row, actionsCell, actionButton, deleteButton).
// ✅ Integriert IvyBadge für Statusanzeige.
// ✅ Unterstützt Status-Cycling (neu → warm → cold → vip → neu).

import React from 'react';

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
 * - Verwendet CSS-Module-Klassen für altes Layout.
 * - Nutzt IvyBadge für Statusanzeige.
 * - Enthält Buttons für Status-Wechsel und Löschen.
 */
export default function LeadRow({ lead, onUpdateLead, onDelete }) {
  if (!lead) return null;
  const { id, name, contact, location, type, status, note, createdAt } = lead;

  // 🔄 Status per Button durchwechseln
  function handleCycle() {
    if (typeof onUpdateLead === 'function') {
      onUpdateLead(id, { status: getNextStatus(status) });
    }
  }

  // 🗑️ Lead löschen
  function handleDelete() {
    if (typeof onDelete === 'function') {
      onDelete(id);
    }
  }

  return (
    <tr className={styles.row}>
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
          className={styles.actionButton}
          title="Status ändern"
        >
          ↻
        </button>
        {/* 🗑️ Löschen */}
        <button
          type="button"
          onClick={handleDelete}
          className={styles.deleteButton}
          title="Lead löschen"
        >
          🗑
        </button>
      </td>
    </tr>
  );
}
