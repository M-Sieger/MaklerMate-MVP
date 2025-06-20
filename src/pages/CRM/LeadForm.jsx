// 📄 LeadForm.jsx – Formular zur Eingabe neuer Leads (UI-Only)

import React, { useState } from 'react';

import styles
  from '../../styles/CRM.module.css'; // 🎨 CSS-Module für konsistentes Styling

// ⏎ Komponente erhält `onAddLead` als Prop (führt Logik aus)
export default function LeadForm({ onAddLead }) {
  // 🧠 Lokale States für Formulareingabe
  const [name, setName] = useState('');
  const [notiz, setNotiz] = useState('');

  // 💾 Beim Absenden neues Lead-Objekt bauen und weitergeben
  const handleSubmit = (e) => {
    e.preventDefault();

    const newLead = {
      id: Date.now(),
      name,
      notiz,
      status: 'neu',
      createdAt: new Date().toISOString(),
    };

    // 🔁 Weitergabe an die übergeordnete Komponente (CRMTool) – inkl. Validierung dort
    onAddLead(newLead);

    // ♻️ Felder zurücksetzen nach erfolgreicher Übergabe
    setName('');
    setNotiz('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.crmForm}>
      {/* 👤 Name */}
      <label className={styles.crmLabel}>👤 Name des Kontakts</label>
      <input
        type="text"
        placeholder="z. B. Max Mustermann"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.crmInput}
      />

      {/* 📝 Notiz */}
      <label className={styles.crmLabel}>📝 Notiz</label>
      <textarea
        placeholder="z. B. Interessiert sich für Wohnung in Köln"
        value={notiz}
        onChange={(e) => setNotiz(e.target.value)}
        className={styles.crmTextarea}
        rows={3}
      />

      {/* 💾 Absenden */}
      <button type="submit" className={styles.crmButton}>
        💾 Lead speichern
      </button>
    </form>
  );
}
