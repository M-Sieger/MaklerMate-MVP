// 📄 LeadForm.jsx — Formular für Leads mit Loading-State & UX-Polish
// ✅ Button zeigt Spinner beim Speichern (0.5s künstliche Verzögerung für Feedback)
// ✅ Entfernt HTML5 required-Bubble, stattdessen Button disabled bis Name gesetzt ist.
// ✅ Guard + Reset nach Submit.

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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleaned = {
      ...lead,
      name: lead.name.trim(),
      contact: lead.contact.trim(),
      location: lead.location.trim(),
      type: lead.type.trim(),
      note: lead.note.trim(),
      status: (lead.status || 'neu').toLowerCase(),
    };

    if (!cleaned.name) return;

    setIsLoading(true);

    const now = Date.now();
    const payload = {
      ...cleaned,
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    // kleine künstliche Verzögerung für UX-Feedback
    await new Promise((res) => setTimeout(res, 500));

    onAddLead && onAddLead(payload);
    setLead(initialLead);
    setIsLoading(false);
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
            disabled={!lead.name.trim() || isLoading}
            title={!lead.name.trim() ? 'Bitte mindestens den Namen eintragen' : 'Lead speichern'}
          >
            {isLoading ? <span className={styles.spinner}></span> : 'Lead speichern'}
          </button>
        </div>
      </div>
    </form>
  );
}
