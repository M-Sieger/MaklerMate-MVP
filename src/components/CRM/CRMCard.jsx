// 📦 CRMCard.jsx
import React, { useId } from 'react';

import styles from './CRM.module.css';

/**
 * CRMCard – Apple-Style Container mit optionalem Header (Titel + Toolbar) und Footer.
 * - title: Überschrift im Header (optional)
 * - toolbarLeft / toolbarRight: ReactNode für Filter, Suche, Aktionen (optional)
 * - footer: ReactNode, z. B. CSV-Export Zeile (optional)
 * - className: zusätzliche Klassen (optional)
 *
 * ⚠️ Abwärtskompatibel:
 *  - Bestehende Consumer, die nur {title}{children} nutzen, verhalten sich unverändert.
 *  - Legacy-Klassen aus CRM.module.css (crmHeader, toolbar, toolbarLeft, toolbarRight) greifen weiterhin.
 */
export default function CRMCard({
  title,
  toolbarLeft,
  toolbarRight,
  footer,
  className = '',
  children,
}) {
  const headingId = useId(); // A11y: verbindet section mit der Überschrift

  return (
    <section
      className={`${styles.crmCard} ${className}`}
      aria-labelledby={title ? headingId : undefined}
      role="region"
    >
      {(title || toolbarLeft || toolbarRight) && (
        <header className={`${styles.crmCardHeader} ${styles.crmHeader}`}>
          {/* Titel links – bleibt optional */}
          {title ? (
            <h2 id={headingId} className={`${styles.crmCardTitle} ${styles.title}`}>
              {title}
            </h2>
          ) : (
            <span className={styles.visuallyHidden}>CRM Bereich</span>
          )}

          {/* Toolbar rechts (split in left/right für Flexibilität) */}
          {(toolbarLeft || toolbarRight) && (
            <div className={`${styles.toolbar}`}>
              <div className={styles.toolbarLeft}>{toolbarLeft}</div>
              <div className={styles.toolbarRight}>{toolbarRight}</div>
            </div>
          )}
        </header>
      )}

      <div className={styles.crmCardContent}>{children}</div>

      {footer && <footer className={styles.crmCardFooter}>{footer}</footer>}
    </section>
  );
}
