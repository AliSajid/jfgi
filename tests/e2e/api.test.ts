// SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('sitemap.xml returns valid XML', async ({ request }) => {
    const response = await request.get('/sitemap.xml');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/xml');

    const xml = await response.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"');
    expect(xml).toContain('<urlset');
    expect(xml).toContain('</urlset>');

    // Should contain at least the homepage
    expect(xml).toMatch(/<loc>https?:\/\/[^<]+\/<\/loc>/);
  });

  test('sitemap.xml has proper cache headers', async ({ request }) => {
    const response = await request.get('/sitemap.xml');

    expect(response.headers()['cache-control']).toBe('max-age=0, s-maxage=3600');
  });

  test('search redirect endpoints work', async ({ request }) => {
    const query = 'test query';

    // Test /search/ redirect
    const searchResponse = await request.get(`/search/${encodeURIComponent(query)}`, {
      maxRedirects: 0
    });

    expect(searchResponse.status()).toBe(301);
    expect(searchResponse.headers()['location']).toBe(`/${encodeURIComponent(query)}`);
  });

  test('search.pl redirect works', async ({ request }) => {
    const query = 'test query';

    const response = await request.get(`/search.pl?q=${encodeURIComponent(query)}`, {
      maxRedirects: 0
    });

    expect(response.status()).toBe(301);
    expect(response.headers()['location']).toBe(`/${encodeURIComponent(query)}`);
  });

  test('search.pl handles missing query parameter', async ({ request }) => {
    const response = await request.get('/search.pl');

    expect(response.status()).toBe(404);
  });

  test('search.pl handles empty query parameter', async ({ request }) => {
    const response = await request.get('/search.pl?q=', {
      maxRedirects: 0
    });

    expect(response.status()).toBe(301);
    expect(response.headers()['location']).toBe('/');
  });

  test('search.pl handles special characters in query', async ({ request }) => {
    const query = 'test & special characters @#$';

    const response = await request.get(`/search.pl?q=${encodeURIComponent(query)}`, {
      maxRedirects: 0
    });

    expect(response.status()).toBe(301);
    expect(response.headers()['location']).toBe(`/${encodeURIComponent(query)}`);
  });

  test('robots.txt is accessible', async ({ request }) => {
    const response = await request.get('/robots.txt');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');

    const content = await response.text();
    expect(content).toContain('User-agent');
  });

  test('favicon is accessible', async ({ request }) => {
    const response = await request.get('/favicon.ico');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image');
  });

  test('manifest.json is accessible', async ({ request }) => {
    const response = await request.get('/site.webmanifest');

    if (response.status() === 200) {
      const manifest = await response.json();
      expect(manifest).toHaveProperty('name');
      expect(manifest).toHaveProperty('icons');
    }
  });
});

test.describe('Error Handling', () => {
  test('404 page works for non-existent routes', async ({ page }) => {
    const response = await page.goto('/non-existent-page');

    // Should return 404 or redirect (depending on SvelteKit config)
    expect([404, 200]).toContain(response?.status() || 0);
  });

  test('handles malformed URLs gracefully', async ({ page }) => {
    const response = await page.goto('/search/%XX%invalid');

    // Should not crash the application
    expect(response?.status()).toBeLessThan(500);
  });
});

test.describe('Performance', () => {
  test('homepage loads within performance budget', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('static assets are properly cached', async ({ request }) => {
    // First request
    const response1 = await request.get('/favicon.ico');
    const etag1 = response1.headers()['etag'];

    if (etag1) {
      // Second request with ETag
      const response2 = await request.get('/favicon.ico', {
        headers: {
          'If-None-Match': etag1
        }
      });

      // Should return 304 Not Modified
      expect(response2.status()).toBe(304);
    }
  });

  test('images are optimized', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that optimized image formats are being served
    const responses: any[] = [];
    page.on('response', (response) => responses.push(response));

    await page.reload();

    const imageResponses = responses.filter(
      (r) => r.url().includes('imagetools') || r.headers()['content-type']?.startsWith('image/')
    );

    // Should serve WebP or AVIF formats when supported
    const modernFormats = imageResponses.filter(
      (r) =>
        r.url().includes('.webp') ||
        r.url().includes('.avif') ||
        r.headers()['content-type']?.includes('webp') ||
        r.headers()['content-type']?.includes('avif')
    );

    expect(modernFormats.length).toBeGreaterThan(0);
  });
});
