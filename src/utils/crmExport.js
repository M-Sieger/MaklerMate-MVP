// 🔁 Exportiert Leads als .json-Datei (strukturierte Übergabe an Tools oder Backups)
export function exportLeadsAsJSON(leads) {
  const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadFile(url, 'leads.json');
}

// 📋 Kopiert Leads als JSON-Text in die Zwischenablage (z. B. zum Einfügen in Mail/Notizen)
export function copyLeadsToClipboard(leads) {
  navigator.clipboard.writeText(JSON.stringify(leads, null, 2))
    .then(() => alert("✅ Leads wurden in die Zwischenablage kopiert"))
    .catch(err => console.error("❌ Fehler beim Kopieren:", err));
}

// 📄 Exportiert Leads als TXT-Datei (einfach lesbar, für manuelles Einfügen)
export function exportLeadsAsTXT(leads) {
  const content = leads
    .map((lead) => `${lead.name} – ${lead.email} (${lead.status})`)
    .join("\n");

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  downloadFile(url, 'leads.txt');
}

// 📊 Exportiert Leads als CSV-Datei (z. B. für Excel, CRM-Importe, Newsletter-Tools)
export function exportLeadsAsCSV(leads) {
  const header = "Name,Email,Status";
  const rows = leads.map((l) => `${l.name},${l.email},${l.status}`);
  const content = [header, ...rows].join("\n");

  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  downloadFile(url, 'leads.csv');
}

// 📥 Hilfsfunktion: generiert Download-Link + klickt automatisch
function downloadFile(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
