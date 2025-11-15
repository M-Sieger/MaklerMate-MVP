/**
 * @fileoverview Lead Helpers - Utility-Funktionen für Lead-Daten
 *
 * ZWECK:
 * - Normalisierung (Status, Datum, Type)
 * - Lead-Erstellung mit Defaults
 * - Migration von alten Datenformaten (v1 → v2)
 * - Validierung, Sortierung, Filterung
 *
 * TYPES:
 * - Lead: Vollständiges Lead-Object
 * - LeadStatus: 'neu' | 'warm' | 'cold' | 'vip'
 * - LeadType: 'mieten' | 'kaufen' | 'verkaufen' | 'vermieten'
 * - PartialLead: Partial Lead für createLead()
 * - ValidationResult: { valid: boolean, errors: string[] }
 *
 * MIGRATION:
 * - v1: Alte Felder (email, ort, created, updated)
 * - v2: Neue Felder (contact, location, createdAt, updatedAt)
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

// ==================== TYPES ====================

/**
 * Gültige Lead-Status-Werte
 */
export type LeadStatus = 'neu' | 'warm' | 'cold' | 'vip';

/**
 * Gültige Lead-Type-Werte
 */
export type LeadType = 'mieten' | 'kaufen' | 'verkaufen' | 'vermieten';

/**
 * Sortier-Kriterien für Leads
 */
export type LeadSortBy = 'name' | 'createdAt' | 'status';

/**
 * Sortier-Richtung
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Lead-Object (v2 Format)
 */
export interface Lead {
  _v: 2;
  id: string;
  name: string;
  contact: string;
  type: LeadType;
  status: LeadStatus;
  location: string;
  note: string;
  createdAt: string; // ISO-8601 Date
  updatedAt: string; // ISO-8601 Date
}

/**
 * Partial Lead für createLead()
 */
export interface PartialLead {
  id?: string;
  name?: string;
  contact?: string;
  type?: string | LeadType;
  status?: string | LeadStatus;
  location?: string;
  note?: string;
  notes?: string; // Support old field
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
}

/**
 * Legacy Lead (v1 Format)
 */
interface LegacyLead {
  id?: string;
  name?: string;
  email?: string; // v1 field
  contact?: string;
  type?: string;
  status?: string;
  ort?: string; // v1 field
  location?: string;
  note?: string;
  notes?: string;
  created?: string | number; // v1 field
  createdAt?: string | number;
  updated?: string | number; // v1 field
  updatedAt?: string | number;
  _v?: number;
}

/**
 * Validierungs-Result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Filter-Kriterien für Leads
 */
export interface LeadFilterCriteria {
  status?: LeadStatus | 'alle';
  type?: LeadType;
  searchQuery?: string;
}

// ==================== CONSTANTS ====================

/**
 * Gültige Status-Werte
 */
export const STATUS_ENUM: readonly LeadStatus[] = [
  'neu',
  'warm',
  'cold',
  'vip',
] as const;

/**
 * Gültige Type-Werte
 */
export const TYPE_ENUM: readonly LeadType[] = [
  'mieten',
  'kaufen',
  'verkaufen',
  'vermieten',
] as const;

// ==================== NORMALIZATION ====================

/**
 * Normalisiert Status-String
 *
 * @param status - Roher Status
 * @returns Normalisierter Status (default: 'neu')
 */
export function normalizeStatus(status: unknown): LeadStatus {
  if (!status || typeof status !== 'string') return 'neu';

  const normalized = status.toLowerCase().trim() as LeadStatus;

  return STATUS_ENUM.includes(normalized) ? normalized : 'neu';
}

/**
 * Normalisiert Type-String
 *
 * @param type - Roher Type
 * @returns Normalisierter Type (default: 'mieten')
 */
export function normalizeType(type: unknown): LeadType {
  if (!type || typeof type !== 'string') return 'mieten';

  const normalized = type.toLowerCase().trim() as LeadType;

  return TYPE_ENUM.includes(normalized) ? normalized : 'mieten';
}

/**
 * Konvertiert Datum-Wert zu ISO-String
 *
 * @param value - Datum-Wert
 * @returns ISO-Datum-String
 */
export function toISODate(value: unknown): string {
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
  const num = typeof value === 'number' ? value : Date.parse(value as string);

  if (isNaN(num)) return new Date().toISOString();

  return new Date(num).toISOString();
}

// ==================== LEAD CREATION ====================

