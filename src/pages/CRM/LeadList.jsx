// 📄 LeadList.jsx – Liste der gespeicherten Leads mit Status-Filter
import React, { useState } from 'react';

// ✅ Korrigierter Pfad zum Stylesheet (wenn Datei da ist)
import styles from '../../components/CRM/CRM.module.css';
// ✅ Korrigierter Pfad zur LeadItem-Komponente
import LeadItem from '../../components/CRM/LeadItem';

// 🧠 Komponente: zeigt alle gespeicherten Leads an + Filterfunktion
export default function LeadList({ leads, onDelete }) {
  const [filterStatus, setFilterStatus] = useState("Alle");

  // 🎯 Filterlogik: wenn "Alle" gewählt → alle anzeigen, sonst nach Status
  const filteredLeads = leads.filter((lead) =>
    filterStatus === "Alle" ? true : lead.status === filterStatus
  );

  // 🟡 Kein Lead nach Filter gefunden → Hinweis anzeigen
  if (filteredLeads.length === 0) {
    return (
      <>
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

        {/* ⚠️ Hinweis bei leerem Ergebnis */}
        <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
          ⚠️ Keine Leads im aktuellen Filter gefunden.
        </p>
      </>
    );
  }

  // ✅ Leads vorhanden → Liste anzeigen
  return (
    <>
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

      {/* 📋 Gefilterte Leads */}
      <ul className={styles.leadList}>
        {filteredLeads.map((lead) => (
          <LeadItem key={lead.id} lead={lead} onDelete={onDelete} />
        ))}
      </ul>
    </>
  );
}
