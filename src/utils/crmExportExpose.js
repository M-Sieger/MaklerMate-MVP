// 📄 Exportiert Exposé-Daten als JSON
export function generateCRMJson(data) {
  return JSON.stringify(data, null, 2);
}

// 🧾 Exportiert Exposé-Daten im CRM-kompatiblen TXT-Format
export function generateCRMTemplate(data) {
  return `Objekttitel: ${data.formData.titel}
Ort: ${data.formData.ort}
Zielgruppe: ${data.formData.zielgruppe}

Exposé-Text:
${data.gptText}
`;
}
