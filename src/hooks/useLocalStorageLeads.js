// 📄 useLocalStorageLeads.js
// ✅ Custom React Hook zum Verwalten von Leads im localStorage
// Ermöglicht Speichern, Löschen, Zurücksetzen – komplett persistent

import {
  useEffect,
  useState,
} from 'react';

// 📦 Schlüsselname im localStorage
const STORAGE_KEY = 'maklermate-leads';

export default function useLocalStorageLeads() {
  // 🧠 React-State für gespeicherte Leads
  const [leads, setLeads] = useState([]);

  // 🔁 Wird beim ersten Laden aufgerufen: holt Daten aus localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLeads(JSON.parse(stored)); // 🧾 Parsen & in State speichern
      } catch (err) {
        console.error('❌ Fehler beim Parsen von localStorage-Daten:', err);
        setLeads([]); // Fallback auf leeres Array
      }
    }
  }, []);

  // 🔄 Speichert aktuellen Lead-State nach jeder Änderung im localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  // ➕ Neuen Lead hinzufügen
  const addLead = (lead) => {
    setLeads((prev) => [...prev, lead]);
  };

  // ❌ Einen Lead löschen (via Index)
  const deleteLead = (id) => {
  const updated = leads.filter((lead) => lead.id !== id);
  setLeads(updated);
};


  // 🔁 Alle Leads löschen
  const resetLeads = () => {
    setLeads([]);
  };

  // 🔙 Exportiere Funktionen & Daten
  return {
    leads,
    addLead,
    deleteLead,
    resetLeads,
  };
}
// 📦 Hook für persistente Lead-Verwaltung via localStorage