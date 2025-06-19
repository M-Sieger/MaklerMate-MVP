// ✅ Listet gespeicherte Leads auf und ermöglicht das Löschen einzelner Einträge

import React from 'react';

import styles from '../../styles/CRM.module.css'; // 🎨 Style importieren

export default function LeadList({ leads, onDelete }) {
  return (
    <ul className={styles.crmLeadList}>
      {/* 🔁 Durch jeden Lead iterieren */}
      {leads.map((lead) => (
        <li key={lead.id} className={styles.crmLeadItem}>
          <div>
            {/* 👤 Name anzeigen */}
            <strong>{lead.name}</strong><br />
            {/* 📄 Notiz anzeigen */}
            <span className={styles.crmLeadNote}>{lead.notiz}</span>
          </div>

          {/* ❌ Button zum Löschen */}
          <button
            onClick={() => onDelete(lead.id)}
            className={styles.crmDeleteButton}
            title="Lead löschen"
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}
