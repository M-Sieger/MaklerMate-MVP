// 📄 useLocalStorageLeads.js – Hook für Lead-Verwaltung mit Full-Update-Funktion

import {
  useEffect,
  useState,
} from 'react';

// 📦 Schlüsselname im localStorage
const STORAGE_KEY = 'maklermate-leads';

export default function useLocalStorageLeads() {
  // 🧠 Lead-State
  const [leads, setLeads] = useState([]);

  // 🔁 Beim Laden: localStorage lesen
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLeads(JSON.parse(stored));
      } catch (err) {
        console.error('❌ Fehler beim Parsen von localStorage-Daten:', err);
        setLeads([]);
      }
    }
  }, []);

// 💾 Bei Änderung: speichern
useEffect(() => {
  try {
    if (Array.isArray(leads)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    }
  } catch (err) {
    console.error('❌ Fehler beim Speichern:', err);
  }
}, [leads]);


  // ➕ Lead hinzufügen
const addLead = (lead) => {
  const newLead = {
    ...lead,
    id: crypto.randomUUID(), // 🔐 Eindeutige ID
    timestamp: new Date().toISOString(), // 🕒 Immer Timestamp setzen
  };
  setLeads((prev) => [...prev, newLead]);
};


  // ❌ Einzelnen Lead löschen
  const deleteLead = (id) => {
    const updated = leads.filter((lead) => lead.id !== id);
    setLeads(updated);
  };

  // 🔁 Alle löschen
  const resetLeads = () => {
    setLeads([]);
  };

  // ✏️ Lead komplett updaten (Name, Notiz, Status etc.)
  const updateLead = (id, updatedFields) => {
    const updated = leads.map((lead) =>
      lead.id === id ? { ...lead, ...updatedFields } : lead
    );
    setLeads(updated);
  };

  // 🔙 Rückgabe
  return {
    leads,
    addLead,
    deleteLead,
    resetLeads,
    updateLead, // ✅ Neue Funktion
  };
}
