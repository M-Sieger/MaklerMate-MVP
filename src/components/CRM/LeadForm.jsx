// 📄 LeadForm.jsx – Eingabeformular (gesteuert über Props)

import React, { useState } from 'react';

import toast from 'react-hot-toast';

import styles from '../../components/CRM/CRM.module.css';

// 🧩 Startzustand für neues Lead-Objekt
const initialLead = {
  name: '',
  contact: '',
  location: '',
  type: '',
  status: '',
  note: '',
};

export default function LeadForm({ onAddLead }) {
  const [lead, setLead] = useState(initialLead);

  // 🔄 Eingabefeld aktualisieren
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 Lead speichern (inkl. ID & Timestamp)
  const handleSave = () => {
    if (!lead.name || !lead.contact || !lead.type || !lead.status) {
      toast.error('❌ Bitte alle Pflichtfelder ausfüllen.');
      return;
    }

    const newLead = {
      ...lead,
      id: crypto.randomUUID(), // 🔐 Stabiler Identifier
      createdAt: new Date().toISOString(), // 🕒 Zeitstempel für Anzeige/Sortierung
    };

    onAddLead(newLead);         // 👉 Übergabe an CRMTool
    setLead(initialLead);       // 🔁 Formular zurücksetzen
    toast.success('✅ Lead gespeichert');
  };

  return (
    <div className={styles.crmForm}>
      <label className={styles.crmLabel}>🙍 Name des Kontakts</label>
      <input
        name="name"
        value={lead.name}
        onChange={handleChange}
        className={styles.crmInput}
        placeholder="z. B. Max Mustermann"
      />

      <label className={styles.crmLabel}>☎️ Kontakt (Telefon oder E-Mail)</label>
      <input
        name="contact"
        value={lead.contact}
        onChange={handleChange}
        className={styles.crmInput}
        placeholder="z. B. 0151 / 1234567 oder max@mail.de"
      />

      <label className={styles.crmLabel}>📍 Ort / Bezirk</label>
      <input
        name="location"
        value={lead.location}
        onChange={handleChange}
        className={styles.crmInput}
        placeholder="z. B. Köln, Ehrenfeld"
      />

      <label className={styles.crmLabel}>🏷️ Lead-Typ</label>
      <select
        name="type"
        value={lead.type}
        onChange={handleChange}
        className={styles.crmSelect}
      >
        <option value="">Typ wählen</option>
        <option value="Käufer">Käufer</option>
        <option value="Verkäufer">Verkäufer</option>
      </select>

      <label className={styles.crmLabel}>🔘 Lead-Status</label>
      <select
        name="status"
        value={lead.status}
        onChange={handleChange}
        className={styles.crmSelect}
      >
        <option value="">Status wählen</option>
        <option value="Neu">Neu</option>
        <option value="Warm">Warm</option>
        <option value="VIP">VIP</option>
        <option value="Kalt">Kalt</option>
      </select>

      <label className={styles.crmLabel}>💬 Notiz</label>
      <textarea
        name="note"
        value={lead.note}
        onChange={handleChange}
        className={styles.crmTextarea}
        placeholder="z. B. Interessiert sich für Wohnung in Köln"
      />

      <button onClick={handleSave} className={styles.crmButton}>
        💾 Lead speichern
      </button>
    </div>
  );
}
