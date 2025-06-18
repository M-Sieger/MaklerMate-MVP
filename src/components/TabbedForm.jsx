// src/components/TabbedForm.jsx

import React, { useState } from 'react';

const TabbedForm = ({ tabs }) => {
  // Standardmäßig erstes Tab aktiv setzen
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className="tabbed-form">
      {/* 🔘 Tab-Auswahl */}
      <div style={{ marginBottom: '1rem' }}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTabIndex(index)}
            style={{
              marginRight: '0.5rem',
              fontWeight: activeTabIndex === index ? 'bold' : 'normal',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 📄 Tab-Inhalt */}
      <div>{tabs[activeTabIndex].content}</div>
    </div>
  );
};

export default TabbedForm;
