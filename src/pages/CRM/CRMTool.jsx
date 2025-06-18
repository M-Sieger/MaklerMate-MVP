// src/pages/CRM/CRMTool.jsx

import React from 'react';

// ✅ Funktionen für Export & Clipboard aus utils importieren
import {
  copyLeadsToClipboard,
  exportLeadsAsJSON,
} from '../../utils/CRMExport';
import LeadForm from './LeadForm';
import LeadList from './LeadList';

export default function CRMTool() {
  const [leads, setLeads] = React.useState([]);

  // 🧠 Neue Leads hinzufügen
  const handleAddLead = (lead) => {
    setLeads((prev) => [...prev, lead]);
  };

  return (
    <div className="crm-tool-container">
      <h1>📇 MaklerMate CRM</h1>

      {/* 📝 Formular zum Hinzufügen von Leads */}
      <LeadForm onAddLead={handleAddLead} />

      {/* 📋 Liste der gespeicherten Leads */}
      <LeadList leads={leads} />

      {/* 🔁 Export- und Clipboard-Funktionen */}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => exportLeadsAsJSON(leads)}>📁 Als JSON exportieren</button>
        <button onClick={() => copyLeadsToClipboard(leads)}>📋 In Zwischenablage</button>
      </div>
    </div>
  );
}
