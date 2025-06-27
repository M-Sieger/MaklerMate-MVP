// 📄 SavedExposes.jsx – Liste gespeicherter Exposés mit Lade-/Löschfunktion

import React from 'react';

import styles from '../styles/SavedExposes.module.css';

export default function SavedExposes({ exposes, onLoad, onDelete }) {
  if (exposes.length === 0) {
    return <p className={styles.emptyText}>📭 Keine gespeicherten Exposés gefunden.</p>;
  }

  return (
    <div className={styles.exportBox}>
      <h3 className={styles.heading}>💾 Gespeicherte Exposés</h3>
      <ul className={styles.list}>
        {exposes.map((expose) => (
          <li key={expose.id} className={styles.item}>
            <div className={styles.meta}>
              🏡 <strong>{expose.formData.objektart || 'Exposé'}</strong> – {expose.formData.ort || 'Unbekannter Ort'}
              <br />
              <small className={styles.timestamp}>🕓 {new Date(expose.createdAt).toLocaleString()}</small>
            </div>
            <div className={styles.actions}>
              <button className={styles.exportButton} onClick={() => onLoad(expose)}>📂 Laden</button>
              <button className={styles.deleteButton} onClick={() => onDelete(expose.id)}>🗑️ Löschen</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
// 📄 SavedExposes.jsx – Liste gespeicherter Exposés mit Lade-/Löschfunktion