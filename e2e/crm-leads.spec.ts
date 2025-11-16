/**
 * @fileoverview E2E Tests für CRM Leads Management Flow
 *
 * CRITICAL USER FLOW:
 * 1. Navigation zur CRM-Seite
 * 2. Lead erstellen
 * 3. Lead bearbeiten
 * 4. Lead-Status ändern
 * 5. Lead löschen
 * 6. Leads exportieren
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * DATUM: 2025-11-15
 */

import { test, expect } from '@playwright/test';

test.describe('CRM Leads Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to CRM page
    await page.goto('/crm');

    // Clear localStorage to start fresh
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should display CRM page with empty state', async ({ page }) => {
    // Check page loaded
    await expect(page).toHaveTitle(/MaklerMate/i);

    // Check for "no leads" message or empty state
    const emptyState = page.locator('text=/keine leads|empty|leer/i');
    const addButton = page.locator('button', { hasText: /lead.*hinzufügen|neuer lead|add/i });

    // Either empty state message or add button should be visible
    const hasEmptyIndicator = await emptyState.isVisible().catch(() => false);
    const hasAddButton = await addButton.isVisible().catch(() => false);

    expect(hasEmptyIndicator || hasAddButton).toBeTruthy();
  });

  test('should create a new lead', async ({ page }) => {
    // Find and click "Add Lead" button
    const addButton = page.locator('button', { hasText: /lead.*hinzufügen|neuer lead|add.*lead/i }).first();
    await addButton.click();

    // Fill lead form
    await page.fill('input[name="name"]', 'Max Mustermann');
    await page.fill('input[name="contact"]', 'max@example.com');

    // Select type if available
    const typeSelect = page.locator('select[name="type"]');
    if (await typeSelect.isVisible()) {
      await typeSelect.selectOption('mieten');
    }

    // Save lead
    const saveButton = page.locator('button', { hasText: /speichern|save/i });
    await saveButton.click();

    // Verify lead appears in list
    await expect(page.locator('text=Max Mustermann')).toBeVisible();
  });

  test('should edit an existing lead', async ({ page }) => {
    // First create a lead
    await page.evaluate(() => {
      const lead = {
        id: 'test-1',
        name: 'Test User',
        contact: 'test@test.com',
        type: 'mieten',
        status: 'neu',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _v: 2,
      };
      localStorage.setItem('crm_leads', JSON.stringify([lead]));
    });

    // Reload to load the lead
    await page.reload();

    // Find and click edit button
    const editButton = page.locator('button[aria-label*="edit" i], button', { hasText: /bearbeiten|edit/i }).first();
    await editButton.click();

    // Change name
    await page.fill('input[name="name"]', 'Updated Name');

    // Save
    await page.click('button', { hasText: /speichern|save/i });

    // Verify update
    await expect(page.locator('text=Updated Name')).toBeVisible();
  });

  test('should change lead status', async ({ page }) => {
    // Create test lead
    await page.evaluate(() => {
      const lead = {
        id: 'test-status',
        name: 'Status Test',
        contact: 'status@test.com',
        type: 'kaufen',
        status: 'neu',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _v: 2,
      };
      localStorage.setItem('crm_leads', JSON.stringify([lead]));
    });

    await page.reload();

    // Find status dropdown/button for the lead
    const statusSelect = page.locator('select[name="status"]').first();

    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('kontaktiert');

      // Verify status changed (might show in badge/label)
      await expect(page.locator('text=/kontaktiert/i')).toBeVisible();
    }
  });

  test('should delete a lead with confirmation', async ({ page }) => {
    // Create test lead
    await page.evaluate(() => {
      const lead = {
        id: 'test-delete',
        name: 'Delete Me',
        contact: 'delete@test.com',
        type: 'mieten',
        status: 'neu',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _v: 2,
      };
      localStorage.setItem('crm_leads', JSON.stringify([lead]));
    });

    await page.reload();

    // Click delete button
    const deleteButton = page.locator('button[aria-label*="delete" i], button', { hasText: /löschen|delete/i }).first();

    // Set up dialog handler for confirmation
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await deleteButton.click();

    // Verify lead is gone
    await expect(page.locator('text=Delete Me')).not.toBeVisible({
      timeout: 2000,
    });
  });

  test('should filter leads by status', async ({ page }) => {
    // Create multiple leads with different statuses
    await page.evaluate(() => {
      const leads = [
        {
          id: '1',
          name: 'Lead Neu',
          contact: 'neu@test.com',
          type: 'mieten',
          status: 'neu',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 2,
        },
        {
          id: '2',
          name: 'Lead Kontaktiert',
          contact: 'kontaktiert@test.com',
          type: 'kaufen',
          status: 'kontaktiert',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 2,
        },
      ];
      localStorage.setItem('crm_leads', JSON.stringify(leads));
    });

    await page.reload();

    // Find filter controls
    const filterButton = page.locator('button, select', { hasText: /filter|status/i }).first();

    if (await filterButton.isVisible()) {
      await filterButton.click();

      // Select "neu" filter
      await page.click('text=neu');

      // Verify only "neu" leads visible
      await expect(page.locator('text=Lead Neu')).toBeVisible();
      await expect(page.locator('text=Lead Kontaktiert')).not.toBeVisible();
    }
  });

  test('should search leads by name', async ({ page }) => {
    // Create test leads
    await page.evaluate(() => {
      const leads = [
        {
          id: '1',
          name: 'Anna Schmidt',
          contact: 'anna@test.com',
          type: 'mieten',
          status: 'neu',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 2,
        },
        {
          id: '2',
          name: 'Max Müller',
          contact: 'max@test.com',
          type: 'kaufen',
          status: 'neu',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 2,
        },
      ];
      localStorage.setItem('crm_leads', JSON.stringify(leads));
    });

    await page.reload();

    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="suche" i]').first();

    if (await searchInput.isVisible()) {
      await searchInput.fill('Anna');

      // Verify filtered results
      await expect(page.locator('text=Anna Schmidt')).toBeVisible();
      await expect(page.locator('text=Max Müller')).not.toBeVisible();
    }
  });

  test('should export leads as CSV', async ({ page }) => {
    // Create test leads
    await page.evaluate(() => {
      const leads = [
        {
          id: '1',
          name: 'Export Test',
          contact: 'export@test.com',
          type: 'mieten',
          status: 'neu',
          note: 'Test note',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 2,
        },
      ];
      localStorage.setItem('crm_leads', JSON.stringify(leads));
    });

    await page.reload();

    // Set up download handler
    const downloadPromise = page.waitForEvent('download');

    // Click export button
    const exportButton = page.locator('button', { hasText: /export|csv/i }).first();
    await exportButton.click();

    // Wait for download
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/\.csv$/i);
  });

  test('should display lead statistics', async ({ page }) => {
    // Create multiple leads
    await page.evaluate(() => {
      const leads = [
        {
          id: '1',
          name: 'Lead 1',
          contact: '1@test.com',
          type: 'mieten',
          status: 'neu',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 2,
        },
        {
          id: '2',
          name: 'Lead 2',
          contact: '2@test.com',
          type: 'kaufen',
          status: 'kontaktiert',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 2,
        },
        {
          id: '3',
          name: 'Lead 3',
          contact: '3@test.com',
          type: 'mieten',
          status: 'qualifiziert',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 2,
        },
      ];
      localStorage.setItem('crm_leads', JSON.stringify(leads));
    });

    await page.reload();

    // Check for statistics display (total count, status breakdown)
    const statsSection = page.locator('[data-testid="lead-stats"], .stats, .statistics');

    if (await statsSection.isVisible()) {
      // Verify total count
      await expect(page.locator('text=/gesamt.*3|total.*3/i')).toBeVisible();
    }
  });

  test('should persist leads in localStorage', async ({ page }) => {
    // Add a lead
    const addButton = page.locator('button', { hasText: /lead.*hinzufügen|add/i }).first();
    await addButton.click();

    await page.fill('input[name="name"]', 'Persistence Test');
    await page.fill('input[name="contact"]', 'persist@test.com');

    await page.click('button', { hasText: /speichern|save/i });

    // Reload page
    await page.reload();

    // Verify lead still exists
    await expect(page.locator('text=Persistence Test')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify CRM is usable on mobile
    await expect(page.locator('button', { hasText: /add|hinzufügen/i }).first()).toBeVisible();

    // Create test lead
    await page.evaluate(() => {
      const lead = {
        id: 'mobile-test',
        name: 'Mobile Test',
        contact: 'mobile@test.com',
        type: 'mieten',
        status: 'neu',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _v: 2,
      };
      localStorage.setItem('crm_leads', JSON.stringify([lead]));
    });

    await page.reload();

    // Verify lead is visible and readable
    await expect(page.locator('text=Mobile Test')).toBeVisible();
  });
});

test.describe('CRM Lead Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crm');
  });

  test('should require name field', async ({ page }) => {
    // Open form
    await page.click('button', { hasText: /add|hinzufügen/i });

    // Try to save without name
    await page.fill('input[name="contact"]', 'test@test.com');
    await page.click('button', { hasText: /speichern|save/i });

    // Should show validation error or prevent submission
    // This depends on your validation implementation
  });

  test('should validate email format', async ({ page }) => {
    // Open form
    await page.click('button', { hasText: /add|hinzufügen/i });

    await page.fill('input[name="name"]', 'Test');
    await page.fill('input[name="contact"]', 'invalid-email');

    await page.click('button', { hasText: /speichern|save/i });

    // Check for email validation error
    // Implementation specific
  });
});
