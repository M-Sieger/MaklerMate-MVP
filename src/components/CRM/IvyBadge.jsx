// ✅ Badge-Komponente für Lead-Status
// - Farbige Badges je nach Status
// - Wird in LeadTable eingebunden
// - Modular (leicht erweiterbar)

import React from 'react';

import styles from './CRM.module.css';

// Farb-Mapping pro Status
const STATUS_STYLES = {
  vip: { label: "VIP", className: styles.badgeVip },
  warm: { label: "Warm", className: styles.badgeWarm },
  neu: { label: "Neu", className: styles.badgeNeu },
  cold: { label: "Cold", className: styles.badgeCold },
};

export default function IvyBadge({ status }) {
  const normalized = (status || "neu").toLowerCase();
  const config = STATUS_STYLES[normalized] || STATUS_STYLES.neu;

  return <span className={`${styles.badge} ${config.className}`}>{config.label}</span>;
}
