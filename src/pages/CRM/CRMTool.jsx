// 📄 CRMTool.jsx – Zentrale CRM-Seite mit LeadForm und Exportansicht

import React from 'react';

// ✅ react-hot-toast importieren, um ggf. auch hier Feedback zu geben
import { toast } from 'react-hot-toast';

import CRMExportLeads from '../../components/CRMExportLeads';
import useLocalStorageLeads
  from '../../hooks/useLocalStorageLeads'; // 💾 Custom Hook
import LeadForm from './LeadForm';

export default function CRMTool() {
  // ✅ Leads aus dem LocalStorage-Management laden
  const { leads, addLead, deleteLead, resetLeads } = useLocalStorageLeads();

  // 🧠 Wrapper mit Validierung für LeadForm
  const handleAddLead = (lead) => {
    const { name, note } = lead;

    if (!name.trim() || !note.trim()) {
      toast.error("❌ Bitte alle Felder ausfüllen!");
      return;
    }

    addLead(lead); // ✅ Wenn validiert, dann speichern
    toast.success("✅ Lead gespeichert!");
  };

  return (
    <div className="crm-tool" style={{ padding: '2rem' }}>
      <h1>📇 MaklerMate – CRM</h1>

      {/* 📝 Eingabe eines neuen Leads */}
      <LeadForm onAddLead={handleAddLead} />

      {/* 📋 Anzeige, Löschen, Reset, Export */}
      <CRMExportLeads
        leads={leads}
        onDelete={deleteLead}
        onReset={resetLeads}
      />
    </div>
  );
}
