import React from 'react';

// 💡 Diese Komponente zeigt eine Liste aller Leads an.
// Sie erhält die Leads als Array über Props und zeigt sie strukturiert an.
// Optional: könnte später um Filter, Sortierung oder Aktionen (z. B. löschen, editieren) erweitert werden.

export default function CRMList({ leads }) {
  if (!leads || leads.length === 0) {
    return <p>📭 Noch keine Leads gespeichert.</p>;
  }

  return (
    <div className="crm-list">
      <h2>📇 Gespeicherte Leads</h2>

      {/* 🔁 Alle Leads durchgehen und anzeigen */}
      {leads.map((lead) => (
        <div key={lead.id} className="crm-lead-item">
          {/* 👤 Name */}
          <strong>{lead.name}</strong>

          {/* 🏷 Statusanzeige */}
          <span className={`lead-status status-${lead.status}`}>
            {lead.status}
          </span>

          {/* 🗒 Notiz */}
          <p>{lead.notiz}</p>

          {/* 🧾 Vorschau: GPT-Text (wenn vorhanden) */}
          {lead.exposéText && (
            <details>
              <summary>📝 GPT-Text anzeigen</summary>
              <pre>{lead.exposéText}</pre>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}
