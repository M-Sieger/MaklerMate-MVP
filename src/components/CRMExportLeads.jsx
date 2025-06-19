import React from 'react';

import {
  exportLeadsAsCSV,
  exportLeadsAsTXT,
} from '../utils/crmExport';

export default function CRMExportBox({ leads }) {
  if (!leads || leads.length === 0) {
    return <p>⚠️ Keine Leads zum Exportieren vorhanden.</p>;
  }

  return (
    <div className="crm-export-box">
      <h4>📤 Leads exportieren</h4>

      <button onClick={() => exportLeadsAsTXT(leads)}>📄 Als TXT herunterladen</button>
      <button onClick={() => exportLeadsAsCSV(leads)}>📊 Als CSV herunterladen</button>
    </div>
  );
}


export default function CRMExportLeads() {
  const { leads, addLead, deleteLead, resetLeads } = useLocalStorageLeads();

  return (
    <div>
      <h2>Gespeicherte Leads</h2>
      <ul>
        {leads.map((lead, index) => (
          <li key={index}>
            {lead.name} - {lead.email}
            <button onClick={() => deleteLead(index)}>❌</button>
          </li>
        ))}
      </ul>
      <button onClick={resetLeads}>Reset</button>
    </div>
  );
}