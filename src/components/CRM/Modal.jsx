// 📄 Modal.jsx – zentrales Modal für GPT, Lead-Edit, Bestätigungen etc.

import React from 'react';

import styles from './CRM.module.css'; // 📦 Einheitliche Modal-Styles

export default function Modal({ title = '', children, onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* ❌ Schließen oben rechts */}
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        {/* 🧠 Titelzeile */}
        {title && <h2 className={styles.modalTitle}>{title}</h2>}

        {/* 📦 Dynamischer Inhalt */}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}
