// 📄 Filterlogik für LeadTable + Suche
import React, { useState } from 'react';

import styles from '../../components/CRM/CRM.module.css';
import LeadTable from '../../components/CRM/LeadTable';

export default function LeadList({ leads, onDelete, onUpdateLead }) {
  const [filterStatus, setFilterStatus] = useState("Alle");
  const [searchQuery, setSearchQuery] = useState("");

  // 🧠 Kombinierte Filterung
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = filterStatus === "Alle" || lead.status === filterStatus;
    const matchesSearch = [lead.name, lead.notiz, lead.status]
      .some((field) =>
        field?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* 🔍 Filterzeile mit Dropdown + Suche */}
      <div className={styles.filterWrapper} style={{ gap: '1rem' }}>
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

        <input
          type="text"
          placeholder="🔎 Suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.crmInput}
          style={{ maxWidth: '300px' }}
        />
      </div>

      {/* 📋 Tabelle oder Hinweis */}
      {filteredLeads.length > 0 ? (
        <LeadTable leads={filteredLeads} onDelete={onDelete} onUpdate={onUpdateLead} />
      ) : (
        <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
          ⚠️ Keine Leads im aktuellen Filter/Suchbegriff gefunden.
        </p>
      )}
    </div>
  );
}
