// 📄 LeadForm.jsx – Formular zur Eingabe und Speicherung eines neuen Leads
// ✅ Direkt verbunden mit localStorage über den Hook `useLocalStorageLeads`

import React, { useState } from 'react';

import useLocalStorageLeads
  from '../../hooks/useLocalStorageLeads'; // 🔌 Direktverbindung zum Storage
import styles
  from '../../styles/CRM.module.css'; // 🎨 Custom Styling für CRM-Formular

export default function LeadForm() {
  const { addLead } = useLocalStorageLeads(); // 📥 Lead hinzufügen (wird automatisch gespeichert)

  // 🧠 Lokale Zustände für Formularfelder
  const [name, setName] = useState('');
  const [notiz, setNotiz] = useState('');

  // 📤 Wird beim Formular-Submit aufgerufen
  const handleSubmit = (e) => {
    e.preventDefault(); // ⛔ Kein Reload

    // 🆕 Neues Lead-Objekt erstellen
    const newLead = {
      id: Date.now(),       // 🆔 Zeitbasierte ID
      name,
      notiz,
      status: 'neu',        // 📌 Standardstatus
      createdAt: new Date().toISOString(), // 🕒 Optional: Zeitstempel
    };

    addLead(newLead);       // 💾 In localStorage speichern via Hook

    // ♻️ Eingabefelder zurücksetzen
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
        required
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

      {/* 💾 Button */}
      <button type="submit" className={styles.crmButton}>
        💾 Lead speichern
      </button>
    </form>
  );
}
