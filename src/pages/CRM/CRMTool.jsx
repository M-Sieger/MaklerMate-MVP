// 📄 CRMTool.jsx – Zentrale CRM-Seite mit Full-Update-Support

import React from 'react';

import { toast } from 'react-hot-toast';

import CRMExportLeads from '../../components/CRM/CRMExportLeads';
import useLocalStorageLeads
  from '../../hooks/useLocalStorageLeads'; // 💾 Custom Hook
import LeadForm from './LeadForm';
import LeadList from './LeadList'; // 🧠 Anzeige + Filter

export default function CRMTool() {
  // ✅ LocalStorage-Lead-Verwaltung mit Full-Update
  const {
    leads,
    addLead,
    deleteLead,
    resetLeads,
    updateLead, // ✅ ersetzt updateLeadStatus
  } = useLocalStorageLeads();

  // 🧠 Validierung + Hinzufügen
  const handleAddLead = (lead) => {
    const { name, notiz } = lead;

    if (!name?.trim() || !notiz?.trim()) {
      toast.error("❌ Bitte alle Felder ausfüllen!");
      return;
    }

    addLead(lead);
    toast.success("✅ Lead gespeichert!");
  };

  return (
<div className="crm-tool" style={{ padding: '2rem' }}>
  <h1>📇 MaklerMate – CRM</h1>

  {/* 📝 Eingabeformular */}
  <LeadForm onAddLead={handleAddLead} />

  {/* 📋 Lead-Liste mit Filter */}
  <LeadList leads={leads} onDelete={deleteLead} />

  {/* 📤 Export + Reset */}
  <CRMExportLeads
    leads={leads}
    onReset={resetLeads}
    onUpdateLead={updateLead}
  />
</div>

  );
}
