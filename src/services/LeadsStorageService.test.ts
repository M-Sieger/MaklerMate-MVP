/**
 * @fileoverview Tests für LeadsStorageService
 *
 * TESTED:
 * - load() - Laden aus localStorage
 * - save() - Speichern mit Debounce
 * - clear() - Löschen
 * - getStats() - Statistiken
 * - exportAsJSON() / importFromJSON()
 * - subscribe() - Subscription-System
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * DATUM: 2025-11-15
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LeadsStorageService } from './LeadsStorageService';
import type { Lead } from '../utils/leadHelpers';

describe('LeadsStorageService', () => {
  let storageService: InstanceType<typeof LeadsStorageService>;
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
      key: vi.fn(),
    };

    // Create new instance for each test
    storageService = new LeadsStorageService('test_leads');
  });

  afterEach(() => {
    storageService.destroy();
    vi.clearAllTimers();
  });

  describe('load', () => {
    it('should return empty array when nothing is stored', () => {
      const leads = storageService.load();
      expect(leads).toEqual([]);
    });

    it('should load and parse stored leads', () => {
      const mockLeads: Lead[] = [
        {
          id: '1',
          name: 'Test Lead',
          contact: 'test@example.com',
          type: 'mieten',
          status: 'neu',
          note: '',
          location: '',
          createdAt: '2025-11-15T12:00:00.000Z',
          updatedAt: '2025-11-15T12:00:00.000Z',
          _v: 2,
        },
      ];

      mockStorage['test_leads'] = JSON.stringify(mockLeads);

      const leads = storageService.load();
      expect(leads).toHaveLength(1);
      expect(leads[0].name).toBe('Test Lead');
    });

    it('should return empty array on invalid JSON', () => {
      mockStorage['test_leads'] = 'invalid json{';

      const leads = storageService.load();
      expect(leads).toEqual([]);
    });

    it('should return empty array when data is not an array', () => {
      mockStorage['test_leads'] = JSON.stringify({ not: 'an array' });

      const leads = storageService.load();
      expect(leads).toEqual([]);
    });

    it('should migrate v1 leads to v2', () => {
      // Mock old v1 lead (without _v field)
      const v1Lead = {
        id: '1',
        name: 'Old Lead',
        contact: 'old@test.com',
        // missing _v, createdAt, etc.
      };

      mockStorage['test_leads'] = JSON.stringify([v1Lead]);

      const leads = storageService.load();
      expect(leads).toHaveLength(1);
      expect(leads[0]._v).toBe(2);
      expect(leads[0].createdAt).toBeDefined();
    });
  });

  describe('save', () => {
    it('should save leads to localStorage with debounce', async () => {
      vi.useFakeTimers();

      const leads: Lead[] = [
        {
          id: '1',
          name: 'Test',
          contact: 'test@test.com',
          type: 'mieten',
          status: 'neu',
          note: '',
          location: '',
          createdAt: '2025-11-15T12:00:00.000Z',
          updatedAt: '2025-11-15T12:00:00.000Z',
          _v: 2,
        },
      ];

      storageService.save(leads);

      // Should not save immediately
      expect(localStorage.setItem).not.toHaveBeenCalled();

      // Fast-forward time past debounce
      vi.advanceTimersByTime(150);

      // Now should be saved
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test_leads',
        expect.stringContaining('Test')
      );

      vi.useRealTimers();
    });

    it('should debounce multiple rapid saves', async () => {
      vi.useFakeTimers();

      const leads1: Lead[] = [
        {
          id: '1',
          name: 'Lead 1',
          contact: 'test1@test.com',
          type: 'mieten',
          status: 'neu',
          note: '',
          location: '',
          createdAt: '2025-11-15T12:00:00.000Z',
          updatedAt: '2025-11-15T12:00:00.000Z',
          _v: 2,
        },
      ];

      const leads2: Lead[] = [
        {
          id: '2',
          name: 'Lead 2',
          contact: 'test2@test.com',
          type: 'mieten',
          status: 'neu',
          note: '',
          location: '',
          createdAt: '2025-11-15T12:00:00.000Z',
          updatedAt: '2025-11-15T12:00:00.000Z',
          _v: 2,
        },
      ];

      // Save twice rapidly
      storageService.save(leads1);
      vi.advanceTimersByTime(50);
      storageService.save(leads2);

      // Advance past first debounce
      vi.advanceTimersByTime(100);

      // Should not have saved yet (timer was reset)
      expect(localStorage.setItem).not.toHaveBeenCalled();

      // Advance past second debounce
      vi.advanceTimersByTime(50);

      // Should have saved only once with latest data
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test_leads',
        expect.stringContaining('Lead 2')
      );

      vi.useRealTimers();
    });
  });

  describe('clear', () => {
    it('should remove leads from localStorage', () => {
      mockStorage['test_leads'] = JSON.stringify([{ id: '1', name: 'Test' }]);

      storageService.clear();

      expect(localStorage.removeItem).toHaveBeenCalledWith('test_leads');
      expect(mockStorage['test_leads']).toBeUndefined();
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      const leads: Lead[] = [
        {
          id: '1',
          name: 'Test Lead',
          contact: 'test@test.com',
          type: 'mieten',
          status: 'neu',
          note: '',
          location: '',
          createdAt: '2025-11-15T12:00:00.000Z',
          updatedAt: '2025-11-15T12:00:00.000Z',
          _v: 2,
        },
      ];

      mockStorage['test_leads'] = JSON.stringify(leads);

      const stats = storageService.getStats();

      expect(stats.count).toBe(1);
      expect(stats.sizeInBytes).toBeGreaterThan(0);
      expect(stats.sizeInKB).toBeGreaterThanOrEqual(0);
    });

    it('should return zero stats for empty storage', () => {
      const stats = storageService.getStats();

      expect(stats.count).toBe(0);
      expect(stats.sizeInBytes).toBeGreaterThanOrEqual(0);
      expect(stats.sizeInKB).toBe(0);
    });
  });

  describe('exportAsJSON / importFromJSON', () => {
    it('should export leads as JSON string', () => {
      const leads: Lead[] = [
        {
          id: '1',
          name: 'Export Test',
          contact: 'export@test.com',
          type: 'mieten',
          status: 'neu',
          note: '',
          location: '',
          createdAt: '2025-11-15T12:00:00.000Z',
          updatedAt: '2025-11-15T12:00:00.000Z',
          _v: 2,
        },
      ];

      mockStorage['test_leads'] = JSON.stringify(leads);

      const exported = storageService.exportAsJSON();
      expect(exported).toBeTruthy();

      const parsed = JSON.parse(exported);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('Export Test');
    });

    it('should import leads from JSON string', () => {
      const jsonString = JSON.stringify([
        {
          id: '1',
          name: 'Import Test',
          contact: 'import@test.com',
        },
      ]);

      const imported = storageService.importFromJSON(jsonString);

      expect(imported).not.toBeNull();
      expect(imported).toHaveLength(1);
      expect(imported?.[0].name).toBe('Import Test');
      expect(imported?.[0]._v).toBe(2); // Should be migrated
    });

    it('should return null for invalid JSON', () => {
      const imported = storageService.importFromJSON('invalid{json');

      expect(imported).toBeNull();
    });

    it('should return null for non-array JSON', () => {
      const imported = storageService.importFromJSON(
        JSON.stringify({ not: 'an array' })
      );

      expect(imported).toBeNull();
    });
  });

  describe('subscribe', () => {
    it('should notify subscribers on save', async () => {
      vi.useFakeTimers();

      const callback = vi.fn();
      storageService.subscribe(callback);

      const leads: Lead[] = [
        {
          id: '1',
          name: 'Sub Test',
          contact: 'sub@test.com',
          type: 'mieten',
          status: 'neu',
          note: '',
          location: '',
          createdAt: '2025-11-15T12:00:00.000Z',
          updatedAt: '2025-11-15T12:00:00.000Z',
          _v: 2,
        },
      ];

      storageService.save(leads);
      vi.advanceTimersByTime(150);

      expect(callback).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'Sub Test' }),
      ]));

      vi.useRealTimers();
    });

    it('should allow unsubscribing', async () => {
      vi.useFakeTimers();

      const callback = vi.fn();
      const unsubscribe = storageService.subscribe(callback);

      // Unsubscribe immediately
      unsubscribe();

      const leads: Lead[] = [
        {
          id: '1',
          name: 'Test',
          contact: 'test@test.com',
          type: 'mieten',
          status: 'neu',
          note: '',
          location: '',
          createdAt: '2025-11-15T12:00:00.000Z',
          updatedAt: '2025-11-15T12:00:00.000Z',
          _v: 2,
        },
      ];

      storageService.save(leads);
      vi.advanceTimersByTime(150);

      // Should not have been called
      expect(callback).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('should notify on clear', () => {
      const callback = vi.fn();
      storageService.subscribe(callback);

      storageService.clear();

      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe('destroy', () => {
    it('should clear subscribers and timers', () => {
      vi.useFakeTimers();

      const callback = vi.fn();
      storageService.subscribe(callback);

      const leads: Lead[] = [
        {
          id: '1',
          name: 'Test',
          contact: 'test@test.com',
          type: 'mieten',
          status: 'neu',
          note: '',
          location: '',
          createdAt: '2025-11-15T12:00:00.000Z',
          updatedAt: '2025-11-15T12:00:00.000Z',
          _v: 2,
        },
      ];

      storageService.save(leads);
      storageService.destroy();

      // Advance time
      vi.advanceTimersByTime(150);

      // Callback should not be called (destroyed)
      expect(callback).not.toHaveBeenCalled();

      vi.useRealTimers();
    });
  });
});
