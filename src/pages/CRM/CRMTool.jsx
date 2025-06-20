// 📄 CRMTool.jsx – Zentrale CRM-Seite mit LeadForm und Exportansicht

import React from 'react';

import CRMExportLeads from '../../components/CRMExportLeads';
import useLocalStorageLeads
  from '../../hooks/useLocalStorageLeads'; // 💾 Hook oben zentral
import LeadForm from './LeadForm';

export default function CRMTool() {
  // ✅ Eine Hook-Instanz – keine doppelten States
  const { leads, addLead, deleteLead, resetLeads } = useLocalStorageLeads();

  return (
    <div className="crm-tool" style={{ padding: '2rem' }}>
      <h1>📇 MaklerMate – CRM</h1>

      {/* 📝 Eingabe eines neuen Leads */}
      <LeadForm onAddLead={addLead} />

      {/* 📋 Anzeige, Löschen, Reset, Export */}
      <CRMExportLeads
        leads={leads}
        onDelete={deleteLead}
        onReset={resetLeads}
      />

      
    </div>
  );
}
