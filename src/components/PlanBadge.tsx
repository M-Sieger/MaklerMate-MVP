/**
 * @fileoverview Plan Badge - Shows current subscription plan
 *
 * ZWECK:
 * - Zeigt aktuellen Plan an (Free vs. Pro)
 * - Visual Feedback für User
 * - Vorbereitung für Upgrade-Flow
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-16
 * STATUS: 🟢 Production-Ready
 */

import React from 'react';
import { useAppContext } from '../context/AppContext';
import styles from './PlanBadge.module.css';

/**
 * Plan Badge Component
 *
 * FEATURES:
 * - Zeigt Plan-Badge (Free / Pro)
 * - Styled unterschiedlich je nach Plan
 * - Klickbar für zukünftigen Upgrade-Flow
 *
 * VERWENDUNG:
 * ```tsx
 * <PlanBadge />
 * ```
 */
export function PlanBadge(): JSX.Element {
  const { plan } = useAppContext();

  const isPro = plan === 'pro';

  return (
    <span
      className={`${styles.badge} ${isPro ? styles.pro : styles.free}`}
      title={`Aktueller Plan: ${plan.toUpperCase()}`}
    >
      {isPro ? '⭐ PRO' : '🆓 FREE'}
    </span>
  );
}
