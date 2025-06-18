// 📦 React-Hook useState importieren
import React, { useState } from 'react';

// 🧠 CRM-Formular-Komponente
// Diese Komponente ist zuständig für:
// – die Eingabe eines neuen Leads
// – das Speichern (per onAddLead Callback)
// – das Zurücksetzen des Formulars nach dem Speichern
export default function CRMForm({ onAddLead }) {
  // 📝 Lokaler Zustand für das Formular
  const [name, setName] = useState('');
  const [notiz, setNotiz] = useState('');

  // 🧩 Wenn der Nutzer das Formular abschickt
  const handleSubmit = (e) => {
    e.preventDefault(); // ⛔ Standardverhalten (Seite neu laden) verhindern

    // 🔧 Neues Lead-Objekt vorbereiten
    const newLead = {
      id: Date.now(),           // einfache ID via Zeitstempel (später evtl. uuid)
      name: name,               // Name aus Eingabefeld
      notiz: notiz,             // Notiz aus Eingabefeld
      status: 'neu'             // Standardstatus bei Erstellung
    };

    // 📤 Lead an Parent-Komponente übergeben (Callback)
    onAddLead(newLead);

    // ♻️ Formular zurücksetzen
    setName('');
    setNotiz('');
  };

  return (
    // 🧾 Formular mit zwei Eingabefeldern
    <form onSubmit={handleSubmit} className="crm-form">

      {/* 👤 Name des Kontakts */}
      <input
        type="text"
        placeholder="Name des Kontakts"
        value={name}
        onChange={(e) => setName(e.target.value)} // live aktualisieren
        required // verhindert leeres Absenden
      />

      {/* 🗒️ Notizfeld */}
      <textarea
        placeholder="Notiz"
        value={notiz}
        onChange={(e) => setNotiz(e.target.value)}
        rows={3}
      />

      {/* 💾 Speichern-Button */}
      <button className="btn btn-primary" type="submit">
        Lead speichern
      </button>
    </form>
  );
}
