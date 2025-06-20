// 📄 CRMExportLeads.jsx – Anzeige, Reset, PDF/TXT/CSV-Export

import React from 'react';

// 📤 Export-Utilities
import {
  exportLeadsAsCSV,
  exportLeadsAsTXT,
} from '../utils/crmExport';
import { exportLeadsAsPDF } from '../utils/pdfExportLeads';

// 📤 Box-Komponente für Datei-Export (nur wenn Leads vorhanden)
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
        {/* Export-Buttons */}
        <button onClick={() => exportLeadsAsTXT(leads)}>📄 TXT herunterladen</button>
        <button onClick={() => exportLeadsAsCSV(leads)}>📊 CSV herunterladen</button>
      </div>
    </div>
  );
}

// 📋 Hauptkomponente: zeigt gespeicherte Leads, bietet Reset + Export
export default function CRMExportLeads({ leads, onDelete, onReset }) {
  // 🐞 DEBUG: zeige alle empfangenen Leads in der Konsole
  console.log('📊 Leads empfangen:', leads);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📇 Gespeicherte Leads</h2>

      {/* 🔁 Liste aller Leads */}
      <ul style={{ marginBottom: '1rem' }}>
        {leads.map((lead, index) => {
          // 🐞 DEBUG: zeige Details jedes Leads
          console.log(`🔍 Lead #${index + 1}:`, lead);

          return (
            <li key={index}>
              {lead.name} – {lead.notiz}
              <button
                onClick={() => onDelete(index)}
                style={{ marginLeft: '1rem' }}
              >
                ❌
              </button>
            </li>
          );
        })}
      </ul>

      {/* ♻️ Leads zurücksetzen */}
      <button onClick={onReset} style={{ marginBottom: '2rem' }}>
        ♻️ Leads zurücksetzen
      </button>

      {/* 📤 Exportbox für TXT + CSV */}
      <CRMExportBox leads={leads} />

      {/* 🧾 PDF separat */}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => exportLeadsAsPDF(leads)}>
          🧾 PDF herunterladen
        </button>
      </div>
    </div>
  );
}
