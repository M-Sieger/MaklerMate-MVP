// 📄 Modal.jsx – zentrales, wiederverwendbares Modal für GPT, Lead-Edit, Warnungen etc.

import React from 'react';

import styles from './Modal.module.css'; // ✅ Eigene, universelle Modal-Styles

export default function Modal({ title = '', children, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* ❌ Schließen oben rechts */}
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        {/* 🧠 Titelzeile (optional) */}
        {title && <h2 className={styles.modalTitle}>{title}</h2>}

        {/* 📦 Dynamischer Inhalt */}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}
