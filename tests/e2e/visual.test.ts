// SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';
import { JFGIPage } from './utils/page-objects';
import {
  mockConsole,
  mockMathRandom,
  waitForPageLoad,
  TEST_QUERIES,
  VIEWPORTS
} from './utils/helpers';

test.describe('Visual Regression', () => {
  let jfgiPage: JFGIPage;

  test.beforeEach(async ({ page }) => {
    jfgiPage = new JFGIPage(page);
    await mockConsole(page);
    // Fix random value to ensure consistent image selection
    await mockMathRandom(page, 0.1);
  });

  test('homepage visual appearance - desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    // Hide dynamic elements that change between runs
    await page.locator('#visitorcounter').evaluate((el) => {
      el.textContent = '1,337 visitors';
    });

    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('homepage visual appearance - mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    // Hide dynamic elements
    await page.locator('#visitorcounter').evaluate((el) => {
      el.textContent = '1,337 visitors';
    });

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('homepage visual appearance - tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    await page.locator('#visitorcounter').evaluate((el) => {
      el.textContent = '1,337 visitors';
    });

    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('search page visual appearance - desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await jfgiPage.searchFor(TEST_QUERIES.simple);
    await waitForPageLoad(page);

    // Stabilize dynamic elements
    await page.locator('#visitorcounter').evaluate((el) => {
      el.textContent = '1,337 visitors';
    });

    // Fix countdown timer to consistent value
    const timerElement = page.locator('[data-testid="countdown-timer"]');
    if ((await timerElement.count()) > 0) {
      await timerElement.evaluate((el) => {
        el.textContent = '20';
      });
    }

    await expect(page).toHaveScreenshot('search-page-desktop.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('search page visual appearance - mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await jfgiPage.searchFor(TEST_QUERIES.simple);
    await waitForPageLoad(page);

    // Stabilize dynamic elements
    await page.locator('#visitorcounter').evaluate((el) => {
      el.textContent = '1,337 visitors';
    });

    const timerElement = page.locator('[data-testid="countdown-timer"]');
    if ((await timerElement.count()) > 0) {
      await timerElement.evaluate((el) => {
        el.textContent = '20';
      });
    }

    await expect(page).toHaveScreenshot('search-page-mobile.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('different image selections', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);

    // Test each image variant
    const imageTests = [
      { random: 0.1, name: 'yoda' },
      { random: 0.5, name: 'drake' },
      { random: 0.9, name: 'office-space' }
    ];

    for (const imageTest of imageTests) {
      await mockMathRandom(page, imageTest.random);
      await jfgiPage.goto('/');
      await waitForPageLoad(page);

      // Stabilize counter
      await page.locator('#visitorcounter').evaluate((el) => {
        el.textContent = '1,337 visitors';
      });

      await expect(page).toHaveScreenshot(`homepage-${imageTest.name}.png`, {
        fullPage: true,
        threshold: 0.2
      });
    }
  });

  test('countdown timer visual states', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await jfgiPage.searchFor(TEST_QUERIES.simple);
    await waitForPageLoad(page);

    // Stabilize counter
    await page.locator('#visitorcounter').evaluate((el) => {
      el.textContent = '1,337 visitors';
    });

    // Test different timer values
    const timerElement = page.locator('[data-testid="countdown-timer"]');
    if ((await timerElement.count()) > 0) {
      // High value (green state)
      await timerElement.evaluate((el) => {
        el.textContent = '15';
        el.style.setProperty('--value', '75');
      });
      await expect(page).toHaveScreenshot('countdown-high.png', {
        clip: { x: 0, y: 0, width: 800, height: 400 },
        threshold: 0.2
      });

      // Medium value (yellow state)
      await timerElement.evaluate((el) => {
        el.textContent = '10';
        el.style.setProperty('--value', '50');
      });
      await expect(page).toHaveScreenshot('countdown-medium.png', {
        clip: { x: 0, y: 0, width: 800, height: 400 },
        threshold: 0.2
      });

      // Low value (red state)
      await timerElement.evaluate((el) => {
        el.textContent = '3';
        el.style.setProperty('--value', '15');
      });
      await expect(page).toHaveScreenshot('countdown-low.png', {
        clip: { x: 0, y: 0, width: 800, height: 400 },
        threshold: 0.2
      });
    }
  });

  test('component isolation screenshots', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    // Title component
    const title = jfgiPage.title;
    await expect(title).toHaveScreenshot('title-component.png', {
      threshold: 0.1
    });

    // Image component (with consistent selection)
    const image = jfgiPage.image;
    await expect(image).toHaveScreenshot('image-component.png', {
      threshold: 0.2
    });

    // Visitor counter (stabilized)
    await page.locator('#visitorcounter').evaluate((el) => {
      el.textContent = '1,337 visitors';
    });
    const counter = jfgiPage.visitorCounter;
    await expect(counter).toHaveScreenshot('visitor-counter-component.png', {
      threshold: 0.1
    });
  });

  test('dark mode visual appearance', async ({ page }) => {
    // Enable dark mode if supported
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.setViewportSize(VIEWPORTS.desktop);

    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    await page.locator('#visitorcounter').evaluate((el) => {
      el.textContent = '1,337 visitors';
    });

    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('high contrast mode', async ({ page }) => {
    // Enable high contrast mode
    await page.emulateMedia({ forcedColors: 'active' });
    await page.setViewportSize(VIEWPORTS.desktop);

    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    await page.locator('#visitorcounter').evaluate((el) => {
      el.textContent = '1,337 visitors';
    });

    await expect(page).toHaveScreenshot('homepage-high-contrast.png', {
      fullPage: true,
      threshold: 0.3 // Higher threshold for high contrast mode
    });
  });

  test('ultra-wide display', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.ultrawide);
    await jfgiPage.goto('/');
    await waitForPageLoad(page);

    await page.locator('#visitorcounter').evaluate((el) => {
      el.textContent = '1,337 visitors';
    });

    await expect(page).toHaveScreenshot('homepage-ultrawide.png', {
      fullPage: true,
      threshold: 0.2
    });
  });
});
