// src/pages/CRM/CRMTool.jsx

import React, { useState } from 'react';

// 🔹 Optional: Exportfunktion (z. B. als CSV, TXT)
import CRMExportBox from '../../components/CRMExportBox';
// 🔹 Eingabeformular für neue Leads
import LeadForm from './LeadForm';
// 🔹 Anzeige aller gespeicherten Leads
import LeadList from './LeadList';

export default function CRMTool() {
  // 🧠 Zustand für alle Leads – beginnt leer
  const [leads, setLeads] = useState([]);

  // ➕ Fügt einen neuen Lead zum Zustand hinzu (mit eindeutiger ID)
  const handleAddLead = (lead) => {
    setLeads((prev) => [...prev, { ...lead, id: Date.now() }]);
  };

  // 🗑️ Löscht einen Lead anhand der ID
  const handleDeleteLead = (id) => {
    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
  };

  return (
    <div className="crm-tool">
      <h1>📇 MaklerMate – CRM</h1>

      {/* 🔹 Formular zur Eingabe eines neuen Leads */}
      <LeadForm onAddLead={handleAddLead} />

      {/* 📋 Übersicht über alle Leads mit Lösch-Button */}
      <LeadList leads={leads} onDelete={handleDeleteLead} />

      {/* 📤 Optionaler Exportbereich für gespeicherte Leads */}
      <CRMExportBox leads={leads} />
    </div>
  );
}
