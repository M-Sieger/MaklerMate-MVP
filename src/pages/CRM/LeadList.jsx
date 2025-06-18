// src/pages/CRM/LeadList.jsx

import React from 'react';

import LeadItem from './LeadItem'; // ⬅️ importiere die Einzelkomponente

// 💡 Diese Komponente zeigt alle Leads an, die ihr über Props übergeben wurden
// Sie reicht die `onDelete`-Funktion weiter an jede `LeadItem`-Instanz

export default function LeadList({ leads, onDelete }) {
  if (!leads || leads.length === 0) {
    return <p>📭 Noch keine Leads gespeichert.</p>;
  }

  return (
    <div className="crm-list">
      <h2>📇 Gespeicherte Leads</h2>

      {/* 🔁 Für jeden Lead wird ein LeadItem angezeigt */}
      {leads.map((lead) => (
        <LeadItem key={lead.id} lead={lead} onDelete={onDelete} />
      ))}
    </div>
  );
}
