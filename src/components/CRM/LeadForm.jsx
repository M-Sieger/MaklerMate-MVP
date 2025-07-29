// 📄 LeadForm.jsx – Eingabeformular im Ivy-Stil für neue oder bestehende Leads

import React, {
  useEffect,
  useState,
} from 'react';

import toast from 'react-hot-toast';

import styles from './LeadForm.module.css';

const initialLead = {
  name: '',
  contact: '',
  location: '',
  type: '',
  status: '',
  note: '',
};

export default function LeadForm({ onAddLead, onUpdate, lead }) {
  const [formData, setFormData] = useState(initialLead);

  useEffect(() => {
    if (lead) setFormData(lead);
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const { name, contact, type, status } = formData;

    if (!name || !contact || !type || !status) {
      toast.error('❌ Bitte alle Pflichtfelder ausfüllen.');
      return;
    }

    if (lead) {
      const { id, createdAt, ...updatedFields } = formData;
      onUpdate(lead.id, updatedFields);
      toast.success('🔄 Lead aktualisiert');
    } else {
      onAddLead(formData);
      toast.success('✅ Lead gespeichert');
      setFormData(initialLead);
    }
  };

  return (
    <div className={styles.formGrid}>
      <div className={styles.field}>
        <label>🙍 Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Max Mustermann"
        />
      </div>

      <div className={styles.field}>
        <label>☎️ Kontakt</label>
        <input
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="0151 / 1234567"
        />
      </div>

      <div className={styles.field}>
        <label>📍 Ort / Bezirk</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="z. B. Köln, Ehrenfeld"
        />
      </div>

      <div className={styles.field}>
        <label>🏷️ Lead-Typ</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="">Typ wählen</option>
          <option value="Käufer">Käufer</option>
          <option value="Verkäufer">Verkäufer</option>
        </select>
      </div>

      <div className={styles.field}>
        <label>🔘 Lead-Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="">Status wählen</option>
          <option value="Neu">Neu</option>
          <option value="Warm">Warm</option>
          <option value="VIP">VIP</option>
          <option value="Kalt">Kalt</option>
        </select>
      </div>

      <div className={`${styles.field} ${styles.full}`}>
        <label>💬 Notiz</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="z. B. Sucht Wohnung in Köln"
        />
      </div>

      <div className={styles.actions}>
        <button onClick={handleSave}>
          {lead ? '🔄 Lead aktualisieren' : '💾 Lead speichern'}
        </button>
      </div>
    </div>
  );
}