/**
 * Erstellt neuen Lead mit Defaults
 *
 * @param partial - Partielle Lead-Daten
 * @returns Vollständiger Lead (v2 Format)
 */
export function createLead(partial: PartialLead = {}): Lead {
  const now = new Date().toISOString();

  return {
    _v: 2,
    id:
      partial.id ||
      `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: partial.name || '',
    contact: partial.contact || '',
    type: normalizeType(partial.type),
    status: normalizeStatus(partial.status),
    location: partial.location || '',
    note: partial.note || partial.notes || '',
    createdAt: toISODate(partial.createdAt || now),
    updatedAt: toISODate(partial.updatedAt || partial.createdAt || now),
  };
}

/**
 * Migriert Lead von v1 zu v2 Format
 *
 * @param raw - Rohe Lead-Daten (v1 oder v2)
 * @returns Migrierter Lead (v2 Format)
 */
export function migrateLead(raw: unknown): Lead {
  if (!raw || typeof raw !== 'object') {
    return createLead({});
  }

  const lead = raw as LegacyLead;

  // Already v2
  if (lead._v === 2) {
    return {
      _v: 2,
      id: lead.id || '',
      name: lead.name || '',
      contact: lead.contact || '',
      type: normalizeType(lead.type),
      status: normalizeStatus(lead.status),
      location: lead.location || '',
      note: lead.note || lead.notes || '',
      createdAt: toISODate(lead.createdAt),
      updatedAt: toISODate(lead.updatedAt || lead.createdAt),
    };
  }

  // v1 or unknown -> migrate
  return createLead({
    id: lead.id,
    name: lead.name,
    contact: lead.contact || lead.email, // Support old 'email' field
    type: lead.type,
    status: lead.status,
    location: lead.location || lead.ort, // Support old 'ort' field
    note: lead.note || lead.notes,
    createdAt: lead.createdAt || lead.created,
    updatedAt: lead.updatedAt || lead.updated,
  });
}

// ==================== VALIDATION ====================

/**
 * Validiert Lead-Objekt
 *
 * @param lead - Lead zum Validieren
 * @returns Validierungs-Result mit Fehlerliste
 */
export function validateLead(lead: unknown): ValidationResult {
  const errors: string[] = [];

  if (!lead || typeof lead !== 'object') {
    return { valid: false, errors: ['Lead muss ein Objekt sein'] };
  }

  const l = lead as Partial<Lead>;

  if (!l.name || typeof l.name !== 'string' || !l.name.trim()) {
    errors.push('Name ist ein Pflichtfeld');
  }

  if (l.contact && typeof l.contact !== 'string') {
    errors.push('Kontakt muss ein String sein');
  }

  if (l.status && !STATUS_ENUM.includes(l.status as LeadStatus)) {
    errors.push(`Ungültiger Status: ${l.status}`);
  }

  if (l.type && !TYPE_ENUM.includes(l.type as LeadType)) {
    errors.push(`Ungültiger Type: ${l.type}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ==================== SORTING ====================

/**
 * Sortiert Leads nach verschiedenen Kriterien
 *
 * @param leads - Array von Leads
 * @param sortBy - Sortier-Kriterium
 * @param order - Sortier-Richtung
 * @returns Sortierte Leads
 */
export function sortLeads(
  leads: Lead[],
  sortBy: LeadSortBy = 'createdAt',
  order: SortOrder = 'desc'
): Lead[] {
  if (!Array.isArray(leads)) return [];

  const sorted = [...leads];

  sorted.sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'name':
        compareValue = (a.name || '').localeCompare(b.name || '');
        break;

      case 'createdAt': {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        compareValue = dateA - dateB;
        break;
      }

      case 'status': {
        // Status-Priorität: vip > warm > neu > cold
        const statusPriority: Record<LeadStatus, number> = {
          vip: 4,
          warm: 3,
          neu: 2,
          cold: 1,
        };
        const priorityA = statusPriority[a.status] || 0;
        const priorityB = statusPriority[b.status] || 0;
        compareValue = priorityA - priorityB;
        break;
      }

      default:
        return 0;
    }

    return order === 'asc' ? compareValue : -compareValue;
  });

  return sorted;
}

// ==================== FILTERING ====================

/**
 * Filtert Leads basierend auf Suchkriterien
 *
 * @param leads - Array von Leads
 * @param criteria - Filter-Kriterien
 * @returns Gefilterte Leads
 */
export function filterLeads(
  leads: Lead[],
  criteria: LeadFilterCriteria = {}
): Lead[] {
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
