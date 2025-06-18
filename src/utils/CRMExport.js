// src/utils/CRMExport.js

// 🔁 Exportiert Leads als .json-Datei
export function exportLeadsAsJSON(leads) {
  const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadFile(url, 'leads.json');
}

// 📋 Kopiert Leads als JSON-Text in die Zwischenablage
export function copyLeadsToClipboard(leads) {
  navigator.clipboard.writeText(JSON.stringify(leads, null, 2))
    .then(() => alert("✅ Leads wurden in die Zwischenablage kopiert"))
    .catch(err => console.error("❌ Fehler beim Kopieren:", err));
}

// 🧱 Basis-Funktion zum Herunterladen einer Datei
function downloadFile(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
