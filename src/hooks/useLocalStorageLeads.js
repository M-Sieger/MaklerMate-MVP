// 📄 useLocalStorageLeads.js — Hook zur Lead-Persistenz in localStorage
// ✅ Alte Struktur beibehalten, Status-Normalisierung und Migration gesichert.
// ✅ CRUD-Methoden (add, update, delete, reset) vorhanden.

import {
  useEffect,
  useState,
} from 'react';

// 📌 Statuswerte (enum) – immer kleingeschrieben
export const STATUS_ENUM = ['neu', 'warm', 'cold', 'vip'];

// 🔧 Status normalisieren (Fallback = "neu")
export function normalizeStatus(rawStatus) {
  if (typeof rawStatus !== 'string') return 'neu';
  const value = rawStatus.trim().toLowerCase();
  return STATUS_ENUM.includes(value) ? value : 'neu';
}

// 🆕 Lead-Objekt im Schema v2 erstellen
function createLead(partialLead) {
  const now = new Date().toISOString();
  return {
    id: partialLead.id || `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    name: partialLead.name || '',
    contact: partialLead.contact || '',
    location: partialLead.location || '',
    type: partialLead.type || '',
    note: partialLead.note || '',
    status: normalizeStatus(partialLead.status),
    createdAt: partialLead.createdAt || now,
    updatedAt: now,
    _v: 2,
  };
}

// ♻️ Migration von alten Records auf Schema v2
function migrateLead(raw) {
  return createLead({
    ...raw,
    id: raw.id,
    createdAt: raw.createdAt,
  });
}

// 🪝 Haupt-Hook: Leads aus localStorage mit CRUD-API
export default function useLocalStorageLeads(storageKey = 'mm_crm_leads_v2') {
  const [leads, setLeads] = useState([]);

  // 📥 Laden beim Mount (inkl. Migration)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const migrated = parsed.map((l) => migrateLead(l));
          setLeads(migrated);
        }
      }
    } catch (err) {
      console.warn('[useLocalStorageLeads] Fehler beim Laden', err);
    }
  }, [storageKey]);

  // 💾 Persistenz bei Änderungen
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(leads));
    } catch (err) {
      console.warn('[useLocalStorageLeads] Fehler beim Speichern', err);
    }
  }, [leads, storageKey]);

  // ➕ Lead hinzufügen
  function addLead(leadPartial) {
    const lead = createLead(leadPartial);
    setLeads((prev) => [...prev, lead]);
  }

  // ✏️ Lead aktualisieren
  function updateLead(id, patch) {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== id) return lead;
        return {
          ...lead,
          ...patch,
          status: patch.status ? normalizeStatus(patch.status) : lead.status,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }

  // 🗑️ Lead löschen
  function deleteLead(id) {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }

  // 🔄 Alle Leads zurücksetzen
  function resetLeads() {
    setLeads([]);
  }

  return { leads, addLead, updateLead, deleteLead, resetLeads };
}
