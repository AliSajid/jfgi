// SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
// SPDX-License-Identifier: MIT

import { tick } from 'svelte';
import { vi } from 'vitest';

export interface RafController {
  now: () => number;
  advance: (ms: number) => Promise<void>;
  flushOne: () => Promise<void>;
  restore: () => void;
}

/**
 * Creates a deterministic requestAnimationFrame controller for testing.
 * Allows manual control over animation timing in tests.
 */
export function setupDeterministicRaf(): RafController {
  let currentTime = 0;
  const rafQueue: FrameRequestCallback[] = [];
  let nextId = 1;

  // Store original functions for restoration
  const originalNow = performance.now.bind(performance);
  const originalRaf = window.requestAnimationFrame.bind(window);
  const originalCancel = window.cancelAnimationFrame.bind(window);

  // Mock performance.now to return controlled time
  vi.spyOn(performance, 'now').mockImplementation(() => currentTime);

  // Mock requestAnimationFrame to queue callbacks
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
    rafQueue.push(callback);
    return nextId++;
  });

  // Mock cancelAnimationFrame (no-op for simplicity)
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

  return {
    now: () => currentTime,

    async advance(ms: number): Promise<void> {
      currentTime += ms;
      await this.flushOne();
    },

    async flushOne(): Promise<void> {
      const callback = rafQueue.shift();
      if (callback) {
        callback(currentTime);
        await tick(); // Allow Svelte to process updates
      }
    },

    restore(): void {
      vi.restoreAllMocks();
      performance.now = originalNow;
      window.requestAnimationFrame = originalRaf;
      window.cancelAnimationFrame = originalCancel;
      rafQueue.length = 0;
      nextId = 1;
      currentTime = 0;
    }
  };
}
