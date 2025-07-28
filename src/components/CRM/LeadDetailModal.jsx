import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import styles from './CRM.module.css';

export default function LeadDetailModal({ lead, onClose, onUpdate }) {
  const [name, setName] = useState(lead.name);
  const [notiz, setNotiz] = useState(lead.notiz);
  const [status, setStatus] = useState(lead.status);

  const handleSave = () => {
    onUpdate(lead.id, { name, notiz, status });
    onClose();
  };

  return ReactDOM.createPortal(
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <h2>🔍 Lead bearbeiten</h2>

      <label>👤 Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.crmInput}
      />

      <label>📝 Notiz</label>
      <textarea
        value={notiz}
        onChange={(e) => setNotiz(e.target.value)}
        rows={3}
        className={styles.crmTextarea}
      />

      <label>🏷️ Status</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={styles.crmSelect}
      >
        <option value="neu">🟢 Neu</option>
        <option value="warm">🟠 Warm</option>
        <option value="vip">⭐ VIP</option>
        <option value="kalt">⚪ Kalt</option>
      </select>

      <div className={styles.modalActions}>
        <button onClick={handleSave} className={styles.crmButton}>💾 Speichern</button>
        <button onClick={onClose} className={styles.modalCancel}>❌ Abbrechen</button>
      </div>
    </div>
  </div>,
  document.getElementById('modal-root')
);
}
