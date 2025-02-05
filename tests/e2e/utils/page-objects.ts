// SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
//
// SPDX-License-Identifier: MIT

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Page Object Model for the JFGI application
 */
export class JFGIPage {
  constructor(private page: Page) {}

  // Navigation
  async goto(path = '/') {
    await this.page.goto(path);
  }

  // Elements
  get title() {
    return this.page.locator('h1');
  }

  get reprimandMessage() {
    return this.page.locator('[data-testid="reprimand-message"]');
  }

  get visitorCounter() {
    return this.page.locator('#visitorcounter');
  }

  get searchButton() {
    return this.page.locator('[data-testid="search-button"]');
  }

  get image() {
    return this.page.locator('img[alt*="Google"]');
  }

  get countdownTimer() {
    return this.page.locator('[data-testid="countdown-timer"]');
  }

  get progressBar() {
    return this.page.locator('.progress');
  }

  // Actions
  async searchFor(query: string) {
    await this.goto(`/${encodeURIComponent(query)}`);
  }

  async waitForRedirect() {
    // Wait for the redirect to Google (should happen within 20 seconds)
    await this.page.waitForURL(/google\.com/, { timeout: 25000 });
  }

  // Assertions
  async expectTitle(text: string) {
    await expect(this.title).toContainText(text);
  }

  async expectVisitorCounterVisible() {
    await expect(this.visitorCounter).toBeVisible();
  }

  async expectImageVisible() {
    await expect(this.image).toBeVisible();
  }

  async expectCountdownTimer(seconds?: number) {
    await expect(this.countdownTimer).toBeVisible();
    if (seconds) {
      await expect(this.countdownTimer).toContainText(seconds.toString());
    }
  }

  async expectProgressBarAnimating() {
    await expect(this.progressBar).toBeVisible();
    // Check that the progress bar has the animation class
    await expect(this.progressBar).toHaveClass(/progress/);
  }
}
