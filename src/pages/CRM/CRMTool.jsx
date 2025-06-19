// src/pages/CRM/CRMTool.jsx

import React from 'react';

// � Komponenten
import CRMExportBox from '../../components/CRMExportBox';
// �🔌 Hook für persistenten Lead-Speicher via LocalStorage
import useLocalStorageLeads from '../../hooks/useLocalStorageLeads';
import LeadForm from './LeadForm';
import LeadList from './LeadList';

export default function CRMTool() {
  // 🧠 Hook liefert Leads + Methoden für Add/Delete/Reset
  const { leads, addLead, deleteLead, resetLeads } = useLocalStorageLeads();

  return (
    <div className="crm-tool">
      <h1>📇 MaklerMate – CRM</h1>

      {/* 🔹 Formular zur Eingabe eines neuen Leads */}
      <LeadForm onAddLead={addLead} />

      {/* 📋 Übersicht über alle Leads mit Löschfunktion */}
      <LeadList leads={leads} onDelete={deleteLead} />

      {/* 📤 Exportbox + Reset */}
      <CRMExportBox leads={leads} onReset={resetLeads} />
    </div>
  );
}
