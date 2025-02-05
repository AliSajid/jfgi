// SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';
import { JFGIPage } from './utils/page-objects';
import { mockConsole, mockMathRandom, waitForPageLoad, EXPECTED_IMAGES } from './utils/helpers';

test.describe('Homepage', () => {
  let jfgiPage: JFGIPage;

  test.beforeEach(async ({ page }) => {
    jfgiPage = new JFGIPage(page);

    // Setup mocks
    await mockConsole(page);
    await mockMathRandom(page, 0.1); // Ensures Yoda image is selected

    await jfgiPage.goto('/');
    await waitForPageLoad(page);
  });

  test('displays the correct page title', async () => {
    await jfgiPage.expectTitle('Just Fucking Google It!');
  });

  test('shows visitor counter', async () => {
    await jfgiPage.expectVisitorCounterVisible();

    // Check that visitor counter shows a number
    const counterText = await jfgiPage.visitorCounter.textContent();
    expect(counterText).toMatch(/\d+/); // Should contain at least one digit
  });

  test('displays a random meme image', async () => {
    await jfgiPage.expectImageVisible();

    // Check that the image has one of the expected alt texts
    const imageElement = jfgiPage.image;
    const altText = await imageElement.getAttribute('alt');
    expect(EXPECTED_IMAGES).toContain(altText);
  });

  test('shows reprimand message on homepage', async () => {
    await expect(jfgiPage.reprimandMessage).toBeVisible();
  });

  test('has proper meta tags for SEO', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Just Fucking Google It!/);

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Home Page.*Google things first/);

    // Check meta author
    const metaAuthor = page.locator('meta[name="author"]');
    await expect(metaAuthor).toHaveAttribute('content', 'Ali Sajid Imami');
  });

  test('loads all static assets successfully', async ({ page }) => {
    const responses: Array<{ url: string; status: number }> = [];

    page.on('response', (response) => {
      responses.push({ url: response.url(), status: response.status() });
    });

    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    // Check that no critical assets failed to load
    const failedAssets = responses.filter((r) => r.status >= 400);
    expect(failedAssets).toHaveLength(0);
  });

  test('is accessible', async ({ page }) => {
    // Basic accessibility checks
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main, [role="main"]')).toBeVisible();

    // Check that images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test('handles different image selections', async ({ page }) => {
    // Test all three possible random values
    const testCases = [
      { random: 0.1, expectedIndex: 0 },
      { random: 0.5, expectedIndex: 1 },
      { random: 0.9, expectedIndex: 2 }
    ];

    for (const testCase of testCases) {
      await mockMathRandom(page, testCase.random);
      await jfgiPage.goto('/');
      await waitForPageLoad(page);

      const altText = await jfgiPage.image.getAttribute('alt');
      expect(altText).toBe(EXPECTED_IMAGES[testCase.expectedIndex]);
    }
  });
});

test.describe('Homepage - Responsive', () => {
  test('displays correctly on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const jfgiPage = new JFGIPage(page);
    await mockConsole(page);
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    // Check that all main elements are visible on mobile
    await jfgiPage.expectTitle('Just Fucking Google It!');
    await jfgiPage.expectImageVisible();
    await jfgiPage.expectVisitorCounterVisible();
  });

  test('displays correctly on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const jfgiPage = new JFGIPage(page);
    await mockConsole(page);
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    await jfgiPage.expectTitle('Just Fucking Google It!');
    await jfgiPage.expectImageVisible();
    await jfgiPage.expectVisitorCounterVisible();
  });
});
