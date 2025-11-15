// src/components/TabbedForm.tsx

import React, { useState } from 'react';

// 🎨 Importiere das zugehörige CSS-Modul
import styles from '../styles/TabbedForm.module.css';

// ==================== TYPES ====================

interface TabItem {
  /** Tab label */
  label: string;

  /** Optional icon */
  icon?: string;

  /** Tab content (React element) */
  content: React.ReactElement;
}

interface TabbedFormProps {
  /** Array of tabs */
  tabs: TabItem[];
}

// ==================== COMPONENT ====================

const TabbedForm = ({ tabs }: TabbedFormProps) => {
  // 🧠 Local State für aktives Tab (Index)
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  return (
    <div className={styles.tabbedForm}> {/* 📦 Haupt-Wrapper für das Tab-System */}

      {/* 🔘 Tab-Kopfzeile – alle auswählbaren Tabs */}
      <div className={styles.tabsHeader}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTabIndex(index)} // 🎯 Tab wechseln
            className={`${styles.fancyTab} ${activeTabIndex === index ? styles.fancyTabActive : ''}`.trim()} // 🎨 Aktiver Tab optisch hervorheben
          >
            {/* Optionales Icon neben dem Label */}
            {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 📄 Inhalt des aktuell aktiven Tabs */}
      <div className={styles.fancyTabContent}>
        {React.isValidElement(tabs[activeTabIndex].content) ? (
          tabs[activeTabIndex].content // ✅ Inhalt anzeigen, wenn valides React-Element
        ) : (
          <p>⚠️ Kein valider Tab-Inhalt vorhanden.</p>
        )}
      </div>
    </div>
  );
};

export default TabbedForm;
