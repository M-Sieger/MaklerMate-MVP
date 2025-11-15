// 📄 components/CRM/IvyBadge.tsx — robustes Status-Badge
import React from 'react';

import styles from './CRM.module.css';

// TYPES
import type { LeadStatus } from '../../utils/leadHelpers';

// ==================== TYPES ====================

interface IvyBadgeProps {
  status: LeadStatus | string;
}

// ==================== CONSTANTS ====================

// Map: akzeptiert 'vip','warm','neu','cold' + 'kalt'
const labelMap: Record<string, string> = { vip: 'VIP', warm: 'Warm', neu: 'Neu', cold: 'Cold', kalt: 'Cold' };
const classMap: Record<string, string> = {
  vip:  [styles.statusVip,  styles['status-vip']].filter(Boolean).join(' '),
  warm: [styles.statusWarm, styles['status-warm']].filter(Boolean).join(' '),
  neu:  [styles.statusNeu,  styles['status-neu']].filter(Boolean).join(' '),
  cold: [styles.statusCold, styles['status-kalt'], styles['status-cold']].filter(Boolean).join(' '),
  kalt: [styles.statusCold, styles['status-kalt'], styles['status-cold']].filter(Boolean).join(' '),
};

// ==================== COMPONENT ====================

export default function IvyBadge({ status }: IvyBadgeProps) {
  const key = String(status || 'neu').toLowerCase();
  const label = labelMap[key] || 'Neu';
  const variantClass = classMap[key] || classMap.neu;

  // Basis: statusBadge sorgt für Form/Typo, Variante für Farbe
  return <span className={`${styles.statusBadge} ${variantClass}`}>{label}</span>;
}
