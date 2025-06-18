// 📦 React + useState (für Lead-Verwaltung)
import React, { useState } from 'react';

import CRMExport from './CRMExport';   // Export-Funktion
// 📋 Import der modularen CRM-Komponenten
import CRMForm from './LeadForm';      // Lead-Eingabe
import CRMList from './LeadList';      // Anzeige der Leads

const CRMTool = () => {
  // 🧠 Zustand: gespeicherte Leads (als Array)
  const [leads, setLeads] = useState([]);

  // ➕ Callback: Lead hinzufügen (wird an CRMForm übergeben)
  const addLead = (newLead) => {
    setLeads((prevLeads) => [...prevLeads, newLead]); // neues Lead anhängen
  };

  return (
    <div className="crm-tool" style={{ padding: '2rem' }}>
      <h1>📇 CRM-Modul – Leads verwalten</h1>

      {/* ➕ Formular zur Eingabe neuer Leads */}
      <CRMForm onAddLead={addLead} />

      <hr />

      {/* 📋 Liste aller gespeicherten Leads */}
      <CRMList leads={leads} />

      <hr />

      {/* 📤 Export als JSON */}
      <CRMExport leads={leads} />
    </div>
  );
};

export default CRMTool;
