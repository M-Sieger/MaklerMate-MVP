/**
 * @fileoverview Tests für Lead Helper Functions
 *
 * TESTED:
 * - Normalization (normalizeStatus, normalizeType, toISODate)
 * - Lead Creation (createLead)
 * - Migration (migrateLead - v1 to v2)
 * - Validation (validateLead)
 * - Sorting (sortLeads - name, date, status)
 * - Filtering (filterLeads - status, type, search)
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * DATUM: 2025-11-15
 */

import { describe, it, expect } from 'vitest';

import {
  normalizeStatus,
  normalizeType,
  toISODate,
  createLead,
  migrateLead,
  validateLead,
  sortLeads,
  filterLeads,
  STATUS_ENUM,
  TYPE_ENUM,
} from './leadHelpers';
import type { Lead, LeadFilterCriteria } from './leadHelpers';

describe('leadHelpers - Normalization', () => {
  describe('normalizeStatus', () => {
    it('should normalize valid status strings', () => {
      expect(normalizeStatus('neu')).toBe('neu');
      expect(normalizeStatus('warm')).toBe('warm');
      expect(normalizeStatus('cold')).toBe('cold');
      expect(normalizeStatus('vip')).toBe('vip');
    });

    it('should handle different cases', () => {
      expect(normalizeStatus('NEU')).toBe('neu');
      expect(normalizeStatus('WaRm')).toBe('warm');
      expect(normalizeStatus('  VIP  ')).toBe('vip');
    });

    it('should return "neu" for invalid status', () => {
      expect(normalizeStatus('invalid')).toBe('neu');
      expect(normalizeStatus('unknown')).toBe('neu');
      expect(normalizeStatus('')).toBe('neu');
    });

    it('should return "neu" for non-string input', () => {
      expect(normalizeStatus(null)).toBe('neu');
      expect(normalizeStatus(undefined)).toBe('neu');
      expect(normalizeStatus(123)).toBe('neu');
      expect(normalizeStatus({})).toBe('neu');
    });
  });

  describe('normalizeType', () => {
    it('should normalize valid type strings', () => {
      expect(normalizeType('mieten')).toBe('mieten');
      expect(normalizeType('kaufen')).toBe('kaufen');
      expect(normalizeType('verkaufen')).toBe('verkaufen');
      expect(normalizeType('vermieten')).toBe('vermieten');
    });

    it('should handle different cases', () => {
      expect(normalizeType('MIETEN')).toBe('mieten');
      expect(normalizeType('KaUfEn')).toBe('kaufen');
      expect(normalizeType('  verkaufen  ')).toBe('verkaufen');
    });

    it('should return "mieten" for invalid type', () => {
      expect(normalizeType('invalid')).toBe('mieten');
      expect(normalizeType('unknown')).toBe('mieten');
      expect(normalizeType('')).toBe('mieten');
    });

    it('should return "mieten" for non-string input', () => {
      expect(normalizeType(null)).toBe('mieten');
      expect(normalizeType(undefined)).toBe('mieten');
      expect(normalizeType(123)).toBe('mieten');
    });
  });

  describe('toISODate', () => {
    it('should convert ISO string to ISO string', () => {
      const isoString = '2025-11-15T12:00:00.000Z';
      expect(toISODate(isoString)).toBe(isoString);
    });

    it('should convert timestamp to ISO string', () => {
      const timestamp = 1700000000000;
      const result = toISODate(timestamp);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should convert parseable date string to ISO', () => {
      const dateString = '2025-11-15';
      const result = toISODate(dateString);
      expect(result).toContain('2025-11-15');
    });

    it('should return current date for invalid input', () => {
      const result = toISODate('invalid-date');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should return current date for null/undefined', () => {
      const result1 = toISODate(null);
      const result2 = toISODate(undefined);
      expect(result1).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(result2).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});

describe('leadHelpers - Lead Creation', () => {
  describe('createLead', () => {
    it('should create lead with defaults', () => {
      const lead = createLead();

      expect(lead._v).toBe(2);
      expect(lead.id).toBeTruthy();
      expect(lead.name).toBe('');
      expect(lead.contact).toBe('');
      expect(lead.type).toBe('mieten');
      expect(lead.status).toBe('neu');
      expect(lead.location).toBe('');
      expect(lead.note).toBe('');
      expect(lead.createdAt).toBeTruthy();
      expect(lead.updatedAt).toBeTruthy();
    });

    it('should create lead with provided data', () => {
      const lead = createLead({
        name: 'Max Mustermann',
        contact: 'max@example.com',
        type: 'kaufen',
        status: 'warm',
        location: 'Berlin',
        note: 'Sucht Wohnung',
      });

      expect(lead.name).toBe('Max Mustermann');
      expect(lead.contact).toBe('max@example.com');
      expect(lead.type).toBe('kaufen');
      expect(lead.status).toBe('warm');
      expect(lead.location).toBe('Berlin');
      expect(lead.note).toBe('Sucht Wohnung');
    });

    it('should use custom ID if provided', () => {
      const customId = 'custom-id-123';
      const lead = createLead({ id: customId });

      expect(lead.id).toBe(customId);
    });

    it('should support legacy "notes" field', () => {
      const lead = createLead({ notes: 'Legacy note field' });

      expect(lead.note).toBe('Legacy note field');
    });

    it('should normalize status and type', () => {
      const lead = createLead({
        status: 'WARM',
        type: 'KAUFEN',
      });

      expect(lead.status).toBe('warm');
      expect(lead.type).toBe('kaufen');
    });

    it('should generate unique IDs', () => {
      const lead1 = createLead();
      const lead2 = createLead();

      expect(lead1.id).not.toBe(lead2.id);
    });
  });
});

describe('leadHelpers - Migration', () => {
  describe('migrateLead', () => {
    it('should keep v2 leads unchanged', () => {
      const v2Lead: Lead = {
        _v: 2,
        id: 'test-id',
        name: 'Test User',
        contact: 'test@example.com',
        type: 'mieten',
        status: 'neu',
        location: 'Berlin',
        note: 'Test note',
        createdAt: '2025-11-15T12:00:00.000Z',
        updatedAt: '2025-11-15T12:00:00.000Z',
      };

      const result = migrateLead(v2Lead);

      expect(result._v).toBe(2);
      expect(result.id).toBe('test-id');
      expect(result.name).toBe('Test User');
      expect(result.contact).toBe('test@example.com');
    });

    it('should migrate v1 lead with old field names', () => {
      const v1Lead = {
        id: 'v1-id',
        name: 'V1 User',
        email: 'v1@example.com', // old field
        ort: 'München', // old field
        type: 'kaufen',
        status: 'warm',
        note: 'V1 note',
        created: 1700000000000, // old field
        updated: 1700000000001, // old field
      };

      const result = migrateLead(v1Lead);

      expect(result._v).toBe(2);
      expect(result.contact).toBe('v1@example.com'); // migrated from email
      expect(result.location).toBe('München'); // migrated from ort
      expect(result.createdAt).toBeTruthy();
      expect(result.updatedAt).toBeTruthy();
    });

    it('should prefer new field names over old ones', () => {
      const mixedLead = {
        email: 'old@example.com',
        contact: 'new@example.com',
        ort: 'OldCity',
        location: 'NewCity',
      };

      const result = migrateLead(mixedLead);

      expect(result.contact).toBe('new@example.com');
      expect(result.location).toBe('NewCity');
    });

    it('should handle invalid input gracefully', () => {
      const result1 = migrateLead(null);
      const result2 = migrateLead(undefined);
      const result3 = migrateLead('not an object');

      expect(result1._v).toBe(2);
      expect(result2._v).toBe(2);
      expect(result3._v).toBe(2);
    });

    it('should support old "notes" field', () => {
      const legacyLead = {
        name: 'Test',
        notes: 'Old notes field',
      };

      const result = migrateLead(legacyLead);

      expect(result.note).toBe('Old notes field');
    });
  });
});

describe('leadHelpers - Validation', () => {
  describe('validateLead', () => {
    it('should validate valid lead', () => {
      const validLead: Lead = {
        _v: 2,
        id: 'test-id',
        name: 'Valid Lead',
        contact: 'valid@test.com',
        type: 'mieten',
        status: 'neu',
        location: 'Berlin',
        note: 'Test',
        createdAt: '2025-11-15T12:00:00.000Z',
        updatedAt: '2025-11-15T12:00:00.000Z',
      };

      const result = validateLead(validLead);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject lead without name', () => {
      const invalidLead = {
        contact: 'test@test.com',
      };

      const result = validateLead(invalidLead);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Name ist ein Pflichtfeld');
    });

    it('should reject lead with empty name', () => {
      const invalidLead = {
        name: '   ',
      };

      const result = validateLead(invalidLead);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Name ist ein Pflichtfeld');
    });

    it('should reject lead with invalid status', () => {
      const invalidLead = {
        name: 'Test',
        status: 'invalid-status',
      };

      const result = validateLead(invalidLead);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Ungültiger Status'))).toBe(
        true
      );
    });

    it('should reject lead with invalid type', () => {
      const invalidLead = {
        name: 'Test',
        type: 'invalid-type',
      };

      const result = validateLead(invalidLead);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Ungültiger Type'))).toBe(
        true
      );
    });

    it('should reject non-object input', () => {
      const result = validateLead(null);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Lead muss ein Objekt sein');
    });

    it('should accumulate multiple errors', () => {
      const invalidLead = {
        name: '',
        status: 'invalid',
        type: 'invalid',
        contact: 123, // wrong type
      };

      const result = validateLead(invalidLead);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});

describe('leadHelpers - Sorting', () => {
  describe('sortLeads', () => {
    const testLeads: Lead[] = [
      {
        _v: 2,
        id: '1',
        name: 'Charlie',
        contact: '',
        type: 'mieten',
        status: 'neu',
        location: '',
        note: '',
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z',
      },
      {
        _v: 2,
        id: '2',
        name: 'Alice',
        contact: '',
        type: 'kaufen',
        status: 'vip',
        location: '',
        note: '',
        createdAt: '2025-11-15T12:00:00.000Z',
        updatedAt: '2025-11-15T12:00:00.000Z',
      },
      {
        _v: 2,
        id: '3',
        name: 'Bob',
        contact: '',
        type: 'verkaufen',
        status: 'warm',
        location: '',
        note: '',
        createdAt: '2025-11-15T11:00:00.000Z',
        updatedAt: '2025-11-15T11:00:00.000Z',
      },
    ];

    it('should sort by name ascending', () => {
      const sorted = sortLeads(testLeads, 'name', 'asc');

      expect(sorted[0].name).toBe('Alice');
      expect(sorted[1].name).toBe('Bob');
      expect(sorted[2].name).toBe('Charlie');
    });

    it('should sort by name descending', () => {
      const sorted = sortLeads(testLeads, 'name', 'desc');

      expect(sorted[0].name).toBe('Charlie');
      expect(sorted[1].name).toBe('Bob');
      expect(sorted[2].name).toBe('Alice');
    });

    it('should sort by createdAt ascending', () => {
      const sorted = sortLeads(testLeads, 'createdAt', 'asc');

      expect(sorted[0].id).toBe('1'); // 10:00
      expect(sorted[1].id).toBe('3'); // 11:00
      expect(sorted[2].id).toBe('2'); // 12:00
    });

    it('should sort by createdAt descending (default)', () => {
      const sorted = sortLeads(testLeads, 'createdAt', 'desc');

      expect(sorted[0].id).toBe('2'); // 12:00
      expect(sorted[1].id).toBe('3'); // 11:00
      expect(sorted[2].id).toBe('1'); // 10:00
    });

    it('should sort by status priority', () => {
      const sorted = sortLeads(testLeads, 'status', 'desc');

      expect(sorted[0].status).toBe('vip'); // highest priority
      expect(sorted[1].status).toBe('warm');
      expect(sorted[2].status).toBe('neu'); // lowest priority
    });

    it('should handle empty array', () => {
      const sorted = sortLeads([], 'name', 'asc');

      expect(sorted).toEqual([]);
    });

    it('should handle non-array input', () => {
      const sorted = sortLeads(null as any, 'name', 'asc');

      expect(sorted).toEqual([]);
    });

    it('should not mutate original array', () => {
      const original = [...testLeads];
      sortLeads(testLeads, 'name', 'asc');

      expect(testLeads).toEqual(original);
    });
  });
});

describe('leadHelpers - Filtering', () => {
  describe('filterLeads', () => {
    const testLeads: Lead[] = [
      {
        _v: 2,
        id: '1',
        name: 'Anna Schmidt',
        contact: 'anna@test.com',
        type: 'mieten',
        status: 'neu',
        location: 'Berlin',
        note: 'Sucht 3-Zimmer-Wohnung',
        createdAt: '2025-11-15T12:00:00.000Z',
        updatedAt: '2025-11-15T12:00:00.000Z',
      },
      {
        _v: 2,
        id: '2',
        name: 'Max Müller',
        contact: 'max@test.com',
        type: 'kaufen',
        status: 'warm',
        location: 'München',
        note: 'Interessiert an Einfamilienhaus',
        createdAt: '2025-11-15T12:00:00.000Z',
        updatedAt: '2025-11-15T12:00:00.000Z',
      },
      {
        _v: 2,
        id: '3',
        name: 'Lisa Weber',
        contact: 'lisa@test.com',
        type: 'mieten',
        status: 'vip',
        location: 'Hamburg',
        note: 'VIP-Kunde',
        createdAt: '2025-11-15T12:00:00.000Z',
        updatedAt: '2025-11-15T12:00:00.000Z',
      },
    ];

    it('should filter by status', () => {
      const filtered = filterLeads(testLeads, { status: 'neu' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Anna Schmidt');
    });

    it('should filter by type', () => {
      const filtered = filterLeads(testLeads, { type: 'mieten' });

      expect(filtered).toHaveLength(2);
      expect(filtered[0].type).toBe('mieten');
      expect(filtered[1].type).toBe('mieten');
    });

    it('should filter by search query (name)', () => {
      const filtered = filterLeads(testLeads, { searchQuery: 'max' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Max Müller');
    });

    it('should filter by search query (contact)', () => {
      const filtered = filterLeads(testLeads, { searchQuery: 'anna@' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].contact).toBe('anna@test.com');
    });

    it('should filter by search query (location)', () => {
      const filtered = filterLeads(testLeads, { searchQuery: 'hamburg' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].location).toBe('Hamburg');
    });

    it('should filter by search query (note)', () => {
      const filtered = filterLeads(testLeads, { searchQuery: 'VIP' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].note).toBe('VIP-Kunde');
    });

    it('should combine multiple filters', () => {
      const filtered = filterLeads(testLeads, {
        status: 'neu',
        type: 'mieten',
        searchQuery: 'anna',
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Anna Schmidt');
    });

    it('should return all leads when status is "alle"', () => {
      const filtered = filterLeads(testLeads, { status: 'alle' });

      expect(filtered).toHaveLength(3);
    });

    it('should be case-insensitive', () => {
      const filtered = filterLeads(testLeads, { searchQuery: 'ANNA' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Anna Schmidt');
    });

    it('should handle empty criteria', () => {
      const filtered = filterLeads(testLeads, {});

      expect(filtered).toHaveLength(3);
    });

    it('should handle empty array', () => {
      const filtered = filterLeads([], { status: 'neu' });

      expect(filtered).toEqual([]);
    });

    it('should handle non-array input', () => {
      const filtered = filterLeads(null as any, { status: 'neu' });

      expect(filtered).toEqual([]);
    });

    it('should not mutate original array', () => {
      const original = [...testLeads];
      filterLeads(testLeads, { status: 'neu' });

      expect(testLeads).toEqual(original);
    });
  });
});

describe('leadHelpers - Constants', () => {
  it('should export STATUS_ENUM', () => {
    expect(STATUS_ENUM).toEqual(['neu', 'warm', 'cold', 'vip']);
  });

  it('should export TYPE_ENUM', () => {
    expect(TYPE_ENUM).toEqual(['mieten', 'kaufen', 'verkaufen', 'vermieten']);
  });
});
