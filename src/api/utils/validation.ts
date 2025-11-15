/**
 * @fileoverview Validation Utilities - Input-Validierung für API-Calls
 *
 * ZWECK:
 * - Validierung für Exposé-Formulardaten
 * - Validierung für Lead-Daten
 * - Validierung für API-Responses
 * - Input-Sanitization (Security)
 *
 * TYPES:
 * - ExposeFormData: Formular-Daten für Exposé-Generierung
 * - LeadFormData: Formular-Daten für Lead-Erstellung
 * - ValidationError: Validierungs-Fehler mit Details
 *
 * SECURITY:
 * - Input-Sanitization gegen XSS
 * - Range-Validierung (Wohnfläche, Zimmer, Baujahr)
 * - Format-Validierung (E-Mail, Telefon)
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

// ==================== TYPES ====================

/**
 * Exposé-Formulardaten
 */
export interface ExposeFormData {
  objektart?: string;
  strasse?: string;
  ort?: string;
  bezirk?: string;
  wohnflaeche?: string | number;
  zimmer?: string | number;
  baujahr?: string | number;
  preis?: string;
  etage?: string | number;
  balkonTerrasse?: string;
  ausstattung?: string;
  besonderheiten?: string;
  [key: string]: unknown; // Allow additional fields
}

/**
 * Lead-Formulardaten
 */
export interface LeadFormData {
  name?: string;
  contact?: string;
  type?: string;
  status?: string;
  location?: string;
  note?: string;
  [key: string]: unknown; // Allow additional fields
}

// ==================== EXPOSÉ VALIDATION ====================

/**
 * Validiert Exposé-Formulardaten
 *
 * VALIDIERUNGEN:
 * - Pflichtfelder: objektart, strasse, ort, wohnflaeche, zimmer, preis
 * - Wohnfläche: > 0, < 10.000 m²
 * - Zimmeranzahl: > 0, < 100
 * - Baujahr: 1700 bis heute + 5 Jahre
 *
 * @param data - Formular-Daten
 * @returns Error-Message oder null wenn valid
 */
export function validateExposeData(data: ExposeFormData): string | null {
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
  if (data.baujahr && String(data.baujahr).trim()) {
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
 *
 * VALIDIERUNGEN:
 * - Text muss String sein
 * - Min. 50 Zeichen
 * - Max. 5000 Zeichen
 * - Keine Error-Strings im Text
 *
 * @param text - Generierter Text
 * @throws Error wenn Response ungültig
 */
export function validateExposeResponse(text: unknown): asserts text is string {
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

// ==================== LEAD VALIDATION ====================

/**
 * Validiert Lead-Daten
 *
 * VALIDIERUNGEN:
 * - Name: Pflichtfeld, min. 2, max. 100 Zeichen
 * - Kontakt: Optional, aber wenn gesetzt dann E-Mail oder Telefon
 * - Type: Optional, muss in ['mieten', 'kaufen', 'verkaufen', 'vermieten'] sein
 * - Status: Optional, muss in ['neu', 'warm', 'cold', 'vip'] sein
 *
 * @param data - Lead-Daten
 * @returns Error-Message oder null wenn valid
 */
export function validateLeadData(data: LeadFormData): string | null {
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

// ==================== HELPER FUNCTIONS ====================

/**
 * Prüft ob String eine gültige E-Mail-Adresse ist
 *
 * PATTERN: RFC 5322 simplified
 *
 * @param email - Email-String
 * @returns True wenn valid
 */
function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') return false;

  // RFC 5322 simplified pattern
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}

/**
 * Prüft ob String eine gültige Telefonnummer ist
 *
 * PATTERN: Zahlen, Leerzeichen, +, -, (, )
 * RANGE: 7-20 Zeichen
 *
 * @param phone - Telefon-String
 * @returns True wenn valid
 */
function isValidPhone(phone: string): boolean {
  if (typeof phone !== 'string') return false;

  // Erlaubt: Zahlen, Leerzeichen, +, -, (, )
  // Min. 7 Zeichen, Max. 20 Zeichen
  const pattern = /^[\d\s+()-]{7,20}$/;
  return pattern.test(phone.trim());
}

// ==================== SANITIZATION ====================

/**
 * Sanitized String für API-Calls
 *
 * SECURITY:
 * - Entfernt HTML-Tags (<, >)
 * - Limitiert auf 1000 Zeichen
 * - Trimmt Whitespace
 *
 * @param str - Input-String
 * @returns Sanitized String
 */
export function sanitizeInput(str: unknown): string {
  if (typeof str !== 'string') return '';

  return (
    str
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .substring(0, 1000) // Max length
  );
}
