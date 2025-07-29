// 📄 LeadForm.jsx – Eingabeformular für neuen oder bestehenden Lead

import React, {
  useEffect,
  useState,
} from 'react';

import toast from 'react-hot-toast';

import styles from '../../components/CRM/CRM.module.css';

// 🧩 Startzustand für neue Leads
const initialLead = {
  name: '',
  contact: '',
  location: '',
  type: '',
  status: '',
  note: '',
};

export default function LeadForm({ onAddLead, onUpdate, lead }) {
  // 🧠 Lokaler Formularstate (leer oder mit initialem Lead bei Bearbeitung)
  const [formData, setFormData] = useState(initialLead);

  // ⏪ Initialisieren bei übergebenem Lead
  useEffect(() => {
    if (lead) {
      setFormData(lead);
    }
  }, [lead]);

  // 🔄 Eingaben ändern
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 Speichern (neu oder aktualisieren)
  const handleSave = () => {
    const { name, contact, type, status } = formData;

    // 🔒 Pflichtfelder prüfen
    if (!name || !contact || !type || !status) {
      toast.error('❌ Bitte alle Pflichtfelder ausfüllen.');
      return;
    }

    if (lead) {
      // ✏️ Bearbeiten → nur Änderungen übergeben
      const { id, createdAt, ...updatedFields } = formData;
      onUpdate(lead.id, updatedFields);
      toast.success('🔄 Lead aktualisiert');
    } else {
      // ➕ Neuer Lead → einfach rohes Objekt übergeben (ID & Timestamp kommen vom Hook)
      onAddLead(formData);
      toast.success('✅ Lead gespeichert');
      setFormData(initialLead); // Zurücksetzen
    }
  };

  return (
    <div className={styles.crmForm}>
      <label className={styles.crmLabel}>🙍 Name des Kontakts</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className={styles.crmInput}
        placeholder="z. B. Max Mustermann"
      />

      <label className={styles.crmLabel}>☎️ Kontakt (Telefon oder E-Mail)</label>
      <input
        name="contact"
        value={formData.contact}
        onChange={handleChange}
        className={styles.crmInput}
        placeholder="z. B. 0151 / 1234567 oder max@mail.de"
      />

      <label className={styles.crmLabel}>📍 Ort / Bezirk</label>
      <input
        name="location"
        value={formData.location}
        onChange={handleChange}
        className={styles.crmInput}
        placeholder="z. B. Köln, Ehrenfeld"
      />

      <label className={styles.crmLabel}>🏷️ Lead-Typ</label>
      <select
        name="type"
        value={formData.type}
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
        value={formData.status}
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
        value={formData.note}
        onChange={handleChange}
        className={styles.crmTextarea}
        placeholder="z. B. Interessiert sich für Wohnung in Köln"
      />

      <button onClick={handleSave} className={styles.crmButton}>
        {lead ? '🔄 Lead aktualisieren' : '💾 Lead speichern'}
      </button>
    </div>
  );
}
