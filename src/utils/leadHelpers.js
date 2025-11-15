// 🔧 leadHelpers.js – Utility-Funktionen für Lead-Daten
// ✅ Normalisierung (Status, Datum)
// ✅ Lead-Erstellung mit Defaults
// ✅ Migration von alten Datenformaten

/**
 * Gültige Status-Werte
 */
export const STATUS_ENUM = ['neu', 'warm', 'cold', 'vip'];

/**
 * Gültige Type-Werte
 */
export const TYPE_ENUM = ['mieten', 'kaufen', 'verkaufen', 'vermieten'];

/**
 * Normalisiert Status-String
 * @param {string} status - Roher Status
 * @returns {string} Normalisierter Status (default: 'neu')
 */
export function normalizeStatus(status) {
  if (!status || typeof status !== 'string') return 'neu';

  const normalized = status.toLowerCase().trim();

  return STATUS_ENUM.includes(normalized) ? normalized : 'neu';
}

/**
 * Normalisiert Type-String
 * @param {string} type - Roher Type
 * @returns {string} Normalisierter Type (default: 'mieten')
 */
export function normalizeType(type) {
  if (!type || typeof type !== 'string') return 'mieten';

  const normalized = type.toLowerCase().trim();

  return TYPE_ENUM.includes(normalized) ? normalized : 'mieten';
}

/**
 * Konvertiert Datum-Wert zu ISO-String
 * @param {string|number|Date} value - Datum-Wert
 * @returns {string} ISO-Datum-String
 */
export function toISODate(value) {
  if (!value) return new Date().toISOString();

  // Already ISO string
  if (typeof value === 'string' && value.includes('T')) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) return value;
    } catch {
      // Fall through
    }
  }

  // Timestamp or parseable string
  const num = typeof value === 'number' ? value : Date.parse(value);

  if (isNaN(num)) return new Date().toISOString();

  return new Date(num).toISOString();
}

/**
 * Erstellt neuen Lead mit Defaults
 * @param {Object} partial - Partielle Lead-Daten
 * @returns {Object} Vollständiger Lead
 */
export function createLead(partial = {}) {
  const now = new Date().toISOString();

  return {
    _v: 2, // Version für Migrations
    id:
      partial.id ||
      `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: partial.name || '',
    contact: partial.contact || '',
    type: normalizeType(partial.type),
    status: normalizeStatus(partial.status),
    location: partial.location || '',
    note: partial.note || partial.notes || '', // Support both fields
    createdAt: toISODate(partial.createdAt || now),
    updatedAt: toISODate(partial.updatedAt || partial.createdAt || now),
  };
}

/**
 * Migriert Lead von v1 zu v2 Format
 * @param {Object} raw - Rohe Lead-Daten
 * @returns {Object} Migrierter Lead
 */
export function migrateLead(raw) {
  if (!raw || typeof raw !== 'object') {
    return createLead({});
  }

  // Already v2
  if (raw._v === 2) {
    return {
      ...raw,
      status: normalizeStatus(raw.status),
      type: normalizeType(raw.type),
      createdAt: toISODate(raw.createdAt),
      updatedAt: toISODate(raw.updatedAt || raw.createdAt),
      _v: 2,
    };
  }

  // v1 or unknown -> migrate
  return createLead({
    id: raw.id,
    name: raw.name,
    contact: raw.contact || raw.email, // Support old 'email' field
    type: raw.type,
    status: raw.status,
    location: raw.location || raw.ort, // Support old 'ort' field
    note: raw.note || raw.notes,
    createdAt: raw.createdAt || raw.created,
    updatedAt: raw.updatedAt || raw.updated,
  });
}

/**
 * Validiert Lead-Objekt
 * @param {Object} lead - Lead zum Validieren
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateLead(lead) {
  const errors = [];

  if (!lead || typeof lead !== 'object') {
    return { valid: false, errors: ['Lead muss ein Objekt sein'] };
  }

  if (!lead.name || typeof lead.name !== 'string' || !lead.name.trim()) {
    errors.push('Name ist ein Pflichtfeld');
  }

  if (lead.contact && typeof lead.contact !== 'string') {
    errors.push('Kontakt muss ein String sein');
  }

  if (lead.status && !STATUS_ENUM.includes(lead.status)) {
    errors.push(`Ungültiger Status: ${lead.status}`);
  }

  if (lead.type && !TYPE_ENUM.includes(lead.type)) {
    errors.push(`Ungültiger Type: ${lead.type}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sortiert Leads nach verschiedenen Kriterien
 * @param {Object[]} leads - Array von Leads
 * @param {string} sortBy - Sortier-Kriterium ('name'|'createdAt'|'status')
 * @param {string} order - Sortier-Richtung ('asc'|'desc')
 * @returns {Object[]} Sortierte Leads
 */
export function sortLeads(leads, sortBy = 'createdAt', order = 'desc') {
  if (!Array.isArray(leads)) return [];

  const sorted = [...leads];

  sorted.sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'name':
        compareValue = (a.name || '').localeCompare(b.name || '');
        break;

      case 'createdAt':
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        compareValue = dateA - dateB;
        break;

      case 'status':
        // Status-Priorität: vip > warm > neu > cold
        const statusPriority = { vip: 4, warm: 3, neu: 2, cold: 1 };
        const priorityA = statusPriority[a.status] || 0;
        const priorityB = statusPriority[b.status] || 0;
        compareValue = priorityA - priorityB;
        break;

      default:
        return 0;
    }

    return order === 'asc' ? compareValue : -compareValue;
  });

  return sorted;
}

/**
 * Filtert Leads basierend auf Suchkriterien
 * @param {Object[]} leads - Array von Leads
 * @param {Object} criteria - Filter-Kriterien
 * @returns {Object[]} Gefilterte Leads
 */
export function filterLeads(leads, criteria = {}) {
  if (!Array.isArray(leads)) return [];

  let filtered = leads;

  // Filter nach Status
  if (criteria.status && criteria.status !== 'alle') {
    filtered = filtered.filter((l) => l.status === criteria.status);
  }

  // Filter nach Type
  if (criteria.type) {
    filtered = filtered.filter((l) => l.type === criteria.type);
  }

  // Text-Suche
  if (criteria.searchQuery && criteria.searchQuery.trim()) {
    const query = criteria.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.name?.toLowerCase().includes(query) ||
        l.contact?.toLowerCase().includes(query) ||
        l.location?.toLowerCase().includes(query) ||
        l.note?.toLowerCase().includes(query)
    );
  }

  return filtered;
}
