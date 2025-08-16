// ✅ Hook für LocalStorage-Handling von Leads
// - Lädt Leads aus localStorage beim ersten Render
// - Speichert neue Leads automatisch
// - Normalisiert Status-Werte (neu, warm, cold, vip)
// - Führt Migration durch, falls alte Daten ohne Status vorliegen

import {
  useEffect,
  useState,
} from 'react';

// Definierte Status-Werte (enum)
export const STATUS_ENUM = ["neu", "warm", "cold", "vip"];

// 🛠 Migration: sorgt dafür, dass alte Leads ein korrektes Schema haben
function migrateLead(lead) {
  return {
    id: lead.id || Date.now(),        // Falls keine ID vorhanden → Timestamp
    name: lead.name || "",
    contact: lead.contact || "",
    location: lead.location || "",
    type: lead.type || "",
    note: lead.note || "",
    // Status normalisieren: lowercase + Fallback = "neu"
    status: STATUS_ENUM.includes((lead.status || "").toLowerCase())
      ? lead.status.toLowerCase()
      : "neu",
    createdAt: lead.createdAt || new Date().toISOString(),
  };
}

export default function useLocalStorageLeads(key = "leads") {
  const [leads, setLeads] = useState([]);

  // ✅ Leads beim Laden aus localStorage ziehen
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLeads(parsed.map(migrateLead));
      } catch (e) {
        console.error("❌ Fehler beim Laden der Leads", e);
      }
    }
  }, [key]);

  // ✅ Immer persistieren, wenn sich Leads ändern
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(leads));
  }, [leads, key]);

  return [leads, setLeads];
}
