/**
 * @fileoverview LocalStorageLeadRepository Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageLeadRepository } from './LocalStorageLeadRepository';
import type { Lead } from '../../utils/leadHelpers';

describe('LocalStorageLeadRepository', () => {
  let repository: LocalStorageLeadRepository;
  let mockStorage: Record<string, string>;

  beforeEach(() => {
    // Mock localStorage
    mockStorage = {};

    global.localStorage = {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        mockStorage = {};
      }),
      length: 0,
      key: vi.fn(() => null),
    };

    repository = new LocalStorageLeadRepository();
  });

  describe('getAll', () => {
    it('should return empty array when no data exists', async () => {
      const leads = await repository.getAll();
      expect(leads).toEqual([]);
    });

    it('should return all leads from localStorage', async () => {
      const testLeads: Lead[] = [
        {
          id: '1',
          name: 'Test Lead',
          contact: 'test@example.com',
          type: 'mieten',
          location: 'Berlin',
          note: 'Test note',
          status: 'neu',
          _v: 2,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];

      mockStorage['maklermate_leads'] = JSON.stringify(testLeads);

      const leads = await repository.getAll();
      expect(leads).toEqual(testLeads);
    });

    it('should handle invalid JSON gracefully', async () => {
      mockStorage['maklermate_leads'] = 'invalid json';

      const leads = await repository.getAll();
      expect(leads).toEqual([]);
    });

    it('should handle non-array data gracefully', async () => {
      mockStorage['maklermate_leads'] = JSON.stringify({ foo: 'bar' });

      const leads = await repository.getAll();
      expect(leads).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return null when lead not found', async () => {
      const lead = await repository.getById('nonexistent');
      expect(lead).toBeNull();
    });

    it('should return lead when found', async () => {
      const testLead: Lead = {
        id: 'test-123',
        name: 'Test Lead',
        contact: 'test@example.com',
        type: 'mieten',
        location: 'Berlin',
        note: 'Test note',
        status: 'neu',
        _v: 2,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      mockStorage['maklermate_leads'] = JSON.stringify([testLead]);

      const lead = await repository.getById('test-123');
      expect(lead).toEqual(testLead);
    });
  });

  describe('create', () => {
    it('should create new lead with generated ID', async () => {
      const newLead = await repository.create({
        name: 'New Lead',
        contact: 'new@example.com',
        type: 'kaufen',
        location: 'Berlin',
        note: 'Test note',
        status: 'warm',
      });

      expect(newLead.id).toBeTruthy();
      expect(newLead.name).toBe('New Lead');
      expect(newLead._v).toBe(2);
      expect(newLead.createdAt).toBeTruthy();
      expect(newLead.updatedAt).toBeTruthy();
    });

    it('should persist lead to localStorage', async () => {
      await repository.create({
        name: 'New Lead',
        contact: 'new@example.com',
        type: 'kaufen',
        location: 'Berlin',
        note: 'Test note',
        status: 'warm',
      });

      const stored = JSON.parse(mockStorage['maklermate_leads']);
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe('New Lead');
    });
  });

  describe('update', () => {
    it('should update existing lead', async () => {
      const testLead: Lead = {
        id: 'test-123',
        name: 'Test Lead',
        contact: 'test@example.com',
        type: 'mieten',
        location: 'Berlin',
        note: 'Test note',
        status: 'neu',
        _v: 2,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      mockStorage['maklermate_leads'] = JSON.stringify([testLead]);

      const updated = await repository.update('test-123', { status: 'vip' });

      expect(updated.status).toBe('vip');
      expect(updated.updatedAt).not.toBe(testLead.updatedAt);
    });

    it('should throw error when lead not found', async () => {
      await expect(repository.update('nonexistent', { status: 'vip' })).rejects.toThrow(
        'Lead with ID nonexistent not found'
      );
    });
  });

  describe('delete', () => {
    it('should delete existing lead', async () => {
      const testLeads: Lead[] = [
        {
          id: 'test-1',
          name: 'Lead 1',
          contact: 'lead1@example.com',
          type: 'mieten',
          location: 'Berlin',
          note: 'Test note',
          status: 'neu',
          _v: 2,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 'test-2',
          name: 'Lead 2',
          contact: 'lead2@example.com',
          type: 'kaufen',
          location: 'Berlin',
          note: 'Test note',
          status: 'warm',
          _v: 2,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];

      mockStorage['maklermate_leads'] = JSON.stringify(testLeads);

      await repository.delete('test-1');

      const remaining = await repository.getAll();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('test-2');
    });

    it('should throw error when lead not found', async () => {
      await expect(repository.delete('nonexistent')).rejects.toThrow(
        'Lead with ID nonexistent not found'
      );
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple leads', async () => {
      const testLeads: Lead[] = [
        {
          id: 'test-1',
          name: 'Lead 1',
          contact: 'lead1@example.com',
          type: 'mieten',
          location: 'Berlin',
          note: 'Test note',
          status: 'neu',
          _v: 2,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 'test-2',
          name: 'Lead 2',
          contact: 'lead2@example.com',
          type: 'kaufen',
          location: 'Berlin',
          note: 'Test note',
          status: 'warm',
          _v: 2,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 'test-3',
          name: 'Lead 3',
          contact: 'lead3@example.com',
          type: 'verkaufen',
          location: 'Berlin',
          note: 'Test note',
          status: 'cold',
          _v: 2,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];

      mockStorage['maklermate_leads'] = JSON.stringify(testLeads);

      await repository.deleteMany(['test-1', 'test-3']);

      const remaining = await repository.getAll();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('test-2');
    });
  });

  describe('exportAsJSON', () => {
    it('should export leads as JSON string', async () => {
      const testLeads: Lead[] = [
        {
          id: 'test-1',
          name: 'Lead 1',
          contact: 'lead1@example.com',
          type: 'mieten',
          location: 'Berlin',
          note: 'Test note',
          status: 'neu',
          _v: 2,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];

      mockStorage['maklermate_leads'] = JSON.stringify(testLeads);

      const json = await repository.exportAsJSON();
      const parsed = JSON.parse(json);

      expect(parsed).toEqual(testLeads);
    });
  });

  describe('importFromJSON', () => {
    it('should import leads from JSON string', async () => {
      const leads = [
        {
          id: 'import-1',
          name: 'Imported Lead',
          contact: 'import@example.com',
          type: 'mieten',
          location: 'Berlin',
          note: 'Test note',
          status: 'neu',
          _v: 2,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];

      const count = await repository.importFromJSON(JSON.stringify(leads));

      expect(count).toBe(1);

      const stored = await repository.getAll();
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('import-1');
    });

    it('should not import duplicate leads', async () => {
      const existingLead: Lead = {
        id: 'existing-1',
        name: 'Existing Lead',
        contact: 'existing@example.com',
        type: 'mieten',
        location: 'Berlin',
        note: 'Test note',
        status: 'neu',
        _v: 2,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      mockStorage['maklermate_leads'] = JSON.stringify([existingLead]);

      // Try to import same lead again
      const count = await repository.importFromJSON(JSON.stringify([existingLead]));

      expect(count).toBe(0); // No new leads imported

      const stored = await repository.getAll();
      expect(stored).toHaveLength(1);
    });

    it('should throw error on invalid JSON', async () => {
      await expect(repository.importFromJSON('invalid json')).rejects.toThrow();
    });

    it('should throw error on non-array JSON', async () => {
      await expect(repository.importFromJSON(JSON.stringify({ foo: 'bar' }))).rejects.toThrow(
        'Invalid JSON: Expected array'
      );
    });
  });
});
