// SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
//
// SPDX-License-Identifier: MIT

import type { Page } from '@playwright/test';

/**
 * Test helper functions for E2E tests
 */

/**
 * Mock Math.random to return a specific value for consistent image selection
 */
export async function mockMathRandom(page: Page, value: number): Promise<void> {
  await page.addInitScript(`
    Math.random = () => ${value};
  `);
}

/**
 * Mock console methods to avoid cluttering test output
 */
export async function mockConsole(page: Page): Promise<void> {
  await page.addInitScript(`
    console.log = () => {};
    console.timeStamp = () => {};
  `);
}

/**
 * Mock Firebase services to avoid real API calls during tests
 */
export async function mockFirebase(page: Page): Promise<void> {
  await page.addInitScript(`
    // Mock Firebase imports
    window.__firebaseMocked = true;
  `);
}

/**
 * Wait for the page to be fully loaded including all dynamic content
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');

  // Wait for visitor counter to be visible (indicates Firebase loaded)
  await page.waitForSelector('#visitorcounter', { timeout: 10000 });
}

/**
 * Take a screenshot for debugging
 */
export async function takeDebugScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({
    path: `test-results/debug-${name}-${Date.now()}.png`,
    fullPage: true
  });
}

/**
 * Test different search queries
 */
export const TEST_QUERIES = {
  simple: 'how to code',
  withSpaces: 'javascript best practices',
  withSpecialChars: 'react hooks & context',
  longQuery:
    'how to optimize performance in a large scale web application with multiple components',
  unicode: 'programming in 中文',
  empty: '',
  numbers: '12345',
  symbols: '@#$%^&*()'
};

/**
 * Expected image alt texts for testing
 */
export const EXPECTED_IMAGES = [
  "Master Yoda looking at you; Overlay Text says 'Use Google, You Should'",
  "Drake meme: Top panel - Drake looking displeased and holding up his hand in rejection with the caption 'Googling the question beforehand.' Bottom panel - Drake smiling and pointing approvingly with the caption 'Asking the question without research.'",
  "Office Space meme: A man with glasses and a tie holding a coffee cup, with the caption 'If you could Google this before asking, that'd be great.'"
];

/**
 * Viewport sizes for responsive testing
 */
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
  ultrawide: { width: 3440, height: 1440 }
};
