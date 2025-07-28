// 📦 CRMCard.jsx
import React from 'react';

import styles from './CRM.module.css';

export default function CRMCard({ title, children }) {
  return (
    <div className={styles.crmCard}>
      {title && (
        <div className={styles.crmCardHeader}>
          <h2 className={styles.crmCardTitle}>{title}</h2>
        </div>
      )}
      <div className={styles.crmCardContent}>{children}</div>
    </div>
  );
}
