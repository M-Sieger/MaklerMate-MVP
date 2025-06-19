// ✅ Eingabeformular für neue Leads
// 🔁 Übergibt den eingegebenen Lead an den Parent (z. B. CRMTool.jsx)

import React, { useState } from 'react';

import styles from '../../styles/CRM.module.css'; // 🎨 Custom CSS-Modul laden

export default function LeadForm({ onAddLead }) {
  // 🧠 Lokaler Zustand für Eingabefelder (Name + Notiz)
  const [name, setName] = useState('');
  const [notiz, setNotiz] = useState('');

  // 📤 Wird aufgerufen, wenn Formular abgeschickt wird
  const handleSubmit = (e) => {
    e.preventDefault(); // ⛔ Verhindert Seitenreload

    // 🆕 Neues Lead-Objekt erzeugen
    const newLead = {
      id: Date.now(), // 🆔 Zeitbasierte ID
      name,
      notiz,
      status: 'neu'
    };

    // 📬 An übergeordnete Komponente weitergeben
    onAddLead(newLead);

    // ♻️ Eingabefelder zurücksetzen
    setName('');
    setNotiz('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.crmForm}>
      {/* 👤 Namensfeld */}
      <label className={styles.crmLabel}>👤 Name des Kontakts</label>
      <input
        type="text"
        placeholder="z. B. Max Mustermann"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={styles.crmInput}
      />

      {/* 📝 Notizfeld */}
      <label className={styles.crmLabel}>📝 Notiz</label>
      <textarea
        placeholder="z. B. Interessiert sich für Wohnung in Köln"
        value={notiz}
        onChange={(e) => setNotiz(e.target.value)}
        className={styles.crmTextarea}
        rows={3}
      />

      {/* 💾 Speichern-Button */}
      <button type="submit" className={styles.crmButton}>
        💾 Lead speichern
      </button>
    </form>
  );
}
