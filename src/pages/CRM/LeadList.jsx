// 📋 LeadList.jsx – Liste der gespeicherten Leads als Cards
import React from 'react';

import styles from '../../styles/CRM.module.css';
import LeadItem from './LeadItem';

export default function LeadList({ leads, onDelete }) {
  if (!leads || leads.length === 0) {
    return <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Noch keine Leads gespeichert.</p>;
  }

  return (
    <ul className={styles.leadList}>
      {leads.map((lead) => (
        <LeadItem key={lead.id} lead={lead} onDelete={onDelete} />
      ))}
    </ul>
  );
}
