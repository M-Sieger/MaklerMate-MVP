// 📄 LeadRow.jsx – Tabellenzeile mit Modal für Detailansicht

import React, { useState } from 'react';

import styles from './CRM.module.css';
import LeadDetailModal from './LeadDetailModal';

export default function LeadRow({ lead, onDelete, onUpdate }) {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleDetailUpdate = (id, updates) => {
    onUpdate(id, updates.status);
    setShowDetailModal(false);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const rowHighlightClass =
    lead.status?.toLowerCase() === 'vip' ? styles.rowVip :
    lead.status?.toLowerCase() === 'warm' ? styles.rowWarm : '';

  return (
    <>
      <tr className={`${styles.tableRow} ${rowHighlightClass}`}>
        <td><strong>{lead.name}</strong></td>
        <td>{lead.contact}</td>
        <td>{lead.location || '–'}</td>
        <td>{lead.type}</td>
        <td>{lead.note}</td>
        <td className={styles.timestamp}>{formatDate(lead.createdAt || lead.timestamp)}</td>
        <td>
          <span className={`${styles.statusBadge} ${styles[`status-${lead.status?.toLowerCase()}`]}`}>
            {lead.status}
          </span>
        </td>
        <td>
          <button
            className={styles.actionButton}
            onClick={() => setShowDetailModal(true)}
            title="Lead bearbeiten"
          >
            ✏️
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(lead.id)}
            title="Lead löschen"
          >
            🗑️
          </button>
        </td>
      </tr>

      {showDetailModal && (
        <LeadDetailModal
          lead={lead}
          onClose={() => setShowDetailModal(false)}
          onUpdate={handleDetailUpdate}
        />
      )}
    </>
  );
}
