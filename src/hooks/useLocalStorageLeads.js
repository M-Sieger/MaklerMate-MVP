import {
  useEffect,
  useState,
} from 'react';

const STORAGE_KEY = "maklermate-leads";

export default function useLocalStorageLeads() {
  const [leads, setLeads] = useState([]);

  // 🔃 Beim ersten Laden aus dem LocalStorage lesen
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLeads(JSON.parse(stored));
      } catch (err) {
        console.error("Fehler beim Parsen von gespeicherten Leads:", err);
      }
    }
  }, []);

  // 💾 Bei Änderungen speichern
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  // ➕ Lead hinzufügen
  const addLead = (newLead) => {
    setLeads((prev) => [...prev, newLead]);
  };

  // ❌ Lead löschen
  const deleteLead = (index) => {
    setLeads((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔄 Alles zurücksetzen
  const resetLeads = () => {
    setLeads([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { leads, addLead, deleteLead, resetLeads };
}
