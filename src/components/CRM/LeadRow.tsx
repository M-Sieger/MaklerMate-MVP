// 📄 LeadRow.tsx — Einzelzeile für Lead-Daten (mit Loader-State)
// ✅ Integriert Loader-UX über .loading-Klasse aus LeadRow.module.css
// ✅ Status-Cycling + Delete-Button mit Ladeindikator

import React, { useState } from 'react';

import { STATUS_ENUM } from '../../utils/leadHelpers';
import type { Lead, LeadStatus } from '../../utils/leadHelpers';
import IvyBadge from './IvyBadge';
import styles from './LeadRow.module.css';

// ==================== TYPES ====================

interface LeadRowProps {
  /** Lead data */
  lead: Lead;

  /** Callback to update lead */
  onUpdateLead?: (id: string, updates: Partial<Lead>) => void | Promise<void>;

  /** Callback to delete lead */
  onDelete?: (id: string) => void | Promise<void>;
}

type LoadingAction = 'cycle' | 'delete' | null;

// ==================== HELPERS ====================

// 🔄 Hilfsfunktion: Nächsten Status im Zyklus ermitteln
function getNextStatus(current: LeadStatus): LeadStatus {
  const idx = STATUS_ENUM.indexOf(current);
  return STATUS_ENUM[(idx + 1) % STATUS_ENUM.length];
}

// ==================== COMPONENT ====================

/**
 * 📌 LeadRow rendert eine einzelne Tabellenzeile mit allen Lead-Daten.
 * - Nutzt IvyBadge für Statusanzeige.
 * - Enthält Buttons für Status-Wechsel und Löschen.
 * - Verwendet Loader-State für asynchrone Aktionen.
 */
export default function LeadRow({ lead, onUpdateLead, onDelete }: LeadRowProps) {
  if (!lead) return null;
  const { id, name, contact, location, type, status, note, createdAt } = lead;

  // ⏳ Lokaler Loader-State für Button-Feedback
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  // 🔄 Status per Button durchwechseln
  async function handleCycle(): Promise<void> {
    if (typeof onUpdateLead === 'function') {
      setLoadingAction('cycle');
      await onUpdateLead(id, { status: getNextStatus(status) });
      setLoadingAction(null);
    }
  }

  // 🗑️ Lead löschen
  async function handleDelete(): Promise<void> {
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
      <td><IvyBadge status={(status || 'neu').toLowerCase() as LeadStatus} /></td>
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
