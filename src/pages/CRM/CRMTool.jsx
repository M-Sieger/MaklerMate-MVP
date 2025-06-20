// 📄 src/pages/CRM/CRMTool.jsx
// ✅ Zentraler Einstieg für das CRM-Modul – verwendet modularisierte Komponenten

import React from 'react';

//  Anzeige + Reset + Export (liegt in components!)
import CRMExportLeads from '../../components/CRMExportLeads';
// 📥 Eingabe eines neuen Leads (intern speichert es per Hook)
import LeadForm from './LeadForm';

export default function CRMTool() {
  return (
    <div className="crm-tool" style={{ padding: '2rem' }}>
      <h1>📇 MaklerMate – CRM</h1>

      {/* 🧾 Neues Lead hinzufügen */}
      <LeadForm />

      {/* 📋 Leads anzeigen, löschen, resetten & exportieren */}
      <CRMExportLeads />
    </div>
  );
}
