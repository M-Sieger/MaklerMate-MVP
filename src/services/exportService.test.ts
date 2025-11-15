/**
 * @fileoverview Tests für ExportService
 *
 * TESTED:
 * - importLeadsFromJSON (verschiedene Szenarien)
 * - CSV-Escaping (indirect via exportLeadsAsCSV)
 * - JSON-Export-Formate
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * DATUM: 2025-11-15
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import exportService from './exportService';
import type { Lead } from '@/utils/leadHelpers';

describe('ExportService', () => {
  describe('importLeadsFromJSON', () => {
    it('should successfully import valid leads', () => {
      const validJSON = JSON.stringify([
        {
          id: '1',
          name: 'Max Mustermann',
          contact: 'max@example.com',
          type: 'mieten',
          status: 'neu',
          note: 'Test Lead',
          createdAt: '2025-11-15T12:00:00.000Z',
        },
      ]);

      const result = exportService.importLeadsFromJSON(validJSON);

      expect(result.success).toBe(true);
      expect(result.leads).toHaveLength(1);
      expect(result.leads?.[0].name).toBe('Max Mustermann');
      expect(result.error).toBeUndefined();
    });

    it('should filter out invalid leads', () => {
      const mixedJSON = JSON.stringify([
        { name: 'Valid Lead', contact: 'valid@test.com' },
        { invalid: 'no name or contact' },
        { name: 'Another Valid', contact: '' }, // name is sufficient
        null,
        'not an object',
      ]);

      const result = exportService.importLeadsFromJSON(mixedJSON);

      expect(result.success).toBe(true);
      expect(result.leads).toHaveLength(2);
      expect(result.leads?.[0].name).toBe('Valid Lead');
      expect(result.leads?.[1].name).toBe('Another Valid');
    });

    it('should reject non-array JSON', () => {
      const invalidJSON = JSON.stringify({
        name: 'Not an array',
      });

      const result = exportService.importLeadsFromJSON(invalidJSON);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Ungültiges Format');
      expect(result.leads).toBeUndefined();
    });

    it('should handle malformed JSON', () => {
      const malformedJSON = '{ "name": "unclosed';

      const result = exportService.importLeadsFromJSON(malformedJSON);

      expect(result.success).toBe(false);
      expect(result.error).toContain('JSON Parse Error');
      expect(result.leads).toBeUndefined();
    });

    it('should reject empty array', () => {
      const emptyJSON = JSON.stringify([]);

      const result = exportService.importLeadsFromJSON(emptyJSON);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Keine gültigen Leads');
    });

    it('should accept leads with only name', () => {
      const nameOnlyJSON = JSON.stringify([
        { name: 'Only Name Lead' },
      ]);

      const result = exportService.importLeadsFromJSON(nameOnlyJSON);

      expect(result.success).toBe(true);
      expect(result.leads).toHaveLength(1);
      expect(result.leads?.[0].name).toBe('Only Name Lead');
    });

    it('should accept leads with only contact', () => {
      const contactOnlyJSON = JSON.stringify([
        { contact: 'contact@only.com' },
      ]);

      const result = exportService.importLeadsFromJSON(contactOnlyJSON);

      expect(result.success).toBe(true);
      expect(result.leads).toHaveLength(1);
      expect(result.leads?.[0].contact).toBe('contact@only.com');
    });
  });

  describe('copyLeadsToClipboard', () => {
    it('should copy leads to clipboard successfully', async () => {
      // Mock clipboard API
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const leads: Lead[] = [
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

      const result = await exportService.copyLeadsToClipboard(leads);

      expect(result).toBe(true);
      expect(mockWriteText).toHaveBeenCalled();
      const copiedText = mockWriteText.mock.calls[0][0] as string;
      expect(copiedText).toContain('Test Lead');
      expect(copiedText).toContain('test@example.com');
    });

    it('should handle clipboard errors', async () => {
      // Mock clipboard API to fail
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard denied'));
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

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

      const result = await exportService.copyLeadsToClipboard(leads);

      expect(result).toBe(false);
    });
  });

  describe('CSV Escaping (indirect test)', () => {
    let mockCreateElement: ReturnType<typeof vi.fn>;
    let mockClick: ReturnType<typeof vi.fn>;
    let mockCreateObjectURL: ReturnType<typeof vi.fn>;
    let mockRevokeObjectURL: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      // Mock DOM APIs
      mockClick = vi.fn();
      mockCreateElement = vi.fn(() => ({
        click: mockClick,
        style: {},
      }));
      mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
      mockRevokeObjectURL = vi.fn();

      // @ts-expect-error - mocking DOM API
      document.createElement = mockCreateElement;
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
      URL.createObjectURL = mockCreateObjectURL;
      URL.revokeObjectURL = mockRevokeObjectURL;

      // Mock Blob
      global.Blob = vi.fn(function (this: Blob, parts: BlobPart[], options?: BlobPropertyBag) {
        // @ts-expect-error - simplified Blob mock
        this.parts = parts;
        // @ts-expect-error - simplified Blob mock
        this.options = options;
        return this;
      }) as unknown as typeof Blob;
    });

    it('should properly escape CSV values with quotes', () => {
      const leadsWithQuotes: Lead[] = [
        {
          id: '1',
          name: 'Schmidt, "Maria"',
          contact: 'maria@example.com',
          type: 'mieten',
          status: 'neu',
          note: 'Test "note" with quotes',
          location: 'Berlin',
          createdAt: '2025-11-15T12:00:00.000Z',
          updatedAt: '2025-11-15T12:00:00.000Z',
          _v: 2,
        },
      ];

      exportService.exportLeadsAsCSV(leadsWithQuotes);

      expect(global.Blob).toHaveBeenCalled();
      // @ts-expect-error - accessing mock data
      const blobData = global.Blob.mock.calls[0][0][0] as string;

      // CSV-Escaping: Quotes should be doubled
      expect(blobData).toContain('""Maria""');
      expect(blobData).toContain('""note""');
    });

    it('should include UTF-8 BOM for Excel compatibility', () => {
      const leads: Lead[] = [
        {
          id: '1',
          name: 'Müller',
          contact: 'test@test.de',
          type: 'mieten',
          status: 'neu',
          note: '',
          location: '',
          createdAt: '2025-11-15T12:00:00.000Z',
          updatedAt: '2025-11-15T12:00:00.000Z',
          _v: 2,
        },
      ];

      exportService.exportLeadsAsCSV(leads);

      // @ts-expect-error - accessing mock data
      const blobData = global.Blob.mock.calls[0][0][0] as string;

      // Should start with BOM
      expect(blobData.charCodeAt(0)).toBe(0xfeff);
    });
  });

  describe('Export Expose as JSON', () => {
    let mockCreateObjectURL: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
      URL.createObjectURL = mockCreateObjectURL;
      URL.revokeObjectURL = vi.fn();

      document.createElement = vi.fn(() => ({
        click: vi.fn(),
        style: {},
      })) as unknown as typeof document.createElement;
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();

      global.Blob = vi.fn(function (this: Blob, parts: BlobPart[]) {
        // @ts-expect-error - simplified Blob mock
        this.parts = parts;
        return this;
      }) as unknown as typeof Blob;
    });

    it('should export expose with timestamp', () => {
      const expose = {
        formData: { objektart: 'Wohnung' },
        output: 'Test expose text',
        selectedStyle: 'emotional',
      };

      exportService.exportExposeAsJSON(expose);

      expect(global.Blob).toHaveBeenCalled();
      // @ts-expect-error - accessing mock data
      const jsonData = global.Blob.mock.calls[0][0][0] as string;
      const parsed = JSON.parse(jsonData);

      expect(parsed.formData.objektart).toBe('Wohnung');
      expect(parsed.output).toBe('Test expose text');
      expect(parsed.exportedAt).toBeDefined();
      expect(new Date(parsed.exportedAt).toString()).not.toBe('Invalid Date');
    });
  });
});
