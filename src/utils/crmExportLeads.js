// 📄 exportLeads.js – Hilfsfunktionen zum Exportieren von Leads (TXT, CSV, später PDF)

/*
🧠 Ziel:
- Einfache, klickbare Exportfunktionen für Makler:innen
- Dateien sollen sofort herunterladbar sein
- Formatierung für Excel, Klartext und spätere PDF-Vorlagen
*/

// 🔤 Exportiere Leads als Klartext-Datei (.txt)
export function exportLeadsAsTXT(leads) {
  const content = leads
    .map((lead) => `${lead.name} – ${lead.contact || '–'} (${lead.status})`)
    .join("\n");

  downloadFile("leads.txt", content, "text/plain");
}

// 📊 Exportiere Leads als CSV-Datei (.csv) – kompatibel mit Excel, Numbers etc.
export function exportLeadsAsCSV(leads) {
  const header = "Name,Kontakt,Typ,Status";

  // 🔒 Felder maskieren (für Kommas, Sonderzeichen etc.)
  const rows = leads.map((l) =>
    `"${l.name || ''}","${l.contact || ''}","${l.type || ''}","${l.status || ''}"`
  );

  const content = [header, ...rows].join("\n");
  downloadFile("leads.csv", content, "text/csv");
}

// ⬇️ Gemeinsamer Download-Helper – triggert automatisch Datei-Download im Browser
function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  // 🖱️ Simulierter Klick zum Auslösen des Downloads
  document.body.appendChild(a);
  a.click();

  // 🧹 Aufräumen
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
