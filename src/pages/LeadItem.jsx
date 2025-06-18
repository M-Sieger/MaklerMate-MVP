// src/pages/CRM/LeadItem.jsx

import React from 'react';

// 💡 Diese Komponente zeigt einen einzelnen Lead an – inkl. Name, Status, Notiz & GPT-Text
// Der Button ruft `onDelete(lead.id)` auf, um den Lead zu löschen

export default function LeadItem({ lead, onDelete }) {
  return (
    <div className="crm-lead-item">
      {/* 👤 Name */}
      <strong>{lead.name}</strong>

      {/* 🏷 Statusanzeige mit dynamischer Klasse */}
      <span className={`lead-status status-${lead.status}`}>
        {lead.status}
      </span>

      {/* 🗒 Notiz */}
      <p>{lead.notiz}</p>

      {/* 🧾 Optional: GPT-generierter Text (Exposé) */}
      {lead.exposéText && (
        <details>
          <summary>📝 GPT-Text anzeigen</summary>
          <pre>{lead.exposéText}</pre>
        </details>
      )}

      {/* 🗑️ Lösch-Button */}
      <button
        className="btn-delete"
        onClick={() => onDelete(lead.id)}
        style={{
          marginTop: "0.5rem",
          backgroundColor: "#f44",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        🗑️ Lead löschen
      </button>
    </div>
  );
}
