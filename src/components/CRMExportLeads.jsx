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
