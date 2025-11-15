// ✅ validation.js – Validation Utilities für API-Calls
// ✅ Validierung für Exposé-Daten
// ✅ Validierung für Lead-Daten
// ✅ Validierung für API-Responses

/**
 * Validiert Exposé-Formulardaten
 * @param {Object} data - Formular-Daten
 * @returns {string|null} Error-Message oder null wenn valid
 */
export function validateExposeData(data) {
  const required = ['objektart', 'strasse', 'ort', 'wohnflaeche', 'zimmer', 'preis'];

  // Pflichtfelder prüfen
  for (const field of required) {
    if (!data[field] || String(data[field]).trim() === '') {
      return `Pflichtfeld fehlt: ${field}`;
    }
  }

  // Wohnfläche validieren
  if (data.wohnflaeche) {
    const wohnflaeche = Number(data.wohnflaeche);
    if (isNaN(wohnflaeche) || wohnflaeche <= 0) {
      return 'Wohnfläche muss eine positive Zahl sein';
    }
    if (wohnflaeche > 10000) {
      return 'Wohnfläche unrealistisch groß (max. 10.000 m²)';
    }
  }

  // Zimmeranzahl validieren
  if (data.zimmer) {
    const zimmer = Number(data.zimmer);
    if (isNaN(zimmer) || zimmer <= 0) {
      return 'Zimmeranzahl muss eine positive Zahl sein';
    }
    if (zimmer > 100) {
      return 'Zimmeranzahl unrealistisch hoch (max. 100)';
    }
  }

  // Baujahr validieren (optional)
  if (data.baujahr && data.baujahr.trim()) {
    const baujahr = Number(data.baujahr);
    const currentYear = new Date().getFullYear();
    if (isNaN(baujahr) || baujahr < 1700 || baujahr > currentYear + 5) {
      return `Baujahr muss zwischen 1700 und ${currentYear + 5} liegen`;
    }
  }

  return null; // Valid
}

/**
 * Validiert Exposé-Response von API
 * @param {string} text - Generierter Text
 * @throws {Error} Wenn Response ungültig
 */
export function validateExposeResponse(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Ungültige Response: Text muss ein String sein');
  }

  const trimmed = text.trim();

  if (trimmed.length < 50) {
    throw new Error('Exposé-Text zu kurz (min. 50 Zeichen)');
  }

  if (trimmed.length > 5000) {
    throw new Error('Exposé-Text zu lang (max. 5000 Zeichen)');
  }

  // Prüfe auf Error-Strings in Response
  const errorPatterns = [
    /error/i,
    /failed/i,
    /unable to/i,
    /something went wrong/i,
  ];

  for (const pattern of errorPatterns) {
    if (pattern.test(trimmed.substring(0, 100))) {
      throw new Error('API hat Fehler-Text zurückgegeben');
    }
  }
}

/**
 * Validiert Lead-Daten
 * @param {Object} data - Lead-Daten
 * @returns {string|null} Error-Message oder null wenn valid
 */
export function validateLeadData(data) {
  if (!data.name || !data.name.trim()) {
    return 'Name ist ein Pflichtfeld';
  }

  if (data.name.trim().length < 2) {
    return 'Name muss mindestens 2 Zeichen lang sein';
  }

  if (data.name.trim().length > 100) {
    return 'Name darf maximal 100 Zeichen lang sein';
  }

  // Kontakt validieren (optional, aber wenn gesetzt dann Format prüfen)
  if (data.contact && data.contact.trim()) {
    if (!isValidEmail(data.contact) && !isValidPhone(data.contact)) {
      return 'Kontakt muss eine gültige E-Mail oder Telefonnummer sein';
    }
  }

  // Type validieren (optional)
  const validTypes = ['mieten', 'kaufen', 'verkaufen', 'vermieten', ''];
  if (data.type && !validTypes.includes(data.type.toLowerCase())) {
    return 'Ungültiger Lead-Typ';
  }

  // Status validieren (optional)
  const validStatuses = ['neu', 'warm', 'cold', 'vip', ''];
  if (data.status && !validStatuses.includes(data.status.toLowerCase())) {
    return 'Ungültiger Status';
  }

  return null; // Valid
}

/**
 * Prüft ob String eine gültige E-Mail-Adresse ist
 * @param {string} email - Email-String
 * @returns {boolean} True wenn valid
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;

  // RFC 5322 simplified pattern
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}

/**
 * Prüft ob String eine gültige Telefonnummer ist
 * @param {string} phone - Telefon-String
 * @returns {boolean} True wenn valid
 */
function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;

  // Erlaubt: Zahlen, Leerzeichen, +, -, (, )
  // Min. 7 Zeichen, Max. 20 Zeichen
  const pattern = /^[\d\s+()-]{7,20}$/;
  return pattern.test(phone.trim());
}

/**
 * Sanitized String für API-Calls (entfernt gefährliche Zeichen)
 * @param {string} str - Input-String
 * @returns {string} Sanitized String
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';

  return str
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .substring(0, 1000); // Max length
}
