// 📄 LeadList.jsx – Filterlogik für LeadTable
import React, { useState } from 'react';

import styles from '../../components/CRM/CRM.module.css';
import LeadTable
  from '../../components/CRM/LeadTable'; // ✅ neue Tabellenkomponente

// 🧠 Komponente: Status-Filter + Übergabe gefilterter Daten an die Table-Komponente
export default function LeadList({ leads, onDelete, onUpdateLead }) {
  const [filterStatus, setFilterStatus] = useState("Alle");

  // 🎯 Filterlogik: nach Status oder alle
  const filteredLeads = leads.filter((lead) =>
    filterStatus === "Alle" ? true : lead.status === filterStatus
  );

  return (
    <div>
      {/* 🔍 Filter Dropdown */}
      <div className={styles.filterWrapper}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.dropdown}
        >
          <option value="Alle">Alle</option>
          <option value="Neu">Neu</option>
          <option value="Warm">Warm</option>
          <option value="VIP">VIP</option>
        </select>
      </div>

      {/* 📋 Gefilterte Tabelle */}
      {filteredLeads.length > 0 ? (
        <LeadTable leads={filteredLeads} onDelete={onDelete} onUpdateLead={onUpdateLead} />
      ) : (
        <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
          ⚠️ Keine Leads im aktuellen Filter gefunden.
        </p>
      )}
    </div>
  );
}
