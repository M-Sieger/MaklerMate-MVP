// src/components/TabbedForm.jsx

import React, { useState } from 'react';

// 🎨 Modul-CSS für moderne Tabs & Inputs
import styles from './TabbedForm.module.css';

const TabbedForm = ({ tabs }) => {
  // 📌 Aktiver Tab-State (aktuelles Tab merken)
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className={styles['tabbed-form']}> {/* 📦 Haupt-Wrapper */}

      {/* 🔘 Tab-Auswahl oben mit Glas-Stil */}
      <div className={styles['tabs-header']}>
        {tabs.map((tab, index) => (
         <button
  key={index}
  onClick={() => setActiveTabIndex(index)}
  className={`${styles.fancyTab} ${activeTabIndex === index ? styles.fancyTabActive : ''}`}
>
  {tab.icon && <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>}
  {tab.label}
</button>
        ))}
      </div>

      {/* 📄 Inhalt des aktuell gewählten Tabs */}
      <div className={styles.fancyTabContent}>
        {React.isValidElement(tabs[activeTabIndex].content) ? (
          tabs[activeTabIndex].content // ✅ Nur wenn gültige Komponente übergeben
        ) : (
          <p>⚠️ Tab-Inhalt nicht verfügbar oder nicht als React-Komponente formatiert.</p>
        )}
      </div>
    </div>
  );
};

export default TabbedForm;
