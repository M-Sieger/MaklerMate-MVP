// 📄 CRMTool.jsx – Zentrale CRM-Seite mit zentraler Validierung & Auto-Scroll

import React from 'react';

import { toast } from 'react-hot-toast';

import CRMExportLeads from '../../components/CRMExportLeads';
import useLocalStorageLeads
  from '../../hooks/useLocalStorageLeads'; // 💾 Custom Hook
import LeadForm from './LeadForm';

export default function CRMTool() {
  // ✅ LocalStorage-basierte Lead-Verwaltung
  const { leads, addLead, deleteLead, resetLeads } = useLocalStorageLeads();

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

      {/* 📋 Liste, Export, Reset */}
      <CRMExportLeads
        leads={leads}
        onDelete={deleteLead}
        onReset={resetLeads}
      />
    </div>
  );
}
