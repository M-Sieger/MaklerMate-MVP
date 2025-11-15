// 📄 SavedExposes.tsx – Liste gespeicherter Exposés mit Lade-/Löschfunktion

import React from 'react';

import styles from './SavedExposes.module.css';

// ==================== TYPES ====================

interface SavedExpose {
  id: string;
  formData: {
    objektart?: string;
    ort?: string;
    [key: string]: unknown;
  };
  createdAt: string;
  [key: string]: unknown;
}

interface SavedExposesProps {
  /** Array von gespeicherten Exposés */
  exposes: SavedExpose[];

  /** Callback zum Laden eines Exposés */
  onLoad: (expose: SavedExpose) => void;

  /** Callback zum Löschen eines Exposés (per Index) */
  onDelete: (index: number) => void;
}

// ==================== COMPONENT ====================

export default function SavedExposes({ exposes, onLoad, onDelete }: SavedExposesProps) {
  if (!exposes || exposes.length === 0) {
    return (
      <div className={styles.emptyBox}>
        <div className={styles.emptyIcon}>📭</div>
        <p className={styles.emptyText}>Noch keine Exposés gespeichert.</p>
        <p className={styles.emptyHint}>Nutze den Button „💾 Exposé speichern", um dein erstes Projekt anzulegen.</p>
      </div>
    );
  }

  return (
    <div className={styles.exportBox}>
      <h3 className={styles.heading}>💾 Gespeicherte Exposés</h3>
      <ul className={styles.list}>
        {exposes.map((expose, index) => (
          <li key={expose.id} className={styles.item}>
            <div className={styles.meta}>
              🏡 <strong>{expose.formData.objektart || 'Exposé'}</strong> – {expose.formData.ort || 'Unbekannter Ort'}
              <br />
              <small className={styles.timestamp}>
                🕓 {new Date(expose.createdAt).toLocaleString()}
              </small>
            </div>
            <div className={styles.actions}>
              <button className={styles.exportButton} onClick={() => onLoad(expose)}>📂 Laden</button>
              <button className={styles.deleteButton} onClick={() => onDelete(index)}>🗑️ Löschen</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
