// 📄 src/components/CRMExportLeads.jsx
// ✅ Besteht aus zwei Komponenten:
// – CRMExportBox: für den Datei-Export (TXT/CSV)
// – CRMExportLeads: Anzeige + Verwaltung gespeicherter Leads inkl. Reset

import React from 'react';

import useLocalStorageLeads
  from '../hooks/useLocalStorageLeads'; // 📦 Hook für lokale Lead-Verwaltung
import {
  exportLeadsAsCSV,
  exportLeadsAsTXT,
} from '../utils/crmExport'; // 📤 Exportfunktionen für TXT & CSV

// 📤 Unterkomponente: Exportiert übergebene Leads (nur wenn vorhanden)
export function CRMExportBox({ leads }) {
  if (!leads || leads.length === 0) {
    return (
      <p style={{ color: '#aaa', marginTop: '1rem' }}>
        ⚠️ Keine Leads zum Exportieren vorhanden.
      </p>
    );
  }

  return (
    <div className="crm-export-box">
      <h4>📤 Leads exportieren</h4>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginTop: '0.5rem',
        }}
      >
        <button onClick={() => exportLeadsAsTXT(leads)}>
          📄 TXT herunterladen
        </button>
        <button onClick={() => exportLeadsAsCSV(leads)}>
          📊 CSV herunterladen
        </button>
      </div>
    </div>
  );
}

// 📋 Hauptkomponente: Listet gespeicherte Leads + bietet Reset und Exportoptionen
export default function CRMExportLeads() {
  const { leads, deleteLead, resetLeads } = useLocalStorageLeads(); // 🧠 Zugriff auf gespeicherte Leads + Funktionen

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📇 Gespeicherte Leads</h2>

      {/* 🔁 Alle gespeicherten Leads durchgehen */}
      <ul style={{ marginBottom: '1rem' }}>
        {leads.map((lead, index) => (
          <li key={index}>
            {lead.name} – {lead.email || 'Keine E-Mail'}
            <button
              onClick={() => deleteLead(index)}
              style={{ marginLeft: '1rem' }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      {/* ♻️ Zurücksetzen aller Leads */}
      <button onClick={resetLeads} style={{ marginBottom: '2rem' }}>
        ♻️ Leads zurücksetzen
      </button>

      {/* 📤 Export-Komponente einbinden */}
      <CRMExportBox leads={leads} />
    </div>
  );
}
