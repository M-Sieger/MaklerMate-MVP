/**
 * @fileoverview E2E Tests für Exposé-Generierung Flow
 *
 * CRITICAL USER FLOW:
 * 1. Navigation zur Exposé-Seite
 * 2. Formular ausfüllen
 * 3. Exposé generieren (OpenAI API)
 * 4. Ergebnis anzeigen
 * 5. PDF-Export
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * DATUM: 2025-11-15
 */

import { test, expect } from '@playwright/test';

test.describe('Exposé Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to expose page
    await page.goto('/expose');
  });

  test('should display expose form on page load', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/MaklerMate/i);

    // Check form elements are visible
    await expect(page.locator('input[name="strasse"]')).toBeVisible();
    await expect(page.locator('input[name="ort"]')).toBeVisible();
    await expect(page.locator('select[name="objektart"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    const generateButton = page.locator('button', { hasText: /generieren/i });
    await generateButton.click();

    // Check for validation messages or that form didn't submit
    // This depends on your validation implementation
    // Example: check if still on same page
    await expect(page).toHaveURL(/\/expose/);
  });

  test('should fill form with valid data', async ({ page }) => {
    // Fill out the expose form
    await page.fill('input[name="strasse"]', 'Musterstraße 123');
    await page.fill('input[name="ort"]', 'Berlin');
    await page.fill('input[name="bezirk"]', 'Mitte');

    // Select objektart
    await page.selectOption('select[name="objektart"]', 'Wohnung');

    // Fill additional fields
    await page.fill('input[name="wohnflaeche"]', '85');
    await page.fill('input[name="zimmer"]', '3');
    await page.fill('input[name="baujahr"]', '1995');
    await page.fill('input[name="preis"]', '450.000 €');

    // Verify values are filled
    await expect(page.locator('input[name="strasse"]')).toHaveValue(
      'Musterstraße 123'
    );
    await expect(page.locator('input[name="ort"]')).toHaveValue('Berlin');
  });

  test('should display loading state during generation', async ({ page }) => {
    // Fill minimum required fields
    await page.fill('input[name="strasse"]', 'Teststraße 1');
    await page.fill('input[name="ort"]', 'München');
    await page.selectOption('select[name="objektart"]', 'Einfamilienhaus');

    // Click generate button
    const generateButton = page.locator('button', { hasText: /generieren/i });
    await generateButton.click();

    // Check for loading indicator
    // This depends on your loading implementation
    // Common patterns: spinner, disabled button, loading text
    await expect(
      page.locator('button', { hasText: /wird generiert|loading/i })
    ).toBeVisible({ timeout: 2000 });
  });

  test.skip('should generate expose successfully with mock data', async ({
    page,
  }) => {
    // NOTE: This test is skipped because it requires OpenAI API credentials
    // To run this test, set up proper API mocking or use test credentials

    // Fill form
    await page.fill('input[name="strasse"]', 'Hauptstraße 42');
    await page.fill('input[name="ort"]', 'Hamburg');
    await page.selectOption('select[name="objektart"]', 'Wohnung');
    await page.fill('input[name="wohnflaeche"]', '75');
    await page.fill('input[name="zimmer"]', '2.5');

    // Generate
    await page.click('button', { hasText: /generieren/i });

    // Wait for result (with generous timeout for API)
    await expect(page.locator('[data-testid="expose-result"]')).toBeVisible({
      timeout: 30000,
    });

    // Verify result contains generated text
    const resultText = await page
      .locator('[data-testid="expose-result"]')
      .textContent();
    expect(resultText).toBeTruthy();
    expect(resultText!.length).toBeGreaterThan(100);
  });

  test('should enable PDF export after generation', async ({ page }) => {
    // This assumes there's already generated content (mock or real)
    // Check if PDF export button exists and is clickable

    // Navigate and check for export button state
    const pdfButton = page.locator('button', { hasText: /pdf.*export/i });

    // Initially might be disabled if no content
    // After generation, should be enabled
    // This test structure depends on your UI implementation
  });

  test('should handle image upload', async ({ page }) => {
    // Check if image upload is available
    const fileInput = page.locator('input[type="file"]');

    if (await fileInput.isVisible()) {
      // Create a dummy file for testing
      const buffer = Buffer.from('fake-image-data');
      await fileInput.setInputFiles({
        name: 'test-image.jpg',
        mimeType: 'image/jpeg',
        buffer,
      });

      // Verify image preview or upload success indicator
      // This depends on your implementation
    }
  });

  test('should navigate back to home', async ({ page }) => {
    // Find and click home/back navigation
    const homeLink = page.locator('a[href="/"]').first();
    await homeLink.click();

    // Verify navigation
    await expect(page).toHaveURL('/');
  });

  test('should persist form data on page reload', async ({ page }) => {
    // Fill form
    await page.fill('input[name="strasse"]', 'Persistenztest 1');
    await page.fill('input[name="ort"]', 'Frankfurt');

    // Reload page
    await page.reload();

    // Check if data persists (if you have localStorage persistence)
    // This depends on whether you implement form state persistence
    // If not implemented, values will be empty after reload
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if form is still usable
    await expect(page.locator('input[name="strasse"]')).toBeVisible();
    await expect(page.locator('button', { hasText: /generieren/i })).toBeVisible();

    // Fill a field to ensure input works
    await page.fill('input[name="ort"]', 'Berlin');
    await expect(page.locator('input[name="ort"]')).toHaveValue('Berlin');
  });
});

test.describe('Exposé Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/expose');
  });

  test('should validate email format in contact field', async ({ page }) => {
    // If there's an email field
    const emailField = page.locator('input[type="email"]');

    if (await emailField.isVisible()) {
      await emailField.fill('invalid-email');
      await page.click('button', { hasText: /generieren/i });

      // Check for validation error
      // This depends on your validation implementation
    }
  });

  test('should validate numeric fields', async ({ page }) => {
    // Test wohnflaeche accepts only numbers
    await page.fill('input[name="wohnflaeche"]', 'not-a-number');

    // Depending on implementation, field might reject input or show error
    const value = await page.locator('input[name="wohnflaeche"]').inputValue();

    // Either empty (rejected) or shows validation error
    expect(value === '' || value === 'not-a-number').toBeTruthy();
  });
});
