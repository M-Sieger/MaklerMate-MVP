// Für das Exportieren der Leadliste als TXT oder CSV

export function exportLeadsAsTXT(leads) {
  const content = leads
    .map((lead) => `${lead.name} – ${lead.email} (${lead.status})`)
    .join("\n");

  downloadFile("leads.txt", content, "text/plain");
}

export function exportLeadsAsCSV(leads) {
  const header = "Name,Email,Status";
  const rows = leads.map((l) => `${l.name},${l.email},${l.status}`);
  const content = [header, ...rows].join("\n");

  downloadFile("leads.csv", content, "text/csv");
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
