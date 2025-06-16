import React, { useState } from 'react';
import '../styles/Tabs.css';

export default function TabbedForm({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <div>
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`tab-button ${activeTab === tab.label ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tabs.find((t) => t.label === activeTab).content}
      </div>
    </div>
  );
}
