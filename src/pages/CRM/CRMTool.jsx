// 📄 CRMTool.jsx – Apple-inspirierter CRM-Bereich mit Card-Layout

import React from 'react';

import { toast } from 'react-hot-toast';

import CRMCard from '../../components/CRM/CRMCard';
import CRMExportLeads from '../../components/CRM/CRMExportLeads';
import LeadForm from '../../components/CRM/LeadForm';
import LeadList
  from '../../components/CRM/LeadList'; // ✅ Richtige Komponente eingebunden
import useLocalStorageLeads from '../../hooks/useLocalStorageLeads';

export default function CRMTool() {
  const {
    leads,
    addLead,
    deleteLead,
    resetLeads,
    updateLead,
  } = useLocalStorageLeads();

  const handleAddLead = (lead) => {
    const { name, contact, type, status } = lead;

    // 🛡️ Pflichtfeld-Validierung
    if (!name?.trim() || !contact?.trim() || !type || !status) {
      toast.error("❌ Bitte alle Pflichtfelder ausfüllen!");
      return;
    }

    // 🕓 Timestamp für Anzeige & Sortierung
    const leadWithTimestamp = {
      ...lead,
      createdAt: new Date().toISOString(),
    };

    addLead(leadWithTimestamp);
    toast.success("✅ Lead gespeichert!");
  };

  return (
    <div style={{ padding: '2rem' }}>
      <CRMCard title="📇 MaklerMate – CRM-Leads">
        <LeadForm onAddLead={handleAddLead} />
        <LeadList leads={leads} onDelete={deleteLead} onUpdateLead={updateLead} /> {/* ✅ LeadList statt LeadTable */}
        <CRMExportLeads
          leads={leads}
          onReset={resetLeads}
          onUpdateLead={updateLead}
        />
      </CRMCard>
    </div>
  );
}
