// src/components/Loader.jsx

import React from 'react';

// 🌀 Einfacher Ladeindikator für Async-Operationen
export default function Loader() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <p>⏳ GPT denkt nach ...</p>
    </div>
  );
}
