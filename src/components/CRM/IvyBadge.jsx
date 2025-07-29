// 📄 IvyBadge.jsx – Farbliche Status-Badge für Leads

import React from 'react';

import styles from './CRM.module.css';

export default function IvyBadge({ status }) {
  const getBadgeStyle = () => {
    switch (status?.toLowerCase()) {
      case 'vip':
        return styles.badgeVip;
      case 'warm':
        return styles.badgeWarm;
      case 'neu':
        return styles.badgeNeu;
      case 'kalt':
        return styles.badgeKalt;
      default:
        return styles.badgeDefault;
    }
  };

  return (
    <span className={`${styles.badge} ${getBadgeStyle()}`}>
      {status || 'Unbekannt'}
    </span>
  );
}
