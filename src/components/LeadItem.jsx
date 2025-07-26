// 📄 LeadItem.jsx – LeadCard mit Delete-Bestätigung via Modal
import React, { useState } from 'react';

import styles from '../styles/CRM.module.css';
import ConfirmModal from './ConfirmModal';

export default function LeadItem({ lead, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    onDelete(lead.id);
    setShowModal(false);
  };

  return (
    <div className={styles.leadItem}>
      <div>
        <strong>{lead.name}</strong>{' '}
        <span className={`lead-status status-${lead.status}`}>{lead.status}</span>
        <p>{lead.notiz}</p>

        {lead.exposéText && (
          <details>
            <summary>📝 GPT-Text anzeigen</summary>
            <pre>{lead.exposéText}</pre>
          </details>
        )}
      </div>

      <button className={styles.deleteButton} onClick={() => setShowModal(true)}>
        🗑️ Lead löschen
      </button>

      <ConfirmModal
        isOpen={showModal}
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
        message={`Möchtest du den Lead „${lead.name}“ wirklich löschen?`}
      />
    </div>
  );
}