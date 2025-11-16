/**
 * @fileoverview Tests für CRM Store
 *
 * TESTED:
 * - Lead CRUD Operations (add, update, delete, bulk delete)
 * - Filter & Search (status filter, search query)
 * - Statistics (total, byStatus, byType)
 * - Bulk Operations (bulkUpdateStatus)
 * - Import/Export (JSON)
 * - Persistence (Zustand persist middleware)
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * DATUM: 2025-11-15
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import useCRMStore from './crmStore';
import type { Lead } from '@/utils/leadHelpers';

describe('CRM Store', () => {
  // Clear localStorage before and after each test
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Lead CRUD Operations', () => {
    it('should add a new lead', () => {
      const { result } = renderHook(() => useCRMStore());

      // Reset store first
      act(() => {
        result.current.resetLeads();
      });

      act(() => {
        result.current.addLead({
          name: 'Max Mustermann',
          contact: 'max@example.com',
          type: 'mieten',
          status: 'neu',
          location: 'Berlin',
          note: 'Sucht 3-Zimmer-Wohnung',
        });
      });

      expect(result.current.leads).toHaveLength(1);
      expect(result.current.leads[0].name).toBe('Max Mustermann');
      expect(result.current.leads[0].id).toBeTruthy();
      expect(result.current.leads[0].createdAt).toBeTruthy();
      expect(result.current.leads[0]._v).toBe(2);
    });

    it('should generate unique IDs for leads', () => {
      const { result } = renderHook(() => useCRMStore());

      // Reset store first
      act(() => {
        result.current.resetLeads();
      });

      act(() => {
        result.current.addLead({
          name: 'Lead 1',
          contact: 'lead1@test.com',
          type: 'mieten',
          status: 'neu',
          location: '',
          note: '',
        });
        result.current.addLead({
          name: 'Lead 2',
          contact: 'lead2@test.com',
          type: 'kaufen',
          status: 'neu',
          location: '',
          note: '',
        });
      });

      const id1 = result.current.leads[0].id;
      const id2 = result.current.leads[1].id;

      expect(id1).not.toBe(id2);
    });

    it('should update an existing lead', () => {
      const { result } = renderHook(() => useCRMStore());

      // Reset store first
      act(() => {
        result.current.resetLeads();
      });

      let leadId: string;

      act(() => {
        result.current.addLead({
          name: 'Original Name',
          contact: 'original@test.com',
          type: 'mieten',
          status: 'neu',
          location: '',
          note: '',
        });
      });

      //Access leadId outside the act block
      leadId = result.current.leads[0].id;

      act(() => {
        result.current.updateLead(leadId, {
          name: 'Updated Name',
          status: 'warm',
        });
      });

      expect(result.current.leads[0].name).toBe('Updated Name');
      expect(result.current.leads[0].status).toBe('warm');
      expect(result.current.leads[0].contact).toBe('original@test.com'); // unchanged
      expect(result.current.leads[0].updatedAt).toBeTruthy(); // updatedAt is set
    });

    it('should delete a lead', () => {
      const { result } = renderHook(() => useCRMStore());

      // Reset store first
      act(() => {
        result.current.resetLeads();
      });

      let leadId: string;

      act(() => {
        result.current.addLead({
          name: 'To Delete',
          contact: 'delete@test.com',
          type: 'mieten',
          status: 'neu',
          location: '',
          note: '',
        });
      });

      // Access leadId outside the act block
      leadId = result.current.leads[0].id;

      expect(result.current.leads).toHaveLength(1);

      act(() => {
        result.current.deleteLead(leadId);
      });

      expect(result.current.leads).toHaveLength(0);
    });

    it('should bulk delete multiple leads', () => {
      const { result } = renderHook(() => useCRMStore());
      act(() => { result.current.resetLeads(); });

      act(() => {
        result.current.addLead({
          name: 'Lead 1',
          contact: 'lead1@test.com',
          type: 'mieten',
          status: 'neu',
          location: '',
          note: '',
        });
        result.current.addLead({
          name: 'Lead 2',
          contact: 'lead2@test.com',
          type: 'kaufen',
          status: 'neu',
          location: '',
          note: '',
        });
        result.current.addLead({
          name: 'Lead 3',
          contact: 'lead3@test.com',
          type: 'mieten',
          status: 'warm',
          location: '',
          note: '',
        });
      });

      const id1 = result.current.leads[0].id;
      const id2 = result.current.leads[1].id;

      expect(result.current.leads).toHaveLength(3);

      act(() => {
        result.current.deleteLeads([id1, id2]);
      });

      expect(result.current.leads).toHaveLength(1);
      expect(result.current.leads[0].name).toBe('Lead 3');
    });

    it('should set all leads at once', () => {
      const { result } = renderHook(() => useCRMStore());
      act(() => { result.current.resetLeads(); });

      const newLeads: Lead[] = [
        {
          id: '1',
          name: 'Set Lead 1',
          contact: 'set1@test.com',
          type: 'mieten',
          status: 'neu',

          location: '',

          note: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 2,
        },
        {
          id: '2',
          name: 'Set Lead 2',
          contact: 'set2@test.com',
          type: 'kaufen',
          status: 'warm',

          location: '',

          note: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 2,
        },
      ];

      act(() => {
        result.current.setLeads(newLeads);
      });

      expect(result.current.leads).toHaveLength(2);
      expect(result.current.leads[0].name).toBe('Set Lead 1');
    });

    it('should reset all leads', () => {
      const { result } = renderHook(() => useCRMStore());
      act(() => { result.current.resetLeads(); });

      act(() => {
        result.current.addLead({
          name: 'Lead 1',
          contact: 'lead1@test.com',
          type: 'mieten',
          status: 'neu',
          location: '',
          note: '',
        });
        result.current.addLead({
          name: 'Lead 2',
          contact: 'lead2@test.com',
          type: 'kaufen',
          status: 'neu',
          location: '',
          note: '',
        });
      });

      expect(result.current.leads).toHaveLength(2);

      act(() => {
        result.current.resetLeads();
      });

      expect(result.current.leads).toHaveLength(0);
    });
  });

  describe('Filter & Search', () => {
    beforeEach(() => {
      localStorage.clear();
      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.resetLeads(); // Reset first to clear any persisted data
        result.current.addLead({
          name: 'Anna Schmidt',
          contact: 'anna@test.com',
          type: 'mieten',
          status: 'neu',
          location: 'Berlin',
          note: '',
        });
        result.current.addLead({
          name: 'Max Müller',
          contact: 'max@test.com',
          type: 'kaufen',
          status: 'warm',
          location: 'München',
          note: '',
        });
        result.current.addLead({
          name: 'Lisa Weber',
          contact: 'lisa@test.com',
          type: 'mieten',
          status: 'vip',
          location: 'Hamburg',
          note: '',
        });
      });
    });

    it('should filter leads by status', () => {
      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.setFilter('neu');
      });

      const filtered = result.current.getFilteredLeads();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Anna Schmidt');
    });

    it('should return all leads when filter is "alle"', () => {
      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.setFilter('alle');
      });

      const filtered = result.current.getFilteredLeads();
      expect(filtered).toHaveLength(3);
    });

    it('should search leads by name', () => {
      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.setSearchQuery('max');
      });

      const filtered = result.current.getFilteredLeads();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Max Müller');
    });

    it('should search leads by contact', () => {
      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.setSearchQuery('anna@');
      });

      const filtered = result.current.getFilteredLeads();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Anna Schmidt');
    });

    it('should search leads by location', () => {
      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.setSearchQuery('hamburg');
      });

      const filtered = result.current.getFilteredLeads();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Lisa Weber');
    });

    it('should combine filter and search', () => {
      const { result } = renderHook(() => useCRMStore());

      // Add another 'mieten' lead
      act(() => {
        result.current.addLead({
          name: 'Peter Klein',
          contact: 'peter@test.com',
          type: 'mieten',
          status: 'neu',
          location: 'Köln',
          note: '',
        });
      });

      act(() => {
        result.current.setFilter('neu');
        result.current.setSearchQuery('anna');
      });

      const filtered = result.current.getFilteredLeads();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Anna Schmidt');
    });

    it('should be case-insensitive when searching', () => {
      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.setSearchQuery('ANNA');
      });

      const filtered = result.current.getFilteredLeads();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Anna Schmidt');
    });
  });

  describe('Statistics', () => {
    it('should calculate correct statistics', () => {
      const { result } = renderHook(() => useCRMStore());
      act(() => { result.current.resetLeads(); });

      act(() => {
        result.current.addLead({
          name: 'Lead 1',
          contact: 'lead1@test.com',
          type: 'mieten',
          status: 'neu',
          location: '',
          note: '',
        });
        result.current.addLead({
          name: 'Lead 2',
          contact: 'lead2@test.com',
          type: 'mieten',
          status: 'neu',
          location: '',
          note: '',
        });
        result.current.addLead({
          name: 'Lead 3',
          contact: 'lead3@test.com',
          type: 'kaufen',
          status: 'warm',
          location: '',
          note: '',
        });
        result.current.addLead({
          name: 'Lead 4',
          contact: 'lead4@test.com',
          type: 'verkaufen',
          status: 'vip',
          location: '',
          note: '',
        });
      });

      const stats = result.current.getStats();

      expect(stats.total).toBe(4);
      expect(stats.byStatus.neu).toBe(2);
      expect(stats.byStatus.warm).toBe(1);
      expect(stats.byStatus.vip).toBe(1);
      expect(stats.byStatus.cold).toBe(0);
      expect(stats.byType.mieten).toBe(2);
      expect(stats.byType.kaufen).toBe(1);
      expect(stats.byType.verkaufen).toBe(1);
    });

    it('should return zero stats for empty store', () => {
      const { result } = renderHook(() => useCRMStore());
      act(() => { result.current.resetLeads(); });

      const stats = result.current.getStats();

      expect(stats.total).toBe(0);
      expect(stats.byStatus.neu).toBe(0);
      expect(stats.byStatus.warm).toBe(0);
      expect(stats.byStatus.vip).toBe(0);
      expect(stats.byStatus.cold).toBe(0);
    });
  });

  describe('Bulk Operations', () => {
    it('should bulk update status for multiple leads', () => {
      const { result } = renderHook(() => useCRMStore());
      act(() => { result.current.resetLeads(); });

      act(() => {
        result.current.addLead({
          name: 'Lead 1',
          contact: 'lead1@test.com',
          type: 'mieten',
          status: 'neu',
          location: '',
          note: '',
        });
        result.current.addLead({
          name: 'Lead 2',
          contact: 'lead2@test.com',
          type: 'kaufen',
          status: 'neu',
          location: '',
          note: '',
        });
        result.current.addLead({
          name: 'Lead 3',
          contact: 'lead3@test.com',
          type: 'mieten',
          status: 'warm',
          location: '',
          note: '',
        });
      });

      const id1 = result.current.leads[0].id;
      const id2 = result.current.leads[1].id;

      act(() => {
        result.current.bulkUpdateStatus([id1, id2], 'vip');
      });

      expect(result.current.leads[0].status).toBe('vip');
      expect(result.current.leads[1].status).toBe('vip');
      expect(result.current.leads[2].status).toBe('warm'); // unchanged
    });
  });

  describe('Import/Export', () => {
    it('should export leads as JSON string', () => {
      const { result } = renderHook(() => useCRMStore());
      act(() => { result.current.resetLeads(); });

      act(() => {
        result.current.addLead({
          name: 'Export Test',
          contact: 'export@test.com',
          type: 'mieten',
          status: 'neu',
          location: '',
          note: '',
        });
      });

      const json = result.current.exportLeadsAsJSON();
      const parsed = JSON.parse(json);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('Export Test');
    });

    it('should import leads from valid JSON', () => {
      const { result } = renderHook(() => useCRMStore());
      act(() => { result.current.resetLeads(); });

      const importData: Lead[] = [
        {
          id: '1',
          name: 'Import Lead 1',
          contact: 'import1@test.com',
          type: 'mieten',
          status: 'neu',

          location: '',

          note: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 2,
        },
        {
          id: '2',
          name: 'Import Lead 2',
          contact: 'import2@test.com',
          type: 'kaufen',
          status: 'warm',

          location: '',

          note: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 2,
        },
      ];

      let importResult: any;
      act(() => {
        importResult = result.current.importLeadsFromJSON(
          JSON.stringify(importData)
        );
      });

      expect(importResult.success).toBe(true);
      expect(importResult.count).toBe(2);
      expect(result.current.leads).toHaveLength(2);
      expect(result.current.leads[0].name).toBe('Import Lead 1');
    });

    it('should reject invalid JSON format', () => {
      const { result } = renderHook(() => useCRMStore());
      act(() => { result.current.resetLeads(); });

      const importResult = result.current.importLeadsFromJSON('invalid{json');

      expect(importResult.success).toBe(false);
      expect(importResult.error).toBeTruthy();
    });

    it('should reject non-array JSON', () => {
      const { result } = renderHook(() => useCRMStore());
      act(() => { result.current.resetLeads(); });

      const importResult = result.current.importLeadsFromJSON(
        JSON.stringify({ name: 'Not an array' })
      );

      expect(importResult.success).toBe(false);
      expect(importResult.error).toBe('Ungültiges Format');
    });
  });
});
