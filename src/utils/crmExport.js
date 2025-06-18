// 📤 Exportiere Leads als JSON-Datei im Browser

export function exportLeadsAsJSON(leads) {
  // 🧠 Schritt 1: JSON-Daten als String formatieren
  const jsonString = JSON.stringify(leads, null, 2); // mit Einrückung für Lesbarkeit

  // 💾 Schritt 2: Neuen Blob (Dateiobjekt) aus dem JSON-Text erstellen
  const blob = new Blob([jsonString], { type: 'application/json' });

  // 🔗 Schritt 3: Temporären Download-Link im Browser erzeugen
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;                  // Link zeigt auf die erzeugte JSON-Datei
  link.download = 'leads_export.json'; // Vorschlag für Dateinamen

  // 🚀 Klick auf den Link auslösen (simuliert)
  document.body.appendChild(link);
  link.click();

  // 🧹 Aufräumen
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
