// 📄 components/CRM/IvyBadge.jsx — robustes Status-Badge
import React from 'react';

import styles from './CRM.module.css';

// Map: akzeptiert 'vip','warm','neu','cold' + 'kalt'
const labelMap = { vip: 'VIP', warm: 'Warm', neu: 'Neu', cold: 'Cold', kalt: 'Cold' };
const classMap = {
  vip:  [styles.statusVip,  styles['status-vip']].filter(Boolean).join(' '),
  warm: [styles.statusWarm, styles['status-warm']].filter(Boolean).join(' '),
  neu:  [styles.statusNeu,  styles['status-neu']].filter(Boolean).join(' '),
  cold: [styles.statusCold, styles['status-kalt'], styles['status-cold']].filter(Boolean).join(' '),
  kalt: [styles.statusCold, styles['status-kalt'], styles['status-cold']].filter(Boolean).join(' '),
};

export default function IvyBadge({ status }) {
  const key = String(status || 'neu').toLowerCase();
  const label = labelMap[key] || 'Neu';
  const variantClass = classMap[key] || classMap.neu;

  // Basis: statusBadge sorgt für Form/Typo, Variante für Farbe
  return <span className={`${styles.statusBadge} ${variantClass}`}>{label}</span>;
}
