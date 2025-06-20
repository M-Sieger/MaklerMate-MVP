// 📄 exportLeads.js – Hilfsfunktionen zum Exportieren von Leads als TXT oder CSV

// 🔤 Exportiere Leads als Klartext-Datei (.txt)
export function exportLeadsAsTXT(leads) {
  const content = leads
    .map((lead) => `${lead.name} – ${lead.email || '–'} (${lead.status})`)
    .join("\n");

  downloadFile("leads.txt", content, "text/plain");
}

// 📊 Exportiere Leads als CSV-Datei (.csv) – maschinenlesbar für Excel, Sheets, etc.
export function exportLeadsAsCSV(leads) {
  const header = "Name,Email,Status";

  // 🔒 Felder sicher maskieren, z. B. bei Kommas im Namen
  const rows = leads.map((l) =>
    `"${l.name || ''}","${l.email || ''}","${l.status || ''}"`
  );

  const content = [header, ...rows].join("\n");
  downloadFile("leads.csv", content, "text/csv");
}

// ⬇️ Gemeinsamer Download-Helper für Datei-Download im Browser
function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  // 💥 Aufräumen
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
