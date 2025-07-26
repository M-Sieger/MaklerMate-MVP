// 🧊 ConfirmModal.jsx – zentrales Bestätigungsfenster
import React from 'react';

import styles from '../styles/CRM.module.css';

export default function ConfirmModal({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <div className={styles.modalButtons}>
          <button onClick={onConfirm} className={styles.modalConfirm}>Ja, löschen</button>
          <button onClick={onCancel} className={styles.modalCancel}>Abbrechen</button>
        </div>
      </div>
    </div>
  );
}