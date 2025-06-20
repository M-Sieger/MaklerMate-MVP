// 📄 LeadForm.jsx – Formular zur Eingabe und Übergabe neuer Leads
// ✅ Verwendet onAddLead als Prop → zentrale State-Verwaltung bleibt intakt

import React, { useState } from 'react';

import styles
  from '../../styles/CRM.module.css'; // 🎨 Individuelles CRM-Form-Styling

// 🔁 Diese Komponente erhält `onAddLead` vom Parent (CRMTool.jsx)
export default function LeadForm({ onAddLead }) {
  // 🧠 Lokaler Zustand für Eingabefelder
  const [name, setName] = useState('');
  const [notiz, setNotiz] = useState('');

  // 📤 Wird beim Absenden des Formulars ausgeführt
  const handleSubmit = (e) => {
    e.preventDefault(); // ⛔ Kein Reload

    // 📦 Neues Lead-Objekt erzeugen
    const newLead = {
      id: Date.now(),                     // 🆔 einfache ID
      name,                               // 👤 Kontaktname
      notiz,                              // 📝 Anmerkung
      status: 'neu',                      // 🟢 Standardstatus
      createdAt: new Date().toISOString() // 🕒 Zeitstempel
    };

    onAddLead(newLead); // ✅ Weitergabe an zentrale Lead-Logik
    setName('');         // ♻️ Felder zurücksetzen
    setNotiz('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.crmForm}>
      {/* 👤 Eingabe: Name */}
      <label className={styles.crmLabel}>👤 Name des Kontakts</label>
      <input
        type="text"
        placeholder="z. B. Max Mustermann"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={styles.crmInput}
      />

      {/* 📝 Eingabe: Notiz */}
      <label className={styles.crmLabel}>📝 Notiz</label>
      <textarea
        placeholder="z. B. Interessiert sich für Wohnung in Köln"
        value={notiz}
        onChange={(e) => setNotiz(e.target.value)}
        className={styles.crmTextarea}
        rows={3}
      />

      {/* 💾 Absende-Button */}
      <button type="submit" className={styles.crmButton}>
        💾 Lead speichern
      </button>
    </form>
  );
}
