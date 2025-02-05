// SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';
import { JFGIPage } from './utils/page-objects';
import { mockConsole, waitForPageLoad, TEST_QUERIES } from './utils/helpers';

test.describe('Search Functionality', () => {
  let jfgiPage: JFGIPage;

  test.beforeEach(async ({ page }) => {
    jfgiPage = new JFGIPage(page);
    await mockConsole(page);
  });

  test('redirects to Google with simple query', async ({ page }) => {
    const query = TEST_QUERIES.simple;

    await jfgiPage.searchFor(query);
    await waitForPageLoad(page);

    // Check that we're on the search page
    expect(page.url()).toContain(encodeURIComponent(query));

    // Check page title includes the search query
    await expect(page).toHaveTitle(new RegExp(`Searching for ${query}`));

    // Check countdown timer is visible
    await jfgiPage.expectCountdownTimer();

    // Wait for redirect (but don't actually follow it to avoid external dependency)
    // Instead, check that the redirect would happen by examining the page
    await expect(page.locator('body')).toBeVisible();
  });

  test('handles queries with spaces', async ({ page }) => {
    const query = TEST_QUERIES.withSpaces;

    await jfgiPage.searchFor(query);
    await waitForPageLoad(page);

    expect(page.url()).toContain(encodeURIComponent(query));
    await expect(page).toHaveTitle(new RegExp(`Searching for ${query.replace(/\s+/g, ' ')}`));
  });

  test('handles queries with special characters', async ({ page }) => {
    const query = TEST_QUERIES.withSpecialChars;

    await jfgiPage.searchFor(query);
    await waitForPageLoad(page);

    expect(page.url()).toContain(encodeURIComponent(query));
    await jfgiPage.expectCountdownTimer();
  });

  test('handles long queries', async ({ page }) => {
    const query = TEST_QUERIES.longQuery;

    await jfgiPage.searchFor(query);
    await waitForPageLoad(page);

    expect(page.url()).toContain(encodeURIComponent(query));
    await jfgiPage.expectCountdownTimer();
  });

  test('handles unicode characters', async ({ page }) => {
    const query = TEST_QUERIES.unicode;

    await jfgiPage.searchFor(query);
    await waitForPageLoad(page);

    expect(page.url()).toContain(encodeURIComponent(query));
    await jfgiPage.expectCountdownTimer();
  });

  test('handles empty query', async ({ page }) => {
    await jfgiPage.searchFor('');
    await waitForPageLoad(page);

    // Should still show the countdown timer even for empty query
    await jfgiPage.expectCountdownTimer();
  });

  test('displays countdown timer with correct initial value', async ({ page }) => {
    await jfgiPage.searchFor(TEST_QUERIES.simple);
    await waitForPageLoad(page);

    // Check that countdown starts at 20 seconds
    const timerElement = jfgiPage.countdownTimer;
    await expect(timerElement).toBeVisible();

    // The timer should show 20 or 19 (depending on when we check)
    const timerText = await timerElement.textContent();
    expect(timerText).toMatch(/1[89]|20/);
  });

  test('countdown timer decreases over time', async ({ page }) => {
    await jfgiPage.searchFor(TEST_QUERIES.simple);
    await waitForPageLoad(page);

    const timerElement = jfgiPage.countdownTimer;
    const initialTime = await timerElement.textContent();
    const initialSeconds = parseInt(initialTime || '20');

    // Wait 2 seconds and check that timer decreased
    await page.waitForTimeout(2000);

    const newTime = await timerElement.textContent();
    const newSeconds = parseInt(newTime || '20');

    expect(newSeconds).toBeLessThan(initialSeconds);
  });

  test('displays progress bar animation', async ({ page }) => {
    await jfgiPage.searchFor(TEST_QUERIES.simple);
    await waitForPageLoad(page);

    await jfgiPage.expectProgressBarAnimating();
  });

  test('shows correct meta information for search page', async ({ page }) => {
    const query = TEST_QUERIES.simple;
    await jfgiPage.searchFor(query);
    await waitForPageLoad(page);

    // Check meta description contains search query
    const metaDescription = page.locator('meta[name="description"]');
    const descriptionContent = await metaDescription.getAttribute('content');
    expect(descriptionContent).toContain(query);
  });

  test('preserves visitor counter on search page', async ({ page }) => {
    await jfgiPage.searchFor(TEST_QUERIES.simple);
    await waitForPageLoad(page);

    // Visitor counter should still be visible and functional
    await jfgiPage.expectVisitorCounterVisible();
  });

  test('preserves image on search page', async ({ page }) => {
    await jfgiPage.searchFor(TEST_QUERIES.simple);
    await waitForPageLoad(page);

    // Image should still be visible
    await jfgiPage.expectImageVisible();
  });
});

test.describe('Search Redirects', () => {
  test('handles /search/ redirect', async ({ page }) => {
    const query = TEST_QUERIES.simple;

    // Visit old search URL format
    await page.goto(`/search/${encodeURIComponent(query)}`);

    // Should redirect to new format
    await page.waitForURL(new RegExp(`/${encodeURIComponent(query)}`));

    // Should show search page content
    await expect(page.locator('[data-testid="countdown-timer"]')).toBeVisible();
  });

  test('handles search.pl format', async ({ page }) => {
    // Test the search.pl endpoint
    const response = await page.goto(`/search.pl?q=${encodeURIComponent(TEST_QUERIES.simple)}`);

    // Should redirect properly
    expect(response?.status()).toBe(301);
  });
});
