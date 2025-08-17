// 📄 LeadForm.jsx — Formular für Leads (fix: Submit fühlt sich „tot“ an)
// ✅ Entfernt HTML5 required-Bubble, stattdessen Button disabled bis Name gesetzt ist.
// ✅ Keine Style-Änderung nötig; optionaler :disabled-Style in LeadForm.module.css (separate Datei).

import React, { useState } from 'react';

import styles from './LeadForm.module.css';

const initialLead = {
  name: '',
  contact: '',
  location: '',
  type: '',
  note: '',
  status: 'neu', // 🟢 Default-Status
};

export default function LeadForm({ onAddLead }) {
  const [lead, setLead] = useState(initialLead);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔒 Minimalvalidierung in JS (kein HTML5 required-Popup)
    const cleaned = {
      ...lead,
      name: lead.name.trim(),
      contact: lead.contact.trim(),
      location: lead.location.trim(),
      type: lead.type.trim(),
      note: lead.note.trim(),
      status: (lead.status || 'neu').toLowerCase(),
    };

    if (!cleaned.name) return; // Button ist bis dahin disabled; return ist nur ein zusätzlicher Guard

    const now = Date.now();
    const payload = {
      ...cleaned,
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    onAddLead && onAddLead(payload);
    setLead(initialLead);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Zeile 1: Name, Kontakt */}
      <div className={styles.formRow}>
        <input
          className={styles.input}
          type="text"
          name="name"
          placeholder="Name"
          value={lead.name}
          onChange={handleChange}
          autoComplete="name"
        />
        <input
          className={styles.input}
          type="text"
          name="contact"
          placeholder="Kontakt (E-Mail / Telefon)"
          value={lead.contact}
          onChange={handleChange}
          autoComplete="tel"
        />
      </div>

      {/* Zeile 2: Ort, Typ */}
      <div className={styles.formRow}>
        <input
          className={styles.input}
          type="text"
          name="location"
          placeholder="Ort"
          value={lead.location}
          onChange={handleChange}
          autoComplete="address-level2"
        />
        <input
          className={styles.input}
          type="text"
          name="type"
          placeholder="Lead-Typ (z. B. Verkäufer/Käufer)"
          value={lead.type}
          onChange={handleChange}
        />
      </div>

      {/* Zeile 3: Notiz (volle Zeile) */}
      <div className={styles.formRow}>
        <textarea
          className={styles.input}
          name="note"
          placeholder="Notiz"
          value={lead.note}
          onChange={handleChange}
          rows={3}
        />
      </div>

      {/* Zeile 4: Status + Aktion */}
      <div className={styles.formRow}>
        <select
          className={styles.select}
          name="status"
          value={lead.status}
          onChange={handleChange}
        >
          <option value="neu">Neu</option>
          <option value="warm">Warm</option>
          <option value="vip">VIP</option>
          <option value="cold">Cold</option>
        </select>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={!lead.name.trim()}
            title={!lead.name.trim() ? 'Bitte mindestens den Namen eintragen' : 'Lead speichern'}
          >
            Lead speichern
          </button>
        </div>
      </div>
    </form>
  );
}
