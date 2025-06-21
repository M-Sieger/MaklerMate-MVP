// GPTOutputBox.jsx – Anzeige des generierten GPT-Textes mit Designbindung

import React from 'react';

import styles from '../styles/GPTOutputBox.module.css';

const GPTOutputBox = ({ text }) => {
  if (!text) return null;

  return (
    <div className={styles.previewBox}>
      <h3 className={styles.heading}>🧠 GPT-Ergebnis</h3>
      <pre className={styles.outputText}>{text}</pre>
    </div>
  );
};

export default GPTOutputBox;
