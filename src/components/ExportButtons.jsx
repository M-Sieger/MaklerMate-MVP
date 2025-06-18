// src/components/ExportButtons.jsx

import React from 'react';

export default function ExportButtons({ formData, output, selectedStyle }) {
  const handleExportJSON = () => {
    const fullData = {
      ...formData,
      output,
      selectedStyle,
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'expose-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert('📋 Text kopiert!');
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <button onClick={handleExportJSON}>📁 JSON exportieren</button>
      <button onClick={handleCopy}>📋 Text kopieren</button>
    </div>
  );
}
