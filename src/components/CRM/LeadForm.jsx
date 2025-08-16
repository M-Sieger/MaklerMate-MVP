// ✅ Eingabeformular für neue Leads
// - Enthält Select für Status (controlled component!)
// - Alle Eingaben landen im lokalen State
// - Beim Submit wird Lead zurück an Parent (CRMTool) gegeben

import React, { useState } from 'react';

import { STATUS_ENUM } from '../../hooks/useLocalStorageLeads';
import styles from './LeadForm.module.css';

export default function LeadForm({ onAddLead }) {
  // Initialwerte: status = "neu"
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    location: "",
    type: "",
    note: "",
    status: "neu",
  });

  // 🛠 Input-Änderungen → State updaten
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // 🛠 Form submit
  function handleSubmit(e) {
    e.preventDefault();
    onAddLead({ ...formData, id: Date.now(), createdAt: new Date().toISOString() });
    setFormData({ name: "", contact: "", location: "", type: "", note: "", status: "neu" });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input name="contact" placeholder="Kontakt" value={formData.contact} onChange={handleChange} />
      <input name="location" placeholder="Ort" value={formData.location} onChange={handleChange} />
      <input name="type" placeholder="Lead-Typ" value={formData.type} onChange={handleChange} />

      <textarea
        name="note"
        placeholder="Notizen"
        value={formData.note}
        onChange={handleChange}
      />

      {/* ✅ Status als Select */}
      <select name="status" value={formData.status} onChange={handleChange}>
        {STATUS_ENUM.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      <button type="submit">➕ Lead speichern</button>
    </form>
  );
}
