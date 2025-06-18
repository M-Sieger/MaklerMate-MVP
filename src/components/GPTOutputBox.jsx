// GPTOutputBox.jsx – Anzeige des generierten GPT-Textes
// Zeigt nur etwas an, wenn `text` gesetzt ist

import React from 'react';

const GPTOutputBox = ({ text }) => {
  if (!text) return null;

  return (
    <div style={{ marginTop: '2rem', background: '#f9f9f9', padding: '1rem' }}>
      <h3>🧠 GPT-Ergebnis</h3>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{text}</pre>
    </div>
  );
};

export default GPTOutputBox;
