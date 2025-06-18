import { useState } from 'react';

import {
  generateCRMJson,
  generateCRMTemplate,
} from '../utils/crmExportExpose';

function CRMExportBox({ formData, gptText }) {
  const [selectedCRM, setSelectedCRM] = useState('json');
  const [showHelp, setShowHelp] = useState(false);

  const download = () => {
    let content = '';
    let mime = '';
    let filename = '';

    const data = { ...formData, gptText };

    if (selectedCRM === 'json') {
      content = generateCRMJson(data);
      mime = 'application/json';
      filename = 'expose_crm.json';
    } else {
      content = generateCRMTemplate(data);
      mime = 'text/plain';
      filename = `expose_${selectedCRM}.txt`;
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="crm-export-box">
      <h3>🔽 Export für CRM-System</h3>
      <p>
        Lade diese Datei herunter und lade sie in dein Makler-CRM hoch (z. B. onOffice, FlowFact, Propstack), um dein Exposé automatisch auszufüllen.
      </p>
      <p style={{ fontSize: "0.9em", color: "#777" }}>
        ⚠️ Nur verwenden, wenn dein CRM JSON-Dateien unterstützt.{" "}
        <button className="link-button" onClick={() => setShowHelp(!showHelp)}>
          ❓ Was ist das?
        </button>
      </p>

      {showHelp && (
        <div className="crm-help-box">
          <p>
            <strong>Was ist JSON?</strong><br />
            JSON ist ein technisches Format, das viele CRM-Systeme verstehen.<br />
            Du brauchst keine Programmierkenntnisse.<br />
            Wenn dein CRM die Option „Daten importieren“ oder „Exposé hochladen“ bietet, kannst du die Datei einfach dort einfügen.<br />
            <em>Im Zweifel: Frag deinen Software-Support.</em>
          </p>
        </div>
      )}

      <div style={{ margin: "1rem 0" }}>
        <label>
          <input
            type="radio"
            value="onoffice"
            checked={selectedCRM === 'onoffice'}
            onChange={(e) => setSelectedCRM(e.target.value)}
          /> onOffice (.txt)
        </label><br />
        <label>
          <input
            type="radio"
            value="flowfact"
            checked={selectedCRM === 'flowfact'}
            onChange={(e) => setSelectedCRM(e.target.value)}
          /> FlowFact (.txt)
        </label><br />
        <label>
          <input
            type="radio"
            value="json"
            checked={selectedCRM === 'json'}
            onChange={(e) => setSelectedCRM(e.target.value)}
          /> Export als JSON (.json)
        </label>
      </div>

      <button className="button-crm" onClick={download}>
        📥 Exportieren
      </button>
    </div>
  );
}

export default CRMExportBox;
