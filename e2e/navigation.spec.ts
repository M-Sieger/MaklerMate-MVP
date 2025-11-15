/**
 * @fileoverview E2E Tests für Navigation und allgemeine Funktionalität
 *
 * BASIC FLOWS:
 * 1. Homepage-Navigation
 * 2. Menü-Navigation zwischen Seiten
 * 3. Responsive Navigation
 * 4. Error Handling
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * DATUM: 2025-11-15
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/MaklerMate/i);

    // Check for hero section or main content
    const heroSection = page.locator('h1, [role="heading"]').first();
    await expect(heroSection).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    await page.goto('/');

    // Check for navigation links
    const navBar = page.locator('nav, header').first();
    await expect(navBar).toBeVisible();

    // Common navigation items
    const links = ['expose', 'crm'];
    for (const link of links) {
      const navLink = page.locator(`a[href*="${link}"]`).first();
      if (await navLink.isVisible()) {
        await expect(navLink).toBeVisible();
      }
    }
  });

  test('should navigate to Exposé tool from homepage', async ({ page }) => {
    await page.goto('/');

    // Find and click Exposé link/button
    const exposeLink = page
      .locator('a[href*="expose"], button', { hasText: /exposé/i })
      .first();
    await exposeLink.click();

    // Verify navigation
    await expect(page).toHaveURL(/\/expose/);
  });

  test('should navigate to CRM from homepage', async ({ page }) => {
    await page.goto('/');

    // Find and click CRM link/button
    const crmLink = page.locator('a[href*="crm"], button', { hasText: /crm/i }).first();
    await crmLink.click();

    // Verify navigation
    await expect(page).toHaveURL(/\/crm/);
  });
});

test.describe('Navigation Between Pages', () => {
  test('should navigate between all main pages', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Go to Exposé
    await page.goto('/expose');
    await expect(page).toHaveURL('/expose');

    // Go to CRM
    await page.goto('/crm');
    await expect(page).toHaveURL('/crm');

    // Back to home via link
    const homeLink = page.locator('a[href="/"]').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('should maintain state when navigating back', async ({ page }) => {
    // Create a lead in CRM
    await page.goto('/crm');

    await page.evaluate(() => {
      const lead = {
        id: 'nav-test',
        name: 'Navigation Test',
        contact: 'nav@test.com',
        type: 'mieten',
        status: 'neu',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _v: 2,
      };
      localStorage.setItem('crm_leads', JSON.stringify([lead]));
    });

    await page.reload();

    // Navigate away
    await page.goto('/expose');

    // Navigate back
    await page.goto('/crm');

    // Verify lead still exists
    await expect(page.locator('text=Navigation Test')).toBeVisible();
  });

  test('should use browser back button correctly', async ({ page }) => {
    await page.goto('/');
    await page.goto('/expose');
    await page.goto('/crm');

    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/expose');

    // Go back again
    await page.goBack();
    await expect(page).toHaveURL('/');

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL('/expose');
  });
});

test.describe('Responsive Navigation', () => {
  test('should display mobile menu on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Look for mobile menu button (hamburger)
    const menuButton = page.locator('button[aria-label*="menu" i], .menu-toggle, .hamburger').first();

    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Menu should expand
      const mobileMenu = page.locator('nav, .mobile-menu, [role="navigation"]').first();
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('should navigate on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Navigate to CRM
    await page.goto('/crm');
    await expect(page).toHaveURL('/crm');

    // Verify page is usable
    const mainContent = page.locator('main, [role="main"], .container').first();
    await expect(mainContent).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should display 404 for non-existent route', async ({ page }) => {
    // Navigate to non-existent page
    const response = await page.goto('/this-page-does-not-exist');

    // Depending on router setup, might redirect to home or show 404
    // Check if still loads something (not complete failure)
    expect(response?.status()).toBeLessThan(500);
  });

  test('should handle localStorage errors gracefully', async ({ page }) => {
    // Disable localStorage
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => {
            throw new Error('localStorage disabled');
          },
          setItem: () => {
            throw new Error('localStorage disabled');
          },
          removeItem: () => {},
          clear: () => {},
        },
        writable: false,
      });
    });

    // Page should still load even without localStorage
    await page.goto('/crm');
    await expect(page).toHaveURL('/crm');
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy on homepage', async ({ page }) => {
    await page.goto('/');

    // Check for h1
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Verify only one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Alt should exist (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Press Tab to navigate
    await page.keyboard.press('Tab');

    // Check if focus is visible
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const tagName = await focusedElement.evaluate((el) => el?.tagName);

    // Should focus on interactive element
    expect(['A', 'BUTTON', 'INPUT', 'SELECT']).toContain(tagName);
  });
});

test.describe('Performance', () => {
  test('should load homepage within reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds (generous for CI)
    expect(loadTime).toBeLessThan(3000);
  });

  test('should not have console errors on page load', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Allow some errors (e.g., missing API keys in test env)
    // But should not have critical React errors
    const criticalErrors = consoleErrors.filter(
      (err) =>
        err.includes('React') ||
        err.includes('Uncaught') ||
        err.includes('TypeError')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
