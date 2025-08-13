// Shared DOM/test helpers
// SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
// SPDX-License-Identifier: MIT

export type Viewport = { width: number; height: number };

export function setViewport({ width, height }: Viewport) {
  // JSDOM: update inner size and dispatch resize
  (window as unknown as { innerWidth: number; innerHeight: number }).innerWidth = width;
  (window as unknown as { innerWidth: number; innerHeight: number }).innerHeight = height;
  window.dispatchEvent(new Event('resize'));
}

export const viewports = {
  mobile: { width: 320, height: 568 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1024, height: 768 },
  desktop: { width: 1920, height: 1080 }
} as const;
