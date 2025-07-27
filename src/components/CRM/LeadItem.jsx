// 📄 LeadItem.jsx – Öffnet DetailModal bei Klick auf Lead
import React, { useState } from 'react';

import ConfirmModal from './ConfirmModal';
import styles from './CRM.module.css';
import LeadDetailModal from './LeadDetailModal'; // 🆕 Detail-Modal importieren

export default function LeadItem({ lead, onDelete, onUpdateLead }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // 🆕 Modal für Details

  const handleDelete = () => {
    onDelete(lead.id);
    setShowDeleteModal(false);
  };

  const handleDetailUpdate = (id, updates) => {
    onUpdateLead(id, updates.status); // 🔁 nur Status ändern
    // ➕ falls du Name/Notiz auch updaten willst, muss useLocalStorageLeads erweitert werden
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

  return (
    <>
      <div
        className={styles.leadItem}
        onClick={() => setShowDetailModal(true)}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.leadHeader}>
          <strong className={styles.leadName}>{lead.name}</strong>
          <span className={styles.statusBadge}>{lead.status}</span>
        </div>

        <p className={styles.leadNote}>{lead.notiz}</p>
        <div className={styles.timestamp}>📅 gespeichert am {formatDate(lead.timestamp)}</div>

        <button
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation(); // 🔕 Modal nicht gleichzeitig öffnen
            setShowDeleteModal(true);
          }}
        >
          🗑️
        </button>
      </div>

      {/* ❌ Delete-Bestätigung */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        message={`Möchtest du den Lead „${lead.name}“ wirklich löschen?`}
      />

      {/* 🔍 Detail-Modal */}
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
