// 📄 LeadForm.jsx – ohne Status, immer „neu“
import React, { useState } from 'react';

import styles from '../../components/CRM/CRM.module.css';

export default function LeadForm({ onAddLead }) {
  const [name, setName] = useState('');
  const [notiz, setNotiz] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newLead = {
      id: Date.now(),
      name,
      notiz,
      status: 'neu', // 🧠 immer automatisch „neu“
      timestamp: new Date().toISOString(),
    };

    onAddLead(newLead);
    setName('');
    setNotiz('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.crmForm}>
      <label className={styles.crmLabel}>👤 Name des Kontakts</label>
      <input
        type="text"
        placeholder="z. B. Max Mustermann"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.crmInput}
        required
      />

      <label className={styles.crmLabel}>📝 Notiz</label>
      <textarea
        placeholder="z. B. Interessiert sich für Wohnung in Köln"
        value={notiz}
        onChange={(e) => setNotiz(e.target.value)}
        className={styles.crmTextarea}
        rows={3}
      />

      <button type="submit" className={styles.crmButton}>
        💾 Lead speichern
      </button>
    </form>
  );
}
