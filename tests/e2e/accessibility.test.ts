// SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';
import { JFGIPage } from './utils/page-objects';
import { mockConsole, waitForPageLoad, TEST_QUERIES } from './utils/helpers';

test.describe('Accessibility', () => {
  let jfgiPage: JFGIPage;

  test.beforeEach(async ({ page }) => {
    jfgiPage = new JFGIPage(page);
    await mockConsole(page);
  });

  test('homepage meets basic accessibility standards', async ({ page }) => {
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    // Check for proper heading structure
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);

    // Check that images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(5); // Meaningful alt text
    }

    // Check for proper document structure
    await expect(page.locator('html[lang]')).toHaveCount(1);
    await expect(page.locator('title')).toHaveCount(1);

    // Check meta viewport for responsive design
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('search page meets accessibility standards', async ({ page }) => {
    await jfgiPage.searchFor(TEST_QUERIES.simple);
    await waitForPageLoad(page);

    // Check heading structure
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);

    // Check that countdown timer is properly labeled
    const timer = page.locator('[data-testid="countdown-timer"]');
    if ((await timer.count()) > 0) {
      // Timer should have some accessible text
      const timerText = await timer.textContent();
      expect(timerText).toMatch(/\d+/);
    }

    // Check progress bar has proper attributes
    const progressBar = page.locator('.progress');
    if ((await progressBar.count()) > 0) {
      // Progress bars should have role or be properly semantic
      const role = await progressBar.getAttribute('role');
      if (!role) {
        // If no role, should be semantic progress element
        await expect(page.locator('progress')).toBeVisible();
      }
    }
  });

  test('keyboard navigation works', async ({ page }) => {
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    // Test Tab navigation
    await page.keyboard.press('Tab');

    // Should be able to navigate through focusable elements
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'BODY']).toContain(focusedElement);
  });

  test('color contrast is sufficient', async ({ page }) => {
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    // Get computed styles of main text elements
    const titleColor = await page.locator('h1').evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor
      };
    });

    // Basic check that colors are not the same (avoiding invisible text)
    expect(titleColor.color).not.toBe(titleColor.backgroundColor);
    expect(titleColor.color).not.toBe('transparent');
  });

  test('text is scalable', async ({ page }) => {
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    // Test with 200% zoom
    await page.setViewportSize({ width: 800, height: 600 });
    await page.evaluate(() => {
      document.body.style.zoom = '2';
    });

    // Content should still be accessible
    await expect(jfgiPage.title).toBeVisible();
    await expect(jfgiPage.image).toBeVisible();
  });

  test('images provide meaningful information', async ({ page }) => {
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      const src = await image.getAttribute('src');

      // Alt text should be meaningful, not just filename
      expect(alt).toBeTruthy();
      expect(alt).not.toBe(src);
      expect(alt?.toLowerCase()).not.toContain('.png');
      expect(alt?.toLowerCase()).not.toContain('.jpg');
      expect(alt?.toLowerCase()).not.toContain('.jpeg');

      // Should describe the content, not be generic
      expect(alt?.toLowerCase()).not.toBe('image');
      expect(alt?.toLowerCase()).not.toBe('picture');
    }
  });

  test('page has proper semantic structure', async ({ page }) => {
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    // Check for landmarks
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();

    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

    if (headings.length > 1) {
      // Should start with h1
      const firstHeading = await headings[0].evaluate((el) => el.tagName.toLowerCase());
      expect(firstHeading).toBe('h1');
    }
  });

  test('animations respect user preferences', async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await jfgiPage.searchFor(TEST_QUERIES.simple);
    await waitForPageLoad(page);

    // Animations should be reduced or removed
    const progressBar = page.locator('.progress');
    if ((await progressBar.count()) > 0) {
      const animationDuration = await progressBar.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.animationDuration;
      });

      // Should have reduced animation
      expect(['0s', 'none', '']).toContain(animationDuration || '');
    }
  });

  test('screen reader compatibility', async ({ page }) => {
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    // Check for screen reader specific elements
    const srOnlyElements = page.locator('.sr-only, .visually-hidden');

    // If present, should not be visible but should exist in DOM
    if ((await srOnlyElements.count()) > 0) {
      const isVisible = await srOnlyElements.first().isVisible();
      expect(isVisible).toBeFalsy();

      const hasContent = await srOnlyElements.first().textContent();
      expect(hasContent?.length).toBeGreaterThan(0);
    }

    // Check that interactive elements have accessible names
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const accessibleName = await button.evaluate((el) => {
        return (
          el.textContent ||
          el.getAttribute('aria-label') ||
          el.getAttribute('title') ||
          el.getAttribute('alt')
        );
      });

      expect(accessibleName?.trim()).toBeTruthy();
    }
  });

  test('form elements have proper labels', async ({ page }) => {
    // This app doesn't have traditional forms, but check for any input elements
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');

      if (id) {
        // Should have associated label
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      } else {
        // Should have aria-label or be wrapped in label
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        const parentLabel = await input.evaluate((el) => el.closest('label') !== null);

        expect(ariaLabel || ariaLabelledBy || parentLabel).toBeTruthy();
      }
    }
  });
});
